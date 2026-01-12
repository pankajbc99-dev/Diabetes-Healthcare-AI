
import React, { useState, useEffect } from 'react';
import { HealthMetrics, RiskResult, AppTab, SavedAssessment } from './types';
import { getAIAssessment } from './services/geminiService';
import { saveAssessment, fetchHistory, supabase } from './services/supabaseClient';
import { TABS, SDG_INFO } from './constants';
import RiskAssessmentForm from './components/RiskAssessmentForm';
import VisualDashboard from './components/VisualDashboard';
import CapsuleChat from './components/CapsuleChat';
import { Heart, ShieldCheck, Activity, Info, ChevronRight, AlertTriangle, CheckCircle2, History as HistoryIcon, Clock, Database } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<SavedAssessment[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    const data = await fetchHistory();
    setHistory(data);
    setIsLoadingHistory(false);
  };

  const handleAssessmentSubmit = async (data: HealthMetrics) => {
    setIsProcessing(true);
    setMetrics(data);
    try {
      const result = await getAIAssessment(data);
      setRiskResult(result);
      
      // Attempt to save to Supabase if configured
      if (supabase) {
        await saveAssessment(data, result);
      }
      
      setActiveTab('insights');
    } catch (err) {
      console.error(err);
      alert("Error generating assessment. Please check your API key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Moderate': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-white border-b md:border-r border-slate-200 p-6 flex flex-col fixed md:sticky top-0 h-fit md:h-screen z-10">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-none">DHCP</h1>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Health Platform</span>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AppTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {!supabase && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
              <Database className="w-3 h-3" /> Supabase Disconnected
            </p>
            <p className="text-[9px] text-amber-600 mt-1">Set SUPABASE_URL and KEY in env vars to enable history.</p>
          </div>
        )}

        <div className="mt-10 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hidden md:block">
          <p className="text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> SDG 3 Aligned
          </p>
          <p className="text-[10px] text-emerald-600 leading-tight">Promoting healthy lives and well-being for all ages.</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'home' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Diabetes Health Care Programme</h2>
                <p className="text-slate-500 max-w-2xl">
                  An intelligent AI ecosystem for early identification, personalized guidance, and clinical data insights powered by the Gemini Engine.
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Early Identification</h3>
                  <p className="text-sm text-slate-500">Assess risk levels using key health metrics based on the PIMA Indians Diabetes research dataset.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Visual Insights</h3>
                  <p className="text-sm text-slate-500">Transform raw clinical data into visual trends and risk categories for better patient engagement.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4">
                    <BotIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Conversational AI</h3>
                  <p className="text-sm text-slate-500">24/7 intelligent health literacy through "Capsule," our interactive AI support assistant.</p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-600/30 transition-all"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">UN SDG 3</span>
                      <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">Global Alignment</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{SDG_INFO.title}</h3>
                    <p className="text-slate-300 mb-6 text-sm leading-relaxed">{SDG_INFO.description}</p>
                    <button 
                      onClick={() => setActiveTab('assessment')}
                      className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2"
                    >
                      Start Risk Screening <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assessment' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Health Metric Input</h2>
                  <p className="text-slate-500">Enter your clinical readings for an AI-powered risk synthesis.</p>
                </div>
                <Info className="w-5 h-5 text-slate-400" />
              </header>
              <RiskAssessmentForm onSubmit={handleAssessmentSubmit} isLoading={isProcessing} />
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <header className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Clinical Dashboard</h2>
                <p className="text-slate-500">Visualization of your metabolic profiles and comparative analysis.</p>
              </header>

              {metrics ? (
                <>
                  <div className={`p-6 rounded-2xl border-2 flex flex-col md:flex-row gap-6 items-start ${getRiskColor(riskResult?.level)}`}>
                    <div className="w-14 h-14 rounded-xl bg-white/50 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold">Risk Assessment: {riskResult?.level || 'Analyzing...'}</span>
                        <span className="px-3 py-1 bg-white/40 rounded-full text-xs font-bold border border-current">Score: {riskResult?.score}/100</span>
                      </div>
                      <p className="text-sm opacity-90 leading-relaxed mb-4">{riskResult?.summary || 'Processing metrics...'}</p>
                    </div>
                  </div>
                  <VisualDashboard metrics={metrics} />
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                  <BarChart3Icon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No active session data. View your saved history or start an assessment.</p>
                  <button onClick={() => setActiveTab('assessment')} className="mt-4 text-blue-600 font-semibold text-sm hover:underline">Go to Assessment</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Assessment History</h2>
                <p className="text-slate-500">Securely stored metabolic assessments from your profile.</p>
              </header>

              {!supabase ? (
                <div className="bg-amber-50 p-10 rounded-3xl text-center border border-amber-100">
                  <Database className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Supabase Connection Required</h3>
                  <p className="text-amber-700 max-w-md mx-auto mb-6 text-sm">To enable history tracking, you must set your Supabase environment variables in Vercel or Render.</p>
                </div>
              ) : isLoadingHistory ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 w-full bg-slate-100 animate-pulse rounded-2xl"></div>
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                  <HistoryIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No assessments found yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        setMetrics(item.metrics);
                        setRiskResult(item.risk_result);
                        setActiveTab('insights');
                      }}
                      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getRiskColor(item.risk_result.level)}`}>
                        <Activity className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-800">Risk Level: {item.risk_result.level}</span>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-500">Score: {item.risk_result.score}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleDateString()}</span>
                          <span>Glucose: {item.metrics.glucose}</span>
                          <span>BMI: {item.metrics.bmi}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 hidden md:block" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <header className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Ask Capsule AI</h2>
                <p className="text-slate-500">24/7 intelligent health chatbot for diabetes and UN SDG 3 support.</p>
              </header>
              <CapsuleChat />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper Icons
const BotIcon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);
const BarChart3Icon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

export default App;
