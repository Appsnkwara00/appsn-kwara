import React, { useState } from 'react';
import { VerificationPillar } from '../../types';
import { 
  ShieldCheck, 
  Stamp, 
  AlertTriangle, 
  FileCheck, 
  Lock, 
  Compass, 
  Award, 
  CheckCircle2, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  FileSearch
} from 'lucide-react';

interface ValidationGuideTabProps {
  pillars: VerificationPillar[];
  onSavePillar?: (pillar: VerificationPillar) => void;
  onDeletePillar?: (id: string) => void;
}

const AVAILABLE_PILLAR_ICONS = [
  'ShieldCheck',
  'Stamp',
  'AlertTriangle',
  'FileCheck',
  'Lock',
  'Compass',
  'Award',
  'CheckCircle2'
];

function renderPillarIcon(iconName?: string) {
  switch (iconName) {
    case 'Stamp':
      return <Stamp className="w-5 h-5 text-[#0D3829]" />;
    case 'AlertTriangle':
      return <AlertTriangle className="w-5 h-5 text-[#0D3829]" />;
    case 'FileCheck':
      return <FileCheck className="w-5 h-5 text-[#0D3829]" />;
    case 'Lock':
      return <Lock className="w-5 h-5 text-[#0D3829]" />;
    case 'Compass':
      return <Compass className="w-5 h-5 text-[#0D3829]" />;
    case 'Award':
      return <Award className="w-5 h-5 text-[#0D3829]" />;
    case 'CheckCircle2':
      return <CheckCircle2 className="w-5 h-5 text-[#0D3829]" />;
    case 'ShieldCheck':
    default:
      return <ShieldCheck className="w-5 h-5 text-[#0D3829]" />;
  }
}

export default function ValidationGuideTab({
  pillars,
  onSavePillar,
  onDeletePillar
}: ValidationGuideTabProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<VerificationPillar | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('ShieldCheck');
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  const sortedPillars = [...pillars].sort((a, b) => a.display_order - b.display_order);

  const handleOpenAdd = () => {
    setEditingPillar(null);
    setTitle('');
    setDescription('');
    setIconName('ShieldCheck');
    setDisplayOrder(sortedPillars.length + 1);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: VerificationPillar) => {
    setEditingPillar(p);
    setTitle(p.title);
    setDescription(p.description);
    setIconName(p.iconName || 'ShieldCheck');
    setDisplayOrder(p.display_order);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !onSavePillar) return;

    const saved: VerificationPillar = {
      id: editingPillar ? editingPillar.id : `pillar-${Date.now()}`,
      title,
      description,
      iconName,
      display_order: Number(displayOrder) || 1
    };

    onSavePillar(saved);
    setIsFormOpen(false);
    setEditingPillar(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-mono font-bold mb-2">
            <FileSearch className="w-3.5 h-3.5 text-emerald-600" />
            <span>CITIZEN PROTECTION &amp; AUTHENTICATION</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Validation Guide &amp; Statutory Pillars
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Control the statutory protection pillars and verification criteria on the homepage. Educates property buyers on court admissibility, SURCON seals, and zero tolerance for quackery.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#0D3829] hover:bg-[#08281D] text-white text-xs font-bold py-3 px-5 rounded-2xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Validation Pillar</span>
        </button>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedPillars.map((pillar) => (
          <div 
            key={pillar.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-900 flex items-center justify-center shrink-0">
                    {renderPillarIcon(pillar.iconName)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      Pillar #{pillar.display_order}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 font-serif leading-snug mt-0.5">
                      {pillar.title}
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-[#FAF9F5] p-3 rounded-xl border border-slate-100">
                {pillar.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
              <button
                onClick={() => handleOpenEdit(pillar)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Pillar</span>
              </button>

              {onDeletePillar && (
                <button
                  onClick={() => {
                    if (confirm(`Delete pillar "${pillar.title}"?`)) {
                      onDeletePillar(pillar.id);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Delete Pillar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 border border-slate-100 my-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {editingPillar ? `Edit Pillar #${editingPillar.display_order}` : 'Add Validation Pillar'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                    Pillar Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Legal Court Admissibility"
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Pillar Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVAILABLE_PILLAR_ICONS.map((icon) => {
                    const isSelected = iconName === icon;
                    return (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setIconName(icon)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#0D3829] text-white border-[#0D3829] shadow-xs'
                            : 'bg-[#FAF9F5] hover:bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {renderPillarIcon(icon)}
                        <span className="text-[10px] font-mono truncate max-w-full">{icon}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Citizen Protection Statement *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Only survey plans prepared, signed, and sealed by SURCON-registered surveyors are recognized as legal evidence in Nigerian courts..."
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0D3829] hover:bg-[#08281D] text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  Save Pillar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
