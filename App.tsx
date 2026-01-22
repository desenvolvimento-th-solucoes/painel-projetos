//teste 
import React, { useState, useEffect, useMemo } from 'react';
import { User, Project, Role, ProjectStatus, VoteRecord, UserGroup, Institution, InstitutionStatus } from './types';
import { StorageService } from './storage';
import StatCard from './components/StatCard';
import PieChartSection from './components/PieChartSection';
import EditUserModal from './components/EditUserModal';
import ProjectDetailModal from './components/ProjectDetailModal';
import VotesTab from './components/VotesTab';
import GroupsTab from './components/GroupsTab';
import InstitutionsTab from './components/InstitutionsTab';

const THLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = { sm: 'w-10 h-10', md: 'w-16 h-16', lg: 'w-32 h-32' };
  return (
    <div className={`${dimensions[size]} relative flex items-center justify-center`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
        <path d="M40 20H140C162.091 20 180 37.9086 180 60V140C180 162.091 162.091 180 140 180H60C37.9086 180 20 162.091 20 140V40C20 28.9543 28.9543 20 40 20Z" fill="#0085FF" />
        <path d="M40 20H140C162.091 20 180 37.9086 180 60V140C180 162.091 162.091 180 140 180H60C37.9086 180 20 162.091 20 140V40C20 28.9543 28.9543 20 40 20Z" stroke="white" strokeWidth="12" />
        <path d="M45 55H105V85H88V150H58V85H45V55Z" fill="white" />
        <path d="M100 85H125V110H150V55H175V150H150V130H125V150H100V85Z" fill="white" />
      </svg>
    </div>
  );
};

const FilterBar: React.FC<{ 
  placeholder: string; 
  value: string; 
  onChange: (val: string) => void;
  children?: React.ReactNode;
}> = ({ placeholder, value, onChange, children }) => (
  <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
    <div className="relative flex-1 group">
      <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors"></i>
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-brand-500 outline-none font-bold text-sm dark:text-white transition-all"
      />
    </div>
    {children}
  </div>
);

