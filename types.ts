
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum ProjectStatus {
  PLANNED = 'Planejado',
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Concluído',
  ON_HOLD = 'Em Pausa'
}

export enum InstitutionStatus {
  ACTIVE = 'Ativa',
  INACTIVE = 'Desativa'
}

export interface Institution {
  id: string;
  name: string;
  status: InstitutionStatus;
}

export interface VoteRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  itemId: string;
  itemName: string;
  itemType: 'project';
  voteType: 'up' | 'down';
  institution: string; // Nova propriedade para filtro
  timestamp: string;
}

export interface VoteData {
  up: number;
  down: number;
  userVotes: Record<string, { type: 'up' | 'down', userName: string }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string;
  jobTitle: string;
  institution: string;
  accessibleInstitutions?: string[];
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  userIds: string[];
}

export interface Project {
  id: string;
  userId: string;
  userName?: string;
  institution: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  votes: VoteData;
  configName?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  responsibleName?: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: string;
  institution: string;
  votes: VoteData;
  startDate?: string;
  endDate?: string;
  responsibleName?: string;
}
