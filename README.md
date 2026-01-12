# DHCP - Diabetes Health Care Programme

An intelligent AI-powered health ecosystem designed for early identification, personalized guidance, and clinical data insights for diabetes management. 
This platform is strictly aligned with **United Nations Sustainable Development Goal 3 (Good Health and Well-being)**.

## 🚀 Key Features

- **AI Risk Assessment**: Uses the Gemini 3 engine to analyze clinical metrics (Glucose, BMI, Age, etc.) and provide a structured risk score and summary.
- **Clinical Dashboard**: Interactive visualizations of metabolic profiles using Recharts to help users understand their health data vs. normative thresholds.
- **Capsule AI Assistant**: A 24/7 intelligent health literacy chatbot for empathetic support and evidence-based information.
- **Secure History**: Integration with Supabase for persistent, secure storage of health assessments.
- **SDG 3 Alignment**: Specific focus on Target 3.4 (Reducing mortality from non-communicable diseases).

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **AI Engine**: @google/genai (Gemini 3 Flash)
- **Database/Backend**: Supabase
- **Visualizations**: Recharts

## 📋 Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd dhcp-ai-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   API_KEY=your_gemini_api_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment Instructions

### Render / Vercel
1. Create a new **Static Site** and connect your GitHub repository.
2. Set the **Build Command**: `npm run build`
3. Set the **Publish Directory**: `dist`
4. **Environment Variables**: Add `API_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY` in the platform's environment settings.

### Supabase Setup
1. Create a table named `assessments`.
2. Table structure:
   - `id`: uuid (primary key)
   - `created_at`: timestamptz (default: now())
   - `metrics`: jsonb
   - `risk_result`: jsonb
3. Enable RLS (Row Level Security) or configure policies based on your security requirements.

## ⚖️ Disclaimer
This platform is an AI-powered informational tool. It is **not** a clinical diagnostic device. Always consult with a qualified medical professional for any health-related decisions or clinical diagnoses.

---
*Developed for a healthier tomorrow, aligned with UN SDG 3.*
