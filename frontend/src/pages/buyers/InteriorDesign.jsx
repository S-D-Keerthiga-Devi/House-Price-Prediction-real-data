import React, { useMemo, useRef, useState } from 'react';
import { generateInteriorDesign } from '../../services/interiorService';
import { toast } from 'react-toastify';

const ROOM_TYPES = ['Living Room','Bedroom','Kitchen','Bathroom','Dining Room','Office','Kids Room'];
const STYLES = ['Modern','Industrial','Bohemian','Traditional','Rustic','Minimalist','Scandinavian','Contemporary'];

function InteriorDesign() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [roomType, setRoomType] = useState('');
  const [style, setStyle] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [resolvedResultUrl, setResolvedResultUrl] = useState('');
  const objectUrlRef = useRef('');
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [slider, setSlider] = useState(50);

  const disabled = useMemo(() => !selectedFile || !roomType || !style || loading, [selectedFile, roomType, style, loading]);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onGenerate = async () => {
    if (!imagePreview) return;

    setLoading(true);
    try {
      const resp = await generateInteriorDesign({
        imageBase64: imagePreview,
        roomType,
        designStyle: style,
        additionalRequirements: notes
      });

      if (resp.status === 'completed' && resp.resultImageUrl) {
        const url = resp.resultImageUrl;
        const cacheBusted = `${url}${url.includes('?') ? '&' : '?'}_ts=${Date.now()}`;
        setResultUrl(url);
        setResolvedResultUrl('');
        setShowModal(true);
        // Fetch as blob to avoid cross-origin preview issues
        try {
          const res = await fetch(cacheBusted, { cache: 'no-store' });
          const blob = await res.blob();
          if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
          const objUrl = URL.createObjectURL(blob);
          objectUrlRef.current = objUrl;
          setResolvedResultUrl(objUrl);
        } catch (e) {
          // Fallback to direct URL
          setResolvedResultUrl(cacheBusted);
        }
        toast.success('Design generated successfully!');
      } else {
        toast.error('Generation failed, try again.');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to generate design');
    } finally {
      setLoading(false);
    }
  };

  const onDownload = async () => {
    try {
      const url = resultUrl || imagePreview;
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'interior-design.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      toast.error('Download failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16 mt-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Experience the Magic of AI Remodeling</h1>
      <p className="text-gray-600 mb-10">Transform any room with a click. Select a space, choose a style, and watch as AI reimagines your environment.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload */}
        <div>
          <label className="block text-gray-800 font-medium mb-2">Select Image of your room</label>
          <div className="border-2 border-dashed rounded-xl bg-gray-100 flex items-center justify-center h-72">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="h-full object-contain" />
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                <div className="text-gray-500">Click to upload</div>
              </label>
            )}
          </div>
        </div>

        {/* Options */}
        <div>
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-1">Select Room Type *</label>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full border rounded-lg p-3">
              <option value="">Room Type</option>
              {ROOM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-1">Select Interior Design Type</label>
            <div className="grid grid-cols-3 gap-3">
              {STYLES.map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`border rounded-lg p-3 text-sm ${style === s ? 'border-purple-500 ring-2 ring-purple-200' : 'hover:border-gray-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-800 font-medium mb-1">Additional Requirements (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full border rounded-lg p-3"
              placeholder="e.g., warm lighting, wooden textures"
            />
          </div>

          <button
            disabled={disabled}
            onClick={onGenerate}
            className={`w-full py-3 rounded-lg text-white ${disabled ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
          <p className="text-xs text-gray-500 mt-2">NOTE: 1 Credit will be used to redesign your room</p>
        </div>
      </div>

      {/* Before/After Slider */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90vw] max-w-4xl">
            <div className="text-lg font-semibold mb-3">Result:</div>
            <div
              ref={containerRef}
              className="relative w-full h-[480px] overflow-hidden rounded-lg select-none bg-black"
              onMouseDown={(e) => { isDraggingRef.current = true; const rect = containerRef.current.getBoundingClientRect(); setSlider(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))); }}
              onMouseMove={(e) => { if (!isDraggingRef.current) return; const rect = containerRef.current.getBoundingClientRect(); setSlider(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))); }}
              onMouseUp={() => { isDraggingRef.current = false; }}
              onMouseLeave={() => { isDraggingRef.current = false; }}
              onTouchStart={(e) => { const rect = containerRef.current.getBoundingClientRect(); const x = e.touches[0].clientX; setSlider(Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100))); }}
              onTouchMove={(e) => { const rect = containerRef.current.getBoundingClientRect(); const x = e.touches[0].clientX; setSlider(Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100))); }}
            >
              {/* Before */}
              <div className="absolute inset-0" style={{ right: `${100 - slider}%`, width: `${slider}%`, overflow: 'hidden' }}>
                <img src={imagePreview} alt="before" className="absolute inset-0 w-full h-full object-cover" />
              </div>

              {/* After */}
              <div className="absolute inset-0" style={{ left: `${slider}%`, width: `${100 - slider}%`, overflow: 'hidden' }}>
                {resolvedResultUrl ? (
                  <img src={resolvedResultUrl} alt="after" className="absolute inset-0 w-full h-full object-cover bg-black" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/70">
                    Loading preview...
                  </div>
                )}
              </div>

              {/* Divider handle */}
              <div className="absolute top-0 bottom-0" style={{ left: `calc(${slider}% - 1px)` }}>
                <div className="h-full w-[2px] bg-white/90 shadow" />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white border shadow cursor-col-resize" style={{ left: `calc(${slider}% - 16px)` }}>
                <div className="w-2 h-2 rounded-full bg-purple-500" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setShowModal(false); if (objectUrlRef.current) { URL.revokeObjectURL(objectUrlRef.current); objectUrlRef.current=''; } }} className="px-4 py-2 rounded-lg border">Close</button>
              <button onClick={onDownload} className="px-4 py-2 rounded-lg bg-purple-600 text-white">Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InteriorDesign;
