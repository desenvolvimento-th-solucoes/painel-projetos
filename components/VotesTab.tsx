
import React, { useState, useMemo } from 'react';
import { VoteRecord, User, Role } from '../types';

interface VotesTabProps {
  history: VoteRecord[];
  currentUser: User | null;
  institutions: string[];
}

const VotesTab: React.FC<VotesTabProps> = ({ history, currentUser, institutions }) => {
  const [searchUser, setSearchUser] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterType, setFilterType] = useState('');

  const isAdmin = currentUser?.role === Role.ADMIN;

  // Gerar lista de projetos únicos presentes no histórico
  const uniqueProjects = useMemo(() => Array.from(new Set(history.map(h => h.itemName))), [history]);

  const filteredHistory = useMemo(() => {
    return history.filter(record => {
      // Regra de Permissão: User só vê os próprios, Admin vê tudo
      const isOwner = currentUser && record.userId === currentUser.id;
      if (!isAdmin && !isOwner) return false;

      // Filtros Dinâmicos
      const matchUser = record.userName.toLowerCase().includes(searchUser.toLowerCase());
      const matchUnit = !filterUnit || record.institution === filterUnit;
      const matchProject = !filterProject || record.itemName === filterProject;
      const matchType = !filterType || record.voteType === filterType;

      return matchUser && matchUnit && matchProject && matchType;
    });
  }, [history, searchUser, filterUnit, filterProject, filterType, isAdmin, currentUser]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">Relatório de Decisões</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
            {isAdmin 
              ? 'Log de Auditoria e Votações Corporativas' 
              : 'Seu Histórico de Posicionamentos em Projetos'}
          </p>
        </div>
      </div>

      {/* Painel de Filtros Avançado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative group">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Buscar colaborador..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-brand-500 outline-none font-bold text-sm dark:text-white transition-all"
          />
        </div>

        <select 
          value={filterUnit} 
          onChange={(e) => setFilterUnit(e.target.value)}
          className="px-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold text-sm dark:text-white cursor-pointer hover:bg-slate-100 transition-all"
        >
          <option value="">Todas Unidades</option>
          {institutions.map(unit => <option key={unit} value={unit}>{unit}</option>)}
        </select>

        <select 
          value={filterProject} 
          onChange={(e) => setFilterProject(e.target.value)}
          className="px-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold text-sm dark:text-white cursor-pointer hover:bg-slate-100 transition-all"
        >
          <option value="">Todos Projetos</option>
          {uniqueProjects.map(proj => <option key={proj} value={proj}>{proj}</option>)}
        </select>

        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="px-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold text-sm dark:text-white cursor-pointer hover:bg-slate-100 transition-all"
        >
          <option value="">Todos Votos</option>
          <option value="up">Favorável</option>
          <option value="down">Contrário</option>
        </select>
      </div>

      <div className="dashboard-card overflow-hidden dark:bg-slate-900 dark:border-slate-800 border-none shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50/50 dark:bg-slate-950/50 border-b dark:border-slate-800">
              <tr className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-black tracking-[0.2em]">
                <th className="py-8 px-10">Colaborador</th>
                <th className="py-8">Iniciativa / Projeto</th>
                <th className="py-8">Unidade</th>
                <th className="py-8">Decisão</th>
                <th className="py-8 text-right px-10">Data e Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredHistory.map(record => (
                <tr key={record.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-all">
                  <td className="py-6 px-10">
                    <div className="flex items-center space-x-4">
                      <img src={record.userAvatar} className="w-10 h-10 rounded-xl shadow-md border-2 border-white dark:border-slate-800" alt="" />
                      <div>
                        <p className="text-sm font-black text-slate-950 dark:text-white">{record.userName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">ID: {record.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{record.itemName}</p>
                      <p className="text-[9px] font-black uppercase text-brand-500 tracking-widest mt-1">SISTEMA TH ESTRATÉGICO</p>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                      {record.institution}
                    </span>
                  </td>
                  <td className="py-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 ${
                      record.voteType === 'up' 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400'
                    }`}>
                      <i className={`fas ${record.voteType === 'up' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                      {record.voteType === 'up' ? 'Favorável' : 'Contrário'}
                    </div>
                  </td>
                  <td className="py-6 text-right px-10">
                    <span className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase">
                      {new Date(record.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <i className="fas fa-folder-open text-5xl mb-4"></i>
                      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Nenhuma decisão registrada com estes critérios</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VotesTab;
