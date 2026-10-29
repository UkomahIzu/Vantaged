export type AdminRole = 
  | 'SUPER_ADMIN' 
  | 'COMPLIANCE_OFFICER' 
  | 'DISPUTES_ARBITRATOR' 
  | 'SUPPORT_SPECIALIST';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleTitle: string;
  securityLevel: string;
  department: string;
  lastLogin: string;
  avatar: string;
}

export interface SystemServiceHealth {
  name: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  uptime: string;
}

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  badgeCount?: number;
  badgeTone?: 'orange' | 'purple' | 'red' | 'green';
  icon: string;
}

