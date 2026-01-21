
import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  institutions: string[];
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onSave, institutions }) => {
  const [formData, setFormData] = useState<Partial<User>>({});
  const [selectedAccessible, setSelectedAccessible] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({ ...user, password: '' }); // Limpar campo senha para edição
      setSelectedAccessible(user.accessibleInstitutions || [user.institution]);
    } else {
      setFormData({
        id: `u-${Date.now()}`,
        name: '',
        email: '',
        password: '',
        role: Role.USER,
        institution: institutions[0] || '',
        jobTitle: 'Colaborador'
      });
      setSelectedAccessible(institutions.length > 0 ? [institutions[0]] : []);
    }
  }, [user, institutions]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUser = { 
      ...formData, 
      avatar: formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || Date.now()}`,
      accessibleInstitutions: selectedAccessible 
    } as User;
    onSave(finalUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border dark:border-slate-700">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-user-edit text-brand-500"></i>
              {user ? 'Editar Colaborador' : 'Novo Colaborador'}
            </h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-all"><i className="fas fa-times"></i></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Dados Básicos</h4>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 mb-1 block">Nome Completo</label>
                <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 transition-all" placeholder="Nome" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 mb-1 block">E-mail Corporativo</label>
                <input required type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 transition-all" placeholder="E-mail" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 mb-1 block">Senha {user && '(Deixe vazio para manter)'}</label>
                <input required={!user} type="text" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 transition-all" placeholder={user ? "Sua nova senha..." : "Senha de acesso"} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 mb-1 block">Papel no Sistema</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as Role})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 transition-all">
                  <option value={Role.USER}>Usuário</option>
                  <option value={Role.ADMIN}>Admin</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 mb-1 block">Unidade Principal</label>
                <select value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 transition-all">
                  {institutions.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Permissões de Acesso Regional</h4>
              <p className="text-[10px] text-slate-400 italic mb-4">Selecione as unidades que este colaborador pode visualizar.</p>
              <div className="grid grid-cols-1 gap-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-800 max-h-[350px] overflow-y-auto">
                {institutions.map(inst => (
                  <label key={inst} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border-2 ${selectedAccessible.includes(inst) ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'border-transparent bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-200'}`}>
                    <span className="text-xs font-bold">{inst}</span>
                    <input type="checkbox" className="hidden" checked={selectedAccessible.includes(inst)} onChange={() => setSelectedAccessible(prev => prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst])} />
                    <i className={`fas ${selectedAccessible.includes(inst) ? 'fa-check-circle' : 'fa-circle opacity-10'}`}></i>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 flex gap-3 border-t border-slate-50 dark:border-slate-700">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:text-slate-400 font-black uppercase text-xs hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" className="flex-1 py-4 rounded-2xl bg-brand-500 text-white font-black shadow-xl shadow-brand-100 dark:shadow-none hover:-translate-y-1 transition-all uppercase text-xs">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
