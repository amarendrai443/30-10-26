/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Newspaper,
  Heart,
  TrendingUp,
  Plane,
  ShieldAlert,
  Users,
  Send,
  CheckCircle2,
  Download,
  Mail,
  Phone,
  ArrowRight,
  Lock,
  Building2,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export type QuickLinkType =
  | 'media-press'
  | 'social-responsibility'
  | 'investors-panel'
  | 'medical-tourism'
  | 'grievance-redressal'
  | 'team-logins';

interface FooterQuickLinksModalProps {
  isOpen: boolean;
  activeType: QuickLinkType | null;
  onClose: () => void;
  onNavigateToRoute: (route: string, urlPath?: string) => void;
}

export const FooterQuickLinksModal: React.FC<FooterQuickLinksModalProps> = ({
  isOpen,
  activeType,
  onClose,
  onNavigateToRoute,
}) => {
  if (!isOpen || !activeType) return null;

  // Grievance form state
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [grievanceForm, setGrievanceForm] = useState({
    name: '',
    phone: '',
    email: '',
    referenceId: '',
    category: 'Diagnostic Sample Delay',
    details: '',
  });

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGrievanceSubmitted(true);
    setTimeout(() => {
      // Auto close or reset
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            {activeType === 'media-press' && (
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <Newspaper className="w-6 h-6" />
              </div>
            )}
            {activeType === 'social-responsibility' && (
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Heart className="w-6 h-6" />
              </div>
            )}
            {activeType === 'investors-panel' && (
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            )}
            {activeType === 'medical-tourism' && (
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Plane className="w-6 h-6" />
              </div>
            )}
            {activeType === 'grievance-redressal' && (
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
            )}
            {activeType === 'team-logins' && (
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <Users className="w-6 h-6" />
              </div>
            )}

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {activeType === 'media-press' && 'Media & Press Bureau'}
                {activeType === 'social-responsibility' && 'Corporate Social Responsibility (CSR)'}
                {activeType === 'investors-panel' && 'Investors & Stakeholders Panel'}
                {activeType === 'medical-tourism' && 'International Medical Tourism & Concierge'}
                {activeType === 'grievance-redressal' && 'Official Grievance Redressal Cell'}
                {activeType === 'team-logins' && 'Internal Team & Staff Login Gateway'}
              </h3>
              <p className="text-xs text-slate-400">Nhealth Unified Healthcare Technologies</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Media / Press Content */}
        {activeType === 'media-press' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <p className="leading-relaxed">
              Welcome to the Nhealth Press Room. We pioneer decentralized healthcare at home, partnering with top diagnostic chains, tertiary hospitals, and certified physicians across India.
            </p>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <div className="font-semibold text-white flex items-center justify-between">
                <span>Latest Press Release (October 2026)</span>
                <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">Oct 2026</span>
              </div>
              <p className="text-xs text-slate-400">
                &ldquo;Nhealth Expands 60-Minute Home Phlebotomy and Portable Digital X-Ray Fleet to Tier-1 and Tier-2 Cities, Surpassing 500,000 Verified Doorstep Consultations.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div className="text-slate-400 text-xs">Media Queries &amp; Interviews</div>
                <div className="font-semibold text-white mt-1">press@nhealth.in</div>
                <div className="text-[11px] text-teal-400 mt-0.5">Spokesperson Office: +91 9581582220</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="text-slate-400 text-xs">Brand Assets &amp; Media Kit</div>
                  <div className="font-semibold text-white mt-1">High-Res Logos, Photos &amp; B-Roll</div>
                </div>
                <a
                  href="/nhealth_logo.png"
                  download
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-teal-300 hover:text-teal-200"
                >
                  <Download className="w-3.5 h-3.5" /> Download Official Brand Kit (.zip)
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 2. Social Responsibility Content */}
        {activeType === 'social-responsibility' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <p className="leading-relaxed">
              At Nhealth, healthcare is a fundamental human right. Through the <strong className="text-emerald-400">Nhealth Care Foundation</strong>, we ensure quality diagnostics and preventative health screenings reach underserved communities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-emerald-500/20 text-center">
                <div className="text-2xl font-bold text-emerald-400">45,000+</div>
                <div className="text-xs text-slate-300 mt-1">Free Rural Screenings</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-emerald-500/20 text-center">
                <div className="text-2xl font-bold text-teal-400">100%</div>
                <div className="text-xs text-slate-300 mt-1">Subsidized Senior Palliative Care</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-emerald-500/20 text-center">
                <div className="text-2xl font-bold text-blue-400">20+</div>
                <div className="text-xs text-slate-300 mt-1">District Mobile Diagnostic Camps</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 space-y-1.5">
              <div className="font-semibold text-white">CSR Partnership Opportunities</div>
              <p className="text-xs text-slate-400">
                Are you an NGO or Corporate Enterprise looking to deploy your CSR budget for doorstep health vans or elderly screenings? Write to our CSR committee at{' '}
                <a href="mailto:csr@nhealth.in" className="text-teal-300 underline">csr@nhealth.in</a>.
              </p>
            </div>
          </div>
        )}

        {/* 3. Investors Panel Content */}
        {activeType === 'investors-panel' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <p className="leading-relaxed">
              Nhealth is building the definitive operating system for decentralized, technology-enabled home healthcare in high-growth metropolitan and tier-2 regions.
            </p>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Key Investment &amp; Growth Highlights</span>
                <span className="text-[11px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">FY 2026-27</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Gross Healthcare Volume (GHV)</span>
                  <span className="text-lg font-bold text-white">₹ 42+ Cr Run-Rate</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Unit Economics</span>
                  <span className="text-lg font-bold text-emerald-400">Contribution Positive</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Partner Clinical Network</span>
                  <span className="text-lg font-bold text-white">180+ Labs &amp; Hospitals</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Repeat Cohort Retention</span>
                  <span className="text-lg font-bold text-teal-400">74% at 6 Months</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-xs">Investor Relations &amp; Cap Table Inquiries</div>
                <div className="text-[11px] text-blue-300">investors@nhealth.in • Series A/B Briefings</div>
              </div>
              <a
                href="mailto:investors@nhealth.in"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
              >
                Request Pitch Deck
              </a>
            </div>
          </div>
        )}

        {/* 4. Medical Tourism Content */}
        {activeType === 'medical-tourism' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <p className="leading-relaxed">
              Comprehensive end-to-end concierge healthcare for international patients traveling to India for world-class surgical procedures, cardiac treatments, organ transplants, and post-operative home recovery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                <div className="font-bold text-white text-xs">Airport &amp; Transit Concierge</div>
                <p className="text-[11px] text-slate-400">Dedicated ALS GPS ambulance pickup directly from RGIA Hyderabad / Mumbai / Bangalore airports.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                <div className="font-bold text-white text-xs">Post-Op Recovery Apartments</div>
                <p className="text-[11px] text-slate-400">24/7 dedicated ICU-trained bedside nursing and daily specialist rounds in serviced accommodations.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                <div className="font-bold text-white text-xs">Telehealth Pre-Opinion</div>
                <p className="text-[11px] text-slate-400">Direct video consultation with top Indian super-specialists prior to international booking.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                <div className="font-bold text-white text-xs">Medical Visa Assistance</div>
                <p className="text-[11px] text-slate-400">Expedited hospital visa invitation letters with multi-lingual coordinator support.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-xs">International Desk Hotline</div>
                <div className="text-[11px] text-indigo-300">+91 9393934621 • medicaltourism@nhealth.in</div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToRoute('corporate-enquiries', '/corporate-enquiries');
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                Inquire Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 5. Grievance Redressal Content */}
        {activeType === 'grievance-redressal' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <p className="leading-relaxed">
              We uphold the highest clinical standards. If you have faced any delay, clinical dissatisfaction, sample handling issue, or billing query, our Nodal Grievance Officer guarantees response within 24 hours.
            </p>

            {grievanceSubmitted ? (
              <div className="p-5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Grievance Ticket Registered Successfully</h4>
                <p className="text-xs text-emerald-200">
                  Ticket Reference #{`GRV-${Date.now().toString().slice(-6)}`} has been dispatched to the Nodal Grievance Officer. An acknowledgment SMS has been sent to your contact number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleGrievanceSubmit} className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={grievanceForm.name}
                      onChange={(e) => setGrievanceForm({ ...grievanceForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={grievanceForm.phone}
                      onChange={(e) => setGrievanceForm({ ...grievanceForm, phone: e.target.value })}
                      placeholder="+91 98480 00000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Booking Ref ID (if any)</label>
                    <input
                      type="text"
                      value={grievanceForm.referenceId}
                      onChange={(e) => setGrievanceForm({ ...grievanceForm, referenceId: e.target.value })}
                      placeholder="e.g. NH-98214"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Grievance Category</label>
                    <select
                      value={grievanceForm.category}
                      onChange={(e) => setGrievanceForm({ ...grievanceForm, category: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="Diagnostic Sample Delay">Diagnostic Sample Delay</option>
                      <option value="Doctor Home Visit Scheduling">Doctor Home Visit Scheduling</option>
                      <option value="Pharmacy Delivery Issue">Pharmacy Delivery Issue</option>
                      <option value="Bedside Attendant Conduct">Bedside Attendant Conduct</option>
                      <option value="Billing / Refund Dispute">Billing / Refund Dispute</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1">Detailed Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={grievanceForm.details}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, details: e.target.value })}
                    placeholder="Describe what occurred so our compliance team can review GPS logs and clinical records..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-400">
                    Nodal Grievance Officer: <strong className="text-white">grievance@nhealth.in</strong>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Grievance
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 6. Team Logins Gateway Content */}
        {activeType === 'team-logins' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <p className="leading-relaxed">
              Secure single-sign-on access gateway for Nhealth internal workforce, HR managers, operational leads, and system administrators.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* HR Portal Gateway */}
              <div
                onClick={() => {
                  onClose();
                  onNavigateToRoute('hrthings', '/hrthings');
                }}
                className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-teal-500/30 hover:border-teal-500 transition-all cursor-pointer group space-y-2 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                    /hrthings
                  </span>
                </div>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-1 group-hover:text-teal-300 transition-colors">
                    HR &amp; People Operations Portal <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Employee rosters, leave approvals, doctor credentialing, and payroll splits.
                  </p>
                </div>
              </div>

              {/* Admin Command Center */}
              <div
                onClick={() => {
                  onClose();
                  onNavigateToRoute('command-center', '/command-center');
                }}
                className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500 transition-all cursor-pointer group space-y-2 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Admin
                  </span>
                </div>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                    Admin Command Center <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Sub-admin permissions, network partner verification, and emergency fleet dispatch.
                  </p>
                </div>
              </div>

              {/* Clinicians & Doctor Dashboard */}
              <div
                onClick={() => {
                  onClose();
                  onNavigateToRoute('dashboard', '/dashboard');
                }}
                className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    Clinical
                  </span>
                </div>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-1 group-hover:text-blue-300 transition-colors">
                    Doctor &amp; Partner Network Portal <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Live video consultation room, e-prescription generation, and home visit queue.
                  </p>
                </div>
              </div>

              {/* Staff Authentication Gateway */}
              <div
                onClick={() => {
                  onClose();
                  onNavigateToRoute('auth', '/auth');
                }}
                className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    SSO
                  </span>
                </div>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-1 group-hover:text-teal-300 transition-colors">
                    General Staff OTP &amp; SSO Login <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Phlebotomists, ambulance drivers, and field technicians secure login.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Nhealth Unified Healthcare Technologies Pvt Ltd</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
