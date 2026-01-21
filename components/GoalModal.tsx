
import React, { useState, useEffect } from 'react';
import { Goal } from '../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  institutions: string[];
  goal?: Goal | null;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave, institutions, goal }) => {
  const [formData, setFormData] = useState<Partial<Goal>>({});

  useEffect(() => {
    if (goal) {
      setFormData({ ...goal });
    } else {
      setFormData({
        title: '',
        description: '',
        institution: institutions[0] || '',
        currentValue: 0,
        targetValue: 100,
        unit: '%',
        category: 'Estratégico',
        startDate: new Date().toISOString().split('T')[0],
        responsibleName: ''
      });
    }
  }, [goal, isOpen, institutions]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalGoal: Goal = {
      id: goal?.id || `g-${Date.now()}`,
      userId: goal?.userId || 'admin',
      title: formData.title || '',
      description: formData.description || '',
      currentValue: Number(formData.currentValue) || 0,
      targetValue: Number(formData.targetValue) || 100,
      unit: formData.unit || '%',
      category: formData.category || 'Geral',
      institution: formData.institution || institutions[0],
      votes: goal?.votes || { up: 0, down: 0, userVotes: {} },
      startDate: formData.startDate,
      endDate: formData.endDate,
      responsibleName: formData.responsibleName
    };

    onSave(finalGoal);
    onClose();
  };

  const inputClass = "w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all";
  const labelClass = "block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-2";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in duration-500 border-2 border-slate-100 dark:border-slate-800">
        <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-xl shadow-sky-500/20">
                <i className="fas fa-bullseye"></i>
              </div>
              Detalhes da Meta
            </h3>
            <p className="text-xs text-sky-600 font-black uppercase tracking-[0.3em] mt-3 ml-1">TH Soluções Estratégicas</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center text-slate-400"><i className="fas fa-times text-xl"></i></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Título da Meta</label>
                <input required type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="Ex: Eficiência Operacional" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Categoria</label>
                  <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className={inputClass} placeholder="Operações..." />
                </div>
                <div>
                  <label className={labelClass}>Unidade (Símbolo)</label>
                  <input type="text" value={formData.unit || ''} onChange={e => setFormData({...formData, unit: e.target.value})} className={inputClass} placeholder="%, R$..." />
                </div>
              </div>

              <div>
                <label className={labelClass}>Descrição</label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className={`${inputClass} resize-none min-h-[120px]`} 
                  placeholder="Objetivos específicos..." 
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>Responsável</label>
                <input type="text" value={formData.responsibleName || ''} onChange={e => setFormData({...formData, responsibleName: e.target.value})} className={inputClass} placeholder="Nome do gestor" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Valor Atual</label>
                  <input type="number" value={formData.currentValue || 0} onChange={e => setFormData({...formData, currentValue: Number(e.target.value)})} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Meta (Alvo)</label>
                  <input type="number" value={formData.targetValue || 0} onChange={e => setFormData({...formData, targetValue: Number(e.target.value)})} className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Regional</label>
                <select 
                  required 
                  value={formData.institution || ''} 
                  onChange={e => setFormData({...formData, institution: e.target.value})} 
                  className={inputClass}
                >
                  {institutions.map(inst => (<option key={inst} value={inst}>{inst}</option>))}
                </select>
              </div>

              <div className="bg-sky-50 dark:bg-sky-950/40 p-6 rounded-[2rem] border-2 border-sky-100 dark:border-sky-900/50 flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-sky-900 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="flex-1">
                  <label className={labelClass.replace('mb-2.5 ml-2', 'mb-0.5 ml-0')}>Data de Início</label>
                  <input type="date" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} className="bg-transparent border-none text-sm font-black text-sky-900 dark:text-sky-100 outline-none w-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex gap-4">
             <button type="button" onClick={onClose} className="flex-1 py-5 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Cancelar</button>
             <button type="submit" className="flex-1 py-5 rounded-[1.5rem] bg-sky-500 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-sky-500/30 hover:bg-sky-600 hover:-translate-y-1 transition-all active:scale-95">
               {goal ? 'Salvar Alterações' : 'Criar Nova Meta'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
