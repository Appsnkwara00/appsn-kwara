import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Clock, Send, CheckCircle2, 
  ShieldCheck, ExternalLink
} from 'lucide-react';
import SurveyorMap from './SurveyorMap';
import { SECRETARIAT_COORDINATES } from '../lib/locationCoordinates';

interface ContactSectionProps {
  onSendMessage: (name: string, email: string, phone: string, subject: string, message: string) => void;
}

export default function ContactSection({ onSendMessage }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<{
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setIsSending(true);

    const submissionData = {
      name,
      email,
      phone,
      subject,
      message,
    };

    setLastSubmitted(submissionData);

    // 1. Send directly to APPSN email: appsnkwara@gmail.com
    try {
      await fetch('https://formsubmit.co/ajax/appsnkwara@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone || 'Not provided',
          _subject: `[APPSN Kwara Secretariat Inquiry] ${subject} - ${name}`,
          message,
          _replyto: email,
          _template: 'table',
          _captcha: 'false'
        })
      });
    } catch (err) {
      console.warn('Direct email dispatch notification:', err);
    }

    // 2. Also register in local portal inbox
    onSendMessage(name, email, phone, subject, message);

    setIsSending(false);
    setIsSuccess(true);
  };

  const getMailtoLink = () => {
    if (!lastSubmitted) {
      return 'mailto:appsnkwara@gmail.com';
    }
    const body = `Name: ${lastSubmitted.name}
Email: ${lastSubmitted.email}
Phone: ${lastSubmitted.phone || 'Not provided'}
Subject: ${lastSubmitted.subject}

Message:
${lastSubmitted.message}`;
    return `mailto:appsnkwara@gmail.com?subject=${encodeURIComponent(`[APPSN Kwara Inquiry] ${lastSubmitted.subject}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bg-[#FAF9F5] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/70" id="contact-appsn-section">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#0D3829] font-mono block">
            — CONTACT SECRETARIAT
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#0B251D] tracking-tight leading-tight">
            Connect with APPSN Kwara
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
            Have questions regarding land boundary demarcation, verifying surveyor registration, or lodging an inquiry? Reach out to the state secretariat.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Secretariat Information (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs space-y-6">
              <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
                Branch Secretariat Liaison
              </h3>

              <div className="space-y-5">
                {/* Office Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-[#EBF4F0] text-[#0D3829] rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      Physical Address
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5 leading-relaxed">
                      Along Ikoyi Avenue, Off New Yidi Rd, Ilorin, Kwara.
                    </p>
                  </div>
                </div>

                {/* Hotlines */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-[#EBF4F0] text-[#0D3829] rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      Secretariat Line
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 font-mono leading-relaxed">
                      <a href="tel:+2349137550602" className="hover:text-[#0D3829] transition-colors">
                        +2349137550602
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-[#EBF4F0] text-[#0D3829] rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      Official Email
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[#0D3829] mt-0.5 font-mono">
                      <a href="mailto:appsnkwara@gmail.com" className="hover:underline">
                        appsnkwara@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Work Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-[#EBF4F0] text-[#0D3829] rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      Working Hours
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-slate-700 mt-0.5 leading-relaxed">
                      Monday – Friday: 9:00 AM – 4:30 PM <br />
                      <span className="text-[11px] text-slate-400">Closed weekends and statutory public holidays</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Practice Notice */}
              <div className="bg-[#FAF9F5] border border-emerald-950/10 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  <strong className="text-slate-900 block font-bold mb-0.5">Public Caution</strong>
                  Never pay for a survey plan without verifying the surveyor's name in this directory. If in doubt, contact our secretariat hotline.
                </p>
              </div>
            </div>

            {/* Secretariat Location Interactive Map */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4" id="secretariat-location-map">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    Secretariat Location Map
                  </span>
                  <h3 className="text-base font-serif font-bold text-slate-900 mt-0.5">
                    APPSN Kwara State Secretariat
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-[#0D3829] px-2.5 py-1 rounded-full border border-emerald-200/70">
                  Ilorin, Kwara
                </span>
              </div>

              <SurveyorMap
                key="contact-secretariat-osm-map"
                lat={SECRETARIAT_COORDINATES.latitude}
                lng={SECRETARIAT_COORDINATES.longitude}
                latitude={SECRETARIAT_COORDINATES.latitude}
                longitude={SECRETARIAT_COORDINATES.longitude}
                surveyorName={SECRETARIAT_COORDINATES.name}
                officeAddress={SECRETARIAT_COORDINATES.address}
                lga="Ilorin East"
                companyName="Association of Private Practicing Surveyors of Nigeria"
                height="230px"
                showDirectionsButton={true}
              />
            </div>
          </div>

          {/* Right Column: Contact Messaging Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0D3829]" />
              Send Message to Branch Secretariat
            </h3>

            {isSuccess ? (
              <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[320px] space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                <h4 className="text-lg font-bold">Message Dispatched to Secretariat!</h4>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md leading-relaxed font-medium">
                  Your inquiry has been sent directly to the official APPSN Kwara inbox at <strong className="font-mono underline">appsnkwara@gmail.com</strong>. The branch secretariat will review your message and follow up promptly.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={getMailtoLink()}
                    className="inline-flex items-center gap-2 bg-[#0D3829] hover:bg-[#08281D] text-white font-bold py-2.5 px-5 rounded-full text-xs shadow-xs cursor-pointer transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Mail App (appsnkwara@gmail.com)</span>
                  </a>
                  <button
                    id="contact-another-btn"
                    onClick={() => {
                      setIsSuccess(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2.5 px-5 rounded-full text-xs shadow-xs cursor-pointer transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alh. Ibrahim Gambari"
                      className="w-full text-xs font-medium p-3 bg-[#FAF9F5] border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D3829] focus:bg-white text-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="w-full text-xs font-medium p-3 bg-[#FAF9F5] border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D3829] focus:bg-white text-slate-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full text-xs font-medium p-3 bg-[#FAF9F5] border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D3829] focus:bg-white text-slate-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1">
                    Inquiry Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Boundary Verification / Practice Inquiry / Land Demarcation"
                    className="w-full text-xs font-medium p-3 bg-[#FAF9F5] border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D3829] focus:bg-white text-slate-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1">
                    Detailed Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, request, or land boundary context..."
                    className="w-full text-xs font-medium p-3 bg-[#FAF9F5] border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D3829] focus:bg-white text-slate-900 transition-colors resize-none"
                  />
                </div>

                <button
                  id="submit-contact-btn"
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#0D3829] hover:bg-[#08281D] active:scale-99 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Message to Secretariat</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
