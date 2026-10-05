import React, { useState, useRef } from 'react';
import { 
  Surveyor, AdminAccount, ContactMessage, Executive, AimObjective,
  ServiceItem, VerificationPillar, AboutContent, SiteSettings
} from '../types';
import { 
  KWARA_LGAS, SPECIALIZATIONS,
  INITIAL_SERVICES, INITIAL_VERIFICATION_PILLARS,
  INITIAL_ABOUT_CONTENT, INITIAL_SITE_SETTINGS
} from '../data';
import { resolveLgaFromLocation } from '../lib/lgaResolver';
import BrandingSettingsTab from './admin/BrandingSettingsTab';
import ServicesTab from './admin/ServicesTab';
import ValidationGuideTab from './admin/ValidationGuideTab';
import AboutContentTab from './admin/AboutContentTab';
import AdminLocationPickerMap from './map/AdminLocationPickerMap';
import { 
  Users, UserCheck, ShieldAlert, FileText, Plus, Search, 
  Trash2, Edit, Check, CheckCircle2, AlertCircle, Eye, 
  EyeOff, MapPin, Briefcase, Calendar, Star, LogOut, 
  User, Mail, Phone, Lock, Save, RefreshCw, Upload, Reply, X,
  Crown, Compass, ZoomIn, ShieldCheck, ArrowRight,
  Layers, FileSearch, Building2, Globe
} from 'lucide-react';

interface AdminPortalProps {
  surveyors: Surveyor[];
  admins: AdminAccount[];
  messages: ContactMessage[];
  executives?: Executive[];
  aims?: AimObjective[];
  services?: ServiceItem[];
  pillars?: VerificationPillar[];
  aboutContent?: AboutContent;
  siteSettings?: SiteSettings;
  onAddSurveyor: (surveyor: Omit<Surveyor, 'id' | 'createdAt'>) => void;
  onUpdateSurveyor: (surveyor: Surveyor) => void;
  onDeleteSurveyor: (id: string) => void;
  onSaveExecutive?: (executive: Executive) => void;
  onDeleteExecutive?: (id: string) => void;
  onSaveAim?: (aim: AimObjective) => void;
  onDeleteAim?: (id: string) => void;
  onSaveService?: (service: ServiceItem) => void;
  onDeleteService?: (id: string) => void;
  onSavePillar?: (pillar: VerificationPillar) => void;
  onDeletePillar?: (id: string) => void;
  onSaveAboutContent?: (content: AboutContent) => void;
  onSaveSiteSettings?: (settings: SiteSettings) => void;
  onAddAdmin: (username: string, email: string, role: 'Super Admin' | 'Branch Admin') => void;
  onDeleteAdmin: (id: string) => void;
  onUpdateMessageStatus: (id: string, status: 'unread' | 'replied' | 'archived') => void;
  onDeleteMessage: (id: string) => void;
  onLoginSuccess: (admin: AdminAccount) => void;
  loggedInAdmin: AdminAccount | null;
  onPreviewImage?: (imageUrl: string, title: string, subtitle?: string) => void;
}

