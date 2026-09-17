import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
}

export default function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle
}: ImagePreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview photo of ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image preview"
          className="absolute -top-12 right-0 sm:-right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Photo Container */}
        <div className="bg-[#0B251D] p-2 sm:p-3 rounded-3xl border border-emerald-800/40 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col items-center">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[68vh] max-w-full w-auto object-contain rounded-2xl select-none"
            referrerPolicy="no-referrer"
          />

          {/* Caption underneath */}
          <div className="w-full text-center pt-3 pb-1 px-4">
            <h4 className="text-white font-serif font-bold text-base sm:text-lg tracking-tight">
              {title}
            </h4>
            {subtitle && (
              <p className="text-emerald-300 text-xs font-mono uppercase tracking-wider font-semibold mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Escape hint for desktop */}
        <div className="text-white/60 text-[11px] font-mono mt-3 hidden sm:block">
          Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20 text-white">Esc</kbd> or click anywhere outside to close
        </div>
      </div>
    </div>
  );
}
