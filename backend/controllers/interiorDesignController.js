import axios from "axios";
import Replicate from "replicate";
import InteriorDesign from "../models/interiorDesignModel.js";

// Helper: ensure we have a public URL for the image. Prefer IMGBB; fallback to Replicate Files API
async function uploadImageToHost(base64Image) {
  const clean = String(base64Image || "");
  if (!clean.startsWith("data:")) return clean; // already a URL

  // Try IMGBB first if configured
  const apiKey = process.env.IMGBB_API_KEY;
  if (apiKey) {
    try {
      const form = new URLSearchParams();
      form.append("image", clean.replace(/^data:image\/(png|jpeg|jpg);base64,/, ""));
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form);
      if (res.data?.data?.url) return res.data.data.url;
    } catch (_) {}
  }

  // Fallback: Replicate Files API via SDK to get a https URL
  try {
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    if (!replicateToken) return clean; // last resort
    const mime = (clean.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/) || [null, 'image/png'])[1];
    const b64 = clean.split(',')[1] || '';
    const buffer = Buffer.from(b64, 'base64');
    const replicate = new Replicate({ auth: replicateToken });
    const file = await replicate.files.upload(buffer, {
      filename: 'input' + (mime.includes('png') ? '.png' : '.jpg'),
      contentType: mime
    });
    return file?.urls?.get || file?.url || clean;
  } catch (e) {
    return clean;
  }
}

export const generateDesign = async (req, res) => {
  try {
    const { roomType, designStyle, additionalRequirements, imageBase64 } = req.body;
    if (!roomType || !designStyle || !imageBase64)
      return res.status(400).json({ message: "roomType, designStyle and image are required" });

    const inputImageUrl = await uploadImageToHost(imageBase64);
    const replicateToken = process.env.REPLICATE_API_TOKEN;

    if (!replicateToken) {
      const record = await InteriorDesign.create({
        roomType,
        designStyle,
        additionalRequirements,
        inputImageUrl,
        resultImageUrl: inputImageUrl,
        status: "completed",
        providerResponse: { warning: "REPLICATE_API_TOKEN not set; returned original image" },
      });
      return res.json({ id: record._id, resultImageUrl: inputImageUrl, status: "completed" });
    }

    // Strong prompt for interior re-design
    let prompt = `Interior design for a ${roomType} in ${designStyle} style, photorealistic, preserves room layout, natural lighting, clean finishes`;
    if (additionalRequirements) prompt += `, ${additionalRequirements}`;

    const replicate = new Replicate({ auth: replicateToken });
    // Use the stability-ai/stable-diffusion-img2img model
    const model = "stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4c3abcd36672df6afce5cb6feb1d66087d";

    let resultUrl = null;
    let providerResponse = null;

    try {
      const output = await replicate.run(model, {
        input: {
          image: inputImageUrl,
          prompt,
          negative_prompt: 'blurry, deformed, extra objects, low quality, watermark',
          num_inference_steps: 25,  // Reduced for faster processing
          guidance_scale: 7.5,
          prompt_strength: 0.8,
          // Additional parameters for this specific model
          image_resolution: 512,
          denoising_strength: 0.75
        }
      });

      // Handle the output - stability-ai model returns an array of images
      if (Array.isArray(output) && output.length > 0) {
        // The first image in the array
        const firstImage = output[0];
        // Get the URL using the url() method if available, otherwise use the direct value
        resultUrl = typeof firstImage.url === 'function' ? firstImage.url() : firstImage;
      } else if (typeof output === 'string') {
        resultUrl = output;
      } else if (output?.url) {
        resultUrl = typeof output.url === 'function' ? output.url() : output.url;
      }

      providerResponse = { model, raw: output };
    } catch (err) {
      // If insufficient credit on Replicate, fallback to a free text-to-image generator (Pollinations)
      const detail = err.response?.data || err.message;
      const status = err.response?.status;
      if (status === 402) {
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=768&nologo=1&random=${Date.now()}`;
        resultUrl = pollinationsUrl;
        providerResponse = { model: 'pollinations.ai', note: 'fallback due to insufficient Replicate credit', originalError: detail };
      } else {
        console.error('Replicate generation failed', detail);
        return res.status(502).json({ message: 'AI generation failed', error: detail });
      }
    }

    // Save to MongoDB
    const record = await InteriorDesign.create({
      userId: req.user?._id,
      roomType,
      designStyle,
      additionalRequirements,
      inputImageUrl,
      resultImageUrl: resultUrl || inputImageUrl,
      status: resultUrl ? 'completed' : 'failed',
      providerResponse,
    });

    return res.json({ id: record._id, resultImageUrl: record.resultImageUrl, status: record.status });
  } catch (error) {
    console.error("generateDesign error", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to generate design", error: error.response?.data || error.message });
  }
};

export const listDesigns = async (req, res) => {
  const filter = req.user?._id ? { userId: req.user._id } : {};
  const items = await InteriorDesign.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json(items);
};