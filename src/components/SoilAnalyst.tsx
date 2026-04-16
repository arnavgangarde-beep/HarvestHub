import React, { useState } from "react";
import {
  FlaskConical, Thermometer, Droplets, CloudRain, Leaf,
  Sprout, ChevronRight, AlertTriangle, CheckCircle2,
  Loader2, RefreshCw, TrendingUp, Award, Zap, Info,
  BarChart3, Target, Recycle
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

interface NPKEntry {
  level: "Low" | "Optimal" | "High";
  value: number;
  advice: string;
}

interface SoilReport {
  soilStatus: string;
  phAlert: string | null;
  npkAnalysis: {
    nitrogen: NPKEntry;
    phosphorus: NPKEntry;
    potassium: NPKEntry;
  };
  topCrops: {
    name: string;
    confidence: number;
    reason: string;
    expectedYield: string;
  }[];
  optimizationSteps: {
    step: number;
    category: string;
    action: string;
  }[];
  sustainabilityNote: string;
  overallScore: number;
}

interface FormState {
  N: string; P: string; K: string; pH: string;
  temperature: string; humidity: string; rainfall: string;
  soilTexture: string;
}

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

const CROP_EMOJI: Record<string, string> = {
  Rice: "🌾", Wheat: "🌾", Maize: "🌽", Sugarcane: "🎋", Cotton: "☁️",
  Jute: "🌿", Coffee: "☕", Banana: "🍌", Mango: "🥭", Grapes: "🍇",
  Apple: "🍎", Orange: "🍊", Papaya: "🍈", Watermelon: "🍉", Muskmelon: "🍈",
  Pomegranate: "🍎", Coconut: "🥥", Chickpea: "🫘", Lentil: "🫘",
  "Kidney Beans": "🫘", "Pigeon Peas": "🫘", "Moth Beans": "🫘",
  "Mung Bean": "🫘", Blackgram: "🫘", Soybean: "🫘", Groundnut: "🥜",
};

const getCropEmoji = (name: string) =>
  CROP_EMOJI[name] || "🌱";

const getLevelColor = (level: string) => {
  if (level === "Low") return "#ef4444";
  if (level === "High") return "#f59e0b";
  return "#10b981";
};

const getLevelBg = (level: string) => {
  if (level === "Low") return "rgba(239,68,68,0.12)";
  if (level === "High") return "rgba(245,158,11,0.12)";
  return "rgba(16,185,129,0.12)";
};

const getCategoryIcon = (cat: string) => {
  const icons: Record<string, React.ReactNode> = {
    Fertilizer: <FlaskConical className="w-3.5 h-3.5" />,
    "Soil Treatment": <Leaf className="w-3.5 h-3.5" />,
    Irrigation: <Droplets className="w-3.5 h-3.5" />,
    Monitoring: <Target className="w-3.5 h-3.5" />,
  };
  return icons[cat] || <ChevronRight className="w-3.5 h-3.5" />;
};

const getCategoryColor = (cat: string) => {
  const colors: Record<string, string> = {
    Fertilizer: "#14b8a6",
    "Soil Treatment": "#8b5cf6",
    Irrigation: "#3b82f6",
    Monitoring: "#f59e0b",
  };
  return colors[cat] || "#10b981";
};

// Circular score ring
function ScoreRing({ score }: { score: number }) {
  const r = 40, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="soil-score-ring-wrap">
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <circle
          cx={50} cy={50} r={r} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="soil-score-center">
        <span className="soil-score-num" style={{ color }}>{score}</span>
        <span className="soil-score-label">/100</span>
      </div>
    </div>
  );
}

