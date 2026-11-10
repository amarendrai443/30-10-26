export interface TeamPillarStat {
  label: string;
  value: string;
}

export interface TeamPillar {
  id: string;
  key: 'clinical' | 'tech' | 'network';
  name: string;
  fullName: string;
  tagline: string;
  iconName: 'Stethoscope' | 'Code2' | 'Network';
  accentColor: string;
  badgeColor: string;
  stats: TeamPillarStat[];
  description: string;
  coreResponsibilities: string[];
  disciplines: string[];
}

export interface TeamMetrics {
  cliniciansCount: string;
  engineersCount: string;
  citiesActive: string;
}

export interface TeamConfigResponse {
  pillars: TeamPillar[];
  metrics: TeamMetrics;
  lastUpdated: string;
}
