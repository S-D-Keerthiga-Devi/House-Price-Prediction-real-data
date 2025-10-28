import React, { useMemo, useRef, useState } from 'react';
import { generateInteriorDesign } from '../../services/interiorService';
import { toast } from 'react-toastify';
import { X, Upload, Download, ImagePlus } from 'lucide-react';

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
  const fileInputRef = useRef(null);

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

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-16 mt-20">
      <title>AI Interior Design Studio - Transform Your Space</title>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#1e3a8a' }}>
            AI Interior Design Studio
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transform any room with intelligent design. Upload your space, choose a style, and watch AI reimagine your interior.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <label className="block text-navy-900 font-semibold text-lg mb-4">
              Room Image
            </label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden">
              {imagePreview ? (
                <div className="relative w-full">
                  <img src={imagePreview} alt="preview" className="w-full h-auto max-h-96 object-contain" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <label
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                      title="Upload another image"
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={onFileChange} 
                      />
                      <Upload className="w-5 h-5 text-blue-900" />
                    </label>
                    <button
                      onClick={removeImage}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors border border-slate-200"
                      title="Remove image"
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full py-20">
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={onFileChange} 
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <ImagePlus className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-navy-900 font-medium text-lg mb-1">Click to upload</div>
                    <div className="text-slate-500 text-sm">or drag and drop</div>
                    <div className="text-slate-400 text-xs mt-2">PNG, JPG up to 10MB</div>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Options Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="mb-6">
              <label className="block text-navy-900 font-semibold text-lg mb-3">
                Room Type <span className="text-red-500">*</span>
              </label>
              <select 
                value={roomType} 
                onChange={(e) => setRoomType(e.target.value)} 
                className="w-full border-2 border-slate-300 rounded-xl p-3.5 text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option value="">Select room type</option>
                {ROOM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-navy-900 font-semibold text-lg mb-3">
                Design Style <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {STYLES.map(s => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`border-2 rounded-xl p-3.5 text-sm font-medium transition-all ${
                      style === s 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md' 
                        : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-navy-900 font-semibold text-lg mb-3">
                Additional Requirements <span className="text-slate-400 text-sm font-normal">(Optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full border-2 border-slate-300 rounded-xl p-3.5 text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                placeholder="E.g., warm lighting, wooden textures, minimalist furniture..."
              />
            </div>

            <button
              disabled={disabled}
              onClick={onGenerate}
              className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all ${
                disabled 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-blue-900 hover:bg-blue-800 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Design...
                </span>
              ) : 'Generate Design'}
            </button>
            <p className="text-xs text-slate-500 mt-3 text-center">
              <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mr-1.5"></span>
              1 Credit will be used to redesign your room
            </p>
          </div>
        </div>
      </div>

      {/* Before/After Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-5xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-navy-900">Your Redesigned Space</h2>
              <button 
                onClick={() => { 
                  setShowModal(false); 
                  if (objectUrlRef.current) { 
                    URL.revokeObjectURL(objectUrlRef.current); 
                    objectUrlRef.current=''; 
                  } 
                }} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div
              ref={containerRef}
              className="relative w-full h-[500px] overflow-hidden rounded-2xl select-none bg-slate-900 shadow-inner"
              onMouseDown={(e) => { 
                isDraggingRef.current = true; 
                const rect = containerRef.current.getBoundingClientRect(); 
                setSlider(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))); 
              }}
              onMouseMove={(e) => { 
                if (!isDraggingRef.current) return; 
                const rect = containerRef.current.getBoundingClientRect(); 
                setSlider(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))); 
              }}
              onMouseUp={() => { isDraggingRef.current = false; }}
              onMouseLeave={() => { isDraggingRef.current = false; }}
              onTouchStart={(e) => { 
                const rect = containerRef.current.getBoundingClientRect(); 
                const x = e.touches[0].clientX; 
                setSlider(Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100))); 
              }}
              onTouchMove={(e) => { 
                const rect = containerRef.current.getBoundingClientRect(); 
                const x = e.touches[0].clientX; 
                setSlider(Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100))); 
              }}
            >
              {/* Before - Label */}
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-navy-900 shadow-lg">
                Before
              </div>

              {/* Before Image */}
              <div className="absolute inset-0" style={{ right: `${100 - slider}%`, width: `${slider}%`, overflow: 'hidden' }}>
                <img src={imagePreview} alt="before" className="absolute inset-0 w-full h-full object-cover" />
              </div>

              {/* After - Label */}
              <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-navy-900 shadow-lg">
                After
              </div>

              {/* After Image */}
              <div className="absolute inset-0" style={{ left: `${slider}%`, width: `${100 - slider}%`, overflow: 'hidden' }}>
                {resolvedResultUrl ? (
                  <img src={resolvedResultUrl} alt="after" className="absolute inset-0 w-full h-full object-cover bg-slate-900" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <svg className="animate-spin h-12 w-12 text-white mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <div className="text-white/70 text-sm">Loading preview...</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider Line */}
              <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${slider}%` }}>
                <div className="h-full w-[3px] bg-white shadow-2xl" style={{ marginLeft: '-1.5px' }} />
              </div>

              {/* Divider Handle */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-blue-600 shadow-2xl cursor-col-resize transition-transform hover:scale-110" 
                style={{ left: `calc(${slider}% - 24px)` }}
              >
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-4 bg-blue-600 rounded-full"></div>
                  <div className="w-0.5 h-4 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button 
                onClick={() => { 
                  setShowModal(false); 
                  if (objectUrlRef.current) { 
                    URL.revokeObjectURL(objectUrlRef.current); 
                    objectUrlRef.current=''; 
                  } 
                }} 
                className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={onDownload} 
                className="px-6 py-3 rounded-xl bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Design
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InteriorDesign;