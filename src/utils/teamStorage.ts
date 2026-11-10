import { TeamConfigResponse, TeamPillar } from '../types/team';

const TEAMS_STORAGE_KEY = 'nhealth_teams_config';

const INITIAL_TEAM_CONFIG: TeamConfigResponse = {
  metrics: {
    cliniciansCount: '250+',
    engineersCount: '40+',
    citiesActive: '18+',
  },
  lastUpdated: new Date().toISOString(),
  pillars: [
    {
      id: 'clinical',
      key: 'clinical',
      name: 'Clinical Ops',
      fullName: 'Clinical Operations & Medical Quality Governance',
      tagline: 'NABH-Standard Care Protocols & Patient Safety',
      iconName: 'Stethoscope',
      accentColor: 'from-[#008080] to-emerald-600',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      stats: [
        { label: 'Verified Specialists', value: '250+' },
        { label: 'Protocol Adherence', value: '99.8%' },
        { label: 'Emergency Triage Benchmark', value: '< 15 mins' },
      ],
      description:
        'Our Clinical Operations command team bridges bedside medicine, hospital emergency wards, tele-triage consultations, and home-care patient interventions with uncompromising safety benchmarks and clinical governance.',
      coreResponsibilities: [
        'Rigorous doctor, nurse, and allied medical personnel credentialing & background verification',
        'NABH-aligned clinical standard operating procedures (SOPs) for acute and chronic home care',
        '24/7 tele-triage escalation matrix and hospital tertiary care transfer protocols',
        'Continuous clinical mortality and morbidity audits, feedback reviews, and pharmacovigilance',
      ],
      disciplines: [
        'Emergency Medicine Specialists',
        'Critical Care Physicians & MD Internists',
        'Certified Home ICU Nursing Leads',
        'Clinical Quality & NABH Auditors',
      ],
    },
    {
      id: 'tech',
      key: 'tech',
      name: 'Tech & Product',
      fullName: 'Technology, AI & Digital Health Products',
      tagline: 'High-Availability Architectures & Contactless AI Diagnostics',
      iconName: 'Code2',
      accentColor: 'from-[#002b49] to-cyan-700',
      badgeColor: 'bg-blue-50 text-[#002b49] border-blue-200',
      stats: [
        { label: 'Platform Availability', value: '99.99%' },
        { label: 'API Response Latency', value: '< 50 ms' },
        { label: 'Data Encryption Standard', value: 'AES-256' },
      ],
      description:
        'The Tech & Product division engineers the backbone of Nhealth: high-performance teleconsultation pipelines, VitalLens AI contactless vitals screening, real-time GPS ambulance telemetry, and ABDM-compliant health record interoperability.',
      coreResponsibilities: [
        'VitalLens AI engine for contactless biometric extraction (Pulse, HRV, Respiration, Stress) via standard cameras',
        'ABDM (Ayushman Bharat Digital Mission) FHIR health record pipelines with strict data privacy',
        'Zero-trust microservices architecture with role-based access controls and end-to-end encryption',
        'Real-time dispatch coordination engine for ambulances, home nurses, and diagnostic phlebotomists',
      ],
      disciplines: [
        'Distributed Systems & Cloud Architects',
        'Computer Vision & Bio-Signal AI Engineers',
        'Full-Stack Frontend & Mobile Developers',
        'Cybersecurity & HIPAA/ABDM Compliance Officers',
      ],
    },
    {
      id: 'network',
      key: 'network',
      name: 'Network Expansion',
      fullName: 'Provider Alliances, Hospital & City Growth',
      tagline: 'Hyperlocal Provider Grid & Institutional Alliances',
      iconName: 'Network',
      accentColor: 'from-[#003e6b] to-[#008080]',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      stats: [
        { label: 'Provider Nodes', value: '500+' },
        { label: 'Operational Hubs', value: '18+ Cities' },
        { label: 'Home Delivery Radius', value: '15 Mins' },
      ],
      description:
        'The Network Expansion team builds the physical fabric of Nhealth by onboarding certified diagnostic labs, licensed retail pharmacies, premier hospital emergency networks, and corporate enterprise clients nationwide.',
      coreResponsibilities: [
        'Strategic alliances with tertiary and quaternary multi-specialty hospital chains for cashless beds & emergency admissions',
        'Hyperlocal integration with NABL-accredited diagnostic labs for 60-minute doorstep sample collection',
        'Last-mile fulfillment network for verified pharmacy delivery and home medical equipment supply',
        'Enterprise healthcare and occupational wellness deployments for corporate campuses and industrial hubs',
      ],
      disciplines: [
        'Hospital & Institutional Alliance Leads',
        'Diagnostic Laboratory Network Managers',
        'Hyperlocal Operations & Logistics Directors',
        'Enterprise Corporate Wellness Consultants',
      ],
    },
  ],
};

export async function fetchTeamData(): Promise<TeamConfigResponse> {
  // 1. Attempt dynamic fetch from backend API endpoint if configured
  const apiBase = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '';
  if (apiBase) {
    try {
      const response = await fetch(`${apiBase}/api/teams`, {
        headers: { 'Accept': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.pillars)) {
          saveStoredTeamData(data);
          return data;
        }
      }
    } catch {
      // Graceful fallback to persistent cache / structured state
    }
  }

  // 2. Fetch from local structured store
  return getStoredTeamData();
}

export function getStoredTeamData(): TeamConfigResponse {
  if (typeof window === 'undefined') return INITIAL_TEAM_CONFIG;
  try {
    const raw = localStorage.getItem(TEAMS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(INITIAL_TEAM_CONFIG));
      return INITIAL_TEAM_CONFIG;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TEAM_CONFIG;
  }
}

export function saveStoredTeamData(config: TeamConfigResponse): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to store team configuration:', err);
  }
}
