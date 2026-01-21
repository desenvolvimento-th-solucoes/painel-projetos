
import React, { useState } from 'react';
import { User, UserGroup } from '../types';

interface GroupsTabProps {
  groups: UserGroup[];
  users: User[];
  onSaveGroup: (group: UserGroup) => void;
  onDeleteGroup: (id: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
}

const GroupsTab: React.FC<GroupsTabProps> = ({ groups, users, onSaveGroup, onDeleteGroup, search, onSearchChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Partial<UserGroup>>({});
  const [viewingGroup, setViewingGroup] = useState<UserGroup | null>(null);

  const handleCreate = () => {
    setEditingGroup({ id: `group-${Date.now()}`, name: '', description: '', userIds: [] });
    setIsModalOpen(true);
  };

  const handleEdit = (group: UserGroup) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleView = (group: UserGroup) => {
    setViewingGroup(group);
    setIsViewModalOpen(true);
  };

  const handleSave = () => {
    if (editingGroup.name) {
      onSaveGroup(editingGroup as UserGroup);
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Deseja realmente excluir o grupo "${name}"? Esta ação removerá a associação dos usuários.`)) {
      onDeleteGroup(id);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tighter">Esquadrões Syrius</h3>
          <p className="text-slate-500 font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.2em] mt-2">Gestão de Coletivos e Permissões Corporativas</p>
        </div>
        <button onClick={handleCreate} className="w-full sm:w-auto px-6 py-4 bg-brand-500 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all flex items-center justify-center gap-2">
          <i className="fas fa-users-viewfinder"></i>
          Novo Esquadrão
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 group">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Buscar esquadrão pelo nome..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-brand-500 outline-none font-bold text-sm dark:text-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {groups.map(group => (
          <div key={group.id} className="dashboard-card p-6 sm:p-8 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between group hover:border-brand-500 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="overflow-hidden">
                <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">{group.name}</h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 line-clamp-2">{group.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <button onClick={() => handleView(group)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-brand-500 flex items-center justify-center transition-all border border-slate-100 dark:border-slate-700" title="Visualizar Membros">
                  <i className="fas fa-eye text-xs sm:text-sm"></i>
                </button>
                <button onClick={() => handleEdit(group)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all border border-slate-100 dark:border-slate-700" title="Editar Estrutura">
                  <i className="fas fa-pen-to-square text-xs sm:text-sm"></i>
                </button>
                <button onClick={() => handleDelete(group.id, group.name)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all border border-slate-100 dark:border-slate-700" title="Excluir">
                  <i className="fas fa-trash-can text-xs sm:text-sm"></i>
                </button>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Colaboradores no Time ({group.userIds.length})</p>
              <div className="flex -space-x-3 overflow-hidden">
                {group.userIds.slice(0, 12).map(uid => {
                  const user = users.find(u => u.id === uid);
                  return user ? (
                    <img key={uid} title={user.name} className="inline-block h-9 w-9 sm:h-10 sm:w-10 rounded-xl ring-4 ring-white dark:ring-slate-900 shadow-md object-cover" src={user.avatar} alt={user.name} />
                  ) : null;
                })}
                {group.userIds.length > 12 && (
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 ring-4 ring-white dark:ring-slate-900">
                    +{group.userIds.length - 12}
                  </div>
                )}
                {group.userIds.length === 0 && (
                  <span className="text-[10px] text-slate-400 font-bold italic uppercase tracking-widest">Sem membros vinculados</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Visualização de Membros */}
      {isViewModalOpen && viewingGroup && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 animate-in zoom-in duration-400">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Equipe: {viewingGroup.name}</h3>
                  <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mt-1">{viewingGroup.userIds.length} Membros Vinculados</p>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
              {viewingGroup.userIds.map(uid => {
                const user = users.find(u => u.id === uid);
                return user ? (
                  <div key={uid} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <img src={user.avatar} className="w-12 h-12 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm" alt=""/>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{user.jobTitle} • {user.institution}</p>
                    </div>
                  </div>
                ) : null;
              })}
              {viewingGroup.userIds.length === 0 && (
                <div className="text-center py-10 opacity-30">
                  <p className="font-black uppercase text-xs tracking-widest">Este esquadrão ainda não possui membros.</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t dark:border-slate-800 text-center">
              <button onClick={() => setIsViewModalOpen(false)} className="px-10 py-3 bg-white dark:bg-slate-800 text-slate-500 font-black uppercase text-xs rounded-xl shadow-sm">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição (Mantido com melhorias de UX) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-400 border-2 border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Configuração de Esquadrão</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:text-rose-500"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Identificação do Grupo</label>
                <input type="text" placeholder="Ex: Time de Expansão Regional" value={editingGroup.name} onChange={e => setEditingGroup({...editingGroup, name: e.target.value})} className="w-full px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 font-bold outline-none focus:border-brand-500 transition-all dark:text-white text-xs sm:text-sm" />
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Diretrizes e Escopo</label>
                <textarea placeholder="Descreva a finalidade deste grupo..." value={editingGroup.description} onChange={e => setEditingGroup({...editingGroup, description: e.target.value})} className="w-full px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 font-bold outline-none focus:border-brand-500 transition-all dark:text-white resize-none text-xs sm:text-sm" rows={3} />
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-2">Vincular Colaboradores</label>
                <div className="grid grid-cols-1 gap-2">
                  {users.map(user => (
                    <label key={user.id} className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all ${editingGroup.userIds?.includes(user.id) ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                      <input type="checkbox" className="hidden" checked={editingGroup.userIds?.includes(user.id)} onChange={() => {
                        const newIds = editingGroup.userIds?.includes(user.id) ? editingGroup.userIds.filter(id => id !== user.id) : [...(editingGroup.userIds || []), user.id];
                        setEditingGroup({...editingGroup, userIds: newIds});
                      }} />
                      <img src={user.avatar} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm" />
                      <div className="overflow-hidden">
                        <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase truncate">{user.institution}</p>
                      </div>
                      <i className={`fas ${editingGroup.userIds?.includes(user.id) ? 'fa-check-circle text-brand-500 ml-auto' : 'fa-circle text-slate-100 dark:text-slate-800/40 ml-auto'} text-sm sm:text-base`}></i>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-black uppercase text-[10px] sm:text-xs hover:bg-slate-200 transition-all">Descartar</button>
              <button onClick={handleSave} className="flex-[2] py-4 rounded-xl sm:rounded-2xl bg-brand-500 text-white font-black uppercase text-[10px] sm:text-xs shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all">Salvar Estrutura</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsTab;