const App: React.FC = () => {
  const [session, setSession] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('th_theme') === 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allGroups, setAllGroups] = useState<UserGroup[]>([]);
  const [allInstitutions, setAllInstitutions] = useState<Institution[]>([]);
  const [voteHistory, setVoteHistory] = useState<VoteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'admin' | 'projects' | 'votes' | 'institutions' | 'groups'>('dashboard');
  
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

  const [searchDashboard, setSearchDashboard] = useState('');
  const [searchProjects, setSearchProjects] = useState('');
  const [filterProjectStatus, setFilterProjectStatus] = useState('');
  const [filterProjectInst, setFilterProjectInst] = useState('');
  const [searchUsers, setSearchUsers] = useState('');
  const [filterUserInst, setFilterUserInst] = useState('');
  const [searchGroups, setSearchGroups] = useState('');
  const [searchInstitutions, setSearchInstitutions] = useState('');
  const [filterInstitutionStatus, setFilterInstitutionStatus] = useState('');

  useEffect(() => {
    const savedSession = StorageService.getSession();
    if (savedSession) setSession(savedSession);
  }, []);

  useEffect(() => {
    if (session) refreshData();
  }, [session]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('th_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
        const [users, projects, groups, institutions, votes] = await Promise.all([
            StorageService.getUsers(),
            StorageService.getProjects(session),
            StorageService.getGroups(),
            StorageService.getInstitutions(),
            StorageService.getVoteHistory()
        ]);
        setAllUsers(users);
        setAllProjects(projects);
        setAllGroups(groups);
        setAllInstitutions(institutions);
        setVoteHistory(votes);
    } catch (e) {
        console.error("Erro ao sincronizar dados:", e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const user = await StorageService.login(email, password);
    if (user) {
      StorageService.setSession(user);
      setSession(user);
      setLoginError('');
    } else {
      setLoginError('Credenciais inválidas.');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    StorageService.setSession(null);
    setSession(null);
    setActiveTab('dashboard');
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`Deseja realmente remover o colaborador ${name}?`)) {
      await StorageService.deleteUser(id);
      await refreshData();
    }
  };

  const handleCreateProject = () => {
    if (!session || session.role !== Role.ADMIN) return;
    const newProjectSkeleton: Project = {
      id: `p-${Date.now()}`,
      userId: session.id,
      institution: session.institution,
      name: '',
      status: ProjectStatus.PLANNED,
      progress: 0,
      votes: { up: 0, down: 0, userVotes: {} },
      description: '',
      responsibleName: session.name
    };
    setSelectedProjectForDetail(newProjectSkeleton);
    setIsProjectDetailOpen(true);
  };

  const handleVoteProject = async (projectId: string, type: 'up' | 'down') => {
    if (!session) return;
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    const record: VoteRecord = {
      id: `v-${Date.now()}`,
      userId: session.id,
      userName: session.name,
      userAvatar: session.avatar,
      itemId: projectId,
      itemName: project.name,
      itemType: 'project',
      voteType: type,
      institution: project.institution, 
      timestamp: new Date().toISOString()
    };

    await StorageService.addVoteToHistory(record);
    await refreshData();
    
    // Atualizar o projeto no modal
    const updatedProjects = await StorageService.getProjects(session);
    const upProject = updatedProjects.find(p => p.id === projectId);
    if (upProject) setSelectedProjectForDetail(upProject);
  };

  const activeInstitutionNames = useMemo(() => {
    const isAdmin = session?.role === Role.ADMIN;
    let names = allInstitutions
      .filter(i => i.status === InstitutionStatus.ACTIVE)
      .map(i => i.name);
    
    if (!isAdmin) {
      names = names.filter(n => n !== 'Matriz Central');
    }

    return names.sort((a, b) => {
        if (a === 'Matriz Central') return -1;
        if (b === 'Matriz Central') return 1;
        return a.localeCompare(b);
    });
  }, [allInstitutions, session]);

  const filteredProjects = useMemo(() => {
    let projects = allProjects;
    if (searchProjects) projects = projects.filter(p => p.name.toLowerCase().includes(searchProjects.toLowerCase()));
    if (filterProjectStatus) projects = projects.filter(p => p.status === filterProjectStatus);
    if (filterProjectInst) projects = projects.filter(p => p.institution === filterProjectInst);
    return projects;
  }, [allProjects, searchProjects, filterProjectStatus, filterProjectInst]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchUsers.toLowerCase()) || 
                          u.jobTitle.toLowerCase().includes(searchUsers.toLowerCase());
      const matchInst = !filterUserInst || u.institution === filterUserInst;
      return matchSearch && matchInst;
    });
  }, [allUsers, searchUsers, filterUserInst]);

  const filteredGroups = useMemo(() => {
    return allGroups.filter(g => 
      g.name.toLowerCase().includes(searchGroups.toLowerCase())
    );
  }, [allGroups, searchGroups]);

  const filteredInstitutions = useMemo(() => {
    return allInstitutions.filter(i => {
      const matchSearch = i.name.toLowerCase().includes(searchInstitutions.toLowerCase());
      const matchStatus = !filterInstitutionStatus || i.status === filterInstitutionStatus;
      return matchSearch && matchStatus;
    });
  }, [allInstitutions, searchInstitutions, filterInstitutionStatus]);

  const dashboardProjects = useMemo(() => {
    return searchDashboard 
      ? allProjects.filter(p => p.institution === searchDashboard) 
      : allProjects;
  }, [allProjects, searchDashboard]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-sky-100 dark:border-slate-800 animate-fade-in text-center">
          <div className="flex flex-col items-center mb-8">
            <THLogo size="lg" />
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mt-6 tracking-tighter">soluções</h2>
            <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.4em] mt-2">Gestão Estratégica</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-brand-500 outline-none font-bold dark:text-white" placeholder="E-mail"/>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-brand-500 outline-none font-bold dark:text-white" placeholder="Senha"/>
            {loginError && <p className="text-rose-500 text-xs font-bold text-center">{loginError}</p>}
            <button disabled={isLoading} type="submit" className="w-full py-5 rounded-2xl bg-brand-500 text-white font-black uppercase shadow-xl hover:bg-brand-600 transition-all flex items-center justify-center gap-2">
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Acessar Painel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950 transition-colors duration-500 relative">
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-full sm:w-80 z-[60] glass-sidebar flex flex-col transition-transform duration-500 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-4">
              <THLogo size="sm" />
              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white leading-none">TH</h2>
                <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest">soluções</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden w-10 h-10 rounded-xl bg-slate-50 text-slate-400"><i className="fas fa-times"></i></button>
          </div>
          <nav className="space-y-2">
            {[{ id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' }, { id: 'projects', icon: 'fa-folder-tree', label: 'Portfólio' }, { id: 'votes', icon: 'fa-fingerprint', label: 'Decisões' }].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeTab === tab.id ? 'sidebar-active font-black shadow-lg shadow-brand-500/10' : 'text-slate-500 hover:text-brand-500'}`}>
                <i className={`fas ${tab.icon} text-lg`}></i><span className="text-sm font-bold uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
            {session?.role === Role.ADMIN && (
              <>
                <div className="pt-10 pb-4 px-6 text-[11px] font-black text-slate-300 uppercase tracking-widest">Corporativo</div>
                {[{ id: 'admin', icon: 'fa-user-shield', label: 'Usuários' }, { id: 'groups', icon: 'fa-users-gear', label: 'Grupos' }, { id: 'institutions', icon: 'fa-building', label: 'Unidades' }].map(tab => (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeTab === tab.id ? 'sidebar-active font-black' : 'text-slate-500 hover:text-brand-500'}`}>
                    <i className={`fas ${tab.icon} text-lg`}></i><span className="text-sm font-bold uppercase tracking-wider">{tab.label}</span>
                  </button>
                ))}
              </>
            )}
          </nav>
        </div>
        <div className="mt-auto p-8 border-t dark:border-slate-800">
          <div className="bg-brand-50 dark:bg-slate-900 rounded-3xl p-5 flex items-center space-x-4 mb-6">
            <img src={session?.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" alt=""/>
            <div><p className="text-sm font-black dark:text-white">{session?.name}</p><p className="text-[10px] text-brand-500 font-black uppercase tracking-widest">{session?.role}</p></div>
          </div>
          <button onClick={handleLogout} className="w-full py-4 text-slate-400 hover:text-rose-600 transition-all font-black uppercase text-xs tracking-widest">Desconectar</button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen bg-slate-50/30 dark:bg-slate-950/90 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-500"><i className="fas fa-bars"></i></button>
            <div>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">Gestão Estratégica</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Painel TH Soluções {isLoading && <i className="fas fa-sync fa-spin ml-2 text-brand-500"></i>}</p>
            </div>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-slate-500 border border-slate-100 dark:border-slate-800 transition-all"><i className={`fas ${isDarkMode ? 'fa-sun text-amber-500' : 'fa-moon text-brand-500'}`}></i></button>
        </header>

        {activeTab === 'dashboard' ? (
          <div className="space-y-10">
            <FilterBar placeholder="Filtrar visão por unidade..." value="" onChange={() => {}}>
              <select 
                value={searchDashboard} 
                onChange={(e) => setSearchDashboard(e.target.value)}
                className="px-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold text-sm dark:text-white focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Todas as Unidades</option>
                {activeInstitutionNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </FilterBar>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Projetos Ativos" value={dashboardProjects.length} icon="fa-folder" color="bg-brand-500" />
              <StatCard title="Regionais" value={allInstitutions.filter(i => i.status === InstitutionStatus.ACTIVE).length} icon="fa-building" color="bg-emerald-500" />
              <StatCard title="Especialistas" value={allUsers.length} icon="fa-users" color="bg-indigo-500" />
              <StatCard title="Votos Coletados" value={voteHistory.length} icon="fa-fingerprint" color="bg-slate-400" />
            </section>
            <PieChartSection projects={dashboardProjects} />
          </div>
        ) : activeTab === 'admin' ? (
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black dark:text-white tracking-tighter">Especialistas</h3>
              <button onClick={() => { setSelectedUserForEdit(null); setIsUserModalOpen(true); }} className="px-6 py-4 bg-brand-500 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-brand-500/20 hover:scale-105 transition-all">Novo Colaborador</button>
            </div>
            <FilterBar placeholder="Buscar por nome ou cargo..." value={searchUsers} onChange={setSearchUsers}>
              <select 
                value={filterUserInst} 
                onChange={(e) => setFilterUserInst(e.target.value)}
                className="px-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold text-sm dark:text-white"
              >
                <option value="">Todas Unidades</option>
                {activeInstitutionNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </FilterBar>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <div key={user.id} className="dashboard-card p-6 flex items-center justify-between group hover:border-brand-500 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar} className="w-12 h-12 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm" alt=""/>
                    <div>
                        <p className="font-black text-sm dark:text-white truncate max-w-[150px]">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[150px]">{user.jobTitle} • {user.institution}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedUserForEdit(user); setIsUserModalOpen(true); }} className="text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 p-2.5 rounded-xl transition-all" title="Editar"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDeleteUser(user.id, user.name)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2.5 rounded-xl transition-all" title="Excluir"><i className="fas fa-trash-alt"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'groups' ? (
          <div className="space-y-10">
            <GroupsTab 
              groups={filteredGroups} 
              users={allUsers} 
              onSaveGroup={async (g) => { await StorageService.saveGroup(g); await refreshData(); }} 
              onDeleteGroup={async (id) => { await StorageService.deleteGroup(id); await refreshData(); }} 
              search={searchGroups}
              onSearchChange={setSearchGroups}
            />
          </div>
        ) : activeTab === 'institutions' ? (
          <div className="space-y-10">
            <InstitutionsTab 
              institutions={filteredInstitutions} 
              onSave={async (i) => { await StorageService.saveInstitution(i); await refreshData(); }} 
              onDelete={async (id) => { await StorageService.deleteInstitution(id); await refreshData(); }} 
              onToggleStatus={async (id) => { 
                const inst = allInstitutions.find(x => x.id === id);
                if (inst) {
                  await StorageService.saveInstitution({...inst, status: inst.status === InstitutionStatus.ACTIVE ? InstitutionStatus.INACTIVE : InstitutionStatus.ACTIVE});
                  await refreshData();
                }
              }} 
              search={searchInstitutions}
              onSearchChange={setSearchInstitutions}
              statusFilter={filterInstitutionStatus}
              onStatusFilterChange={setFilterInstitutionStatus}
            />
          </div>
        ) : activeTab === 'projects' ? (
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black dark:text-white tracking-tighter">Portfólio Estratégico</h3>
              {session.role === Role.ADMIN && (
                <button onClick={handleCreateProject} className="px-6 py-4 bg-brand-500 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-brand-500/20 hover:scale-105 transition-all">Novo Projeto</button>
              )}
            </div>
            <FilterBar placeholder="Buscar projeto pelo nome..." value={searchProjects} onChange={setSearchProjects}>
              <select 
                value={filterProjectStatus} 
                onChange={(e) => setFilterProjectStatus(e.target.value)}
                className="px-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold text-sm dark:text-white"
              >
                <option value="">Todos Status</option>
                {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select 
                value={filterProjectInst} 
                onChange={(e) => setFilterProjectInst(e.target.value)}
                className="px-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold text-sm dark:text-white"
              >
                <option value="">Todas Unidades</option>
                {activeInstitutionNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </FilterBar>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredProjects.map(p => (
                <div key={p.id} className="dashboard-card p-8 group hover:border-brand-500 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between mb-4"><h4 className="font-black dark:text-white group-hover:text-brand-500 transition-colors truncate">{p.name}</h4><span className="text-[9px] font-black uppercase text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-lg">{p.status}</span></div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-4 tracking-widest">{p.institution}</p>
                    <div className="flex justify-between items-center mb-2"><span className="text-[10px] font-black text-slate-400">PROGRESSO</span><span className="text-xs font-black text-brand-500">{p.progress}%</span></div>
                    <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full mb-8"><div className="bg-brand-500 h-full rounded-full shadow-lg shadow-brand-500/30 transition-all duration-1000" style={{width: `${p.progress}%`}}></div></div>
                  </div>
                  <button onClick={() => { setSelectedProjectForDetail(p); setIsProjectDetailOpen(true); }} className="w-full py-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-brand-500 hover:text-white transition-all">Acessar Detalhes</button>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'votes' ? (
          <VotesTab history={voteHistory} currentUser={session} institutions={activeInstitutionNames} />
        ) : null}
      </main>

      <EditUserModal user={selectedUserForEdit} isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={async (u) => { await StorageService.saveUser(u); await refreshData(); }} institutions={activeInstitutionNames} />
      <ProjectDetailModal 
        project={selectedProjectForDetail} 
        users={allUsers} 
        isOpen={isProjectDetailOpen} 
        onClose={() => setIsProjectDetailOpen(false)} 
        onSave={async (p) => { 
          await StorageService.saveProject(p);
          await refreshData(); 
        }} 
        onDelete={async (id) => { if(window.confirm("Deseja excluir permanentemente este projeto?")){ await StorageService.deleteProject(id); await refreshData(); setIsProjectDetailOpen(false); }}} 
        onVote={handleVoteProject}
        institutions={activeInstitutionNames} 
        isAdmin={session.role === Role.ADMIN} 
        currentUserId={session.id}
      />
    </div>
  );
};

export default App;
