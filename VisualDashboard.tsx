
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { HealthMetrics } from '../types';
import { PIMA_THRESHOLDS } from '../constants';

interface Props {
  metrics: HealthMetrics;
}

const VisualDashboard: React.FC<Props> = ({ metrics }) => {
  const chartData = [
    { name: 'Glucose', value: metrics.glucose, normal: PIMA_THRESHOLDS.glucose.normal },
    { name: 'BMI', value: metrics.bmi, normal: PIMA_THRESHOLDS.bmi.normal },
    { name: 'BP', value: metrics.bloodPressure, normal: PIMA_THRESHOLDS.bloodPressure.normal },
    { name: 'Age', value: metrics.age, normal: 50 },
  ];

  const pieData = [
    { name: 'Your Score', value: metrics.glucose > 140 ? 70 : 30 },
    { name: 'Healthy Target', value: 100 - (metrics.glucose > 140 ? 70 : 30) },
  ];

  const COLORS = ['#3b82f6', '#e2e8f0'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Comparison to Normative Thresholds</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > entry.normal ? '#ef4444' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-xs text-slate-500 text-center">
            <span className="inline-block w-3 h-3 bg-red-500 mr-1 rounded-sm"></span> Above Threshold
            <span className="inline-block w-3 h-3 bg-emerald-500 ml-4 mr-1 rounded-sm"></span> Within Range
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Glucose Risk Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-blue-600">{metrics.glucose}</span>
            <span className="text-slate-400 ml-1">mg/dL</span>
            <p className="text-sm text-slate-500 mt-2">Current Fasting Glucose</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDashboard;