export default function AdminPortal({
  surveyors,
  admins,
  messages,
  executives = [],
  aims = [],
  services = INITIAL_SERVICES,
  pillars = INITIAL_VERIFICATION_PILLARS,
  aboutContent = INITIAL_ABOUT_CONTENT,
  siteSettings = INITIAL_SITE_SETTINGS,
  onAddSurveyor,
  onUpdateSurveyor,
  onDeleteSurveyor,
  onSaveExecutive,
  onDeleteExecutive,
  onSaveAim,
  onDeleteAim,
  onSaveService,
  onDeleteService,
  onSavePillar,
  onDeletePillar,
  onSaveAboutContent,
  onSaveSiteSettings,
  onAddAdmin,
  onDeleteAdmin,
  onUpdateMessageStatus,
  onDeleteMessage,
  onLoginSuccess,
  loggedInAdmin,
  onPreviewImage
}: AdminPortalProps) {
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('appsnkwara0@gmail.com');
  const [loginPassword, setLoginPassword] = useState('appsnkwara2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin View State
  const [activeTab, setActiveTab] = useState<
    'stats' | 'surveyors' | 'executives' | 'aims' | 'services' | 'validation' | 'about' | 'branding' | 'admins' | 'messages'
  >('stats');

  // Search/Filter states inside Admin Panel
  const [adminSearch, setAdminSearch] = useState('');
  const [adminLgaFilter, setAdminLgaFilter] = useState('');
  const [adminSpecFilter, setAdminSpecFilter] = useState('');

  // Surveyor Form states (For Add / Edit)
  const [isSurveyorFormOpen, setIsSurveyorFormOpen] = useState(false);
  const [editingSurveyor, setEditingSurveyor] = useState<Surveyor | null>(null);
  
  // Form fields (Notice: NO formExp)
  const [formName, setFormName] = useState('');
  const [formRegNo, setFormRegNo] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formLga, setFormLga] = useState(KWARA_LGAS[0]);
  const [formLat, setFormLat] = useState<number | null>(null);
  const [formLng, setFormLng] = useState<number | null>(null);
  const [formSpec, setFormSpec] = useState(SPECIALIZATIONS[0]);
  const [formAbout, setFormAbout] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formPhoto, setFormPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200');
  const [detectedLgaNote, setDetectedLgaNote] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Executive Management States
  const [isExecFormOpen, setIsExecFormOpen] = useState(false);
  const [editingExec, setEditingExec] = useState<Executive | null>(null);
  const [execName, setExecName] = useState('');
  const [execPosition, setExecPosition] = useState('');
  const [execImage, setExecImage] = useState('');
  const [execBio, setExecBio] = useState('');
  const [execOrder, setExecOrder] = useState<number>(1);
  const [execIsActive, setExecIsActive] = useState<boolean>(true);
  const execPhotoInputRef = useRef<HTMLInputElement>(null);

  // Aims Management States
  const [isAimFormOpen, setIsAimFormOpen] = useState(false);
  const [editingAim, setEditingAim] = useState<AimObjective | null>(null);
  const [aimTitle, setAimTitle] = useState('');
  const [aimDesc, setAimDesc] = useState('');
  const [aimOrder, setAimOrder] = useState<number>(1);

  // New Admin Form fields
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'Super Admin' | 'Branch Admin'>('Branch Admin');

  // Reply popup
  const [replyingMessage, setReplyingMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplySent, setIsReplySent] = useState(false);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all credentials.');
      return;
    }

    const foundAdmin = admins.find(a => a.email.toLowerCase() === loginEmail.toLowerCase());
    if (foundAdmin && loginPassword === 'appsnkwara2026') {
      onLoginSuccess(foundAdmin);
      setLoginError('');
    } else if (loginEmail === 'appsnkwara0@gmail.com' && loginPassword === 'appsnkwara2026') {
      onLoginSuccess({
        id: 'admin-default',
        username: 'Kwara Admin',
        email: 'appsnkwara0@gmail.com',
        role: 'Super Admin'
      });
      setLoginError('');
    } else {
      setLoginError('Invalid email or password. Hint: Use demo credentials below.');
    }
  };

  // Image Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Automatic LGA detection handler when typing address
  const handleAddressChange = (address: string) => {
    setFormAddress(address);
    const resolved = resolveLgaFromLocation(address);
    if (resolved !== "LGA not specified") {
      setFormLga(resolved);
      setDetectedLgaNote(`Automatically assigned: ${resolved} LGA`);
    } else {
      setDetectedLgaNote("LGA not specified (select manually below or add landmark)");
    }
  };

  // Open Form to Add Surveyor
  const handleOpenAddForm = () => {
    setEditingSurveyor(null);
    setFormName('');
    setFormRegNo('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormLga(KWARA_LGAS[0]);
    setFormLat(null);
    setFormLng(null);
    setFormSpec(SPECIALIZATIONS[0]);
    setFormAbout('');
    setFormIsActive(true);
    setFormPhoto('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200');
    setDetectedLgaNote(null);
    setIsSurveyorFormOpen(true);
  };

  // Open Form to Edit Surveyor
  const handleOpenEditForm = (surveyor: Surveyor) => {
    setEditingSurveyor(surveyor);
    setFormName(surveyor.fullName);
    setFormRegNo(surveyor.registrationNumber);
    setFormPhone(surveyor.phoneNumber);
    setFormEmail(surveyor.email);
    setFormAddress(surveyor.officeAddress);
    setFormLga(surveyor.lga === 'LGA not specified' ? KWARA_LGAS[0] : surveyor.lga);
    setFormLat(typeof surveyor.latitude === 'number' ? surveyor.latitude : null);
    setFormLng(typeof surveyor.longitude === 'number' ? surveyor.longitude : null);
    setFormSpec(surveyor.specialization);
    setFormAbout(surveyor.aboutMe || '');
    setFormIsActive(surveyor.isActive);
    setFormPhoto(surveyor.profilePhoto);
    setDetectedLgaNote(`Current: ${surveyor.lga}`);
    setIsSurveyorFormOpen(true);
  };

  // Save Surveyor (Add or Edit)
  const handleSaveSurveyor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formRegNo || !formPhone || !formEmail) return;

    if (editingSurveyor) {
      onUpdateSurveyor({
        ...editingSurveyor,
        fullName: formName,
        registrationNumber: formRegNo,
        phoneNumber: formPhone,
        email: formEmail,
        officeAddress: formAddress,
        lga: formLga,
        specialization: formSpec,
        aboutMe: formAbout,
        isActive: formIsActive,
        profilePhoto: formPhoto,
        latitude: formLat,
        longitude: formLng
      });
    } else {
      onAddSurveyor({
        fullName: formName,
        registrationNumber: formRegNo,
        phoneNumber: formPhone,
        email: formEmail,
        officeAddress: formAddress,
        lga: formLga,
        specialization: formSpec,
        aboutMe: formAbout,
        isActive: formIsActive,
        profilePhoto: formPhoto,
        latitude: formLat,
        longitude: formLng
      });
    }
    setIsSurveyorFormOpen(false);
    setEditingSurveyor(null);
  };

  // Executive Management Handlers
  const handleOpenAddExec = () => {
    setEditingExec(null);
    setExecName('');
    setExecPosition('');
    setExecImage('');
    setExecBio('');
    setExecOrder(executives.length + 1);
    setExecIsActive(true);
    setIsExecFormOpen(true);
  };

  const handleOpenEditExec = (exec: Executive) => {
    setEditingExec(exec);
    setExecName(exec.full_name);
    setExecPosition(exec.position);
    setExecImage(exec.profile_image || '');
    setExecBio(exec.bio || '');
    setExecOrder(exec.display_order);
    setExecIsActive(exec.is_active !== false && exec.active !== false);
    setIsExecFormOpen(true);
  };

  const handleExecPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setExecImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleExecActive = (exec: Executive) => {
    if (!onSaveExecutive) return;
    const currentActive = exec.is_active !== false && exec.active !== false;
    onSaveExecutive({
      ...exec,
      is_active: !currentActive
    });
  };

  const handleSaveExecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!execName || !execPosition || !onSaveExecutive) return;

    const saved: Executive = {
      id: editingExec ? editingExec.id : `exec-${Date.now()}`,
      full_name: execName.trim(),
      position: execPosition.trim(),
      profile_image: execImage.trim(),
      bio: execBio.trim(),
      display_order: Number(execOrder) || 1,
      is_active: execIsActive
    };

    onSaveExecutive(saved);
    setIsExecFormOpen(false);
    setEditingExec(null);
  };

  // Aims Management Handlers
  const handleOpenAddAim = () => {
    setEditingAim(null);
    setAimTitle('');
    setAimDesc('');
    setAimOrder(aims.length + 1);
    setIsAimFormOpen(true);
  };

  const handleOpenEditAim = (aim: AimObjective) => {
    setEditingAim(aim);
    setAimTitle(aim.title);
    setAimDesc(aim.description);
    setAimOrder(aim.display_order);
    setIsAimFormOpen(true);
  };

  const handleSaveAimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aimTitle || !aimDesc || !onSaveAim) return;

    const saved: AimObjective = {
      id: editingAim ? editingAim.id : `aim-${Date.now()}`,
      title: aimTitle,
      description: aimDesc,
      icon: editingAim ? editingAim.icon : 'ShieldCheck',
      display_order: Number(aimOrder) || 1,
      is_active: true
    };

    onSaveAim(saved);
    setIsAimFormOpen(false);
    setEditingAim(null);
  };

  // Create new Admin Submit
  const handleCreateAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUser || !newAdminEmail) return;
    onAddAdmin(newAdminUser, newAdminEmail, newAdminRole);
    setNewAdminUser('');
    setNewAdminEmail('');
    setIsAdminFormOpen(false);
  };

  // Handle Reply Submit
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingMessage || !replyText) return;
    onUpdateMessageStatus(replyingMessage.id, 'replied');
    setIsReplySent(true);
    setTimeout(() => {
      setIsReplySent(false);
      setReplyingMessage(null);
      setReplyText('');
    }, 1500);
  };

  // Safe fallback photo
  const renderPhoto = (photoUrl?: string) => {
    return photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200';
  };

  // Filtered Surveyors for Admin Table
  const filteredSurveyors = surveyors.filter(s => {
    const q = adminSearch.toLowerCase().trim();
    const matchQ = !q || 
      s.fullName.toLowerCase().includes(q) ||
      s.registrationNumber.toLowerCase().includes(q) ||
      s.officeAddress.toLowerCase().includes(q) ||
      s.lga.toLowerCase().includes(q);

    const matchLga = !adminLgaFilter || s.lga === adminLgaFilter;
    const matchSpec = !adminSpecFilter || s.specialization === adminSpecFilter;

    return matchQ && matchLga && matchSpec;
  });

  const unreadInquiries = messages.filter(m => m.status === 'unread').length;

  // -------------------------------------------------------------
  // LOGIN SCREEN (If not logged in)
  // -------------------------------------------------------------
  if (!loggedInAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#0D3829] text-emerald-300 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Admin Portal
            </h2>
            <p className="text-xs text-slate-500">
              Association of Private Practicing Surveyors of Nigeria (APPSN), Kwara State Branch.
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="appsnkwara0@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0D3829] transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0D3829] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-900 leading-relaxed font-mono">
              <strong>Authorized Portal:</strong> Use default credentials <span className="underline">appsnkwara0@gmail.com</span> / <span className="underline">appsnkwara2026</span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0D3829] hover:bg-[#08281D] text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase font-mono tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Sign In to Command Center
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DASHBOARD SCREEN (Logged In)
  // -------------------------------------------------------------
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8" id="admin-dashboard-container">
      
      {/* Top Welcome Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>APPSN Kwara Branch Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Welcome, {loggedInAdmin.username}
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            {loggedInAdmin.email} • {loggedInAdmin.role}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('surveyors')}
            className="bg-[#0D3829] hover:bg-[#08281D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Surveyor</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-4 space-y-1.5 shadow-xs">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            Navigation
          </div>

          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-[#0D3829] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#FAF9F5]'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('surveyors')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'surveyors'
                ? 'bg-[#0D3829] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#FAF9F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>Surveyors Directory</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {surveyors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('executives')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'executives'
                ? 'bg-[#0D3829] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#FAF9F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Executive Council</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {executives.length || 3}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('aims')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'aims'
                ? 'bg-[#0D3829] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#FAF9F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Aims & Objectives</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {aims.length || 10}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#0D3829] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#FAF9F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 shrink-0 text-teal-600" />
              <span>Practice Services</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {services.length || 8}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('validation')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'validation'
                ? 'bg-[#0D3829] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#FAF9F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSearch className="w-4 h-4 shrink-0 text-cyan-600" />
              <span>Validation Guide</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {pillars.length || 4}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-[#0D3829] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#FAF9F5]'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>About APPSN</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'branding'
                ? 'bg-[#0D3829] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#FAF9F5]'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0 text-indigo-500" />
            <span>Logo, Favicon & Brand</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-[#0D3829] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#FAF9F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 shrink-0" />
              <span>Contact Inquiries</span>
            </div>
            {unreadInquiries > 0 && (
              <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                {unreadInquiries} NEW
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'admins'
                ? 'bg-[#0D3829] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#FAF9F5]'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Admin Personnel</span>
          </button>
        </div>

        {/* Work Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Registered</span>
                  <div className="text-3xl font-bold text-slate-900 font-serif">{surveyors.length}</div>
                  <p className="text-xs text-slate-500">SURCON certified practitioners</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Active Status</span>
                  <div className="text-3xl font-bold text-emerald-700 font-serif">
                    {surveyors.filter(s => s.isActive).length}
                  </div>
                  <p className="text-xs text-slate-500">Authorized for public lodgement</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Citizen Inquiries</span>
                  <div className="text-3xl font-bold text-blue-700 font-serif">{messages.length}</div>
                  <p className="text-xs text-slate-500">{unreadInquiries} pending attention</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SURVEYORS DIRECTORY */}
          {activeTab === 'surveyors' && (
            <div className="space-y-6">
              
              {/* Actions & Filters */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif">Manage Surveyors Directory</h3>
                    <p className="text-xs text-slate-500">Live Supabase database records.</p>
                  </div>
                  <button
                    onClick={handleOpenAddForm}
                    className="bg-[#0D3829] hover:bg-[#08281D] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Surveyor</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      placeholder="Search name, reg number, address..."
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <select
                    value={adminLgaFilter}
                    onChange={(e) => setAdminLgaFilter(e.target.value)}
                    className="py-2 px-3 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs text-slate-700"
                  >
                    <option value="">All LGAs</option>
                    {KWARA_LGAS.map(lga => (
                      <option key={lga} value={lga}>{lga} LGA</option>
                    ))}
                  </select>

                  <select
                    value={adminSpecFilter}
                    onChange={(e) => setAdminSpecFilter(e.target.value)}
                    className="py-2 px-3 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs text-slate-700"
                  >
                    <option value="">All Specializations</option>
                    {SPECIALIZATIONS.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table of Surveyors */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-slate-200/80 text-slate-500 font-mono uppercase text-[10px]">
                        <th className="px-5 py-3.5">Surveyor</th>
                        <th className="px-5 py-3.5">Reg Number</th>
                        <th className="px-5 py-3.5">Office & Assigned LGA</th>
                        <th className="px-5 py-3.5">Contact</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredSurveyors.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-400">
                            No surveyors match criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredSurveyors.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div 
                                  onClick={() => onPreviewImage && s.profilePhoto && onPreviewImage(s.profilePhoto, s.fullName, s.registrationNumber)}
                                  className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-zoom-in group/img relative"
                                  title="Click to preview"
                                >
                                  <img
                                    src={renderPhoto(s.profilePhoto)}
                                    alt={s.fullName}
                                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 line-clamp-1">{s.fullName}</div>
                                  <div className="text-[11px] text-slate-400 line-clamp-1">{s.company_name || 'Private Practice'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-mono font-semibold text-slate-700">
                              {s.registrationNumber}
                            </td>
                            <td className="px-5 py-3.5 space-y-0.5">
                              <div className="font-bold text-emerald-900 font-mono text-[11px]">
                                {s.lga === 'LGA not specified' ? 'LGA not specified' : `${s.lga} LGA`}
                              </div>
                              <div className="text-slate-500 text-[11px] truncate max-w-[200px]" title={s.officeAddress}>
                                {s.officeAddress}
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">
                              <div>{s.phoneNumber}</div>
                              <div className="text-slate-400 truncate max-w-[140px]">{s.email}</div>
                            </td>
                            <td className="px-5 py-3.5">
                              {s.isActive ? (
                                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                                  ACTIVE
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded-full">
                                  INACTIVE
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditForm(s)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#0D3829] cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete ${s.fullName}?`)) {
                                      onDeleteSurveyor(s.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: EXECUTIVE COUNCIL */}
          {activeTab === 'executives' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">APPSN Kwara Executive Council</h3>
                  <p className="text-xs text-slate-500">Manage Chairman, Vice Chairman, Secretary, and all executive council officers, positions, photos, and display order.</p>
                </div>
                <button
                  onClick={handleOpenAddExec}
                  className="bg-[#0D3829] hover:bg-[#08281D] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Executive</span>
                </button>
              </div>

              {executives.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
                  No executives found. Click "Add Executive" above to add one.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...executives].sort((a, b) => a.display_order - b.display_order).map((exec) => {
                    const isActive = exec.is_active !== false && exec.active !== false;
                    return (
                      <div key={exec.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div 
                            onClick={() => onPreviewImage && exec.profile_image && onPreviewImage(exec.profile_image, exec.full_name, `${exec.position} • APPSN Kwara`)}
                            className="relative aspect-[4/3.5] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 cursor-zoom-in group/photo"
                            title="Click to preview photo"
                          >
                            {exec.profile_image ? (
                              <img
                                src={exec.profile_image}
                                alt={exec.full_name}
                                className="w-full h-full object-cover object-center group-hover/photo:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-[#0D3829] font-serif font-bold text-xl">
                                {exec.full_name.charAt(0)}
                              </div>
                            )}
                            <div className="absolute top-2.5 left-2.5 bg-[#0D3829] text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                              Order #{exec.display_order}
                            </div>
                            <div className="absolute top-2.5 right-2.5">
                              {isActive ? (
                                <span className="bg-emerald-500 text-white text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs">
                                  ACTIVE
                                </span>
                              ) : (
                                <span className="bg-slate-500 text-white text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs">
                                  INACTIVE
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-[11px] font-mono uppercase font-bold text-emerald-800 block">
                              {exec.position}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 font-serif">
                              {exec.full_name}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-3 mt-1 leading-relaxed">
                              {exec.bio || 'APPSN Kwara State Branch Executive Council Member.'}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleExecActive(exec)}
                            className={`text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Toggle active status"
                          >
                            {isActive ? 'Active' : 'Disabled'}
                          </button>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditExec(exec)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#0D3829] cursor-pointer text-xs font-bold flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            {onDeleteExecutive && (
                              <button
                                onClick={() => {
                                  if (confirm(`Remove ${exec.full_name} from Executive Council?`)) {
                                    onDeleteExecutive(exec.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                                title="Remove Executive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AIMS & OBJECTIVES */}
          {activeTab === 'aims' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">APPSN Kwara Aims &amp; Objectives</h3>
                  <p className="text-xs text-slate-500">Official constitutional mandates displayed on the homepage and throughout the portal.</p>
                </div>

                <button
                  onClick={handleOpenAddAim}
                  className="bg-[#0D3829] hover:bg-[#08281D] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Aim &amp; Objective</span>
                </button>
              </div>

              <div className="space-y-3">
                {[...aims].sort((a, b) => a.display_order - b.display_order).map((aim) => (
                  <div key={aim.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          #{aim.display_order}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 font-serif">
                          {aim.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {aim.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEditAim(aim)}
                        className="text-xs font-bold text-[#0D3829] hover:bg-[#FAF9F5] p-2 rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-200"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {onDeleteAim && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete aim #${aim.display_order}: "${aim.title}"?`)) {
                              onDeleteAim(aim.id);
                            }
                          }}
                          className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer border border-slate-200"
                          title="Delete Aim"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PRACTICE SERVICES */}
          {activeTab === 'services' && (
            <ServicesTab 
              services={services}
              onSaveService={onSaveService}
              onDeleteService={onDeleteService}
            />
          )}

          {/* TAB: VALIDATION GUIDE */}
          {activeTab === 'validation' && (
            <ValidationGuideTab 
              pillars={pillars}
              onSavePillar={onSavePillar}
              onDeletePillar={onDeletePillar}
            />
          )}

          {/* TAB: ABOUT APPSN */}
          {activeTab === 'about' && (
            <AboutContentTab 
              aboutContent={aboutContent}
              onSaveAboutContent={onSaveAboutContent}
              onPreviewImage={onPreviewImage}
            />
          )}

          {/* TAB: BRANDING & SITE SETTINGS */}
          {activeTab === 'branding' && (
            <BrandingSettingsTab 
              siteSettings={siteSettings}
              onSaveSiteSettings={onSaveSiteSettings}
            />
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 font-serif">Citizen Inquiries</h3>
                <p className="text-xs text-slate-500">Messages sent through public verification forms.</p>
              </div>

              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center text-slate-400">
                    No messages received yet.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">{new Date(msg.createdAt).toLocaleString()}</span>
                          <h4 className="text-sm font-bold text-slate-900">{msg.name}</h4>
                          <div className="text-xs text-slate-500 font-mono">{msg.email} • {msg.phone}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setReplyingMessage(msg);
                              setReplyText('');
                            }}
                            className="text-xs font-bold text-[#0D3829] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Reply className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </button>
                          <button
                            onClick={() => onDeleteMessage(msg.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 bg-[#FAF9F5] p-3 rounded-xl border border-slate-100">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ADMINS */}
          {activeTab === 'admins' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">Admin Personnel</h3>
                  <p className="text-xs text-slate-500">Authorized branch officers.</p>
                </div>
                <button
                  onClick={() => setIsAdminFormOpen(true)}
                  className="bg-[#0D3829] hover:bg-[#08281D] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Admin</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-slate-200 font-mono text-[10px] text-slate-500 uppercase">
                    <tr>
                      <th className="px-5 py-3">Username</th>
                      <th className="px-5 py-3">Email</th>
                      <th className="px-5 py-3">Role</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {admins.map((adm) => (
                      <tr key={adm.id}>
                        <td className="px-5 py-3 font-bold text-slate-900">{adm.username}</td>
                        <td className="px-5 py-3 font-mono text-slate-600">{adm.email}</td>
                        <td className="px-5 py-3 font-mono text-[11px] text-emerald-800 font-bold">{adm.role}</td>
                        <td className="px-5 py-3 text-right">
                          {admins.length > 1 && (
                            <button
                              onClick={() => onDeleteAdmin(adm.id)}
                              className="text-rose-600 hover:underline font-bold text-xs cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT SURVEYOR (Automatic LGA detection & NO experience) */}
      {/* ------------------------------------------------------------- */}
      {isSurveyorFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 border border-slate-100 my-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  {editingSurveyor ? 'Edit Surveyor Profile' : 'Register New Surveyor'}
                </h3>
                <p className="text-xs text-slate-500">
                  LGA is automatically resolved from the office address.
                </p>
              </div>
              <button
                onClick={() => setIsSurveyorFormOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSurveyor} className="space-y-4">
              
              {/* Full Name & Reg Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                    Full Name (with title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Surv. Funsho-Salawu Ayodeji"
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                    SURCON Registration No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={formRegNo}
                    onChange={(e) => setFormRegNo(e.target.value)}
                    placeholder="SURCON 1234 or SURCON/2020/1234"
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="08031234567"
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="surveyor@domain.com"
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                  />
                </div>
              </div>

              {/* Office Address (Triggers Automatic LGA resolution) */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Office Physical Address * (Automatic LGA Assignment)
                </label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="e.g. 14 Basin Road, GRA, Ilorin, Kwara State"
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                />
                {detectedLgaNote && (
                  <p className="text-[11px] font-mono text-emerald-800 font-bold mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{detectedLgaNote}</span>
                  </p>
                )}
              </div>

              {/* Interactive OpenStreetMap Location Section */}
              <AdminLocationPickerMap
                address={formAddress}
                lga={formLga}
                latitude={formLat}
                longitude={formLng}
                onChangeCoordinates={(lat, lng) => {
                  setFormLat(lat);
                  setFormLng(lng);
                }}
              />

              {/* LGA Field (Auto populated, with manual override available) & Specialization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                    Assigned LGA (Auto-detected) *
                  </label>
                  <select
                    value={formLga}
                    onChange={(e) => setFormLga(e.target.value)}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl bg-white focus:border-[#0D3829] focus:outline-none font-medium cursor-pointer"
                  >
                    {KWARA_LGAS.map(lga => (
                      <option key={lga} value={lga}>{lga} LGA</option>
                    ))}
                    <option value="LGA not specified">LGA not specified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                    Primary Specialization *
                  </label>
                  <select
                    value={formSpec}
                    onChange={(e) => setFormSpec(e.target.value)}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl bg-white focus:border-[#0D3829] focus:outline-none font-medium cursor-pointer"
                  >
                    {SPECIALIZATIONS.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Profile Photo URL */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                />
              </div>

              {/* Bio Summary */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Professional Bio / About Surveyor
                </label>
                <textarea
                  rows={3}
                  value={formAbout}
                  onChange={(e) => setFormAbout(e.target.value)}
                  placeholder="Licensed surveyor authorized for every type of survey work..."
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none resize-none"
                />
              </div>

              {/* Active Switch */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="form-is-active"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded cursor-pointer"
                />
                <label htmlFor="form-is-active" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Active Verified SURCON Status
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSurveyorFormOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0D3829] hover:bg-[#08281D] text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  Save Profile
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT EXECUTIVE                                   */}
      {/* ------------------------------------------------------------- */}
      {isExecFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {editingExec ? 'Edit Executive Profile' : 'Add Executive Officer'}
              </h3>
              <button
                onClick={() => setIsExecFormOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExecSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={execName}
                  onChange={(e) => setExecName(e.target.value)}
                  placeholder="Surv. Funsho-Salawu Ayodeji"
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Position / Office *
                </label>
                <input
                  type="text"
                  required
                  value={execPosition}
                  onChange={(e) => setExecPosition(e.target.value)}
                  placeholder="Chairman, Vice Chairman, or Secretary"
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Display Order (1 = Chairman, 2 = Vice Chairman, 3 = Secretary, 4+ = Other Executives) *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={execOrder}
                  onChange={(e) => setExecOrder(Number(e.target.value))}
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500">
                    Profile Photo
                  </label>
                  <button
                    type="button"
                    onClick={() => execPhotoInputRef.current?.click()}
                    className="text-xs text-[#0D3829] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                  </button>
                  <input
                    ref={execPhotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleExecPhotoUpload}
                    className="hidden"
                  />
                </div>
                
                <div className="flex gap-2 items-center">
                  {execImage && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img src={execImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={execImage}
                    onChange={(e) => setExecImage(e.target.value)}
                    placeholder="https://... or click Upload Image File above"
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Short Bio / Description
                </label>
                <textarea
                  rows={3}
                  value={execBio}
                  onChange={(e) => setExecBio(e.target.value)}
                  placeholder="Leading APPSN Kwara State Branch to maintain professional surveying excellence..."
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="exec-active-checkbox"
                  checked={execIsActive}
                  onChange={(e) => setExecIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#0D3829] rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="exec-active-checkbox" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Active Status (Officer is active and visible on the website)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExecFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0D3829] hover:bg-[#08281D] text-white font-bold py-2 px-5 rounded-xl text-xs"
                >
                  Save Executive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT AIM OBJECTIVE                               */}
      {/* ------------------------------------------------------------- */}
      {isAimFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {editingAim ? `Edit Aim & Objective #${editingAim.display_order}` : 'Add Aim & Objective'}
              </h3>
              <button
                onClick={() => setIsAimFormOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAimSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={aimTitle}
                    onChange={(e) => setAimTitle(e.target.value)}
                    placeholder="e.g. Mandatory SURCON Registration"
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
                    value={aimOrder}
                    onChange={(e) => setAimOrder(Number(e.target.value))}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={aimDesc}
                  onChange={(e) => setAimDesc(e.target.value)}
                  placeholder="Detail the constitutional purpose and public benefit of this objective..."
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAimFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0D3829] hover:bg-[#08281D] text-white font-bold py-2 px-5 rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  {editingAim ? 'Save Changes' : 'Add Aim & Objective'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: REPLY POPUP                                            */}
      {/* ------------------------------------------------------------- */}
      {replyingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900">
                Reply to {replyingMessage.name}
              </h4>
              <button
                onClick={() => setReplyingMessage(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isReplySent ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="text-sm font-bold text-slate-800">Response Dispatched!</div>
              </div>
            ) : (
              <form onSubmit={handleReplySubmit} className="space-y-4">
                <div className="text-xs text-slate-500">
                  Responding to inquiry: <em>"{replyingMessage.subject}"</em>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Reply Text
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Dear Citizen, thank you for reaching out to APPSN Kwara..."
                    className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D3829] resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReplyingMessage(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0D3829] hover:bg-[#08281D] text-white font-bold py-1.5 px-4 rounded-lg text-xs"
                  >
                    Send Response
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD ADMIN PERSONNEL                                    */}
      {/* ------------------------------------------------------------- */}
      {isAdminFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Register Branch Officer
              </h4>
              <button
                onClick={() => setIsAdminFormOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={newAdminUser}
                  onChange={(e) => setNewAdminUser(e.target.value)}
                  placeholder="e.g. adebayo_surveyor"
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D3829]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="adebayo@appsnkwara.com"
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D3829]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Role
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as any)}
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Branch Admin">Branch Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdminFormOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0D3829] hover:bg-[#08281D] text-white font-bold py-2 px-4 rounded-xl text-xs"
                >
                  Save Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
