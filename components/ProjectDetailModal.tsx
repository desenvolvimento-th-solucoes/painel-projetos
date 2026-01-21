
import React, { useState, useEffect } from 'react';
import { Project, Role, ProjectStatus, User } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onVote?: (projectId: string, type: 'up' | 'down') => void;
  institutions: string[];
  isAdmin: boolean;
  currentUserId?: string;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ 
  project, 
  users, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  onVote,
  institutions, 
  isAdmin,
  currentUserId 
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [activeTab, setActiveTab] = useState<'info' | 'voters'>('info');

  useEffect(() => {
    if (project) {
      setFormData({ ...project });
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    const updatedProject = { 
      ...project, 
      ...formData,
      status: formData.progress === 100 ? ProjectStatus.COMPLETED : (Number(formData.progress) > 0 && formData.status === ProjectStatus.PLANNED ? ProjectStatus.IN_PROGRESS : formData.status || project.status)
    } as Project;
    
    onSave(updatedProject);
    onClose();
  };

  const getStatusBgColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PLANNED: return 'bg-slate-500';
      case ProjectStatus.IN_PROGRESS: return 'bg-sky-500';
      case ProjectStatus.COMPLETED: return 'bg-emerald-500';
      case ProjectStatus.ON_HOLD: return 'bg-amber-500';
      default: return 'bg-sky-500';
    }
  };

  const inputClass = "w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:border-sky-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClass = "block text-[9px] sm:text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1 sm:ml-2";

  const voteEntries = Object.entries(project.votes?.userVotes || {}) as [string, { type: 'up' | 'down', userName: string }][];
  const upVoters = voteEntries.filter(([_, v]) => v.type === 'up');
  const downVoters = voteEntries.filter(([_, v]) => v.type === 'down');
  
  const userVote = currentUserId ? project.votes?.userVotes[currentUserId]?.type : null;
  const hasVoted = !!userVote;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-400 border-2 border-slate-100 dark:border-slate-800 flex flex-col">
        
        <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40 flex-shrink-0">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl flex-shrink-0 ${getStatusBgColor(formData.status as ProjectStatus)}`}>
              <i className="fas fa-folder-open text-xl sm:text-2xl"></i>
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tighter truncate">Iniciativa Estratégica</h3>
              <p className="text-[9px] sm:text-xs text-sky-600 font-black uppercase tracking-[0.2em] mt-1 truncate">{formData.name || 'Nova Iniciativa'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center text-slate-400 flex-shrink-0">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="flex px-10 pt-4 gap-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20">
          <button 
            onClick={() => setActiveTab('info')}
            className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'info' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Informações
          </button>
          <button 
            onClick={() => setActiveTab('voters')}
            className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'voters' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Conselho ({upVoters.length + downVoters.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'info' ? (
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8 sm:space-y-10">
              {/* Voting Section */}
              <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Sua Decisão</h4>
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    disabled={hasVoted}
                    onClick={() => onVote && onVote(project.id, 'up')}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all active:scale-95 ${
                      userVote === 'up' 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                      : hasVoted 
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 opacity-50 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-emerald-500 hover:text-emerald-600'
                    }`}
                  >
                    <i className="fas fa-check-circle"></i>
                    <span className="text-xs font-black uppercase tracking-widest">{userVote === 'up' ? 'Votado' : 'A Favor'}</span>
                    <span className="text-sm font-black ml-2">{project.votes.up}</span>
                  </button>
                  <button 
                    type="button"
                    disabled={hasVoted}
                    onClick={() => onVote && onVote(project.id, 'down')}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all active:scale-95 ${
                      userVote === 'down' 
                      ? 'bg-rose-600 border-rose-600 text-white shadow-lg' 
                      : hasVoted 
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 opacity-50 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-rose-500 hover:text-rose-600'
                    }`}
                  >
                    <i className="fas fa-times-circle"></i>
                    <span className="text-xs font-black uppercase tracking-widest">{userVote === 'down' ? 'Votado' : 'Contra'}</span>
                    <span className="text-sm font-black ml-2">{project.votes.down}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <label className={labelClass}>Título do Projeto</label>
                    <input disabled={!isAdmin} required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} placeholder="Nome do projeto" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className={labelClass}>Início</label>
                      <input disabled={!isAdmin} type="date" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Término</label>
                      <input disabled={!isAdmin} type="date" value={formData.endDate || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(ProjectStatus).map((s) => (
                        <button
                          key={s}
                          type="button"
                          disabled={!isAdmin}
                          onClick={() => setFormData({...formData, status: s})}
                          className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                            formData.status === s 
                            ? `${getStatusBgColor(s)} text-white border-transparent shadow-lg` 
                            : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-sky-500'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <label className={labelClass}>Responsável</label>
                    <input disabled={!isAdmin} type="text" value={formData.responsibleName || ''} onChange={e => setFormData({...formData, responsibleName: e.target.value})} className={inputClass} placeholder="Nome do gestor" />
                  </div>

                  <div>
                    <label className={labelClass}>Unidade</label>
                    <select 
                      disabled={!isAdmin}
                      value={formData.institution}
                      onChange={(e) => setFormData({...formData, institution: e.target.value})}
                      className={inputClass}
                    >
                      {institutions.map(inst => (
                        <option key={inst} value={inst}>{inst}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3 px-1 sm:px-2">
                      <label className="text-[9px] sm:text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Execução (%)</label>
                      <span className="text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400">{formData.progress}%</span>
                    </div>
                    {isAdmin ? (
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        value={formData.progress || 0}
                        onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                        className="w-full appearance-none h-2 rounded-full bg-slate-100 dark:bg-slate-950 accent-sky-500 cursor-pointer"
                      />
                    ) : (
                      <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className={`h-full ${getStatusBgColor(formData.status as ProjectStatus)}`} style={{ width: `${formData.progress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Descrição</label>
                <textarea 
                  disabled={!isAdmin} 
                  rows={4}
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className={`${inputClass} resize-none min-h-[100px] sm:min-h-[120px]`} 
                  placeholder="Escopo do projeto..." 
                />
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col xs:flex-row gap-3 sm:gap-4">
                 <button type="button" onClick={onClose} className="flex-1 py-4 sm:py-5 rounded-xl sm:rounded-[1.8rem] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-slate-200 transition-all">Sair</button>
                 {isAdmin && (
                   <>
                     <button type="button" onClick={() => onDelete && onDelete(project.id)} className="flex-1 py-4 sm:py-5 rounded-xl sm:rounded-[1.8rem] bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-2 border-rose-100 dark:border-rose-900/50 font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-rose-600 hover:text-white transition-all">Remover</button>
                     <button type="submit" className="flex-[2] py-4 sm:py-5 rounded-xl sm:rounded-[1.8rem] bg-sky-500 text-white font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-2xl shadow-sky-500/30 hover:bg-sky-600 hover:-translate-y-1 transition-all active:scale-95">Salvar</button>
                   </>
                 )}
              </div>
            </form>
          ) : (
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-emerald-500/20 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg"><i className="fas fa-check"></i></div>
                    <div><h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">A Favor</h4><p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{upVoters.length} Membros</p></div>
                  </div>
                  <div className="space-y-2">
                    {upVoters.map(([uid, v]) => (
                      <div key={uid} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${v.userName}`} className="w-10 h-10 rounded-xl shadow-sm" alt="" />
                        <div><p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{v.userName}</p></div>
                      </div>
                    ))}
                    {upVoters.length === 0 && <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center py-10 italic">Nenhum voto positivo</p>}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-rose-500/20 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-lg"><i className="fas fa-times"></i></div>
                    <div><h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Objeções</h4><p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">{downVoters.length} Membros</p></div>
                  </div>
                  <div className="space-y-2">
                    {downVoters.map(([uid, v]) => (
                      <div key={uid} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${v.userName}`} className="w-10 h-10 rounded-xl shadow-sm" alt="" />
                        <div><p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{v.userName}</p></div>
                      </div>
                    ))}
                    {downVoters.length === 0 && <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center py-10 italic">Sem objeções</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
