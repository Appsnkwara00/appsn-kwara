import React, { useState } from 'react';
import { ServiceItem } from '../../types';
import { 
  Compass, 
  Mountain, 
  Home, 
  Map, 
  Waves, 
  Crosshair, 
  FileCheck, 
  ShieldCheck, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  Eye, 
  EyeOff,
  Sparkles,
  Layers
} from 'lucide-react';
import { getServiceIcon } from '../ServicesSection';

interface ServicesTabProps {
  services: ServiceItem[];
  onSaveService?: (service: ServiceItem) => void;
  onDeleteService?: (id: string) => void;
}

const AVAILABLE_ICONS = [
  'Compass',
  'Mountain',
  'Home',
  'Map',
  'Waves',
  'Crosshair',
  'FileCheck',
  'ShieldCheck'
];

export default function ServicesTab({
  services,
  onSaveService,
  onDeleteService
}: ServicesTabProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [useCase, setUseCase] = useState('');
  const [iconName, setIconName] = useState('Compass');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  const sortedServices = [...services].sort((a, b) => a.display_order - b.display_order);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setShortDesc('');
    setFullDesc('');
    setUseCase('');
    setIconName('Compass');
    setDisplayOrder(sortedServices.length + 1);
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingService(s);
    setName(s.name);
    setShortDesc(s.shortDesc);
    setFullDesc(s.fullDesc);
    setUseCase(s.useCase);
    setIconName(s.iconName || 'Compass');
    setDisplayOrder(s.display_order);
    setIsActive(s.is_active !== false);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !shortDesc || !onSaveService) return;

    const saved: ServiceItem = {
      id: editingService ? editingService.id : `service-${Date.now()}`,
      name,
      shortDesc,
      fullDesc: fullDesc || shortDesc,
      useCase: useCase || 'Land administration, development and construction.',
      iconName,
      display_order: Number(displayOrder) || 1,
      is_active: isActive
    };

    onSaveService(saved);
    setIsFormOpen(false);
    setEditingService(null);
  };

  const handleToggleActive = (s: ServiceItem) => {
    if (!onSaveService) return;
    onSaveService({
      ...s,
      is_active: s.is_active === false ? true : false
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-mono font-bold mb-2">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>PRACTICE SPECIALTIES &amp; SERVICES</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Survey Practice Services
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Manage the official surveying services offered across Kwara State. Edit titles, technical descriptions, applications, and icons displayed in the Services section and menu.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#0D3829] hover:bg-[#08281D] text-white text-xs font-bold py-3 px-5 rounded-2xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Practice Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedServices.map((service) => {
          const IconComp = getServiceIcon(service.iconName);
          const active = service.is_active !== false;

          return (
            <div 
              key={service.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                active ? 'border-slate-200/90' : 'border-slate-200/50 opacity-60 bg-slate-50/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{service.display_order}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {service.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800">
                        Icon: {service.iconName || 'Compass'}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {active ? 'ACTIVE' : 'HIDDEN'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.shortDesc}
                </p>

                {service.useCase && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                    <strong className="text-slate-700">Application:</strong> {service.useCase}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => handleToggleActive(service)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  {active ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide on Website</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show on Website</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {onDeleteService && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
                          onDeleteService(service.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8 border border-slate-100 my-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {editingService ? `Edit "${editingService.name}"` : 'Add New Practice Service'}
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
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cadastral & Boundary Surveying"
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
                  Select Visual Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVAILABLE_ICONS.map((icon) => {
                    const Comp = getServiceIcon(icon);
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
                        <Comp className="w-4 h-4" />
                        <span className="text-[10px] font-mono">{icon}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Short Summary * (Shown on Service Card)
                </label>
                <textarea
                  rows={2}
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Precise boundary delineation, beacon layout, and perimeter validation to safeguard title ownership."
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Full Technical Scope (Shown on detailed view)
                </label>
                <textarea
                  rows={3}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Boundary and perimeter determination using high-precision GNSS RTK and total station instrumentation..."
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Key Use Case / Application */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Key Application / Use Cases
                </label>
                <input
                  type="text"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  placeholder="Residential land acquisition, perimeter fencing, and farm demarcations."
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="service-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#0D3829] cursor-pointer"
                />
                <label htmlFor="service-active" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Service is Active and visible on the website
                </label>
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
                  Save Practice Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
