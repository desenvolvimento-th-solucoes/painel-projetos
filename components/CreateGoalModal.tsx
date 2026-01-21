
import React, { useState } from 'react';
import { Goal } from '../types';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  institutions: string[];
}

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ isOpen, onClose, onSave, institutions }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    institution: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      userId: 'admin',
      title: formData.title,
      description: formData.description,
      currentValue: 0,
      targetValue: 100,
      unit: '%',
      category: 'Geral',
      institution: formData.institution,
      votes: { up: 0, down: 0, userVotes: {} }
    };
    onSave(newGoal);
    // Reset form
    setFormData({ title: '', description: '', institution: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border-2 border-slate-100 dark:border-slate-800">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-bullseye"></i>
            </div>
            Nova Meta
          </h3>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center"><i className="fas fa-times"></i></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-2">Título da Meta</label>
              <input 
                required 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 dark:text-white"
                placeholder="Ex: Aumento de Eficiência"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-2">Descrição Detalhada</label>
              <textarea 
                required 
                rows={4}
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 dark:text-white resize-none"
                placeholder="Descreva o que deve ser alcançado..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-2">Unidade Responsável</label>
              <select 
                required 
                value={formData.institution} 
                onChange={e => setFormData({...formData, institution: e.target.value})} 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 dark:text-white cursor-pointer appearance-none"
              >
                <option value="">Selecione a Unidade...</option>
                {institutions.map(inst => (<option key={inst} value={inst}>{inst}</option>))}
              </select>
            </div>
          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
            <button type="submit" className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all">Criar Meta</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGoalModal;
