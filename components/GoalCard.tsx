
import React from 'react';
import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
  onVote: (type: 'up' | 'down') => void;
  onEdit?: () => void;
  currentUserId: string;
  isAdmin?: boolean;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onVote, onEdit, currentUserId, isAdmin }) => {
  const percentage = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  const userVote = goal.votes.userVotes[currentUserId]?.type;
  
  const voters = Object.values(goal.votes.userVotes) as Array<{ type: 'up' | 'down', userName: string }>;
  const approvers = voters.filter(v => v.type === 'up').map(v => v.userName);
  const disapprovers = voters.filter(v => v.type === 'down').map(v => v.userName);
  const hasVoted = !!userVote;

  return (
    <div className="dashboard-card p-5 md:p-8 flex flex-col h-full animate-fade-in dark:bg-slate-800 dark:border-slate-700 group/card relative bg-white">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-3 w-full">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[9px] md:text-[10px] font-black px-3 py-1 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 uppercase tracking-widest border border-sky-100 dark:border-sky-800">
              {goal.category}
            </span>
            <span className="text-[9px] md:text-[10px] font-black px-3 py-1 rounded-lg bg-slate-50 text-slate-500 dark:bg-slate-900/20 dark:text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-800">
              {goal.institution}
            </span>
            {isAdmin && (
              <button 
                onClick={onEdit}
                className="ml-auto w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-sky-600 transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700"
                title="Editar Meta"
              >
                <i className="fas fa-edit text-xs"></i>
              </button>
            )}
          </div>
          <h4 className="text-slate-950 dark:text-white font-black text-lg md:text-xl leading-snug tracking-tight pr-8">{goal.title}</h4>
          {goal.description && (
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
              {goal.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        {goal.targetValue > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Execução</span>
                <span className="text-sm font-black text-sky-600 dark:text-sky-400">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800">
              <div 
                className="bg-sky-500 dark:bg-sky-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-4 pt-5 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative group/btn flex-1 sm:flex-none">
                <button 
                  disabled={hasVoted}
                  onClick={() => onVote('up')}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all active:scale-95 ${
                    userVote === 'up' 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                    : hasVoted 
                    ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-emerald-500 hover:text-emerald-600'
                  }`}
                >
                  <i className="fas fa-check-circle"></i>
                  <span className="text-[10px] font-black uppercase tracking-wider">{userVote === 'up' ? 'Votado' : 'A Favor'}</span>
                  <span className="text-[11px] font-black">{goal.votes.up}</span>
                </button>
              </div>

              <div className="relative group/btn flex-1 sm:flex-none">
                <button 
                  disabled={hasVoted}
                  onClick={() => onVote('down')}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all active:scale-95 ${
                    userVote === 'down' 
                    ? 'bg-rose-600 border-rose-600 text-white shadow-lg' 
                    : hasVoted 
                    ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-rose-500 hover:text-rose-600'
                  }`}
                >
                  <i className="fas fa-times-circle"></i>
                  <span className="text-[10px] font-black uppercase tracking-wider">{userVote === 'down' ? 'Votado' : 'Contra'}</span>
                  <span className="text-[11px] font-black">{goal.votes.down}</span>
                </button>
              </div>
            </div>
            
            <div className="hidden md:flex -space-x-2.5">
               {[1,2,3].map(i => (
                   <img key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${goal.id+i}`} alt=""/>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
