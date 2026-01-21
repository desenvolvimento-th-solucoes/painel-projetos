
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Project, ProjectStatus } from '../types';

interface PieChartSectionProps {
  projects: Project[];
}

// Mapeamento de cores: Planejado (Cinza), Em Andamento (Azul Claro), Concluído (Verde), Em Pausa (Laranja Suave)
const STATUS_COLORS: Record<string, string> = {
  [ProjectStatus.PLANNED]: '#CBD5E1',    // Slate 300
  [ProjectStatus.IN_PROGRESS]: '#0EA5E9', // Sky 500 (Primária)
  [ProjectStatus.COMPLETED]: '#10B981',   // Emerald 500
  [ProjectStatus.ON_HOLD]: '#F59E0B',     // Amber 500
};

const PieChartSection: React.FC<PieChartSectionProps> = ({ projects }) => {
  const data = Object.values(ProjectStatus).map((status) => ({
    name: status,
    value: projects.filter(p => p.status === status).length,
    color: STATUS_COLORS[status]
  })).filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Status Geral</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                  padding: '12px 20px',
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B'
                }}
                itemStyle={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                formatter={(value) => <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Distribuição Operacional</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                dataKey="value"
                stroke="none"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: 'none', 
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PieChartSection;
