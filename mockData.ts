
import { User, Project, ProjectStatus, Role, VoteData, Institution, InstitutionStatus } from './types';

export const INITIAL_INSTITUTIONS: Institution[] = [
  { id: 'i1', name: 'Matriz Central', status: InstitutionStatus.ACTIVE },
  { id: 'i2', name: 'Syrius de Campinas', status: InstitutionStatus.ACTIVE },
  { id: 'i3', name: 'Syrius de Mogi Guaçu', status: InstitutionStatus.ACTIVE },
  { id: 'i4', name: 'Syrius de Mogi Mirim', status: InstitutionStatus.ACTIVE },
  { id: 'i5', name: 'Syrius de Jacutinga', status: InstitutionStatus.ACTIVE },
  { id: 'i6', name: 'Syrius de Porto Ferreira', status: InstitutionStatus.ACTIVE },
  { id: 'i7', name: 'Syrius de Itapira', status: InstitutionStatus.ACTIVE }
];

export const INSTITUTIONS_LIST = INITIAL_INSTITUTIONS.map(i => i.name);

const emptyVotes = (): VoteData => ({ up: 0, down: 0, userVotes: {} });

export const INITIAL_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Diretoria Executiva', 
    email: 'admin@th.com', 
    password: 'admin', 
    role: Role.ADMIN, 
    jobTitle: 'Diretor Geral',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin_master',
    institution: 'Matriz Central',
    accessibleInstitutions: INITIAL_INSTITUTIONS.map(i => i.name)
  },
  { 
    id: 'u2', 
    name: 'Ricardo Almeida', 
    email: 'ricardo@th.com', 
    password: 'user123', 
    role: Role.USER, 
    jobTitle: 'Gerente Regional',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ricardo',
    institution: 'Syrius de Campinas',
    accessibleInstitutions: ['Syrius de Campinas', 'Syrius de Mogi Mirim']
  }
];

export const INITIAL_PROJECTS: Project[] = [
  { 
    id: 'p1', userId: 'u2', userName: 'Ricardo Almeida', institution: 'Syrius de Campinas', 
    name: 'Expansão Unidade Campinas', status: ProjectStatus.IN_PROGRESS, progress: 35, 
    votes: emptyVotes(),
    configName: 'Revitalização Física',
    startDate: '2024-02-15',
    endDate: '2024-11-30',
    description: 'Reforma completa da fachada e ampliação do showroom para clientes Syrius.',
    responsibleName: 'Ricardo Almeida'
  }
];
