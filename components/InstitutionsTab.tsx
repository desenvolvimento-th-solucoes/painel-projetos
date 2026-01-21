
import React, { useState } from 'react';
import { Institution, InstitutionStatus } from '../types';

interface InstitutionsTabProps {
  institutions: Institution[];
  onSave: (inst: Institution) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

const InstitutionsTab: React.FC<InstitutionsTabProps> = ({ institutions, onSave, onDelete, onToggleStatus, search, onSearchChange, statusFilter, onStatusFilterChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newInst: Institution = {
      id: `i-${Date.now()}`,
      name: newName,
      status: InstitutionStatus.ACTIVE
    };
    onSave(newInst);
    setNewName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">Unidades Syrius</h3>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Gestão Estratégica de Regionais e Pontos Operacionais</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-4 bg-brand-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus-circle"></i>
          Nova Unidade
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 group">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Buscar regional pelo nome..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent focus:border-brand-500 outline-none font-bold text-sm dark:text-white transition-all"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold text-sm dark:text-white cursor-pointer hover:bg-slate-100 transition-all"
        >
          <option value="">Todos Status</option>
          <option value={InstitutionStatus.ACTIVE}>Ativas</option>
          <option value={InstitutionStatus.INACTIVE}>Desativadas</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {institutions.map((inst) => (
          <div key={inst.id} className="dashboard-card p-6 md:p-8 flex flex-col gap-6 group hover:border-brand-500 transition-all relative overflow-hidden">
            {inst.status === InstitutionStatus.INACTIVE && (
               <div className="absolute top-0 right-0 p-3 bg-rose-500/10 text-rose-500 rounded-bl-2xl">
                 <i className="fas fa-ban text-[10px]"></i>
               </div>
            )}
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${inst.status === InstitutionStatus.ACTIVE ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-500 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white shadow-lg shadow-brand-500/10' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                <i className="fas fa-building text-2xl"></i>
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-lg font-black text-slate-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">{inst.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${inst.status === InstitutionStatus.ACTIVE ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`}></span>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${inst.status === InstitutionStatus.ACTIVE ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {inst.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
              <button 
                onClick={() => onToggleStatus(inst.id)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${inst.status === InstitutionStatus.ACTIVE ? 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-amber-100 hover:text-amber-700' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'}`}
              >
                {inst.status === InstitutionStatus.ACTIVE ? 'Desativar' : 'Ativar'}
              </button>
              <button 
                onClick={() => {
                  if(confirm(`Excluir a unidade "${inst.name}"? Esta ação é irreversível.`)) onDelete(inst.id);
                }}
                className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center border border-slate-100 dark:border-slate-800"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
        {institutions.length === 0 && (
          <div className="col-span-full py-24 text-center opacity-30">
            <i className="fas fa-building-circle-exclamation text-5xl mb-4"></i>
            <p className="font-black uppercase text-xs tracking-widest">Nenhuma unidade encontrada nos registros atuais.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border-2 border-slate-100 dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
                <i className="fas fa-building-circle-plus text-brand-500"></i>
                Nova Unidade
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:text-rose-500"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Identificação da Regional</label>
                <input 
                  type="text" 
                  autoFocus
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                  placeholder="Ex: Syrius Unidade Regional Americana"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 font-bold outline-none focus:border-brand-500 transition-all dark:text-white text-sm" 
                />
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4 bg-slate-50/30 dark:bg-slate-950/30">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-black uppercase text-[10px] hover:bg-slate-200 transition-all">Cancelar</button>
              <button onClick={handleCreate} className="flex-1 py-4 rounded-2xl bg-brand-500 text-white font-black uppercase text-[10px] shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all">Registrar Unidade</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionsTab;