// Confidence bar for a crop
function ConfidenceBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="soil-conf-bar-bg">
      <div
        className="soil-conf-bar-fill"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}90, ${color})`,
          boxShadow: `0 0 8px ${color}50`,
          transition: "width 1s cubic-bezier(0.4,0,0.2,1)"
        }}
      />
    </div>
  );
}

// Single input field with icon
function SoilInput({
  id, label, icon, value, onChange, unit, min, max, step, placeholder
}: {
  id: string; label: string; icon: React.ReactNode;
  value: string; onChange: (v: string) => void;
  unit?: string; min?: number; max?: number; step?: number; placeholder?: string;
}) {
  return (
    <div className="soil-input-group">
      <label htmlFor={id} className="soil-input-label">
        <span className="soil-input-icon">{icon}</span>
        {label} {unit && <span className="soil-input-unit">{unit}</span>}
      </label>
      <input
        id={id} type="number"
        className="soil-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        min={min} max={max} step={step ?? 0.1}
        placeholder={placeholder ?? "0"}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────

export default function SoilAnalyst() {
  const [form, setForm] = useState<FormState>({
    N: "", P: "", K: "", pH: "",
    temperature: "", humidity: "", rainfall: "", soilTexture: ""
  });
  const [report, setReport] = useState<SoilReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof FormState) => (v: string) =>
    setForm(f => ({ ...f, [field]: v }));

  const handleAnalyze = async () => {
    const required: (keyof FormState)[] = ["N", "P", "K", "pH", "temperature", "humidity", "rainfall"];
    if (required.some(k => form[k] === "")) {
      setError("Please fill in all required soil parameters before analyzing.");
      return;
    }
    setError(""); setLoading(true); setReport(null);
    try {
      const res = await fetch("/api/soil-analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: Number(form.N), P: Number(form.P), K: Number(form.K),
          pH: Number(form.pH), temperature: Number(form.temperature),
          humidity: Number(form.humidity), rainfall: Number(form.rainfall),
          soilTexture: form.soilTexture || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setReport(data);
    } catch (e: any) {
      setError(e?.message || "Failed to connect to soil analysis engine.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ N: "", P: "", K: "", pH: "", temperature: "", humidity: "", rainfall: "", soilTexture: "" });
    setReport(null); setError("");
  };

  const fillDemo = () => {
    setForm({ N: "90", P: "42", K: "43", pH: "6.5", temperature: "20", humidity: "82", rainfall: "200", soilTexture: "Dark and loamy" });
    setReport(null); setError("");
  };

  return (
    <div className="soil-root">
      {/* Ambient orbs */}
      <div className="soil-orb soil-orb-1" />
      <div className="soil-orb soil-orb-2" />

      {/* Header */}
      <div className="soil-header">
        <div className="flex items-center gap-3">
          <div className="soil-header-icon">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="soil-title">AI Soil Analyst</h1>
            <p className="soil-subtitle">
              <span className="soil-live-dot" />
              Powered by Groq · llama-3.3-70b · Indian Agriculture Expert
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="soil-demo-btn" onClick={fillDemo} title="Load demo data">
            <Zap className="w-3.5 h-3.5" /> Try Demo
          </button>
          {report && (
            <button className="soil-reset-btn" onClick={handleReset}>
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="soil-layout">

        {/* ── INPUT PANEL ── */}
        <div className="soil-input-panel">
          <div className="soil-section-label">
            <BarChart3 className="w-4 h-4 text-teal-400" /> Nutrient Profile (mg/kg)
          </div>

          <div className="soil-input-grid">
            <SoilInput id="soil-n" label="Nitrogen" icon={<span className="soil-nutrient-badge n">N</span>}
              value={form.N} onChange={set("N")} unit="mg/kg" min={0} max={200} placeholder="e.g. 90" />
            <SoilInput id="soil-p" label="Phosphorus" icon={<span className="soil-nutrient-badge p">P</span>}
              value={form.P} onChange={set("P")} unit="mg/kg" min={0} max={200} placeholder="e.g. 42" />
            <SoilInput id="soil-k" label="Potassium" icon={<span className="soil-nutrient-badge k">K</span>}
              value={form.K} onChange={set("K")} unit="mg/kg" min={0} max={200} placeholder="e.g. 43" />
          </div>

          <div className="soil-section-label" style={{ marginTop: "1.25rem" }}>
            <Thermometer className="w-4 h-4 text-orange-400" /> Environmental Factors
          </div>

          <div className="soil-input-grid">
            <SoilInput id="soil-ph" label="pH Level" icon={<FlaskConical className="w-4 h-4 text-purple-400" />}
              value={form.pH} onChange={set("pH")} min={0} max={14} step={0.1} placeholder="e.g. 6.5" />
            <SoilInput id="soil-temp" label="Temperature" icon={<Thermometer className="w-4 h-4 text-orange-400" />}
              value={form.temperature} onChange={set("temperature")} unit="°C" min={0} max={50} placeholder="e.g. 20" />
            <SoilInput id="soil-hum" label="Humidity" icon={<Droplets className="w-4 h-4 text-blue-400" />}
              value={form.humidity} onChange={set("humidity")} unit="%" min={0} max={100} placeholder="e.g. 82" />
            <SoilInput id="soil-rain" label="Rainfall" icon={<CloudRain className="w-4 h-4 text-sky-400" />}
              value={form.rainfall} onChange={set("rainfall")} unit="mm" min={0} max={5000} placeholder="e.g. 200" />
          </div>

          <div className="soil-section-label" style={{ marginTop: "1.25rem" }}>
            <Leaf className="w-4 h-4 text-green-400" /> Visual Description (optional)
          </div>
          <textarea
            id="soil-texture"
            className="soil-textarea"
            rows={2}
            placeholder="e.g. Dark and loamy, reddish clay, sandy with gravel…"
            value={form.soilTexture}
            onChange={e => set("soilTexture")(e.target.value)}
          />

          {error && (
            <div className="soil-error-banner">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            id="soil-analyze-btn"
            className="soil-analyze-btn"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Soil…</>
              : <><FlaskConical className="w-4 h-4" /> Generate Soil Report</>
            }
          </button>

          {!report && !loading && (
            <div className="soil-hint-box">
              <Info className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
              <p>Enter your soil's N-P-K levels, environmental conditions, and optionally describe the soil texture. Click "Try Demo" to test with sample data.</p>
            </div>
          )}
        </div>

        {/* ── REPORT PANEL ── */}
        <div className="soil-report-panel">
          {!report && !loading && (
            <div className="soil-empty-state">
              <div className="soil-empty-icon">
                <Sprout className="w-10 h-10 text-emerald-400/50" />
              </div>
              <p className="soil-empty-title">Your Soil Report Will Appear Here</p>
              <p className="soil-empty-sub">Fill in the parameters on the left and click "Generate Soil Report" to receive an expert AI analysis tailored for Indian agriculture.</p>
            </div>
          )}

          {loading && (
            <div className="soil-loading-state">
              <div className="soil-loading-spinner">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              </div>
              <p className="soil-loading-title">Consulting Soil Database…</p>
              <p className="soil-loading-sub">Our AI agronomist is cross-referencing your data with Indian crop suitability models.</p>
            </div>
          )}

          {report && (
            <div className="soil-report-body">

              {/* pH Critical Alert */}
              {report.phAlert && (
                <div className="soil-ph-alert">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-400 text-sm mb-0.5">⚠ Critical pH Alert</p>
                    <p className="text-xs text-red-300 leading-relaxed">{report.phAlert}</p>
                  </div>
                </div>
              )}

              {/* Overall Score + Status */}
              <div className="soil-report-hero">
                <div className="soil-report-hero-left">
                  <div className="soil-report-section-tag">
                    <Award className="w-3.5 h-3.5 text-emerald-400" /> Overall Soil Health
                  </div>
                  <ScoreRing score={report.overallScore} />
                </div>
                <div className="soil-report-hero-right">
                  <p className="soil-status-text">{report.soilStatus}</p>
                </div>
              </div>

              {/* NPK Analysis */}
              <div className="soil-report-section">
                <div className="soil-report-section-tag">
                  <BarChart3 className="w-3.5 h-3.5 text-teal-400" /> NPK Analysis
                </div>
                <div className="soil-npk-grid">
                  {(["nitrogen", "phosphorus", "potassium"] as const).map((key) => {
                    const entry = report.npkAnalysis[key];
                    const label = key === "nitrogen" ? "N" : key === "phosphorus" ? "P" : "K";
                    const fullLabel = key.charAt(0).toUpperCase() + key.slice(1);
                    const color = getLevelColor(entry.level);
                    return (
                      <div key={key} className="soil-npk-card" style={{ borderColor: `${color}25`, background: getLevelBg(entry.level) }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`soil-nutrient-badge ${label.toLowerCase()}`}>{label}</span>
                          <span className="soil-npk-val" style={{ color }}>{entry.value} mg/kg</span>
                        </div>
                        <p className="soil-npk-full">{fullLabel}</p>
                        <span className="soil-npk-level" style={{ color, background: `${color}18` }}>{entry.level}</span>
                        <p className="soil-npk-advice">{entry.advice}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Crops */}
              <div className="soil-report-section">
                <div className="soil-report-section-tag">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-400" /> Top 3 Recommended Crops
                </div>
                <div className="soil-crops-list">
                  {report.topCrops.slice(0, 3).map((crop, i) => {
                    const confColor = crop.confidence >= 85 ? "#10b981" : crop.confidence >= 70 ? "#f59e0b" : "#3b82f6";
                    return (
                      <div key={i} className="soil-crop-row">
                        <div className="soil-crop-rank">{i + 1}</div>
                        <div className="soil-crop-emoji">{getCropEmoji(crop.name)}</div>
                        <div className="soil-crop-info">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="soil-crop-name">{crop.name}</span>
                            <span className="soil-crop-conf" style={{ color: confColor, background: `${confColor}15` }}>
                              {crop.confidence}% match
                            </span>
                          </div>
                          <p className="soil-crop-reason">{crop.reason}</p>
                          <ConfidenceBar pct={crop.confidence} color={confColor} />
                          <p className="soil-crop-yield">
                            <Target className="w-3 h-3 text-teal-400" /> Expected: {crop.expectedYield}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optimization Steps */}
              {report.optimizationSteps.length > 0 && (
                <div className="soil-report-section">
                  <div className="soil-report-section-tag">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Optimization Steps
                  </div>
                  <div className="soil-steps-list">
                    {report.optimizationSteps.map((s) => {
                      const col = getCategoryColor(s.category);
                      return (
                        <div key={s.step} className="soil-step-row" style={{ borderLeftColor: col }}>
                          <div className="soil-step-header">
                            <span className="soil-step-icon" style={{ color: col, background: `${col}18` }}>
                              {getCategoryIcon(s.category)}
                            </span>
                            <span className="soil-step-cat" style={{ color: col }}>{s.category}</span>
                            <span className="soil-step-num">Step {s.step}</span>
                          </div>
                          <p className="soil-step-action">{s.action}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sustainability Note */}
              <div className="soil-sustainability-card">
                <div className="soil-sust-glow" />
                <div className="flex items-start gap-3">
                  <div className="soil-sust-icon">
                    <Recycle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="soil-sust-title">🌱 Sustainability Note</p>
                    <p className="soil-sust-text">{report.sustainabilityNote}</p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
