// Admin pure image carousel manager for pharmaceutical visual aids
import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  MoveLeft,
  MoveRight,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  X,
  Edit2,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import ConfirmModal from '../../../components/common/ConfirmModal';

export default function ProductSlides({ product, slides = [] }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, slide: null });
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const fileInputRef = useRef(null);

  // Handle files selection (supports multiple images at once)
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove a staged file before upload
  const handleRemoveStaged = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit batch image upload
  const handleUploadSubmit = (e) => {
    e?.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('images[]', file);
    });

    router.post(`/admin/products/${product.id}/slides`, formData, {
      onSuccess: () => {
        setSelectedFiles([]);
        setFilePreviews([]);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: () => setIsUploading(false)
    });
  };

  // Move slide position (left or right / up or down)
  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const newOrder = [...slides];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIdx, 0, moved);

    const slideIds = newOrder.map((s) => s.id);
    router.post(`/admin/products/${product.id}/slides/reorder`, { slide_ids: slideIds }, {
      preserveScroll: true
    });
  };

  // Toggle active status
  const handleToggleStatus = (slide) => {
    router.patch(`/admin/products/${product.id}/slides/${slide.id}/status`, {}, {
      preserveScroll: true
    });
  };

  // Delete slide
  const handleConfirmDelete = () => {
    if (!deleteConfirm.slide) return;
    router.delete(`/admin/products/${product.id}/slides/${deleteConfirm.slide.id}`, {
      preserveScroll: true,
      onSuccess: () => setDeleteConfirm({ isOpen: false, slide: null })
    });
  };

  // Save edited title
  const handleSaveTitle = (slide) => {
    router.post(`/admin/products/${product.id}/slides/${slide.id}`, {
      title: editTitleValue.trim() || slide.title
    }, {
      preserveScroll: true,
      onSuccess: () => setEditingTitleId(null)
    });
  };

  const activeSlides = slides.filter((s) => s.is_active);

  return (
    <AdminLayout>
      <Head title={`${product.brand_name} — Visual Aid Carousel`} />

      <div className="space-y-6">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/admin/products" className="hover:text-teal-600 transition-colors">
                Products
              </Link>
              <span>/</span>
              <Link href={`/admin/products/${product.id}`} className="hover:text-teal-600 transition-colors font-medium">
                {product.brand_name}
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Visual Aid Carousel</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-xs">
                <ImageIcon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{product.brand_name}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 font-bold">
                    Visual Aid Carousel
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Upload slide images directly. MRs present them as a full-screen interactive carousel on their tablet.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/admin/products/${product.id}`}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              Back to Product
            </Link>

            <Link
              href="/mr/products"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview MR Carousel</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>
          </div>
        </div>

        {/* Upload Zone (Drag & Drop or Click to Select Multiple Slide Images) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Upload Carousel Slide Images</h2>
              <p className="text-xs text-slate-500">
                Select one or multiple presentation slide images (PNG, JPG, WebP) to add to the visual aid carousel.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {slides.length} {slides.length === 1 ? 'Slide' : 'Slides'} in Carousel
            </span>
          </div>

          {/* Dropzone Container */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-teal-500/40 hover:border-teal-600 bg-teal-50/20 hover:bg-teal-50/40 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xs">
              <Upload className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Click to browse or drop slide images here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Select multiple slides at once. Recommended resolution: 1920x1080 (16:9) or 4:3 for optimal tablet presentation.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              multiple
              onChange={handleFilesChange}
              className="hidden"
            />
          </div>

          {/* Staged files preview before uploading */}
          {filePreviews.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  {filePreviews.length} {filePreviews.length === 1 ? 'image' : 'images'} selected for upload:
                </span>
                <button
                  type="button"
                  onClick={handleUploadSubmit}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading Slides...' : `Upload ${filePreviews.length} Slide(s)`}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filePreviews.map((item, idx) => (
                  <div key={idx} className="relative rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs group">
                    <img src={item.url} alt={item.name} className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveStaged(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-md hover:bg-red-700 cursor-pointer shadow-xs"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="p-1.5 text-[10px] font-medium text-slate-600 truncate text-center">
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Carousel Slides Sequence Gallery */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Presentation Slide Sequence</h2>
              <p className="text-xs text-slate-500">
                Drag or use arrows to arrange the order that MRs flip through during doctor meetings.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {activeSlides.length} of {slides.length} active in deck
            </span>
          </div>

          {slides.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No Slide Images in Carousel Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Upload your pharmaceutical visual aid images above. MRs will flip through them as an interactive full-screen carousel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-xs ${
                    slide.is_active
                      ? 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-md'
                      : 'bg-slate-50/70 border-slate-200 opacity-60'
                  }`}
                >
                  {/* Top Bar with Slide Number & Visibility */}
                  <div className="p-2.5 px-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                      Slide #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(slide)}
                      className={`p-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        slide.is_active ? 'text-emerald-700 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                      }`}
                      title={slide.is_active ? 'Active in presentation' : 'Hidden from presentation'}
                    >
                      {slide.is_active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Slide Image Preview with Lightbox Click */}
                  <div
                    onClick={() => setLightboxIndex(idx)}
                    className="relative w-full h-44 bg-slate-900 cursor-pointer overflow-hidden group"
                  >
                    <img
                      src={slide.image_path}
                      alt={slide.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[1px]">
                      <Eye className="w-4 h-4" />
                      <span>View Full Slide</span>
                    </div>
                  </div>

                  {/* Slide Title & Order Controls */}
                  <div className="p-3 bg-white space-y-2">
                    {/* Title */}
                    {editingTitleId === slide.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editTitleValue}
                          onChange={(e) => setEditTitleValue(e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                          placeholder="Slide Title"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveTitle(slide)}
                          className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTitleId(null)}
                          className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 truncate" title={slide.title}>
                          {slide.title || `Slide ${idx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTitleId(slide.id);
                            setEditTitleValue(slide.title || '');
                          }}
                          className="p-1 text-slate-400 hover:text-teal-700 rounded cursor-pointer"
                          title="Rename slide"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Bottom Action Buttons: Move Left, Move Right, Delete */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(idx, -1)}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                          title="Move Left (Earlier in Carousel)"
                        >
                          <MoveLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 1)}
                          disabled={idx === slides.length - 1}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                          title="Move Right (Later in Carousel)"
                        >
                          <MoveRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ isOpen: true, slide })}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Lightbox Modal for Admin Slide Preview */}
      {lightboxIndex !== null && slides[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-300 border border-teal-500/50">
                  Slide {lightboxIndex + 1} of {slides.length}
                </span>
                <span className="text-sm font-semibold text-slate-200">
                  {slides[lightboxIndex].title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Slide Image */}
            <div className="relative w-full max-h-[80vh] flex items-center justify-center">
              <img
                src={slides[lightboxIndex].image_path}
                alt={slides[lightboxIndex].title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />

              {/* Prev / Next Lightbox Controls */}
              {lightboxIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(lightboxIndex - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer backdrop-blur-xs transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {lightboxIndex < slides.length - 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(lightboxIndex + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer backdrop-blur-xs transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Slide Image?"
        message={`Are you sure you want to remove "${deleteConfirm.slide?.title || 'this slide'}" from the visual aid carousel?`}
        confirmText="Delete Slide"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, slide: null })}
      />
    </AdminLayout>
  );
}
