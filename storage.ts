
import { User, Project, Role, ProjectStatus, VoteRecord, UserGroup, Institution, InstitutionStatus } from './types';

// Detecta automaticamente o IP/host do servidor
const getApiUrl = () => {
  // Se estiver em produção ou acessado via IP, usa o mesmo host do frontend
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:3001/api`;
  }
  // Caso contrário, usa localhost
  return 'http://localhost:3001/api';
};

const API_URL = getApiUrl();

const handleRequest = async (url: string, method: string, body?: any) => {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  };
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Erro na requisição ${method} ${url}`);
  return res.json();
};

export const StorageService = {
  init: () => {},

  // --- AUTH ---
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      return await handleRequest(`${API_URL}/login`, 'POST', { email, password });
    } catch (e) {
      console.error("Erro de login.");
      return null;
    }
  },

  // --- USUÁRIOS ---
  getUsers: async (): Promise<User[]> => {
    try { return await handleRequest(`${API_URL}/users`, 'GET'); } catch (e) { return []; }
  },

  saveUser: async (user: User) => {
    try {
      const current = await StorageService.getUsers();
      const exists = current.some(u => u.id === user.id);
      await handleRequest(`${API_URL}/users${exists ? `/${user.id}` : ''}`, exists ? 'PUT' : 'POST', user);
    } catch (e) { console.error("Erro ao salvar usuário:", e); }
  },

  deleteUser: async (id: string) => {
    try { await handleRequest(`${API_URL}/users/${id}`, 'DELETE'); } catch (e) { console.error("Erro ao excluir usuário:", e); }
  },

  // --- GRUPOS ---
  getGroups: async (): Promise<UserGroup[]> => {
    try { return await handleRequest(`${API_URL}/groups`, 'GET'); } catch (e) { return []; }
  },

  saveGroup: async (group: UserGroup) => {
    try {
      const current = await StorageService.getGroups();
      const exists = current.some(g => g.id === group.id);
      await handleRequest(`${API_URL}/groups${exists ? `/${group.id}` : ''}`, exists ? 'PUT' : 'POST', group);
    } catch (e) { console.error("Erro ao salvar grupo:", e); }
  },

  deleteGroup: async (id: string) => {
    try { await handleRequest(`${API_URL}/groups/${id}`, 'DELETE'); } catch (e) {}
  },

  // --- PROJETOS ---
  getProjects: async (user: User | null): Promise<Project[]> => {
    try {
      const insts = JSON.stringify(user?.accessibleInstitutions || []);
      return await handleRequest(`${API_URL}/projects?role=${user?.role}&institutions=${insts}`, 'GET');
    } catch (e) { return []; }
  },

  saveProject: async (project: Project) => {
    try {
      const current = await StorageService.getProjects(null);
      const exists = current.some(p => p.id === project.id);
      await handleRequest(`${API_URL}/projects${exists ? `/${project.id}` : ''}`, exists ? 'PUT' : 'POST', project);
    } catch (e) {}
  },

  updateProject: async (p: Project) => {
    return StorageService.saveProject(p);
  },

  deleteProject: async (id: string) => {
    try { await handleRequest(`${API_URL}/projects/${id}`, 'DELETE'); } catch (e) {}
  },

  // --- UNIDADES ---
  getInstitutions: async (): Promise<Institution[]> => {
    try { return await handleRequest(`${API_URL}/institutions`, 'GET'); } catch (e) { return []; }
  },

  saveInstitution: async (inst: Institution) => {
    try {
      const current = await StorageService.getInstitutions();
      const exists = current.some(i => i.id === inst.id);
      await handleRequest(`${API_URL}/institutions${exists ? `/${inst.id}` : ''}`, exists ? 'PUT' : 'POST', inst);
    } catch (e) {}
  },

  deleteInstitution: async (id: string) => {
    try { await handleRequest(`${API_URL}/institutions/${id}`, 'DELETE'); } catch (e) {}
  },

  // --- VOTOS ---
  getVoteHistory: async (): Promise<VoteRecord[]> => {
    try { return await handleRequest(`${API_URL}/votes`, 'GET'); } catch (e) { return []; }
  },

  addVoteToHistory: async (record: VoteRecord) => {
    try { await handleRequest(`${API_URL}/votes`, 'POST', record); } catch (e) { console.error("Falha ao registrar voto:", e); }
  },

  // --- SESSION ---
  setSession: (user: User | null) => {
    if (user) localStorage.setItem('th_solucoes_session', JSON.stringify(user));
    else localStorage.removeItem('th_solucoes_session');
  },

  getSession: (): User | null => {
    const session = localStorage.getItem('th_solucoes_session');
    return session ? JSON.parse(session) : null;
  }
};
