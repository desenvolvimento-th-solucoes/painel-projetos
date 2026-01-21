
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <div className="dashboard-card p-6 flex flex-col justify-between dark:bg-slate-800/80 dark:border-slate-700/50 backdrop-blur-sm bg-white">
      <div className="flex justify-between items-start mb-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${color} shadow-lg shadow-current/20`}>
          <i className={`fas ${icon} text-lg`}></i>
        </div>
        {trend && (
          <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
            <i className={`fas ${trend.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">{value}</h3>
        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] mt-2">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
