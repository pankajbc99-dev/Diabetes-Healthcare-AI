import React, { useState } from 'react';
import { HealthMetrics } from '../types';
import { Activity, User, Scale, Droplet, Clock } from 'lucide-react';

interface Props {
  onSubmit: (metrics: HealthMetrics) => void;
  isLoading: boolean;
}

const RiskAssessmentForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    pregnancies: 0,
    glucose: 100,
    bloodPressure: 80,
    skinThickness: 20,
    insulin: 80,
    bmi: 24,
    pedigree: 0.5,
    age: 30,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetrics((prev: HealthMetrics) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(metrics);
  };

  const inputClass = "w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Age</label>
            <div className="relative">
              <input type="number" name="age" value={metrics.age} onChange={handleChange} className={inputClass} />
              <User className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Glucose Level (mg/dL)</label>
            <div className="relative">
              <input type="number" name="glucose" value={metrics.glucose} onChange={handleChange} className={inputClass} />
              <Droplet className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div>
            <label className={labelClass}>BMI</label>
            <div className="relative">
              <input type="number" step="0.1" name="bmi" value={metrics.bmi} onChange={handleChange} className={inputClass} />
              <Scale className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Blood Pressure (Diastolic)</label>
            <div className="relative">
              <input type="number" name="bloodPressure" value={metrics.bloodPressure} onChange={handleChange} className={inputClass} />
              <Activity className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Insulin (mu U/ml)</label>
            <div className="relative">
              <input type="number" name="insulin" value={metrics.insulin} onChange={handleChange} className={inputClass} />
              <Activity className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Pregnancies</label>
            <input type="number" name="pregnancies" value={metrics.pregnancies} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Skin Thickness (mm)</label>
            <input type="number" name="skinThickness" value={metrics.skinThickness} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Diabetes Pedigree Function</label>
            <input type="number" step="0.001" name="pedigree" value={metrics.pedigree} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Generate AI Risk Assessment"
        )}
      </button>
    </form>
  );
};

export default RiskAssessmentForm;
