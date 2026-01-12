
import React from 'react';
import { Activity, Heart, Info, MessageSquare, ClipboardCheck, BarChart3, History } from 'lucide-react';

export const PIMA_THRESHOLDS = {
  glucose: { normal: 140, high: 200 },
  bmi: { normal: 25, overweight: 30, obese: 35 },
  bloodPressure: { normal: 80, high: 90 },
};

export const TABS = [
  { id: 'home', label: 'Home', icon: <Heart className="w-5 h-5" /> },
  { id: 'assessment', label: 'Risk Assessment', icon: <ClipboardCheck className="w-5 h-5" /> },
  { id: 'insights', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> },
  { id: 'chat', label: 'Ask Capsule AI', icon: <MessageSquare className="w-5 h-5" /> },
];

export const SDG_INFO = {
  title: "Alignment with UN SDG 3",
  subtitle: "Good Health and Well-Being",
  description: "Target 3.4: Reduce by one third premature mortality from non-communicable diseases through prevention and treatment and promote mental health and well-being."
};
