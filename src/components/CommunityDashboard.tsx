import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Users, MessageCircle, Send, TrendingUp, TrendingDown,
  ThumbsUp, Bookmark, Share2, Search, Bell,
  ChevronUp, ChevronDown, Globe, Flame,
  Sprout, MapPin, Star, Award, Zap, BarChart2,
  Hash, ArrowUp, ArrowRight, ShieldCheck, BadgeCheck,
  Stethoscope, Lightbulb, AlertTriangle, BookOpen,
  RefreshCw, Loader2, AtSign, CheckCircle2, X, ChevronRight
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────

const CROP_PRICES = [
  { name: "Wheat",  price: 2180, change: 5.2,  trend: "up",   icon: "🌾", color: "#f59e0b", unit: "₹/qtl" },
  { name: "Rice",   price: 3120, change: 2.8,  trend: "up",   icon: "🌾", color: "#14b8a6", unit: "₹/qtl" },
  { name: "Tomato", price: 48,   change: -8.1, trend: "down", icon: "🍅", color: "#ef4444", unit: "₹/kg"  },
  { name: "Onion",  price: 32,   change: 12.4, trend: "up",   icon: "🧅", color: "#f97316", unit: "₹/kg"  },
  { name: "Cotton", price: 6800, change: 3.1,  trend: "up",   icon: "☁️", color: "#8b5cf6", unit: "₹/qtl" },
  { name: "Potato", price: 24,   change: -4.5, trend: "down", icon: "🥔", color: "#6b7280", unit: "₹/kg"  },
];

const CHART_DATA = [
  [2100, 2120, 2090, 2140, 2160, 2155, 2180],
  [3050, 3060, 3080, 3095, 3100, 3115, 3120],
  [52, 50, 49, 46, 44, 48, 48],
  [28, 30, 32, 31, 34, 30, 32],
  [6650, 6680, 6720, 6740, 6760, 6790, 6800],
  [25, 26, 24, 25, 23, 24, 24],
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];

const DISCUSSIONS = [
  { id: 1, avatar: "R", avatarColor: "#f59e0b", name: "Rajesh Kumar", role: "Wheat Farmer · Punjab", handle: "@rajesh_farm", tag: "Market", tagColor: "#f59e0b", title: "Wheat prices likely to rise 5-7% next month — what are your thoughts?", body: "Based on export demand from APEDA and FCI procurement, wheat prices will see a strong uptick. Are you holding your stocks or selling now?", time: "2h ago", likes: 142, comments: 38, views: 1240, trending: true, bookmarked: false, liked: false },
  { id: 2, avatar: "P", avatarColor: "#14b8a6", name: "Priya Sharma", role: "Rice Grower · AP", handle: "@priya_paddy", tag: "Weather", tagColor: "#3b82f6", title: "IMD predicts heavy rainfall in AP next week — paddy crop at risk?", body: "Got an alert from the district agri office. Unseasonal rains predicted for Godavari belt. Please check your drainage channels.", time: "4h ago", likes: 89, comments: 52, views: 2100, trending: true, bookmarked: true, liked: true },
  { id: 3, avatar: "M", avatarColor: "#8b5cf6", name: "Mohan Patel", role: "Cotton Farmer · Gujarat", handle: "@mohan_kapas", tag: "Pests", tagColor: "#ef4444", title: "Pink bollworm infestation spreading — organic solutions?", body: "Had 30% crop loss last season. Trying neem-based solutions and pheromone traps. Any bio-control agents that work at scale?", time: "6h ago", likes: 203, comments: 74, views: 3800, trending: false, bookmarked: false, liked: false },
  { id: 4, avatar: "A", avatarColor: "#10b981", name: "Ananya Reddy", role: "Smart Farmer · Telangana", handle: "@ananya_harvest", tag: "Tech", tagColor: "#14b8a6", title: "AI crop monitoring reduced my water usage by 40% — full breakdown", body: "Using soil moisture sensors + HarvestHub AI, I've cut irrigation costs dramatically. Here's my 6-month analysis. DM me for the template.", time: "1d ago", likes: 412, comments: 91, views: 6500, trending: false, bookmarked: false, liked: false },
];

const CHAT_MESSAGES = [
  { id: 1, avatar: "R", color: "#f59e0b", name: "Rajesh", text: "Price alert: Wheat hit ₹2180/qtl at Ludhiana mandi! 🌾", time: "11:02 AM", isMe: false },
  { id: 2, avatar: "P", color: "#14b8a6", name: "Priya", text: "Anyone selling high-yield paddy seeds? Need 50 kg for next season.", time: "11:15 AM", isMe: false },
  { id: 3, avatar: "Y", color: "#8b5cf6", name: "You", text: "I have surplus Sona Masoori paddy seeds. DM me!", time: "11:18 AM", isMe: true },
  { id: 4, avatar: "E", color: "#10b981", name: "Dr. Suresh (Ext. Officer)", text: "🔰 Official alert: Pink bollworm traps mandatory for cotton farmers in Vidarbha from April 15. Contact your KVK.", time: "11:25 AM", isMe: false, isExpert: true },
  { id: 5, avatar: "M", color: "#ef4444", name: "Mohan", text: "Quick question — has anyone tried vertical farming for tomatoes?", time: "11:32 AM", isMe: false },
  { id: 6, avatar: "A", color: "#10b981", name: "Ananya", text: "Yes! Great ROI. I'll share my hydroponic setup guide in the community thread.", time: "11:35 AM", isMe: false },
  { id: 7, avatar: "Y", color: "#8b5cf6", name: "You", text: "The onion prices at Nashik mandi are really volatile today 📊", time: "11:41 AM", isMe: true },
];

const ONLINE_MEMBERS = [
  { name: "Rajesh K.", region: "Punjab", avatar: "R", color: "#f59e0b", online: true },
  { name: "Priya S.", region: "Andhra", avatar: "P", color: "#14b8a6", online: true },
  { name: "Mohan P.", region: "Gujarat", avatar: "M", color: "#8b5cf6", online: true },
  { name: "Ananya R.", region: "Telangana", avatar: "A", color: "#10b981", online: true },
  { name: "Vikram J.", region: "Rajasthan", avatar: "V", color: "#f97316", online: false },
  { name: "Deepa M.", region: "Tamil Nadu", avatar: "D", color: "#3b82f6", online: false },
];

const TRENDING_TAGS = ["#WheatMarket", "#MonsoonPrep", "#OrganicFarming", "#CropInsurance", "#Mandi2026", "#SoilHealth"];

// ─── Extension Officers ───
const EXTENSION_OFFICERS = [
  { id: "dr_suresh", name: "Dr. Suresh Patil", role: "District Agriculture Officer", dept: "Dept. of Agriculture, Maharashtra", avatar: "S", color: "#10b981", verified: true, speciality: "Pest Management, Cotton" },
  { id: "dr_kavitha", name: "Dr. Kavitha Nair", role: "KVK Scientist", dept: "ICAR - Kerala Agricultural Univ.", avatar: "K", color: "#14b8a6", verified: true, speciality: "Paddy, Organic Farming" },
  { id: "dr_ranjan", name: "Dr. Ranjan Singh", role: "Extension Officer", dept: "Punjab Agricultural Univ.", avatar: "RS", color: "#f59e0b", verified: true, speciality: "Wheat, Market Linkage" },
  { id: "dr_latha", name: "Dr. Latha Reddy", role: "Agri. Tech Officer", dept: "ANGRAU, Andhra Pradesh", avatar: "L", color: "#8b5cf6", verified: true, speciality: "Smart Irrigation, Rice" },
];

// ─── Expert Q&A ───
const EXPERT_QA = [
  { id: 1, qAvatar: "R", qColor: "#f59e0b", qName: "Rajesh K.", question: "My wheat leaves are turning yellow at the tips. Is this nitrogen deficiency or rust?", expert: EXTENSION_OFFICERS[2], answer: "Based on the symptom description — yellowing at leaf tips progressing inward — this points to nitrogen deficiency rather than yellow rust (which shows yellow stripes, not tip burn). Apply urea at 25 kg/acre as top dressing immediately if the crop is at tillering-jointing stage. Avoid at flag leaf stage.", time: "2h ago", helpful: 34, tags: ["#Wheat", "#NutritionDeficiency"] },
  { id: 2, qAvatar: "M", qColor: "#8b5cf6", qName: "Mohan P.", question: "Pink bollworm damage is above 10% in my cotton. Which chemical is most effective right now?", expert: EXTENSION_OFFICERS[0], answer: "For pink bollworm above ETL (10%), use Emamectin Benzoate 5 SG @ 0.4 g/L water, or Chlorantraniliprole 18.5 SC @ 0.3 ml/L. Combine with pheromone traps (5/acre). Important: Rotate modes of action to prevent resistance. Spray at evening to maximize efficacy and minimize bee mortality.", time: "5h ago", helpful: 58, tags: ["#Cotton", "#PestControl"] },
];

// ─────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  const area = `M${pts.split(" ").map((p, i) => (i === 0 ? p : `L${p}`)).join(" ")} L${w},${h} L0,${h} Z`;
  const line = `M${pts.split(" ").map((p, i) => (i === 0 ? p : `L${p}`)).join(" ")}`;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / range) * (h - 4) - 2} r="2.5" fill={color} />
    </svg>
  );
}

function CropBarChart({ selectedCrop }: { selectedCrop: number }) {
  const data = CHART_DATA[selectedCrop], crop = CROP_PRICES[selectedCrop], max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-24 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <div className="w-full rounded-t-md transition-all duration-700" style={{ height: `${(v / max) * 100}%`, background: i === data.length - 1 ? `linear-gradient(180deg, ${crop.color}, ${crop.color}80)` : `${crop.color}30`, boxShadow: i === data.length - 1 ? `0 0 12px ${crop.color}60` : "none" }} />
          <span className="text-[9px] text-slate-500">{DAYS[i]}</span>
        </div>
      ))}
    </div>
  );
}

function FloatingBubble({ children, style, className, onClick }: { children: React.ReactNode; style?: React.CSSProperties; className?: string; onClick?: () => void }) {
  return <div className={`community-bubble ${className ?? ""}`} style={style} onClick={onClick}>{children}</div>;
}

function ExpertBadge({ officer, small }: { officer: typeof EXTENSION_OFFICERS[0]; small?: boolean }) {
  return (
    <div className={`expert-badge ${small ? "small" : ""}`}>
      <div className="expert-badge-avatar" style={{ background: `${officer.color}20`, border: `1.5px solid ${officer.color}50` }}>
        <span style={{ color: officer.color, fontSize: small ? "0.65rem" : "0.8rem", fontWeight: 800 }}>{officer.avatar}</span>
      </div>
      <div>
        <div className="flex items-center gap-1">
          <span className="expert-badge-name">{officer.name}</span>
          {officer.verified && <BadgeCheck className="w-3 h-3 text-teal-400 flex-shrink-0" />}
        </div>
        {!small && <p className="expert-badge-role">{officer.role}</p>}
        {!small && <p className="expert-badge-dept">{officer.dept}</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AI WEEKLY DIGEST SIDEBAR CARD
// ─────────────────────────────────────────────────────────

interface DigestData {
  headline: string;
  summary: string;
  topThreats: { crop: string; threat: string; severity: "low" | "medium" | "high" }[];
  topOpportunities: string[];
  weeklyTip: string;
}

function WeeklyDigestCard() {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDigest = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/community-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Failed to generate digest");
      const data = await res.json();
      setDigest(data);
    } catch (e: any) {
      setError("Digest unavailable right now.");
      // Fallback static digest
      setDigest({
        headline: "Wheat Rally & Cotton Pest Alert This Week",
        summary: "Wheat prices surged 5.2% on strong export demand from West Asia. Meanwhile, pink bollworm alerts were raised in Vidarbha cotton belt. Paddy farmers in Andhra Pradesh face unseasonal rainfall risks.",
        topThreats: [
          { crop: "Cotton", threat: "Pink Bollworm infestation above ETL", severity: "high" },
          { crop: "Paddy", threat: "Unseasonal rainfall risk", severity: "medium" },
          { crop: "Tomato", threat: "Price crash at Azadpur mandi", severity: "medium" },
        ],
        topOpportunities: [
          "Wheat: Strong export window open until May",
          "Onion: 12% price rise at Nashik market",
          "Cotton: Organic certification premium up 18%",
        ],
        weeklyTip: "Apply neem-based bio-pesticides before 8 AM to protect beneficial insects while controlling cotton pests.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDigest(); }, [fetchDigest]);

  const severityColor: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
  const severityBg: Record<string, string> = { high: "rgba(239,68,68,0.1)", medium: "rgba(245,158,11,0.1)", low: "rgba(16,185,129,0.1)" };

  return (
    <div className="weekly-digest-card">
      <div className="digest-glow" />
      <div className="digest-header">
        <div className="flex items-center gap-2">
          <div className="digest-icon"><Zap className="w-3.5 h-3.5 text-teal-400" /></div>
          <span className="digest-title">AI Weekly Digest</span>
          <span className="community-live-badge">NEW</span>
        </div>
        <button className="community-view-all-btn" onClick={fetchDigest} title="Refresh">
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="digest-loading">
          <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
          <span>AI is generating this week's digest…</span>
        </div>
      ) : digest ? (
        <div className="digest-body">
          <p className="digest-headline">"{digest.headline}"</p>
          <p className="digest-summary">{digest.summary}</p>

          {/* Top Threats */}
          <div className="digest-section">
            <p className="digest-section-label"><AlertTriangle className="w-3 h-3 text-red-400" /> Crop Threats</p>
            <div className="space-y-1.5">
              {digest.topThreats?.slice(0, 3).map((t, i) => (
                <div key={i} className="digest-threat-row" style={{ background: severityBg[t.severity], borderColor: `${severityColor[t.severity]}25` }}>
                  <span className="digest-threat-crop">{t.crop}</span>
                  <span className="digest-threat-text">{t.threat}</span>
                  <span className="digest-severity-dot" style={{ background: severityColor[t.severity], boxShadow: `0 0 5px ${severityColor[t.severity]}` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="digest-section">
            <p className="digest-section-label"><TrendingUp className="w-3 h-3 text-emerald-400" /> Opportunities</p>
            <div className="space-y-1.5">
              {digest.topOpportunities?.slice(0, 3).map((o, i) => (
                <div key={i} className="digest-opportunity-row">
                  <ChevronRight className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span className="digest-opportunity-text">{o}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Tip */}
          {digest.weeklyTip && (
            <div className="digest-tip">
              <Lightbulb className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="digest-tip-text"><strong className="text-orange-400">Tip:</strong> {digest.weeklyTip}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ASK AN EXPERT VIEW
// ─────────────────────────────────────────────────────────

function AskExpertView() {
  const [question, setQuestion] = useState("");
  const [taggedOfficer, setTaggedOfficer] = useState<typeof EXTENSION_OFFICERS[0] | null>(null);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"ask" | "qa">("ask");

  const askAI = async () => {
    if (!question.trim()) return;
    setAiLoading(true); setAiAnswer(""); setSubmitted(true);
    try {
      const contextQ = taggedOfficer
        ? `[Tagged: ${taggedOfficer.name} — ${taggedOfficer.speciality}] ${question}`
        : question;
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: `You are an expert agricultural extension officer with the speciality: ${taggedOfficer?.speciality || "general agronomy"}. A farmer asks: ${contextQ}. Provide a precise, actionable answer under 150 words. Include specific dosages, timings, and product names where relevant.` }),
      });
      const data = await res.json();
      setAiAnswer(data.answer || "No response received.");
    } catch {
      setAiAnswer("Unable to connect to the AI advisor right now. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="expert-view-root">
      {/* Sub-tab bar */}
      <div className="expert-subtabs">
        {(["ask", "qa"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`expert-subtab${activeTab === t ? " active" : ""}`}>
            {t === "ask" ? <><Stethoscope className="w-3.5 h-3.5" /> Ask an Expert</> : <><BookOpen className="w-3.5 h-3.5" /> Expert Q&amp;A Feed</>}
          </button>
        ))}
      </div>

      {activeTab === "ask" && (
        <div className="expert-ask-layout">
          {/* Left: Question composer */}
          <div className="expert-ask-main">
            <FloatingBubble className="community-card" style={{ animationDelay: "0s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="expert-ask-icon"><Stethoscope className="w-5 h-5 text-teal-400" /></div>
                <div>
                  <h2 className="text-base font-bold text-white">Ask a Certified Expert</h2>
                  <p className="community-subtitle">Get verified advice from agricultural extension officers & scientists</p>
                </div>
              </div>

              {/* Tag Officer */}
              <div className="relative mb-3">
                <button className="expert-tag-btn" onClick={() => setShowTagMenu(v => !v)}>
                  <AtSign className="w-4 h-4 text-teal-400" />
                  {taggedOfficer ? (
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-teal-300 font-semibold">{taggedOfficer.name}</span>
                      <button className="ml-auto" onClick={e => { e.stopPropagation(); setTaggedOfficer(null); }}><X className="w-3.5 h-3.5 text-slate-400 hover:text-white" /></button>
                    </div>
                  ) : <span className="text-slate-400">Tag an Extension Officer (optional)</span>}
                </button>

                {showTagMenu && (
                  <div className="expert-tag-dropdown">
                    {EXTENSION_OFFICERS.map(o => (
                      <button key={o.id} className="expert-tag-option" onClick={() => { setTaggedOfficer(o); setShowTagMenu(false); }}>
                        <div className="expert-badge-avatar small" style={{ background: `${o.color}20`, border: `1.5px solid ${o.color}50` }}>
                          <span style={{ color: o.color, fontSize:"0.65rem", fontWeight:800 }}>{o.avatar}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-white text-xs font-semibold">{o.name}</span>
                            <BadgeCheck className="w-3 h-3 text-teal-400" />
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{o.speciality}</p>
                        </div>
                        <span className="expert-speciality-tag">{o.dept.split(",")[0]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Question Input */}
              <textarea
                className="expert-qa-input"
                rows={4}
                placeholder="Describe your crop issue in detail — include crop type, stage, symptoms, weather, and what you've tried so far…"
                value={question}
                onChange={e => { setQuestion(e.target.value); setSubmitted(false); setAiAnswer(""); }}
              />

              <div className="flex items-center gap-3 mt-3">
                <button className="expert-ask-btn" onClick={askAI} disabled={!question.trim() || aiLoading}>
                  {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting Answer…</> : <><Zap className="w-4 h-4" /> Get Expert AI Answer</>}
                </button>
                <p className="community-subtitle">Powered by Groq · llama-3.3-70b</p>
              </div>
            </FloatingBubble>

            {/* AI Answer */}
            {submitted && (
              <FloatingBubble className="community-card" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center gap-2 mb-3">
                  {taggedOfficer ? <ExpertBadge officer={taggedOfficer} small /> : (
                    <div className="flex items-center gap-2">
                      <div className="expert-ask-icon sm"><Sprout className="w-3.5 h-3.5 text-teal-400" /></div>
                      <span className="text-sm font-bold text-white">HarvestHub AI Advisor</span>
                    </div>
                  )}
                  <span className="community-live-badge ml-auto">AI Response</span>
                </div>
                {aiLoading ? (
                  <div className="expert-answer-loading"><Loader2 className="w-5 h-5 text-teal-400 animate-spin" /><span>Consulting agricultural knowledge base…</span></div>
                ) : (
                  <div className="expert-answer-box">
                    <p className="expert-answer-text">{aiAnswer}</p>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                      <button className="community-action-btn"><ThumbsUp className="w-3.5 h-3.5" /> Helpful</button>
                      <button className="community-action-btn"><Share2 className="w-3.5 h-3.5" /> Share</button>
                      <button className="community-action-btn ml-auto" onClick={() => { setSubmitted(false); setAiAnswer(""); setQuestion(""); setTaggedOfficer(null); }}>
                        <X className="w-3.5 h-3.5" /> New Question
                      </button>
                    </div>
                  </div>
                )}
              </FloatingBubble>
            )}
          </div>

          {/* Right: Extension Officers directory */}
          <aside className="expert-officers-sidebar">
            <FloatingBubble className="community-card" style={{ animationDelay: "0.2s" }}>
              <div className="community-card-header mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span className="community-card-title">Verified Officers</span>
                </div>
                <span className="community-online-count">{EXTENSION_OFFICERS.length} active</span>
              </div>
              <div className="space-y-3">
                {EXTENSION_OFFICERS.map(o => (
                  <div key={o.id} className="officer-card" onClick={() => { setTaggedOfficer(o); setShowTagMenu(false); }}>
                    <div className="officer-card-glow" style={{ background: `radial-gradient(circle at 0% 50%, ${o.color}10, transparent 60%)` }} />
                    <div className="flex items-start gap-2.5">
                      <div className="officer-avatar" style={{ background: `${o.color}18`, border: `1.5px solid ${o.color}45` }}>
                        <span style={{ color: o.color, fontSize: "0.85rem", fontWeight: 800 }}>{o.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="officer-name">{o.name}</span>
                          <BadgeCheck className="w-3 h-3 text-teal-400 flex-shrink-0" />
                        </div>
                        <p className="officer-role">{o.role}</p>
                        <p className="officer-dept">{o.dept}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {o.speciality.split(", ").map(s => (
                            <span key={s} className="officer-speciality-tag">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="officer-tag-btn" onClick={e => { e.stopPropagation(); setTaggedOfficer(o); }}>
                      <AtSign className="w-3 h-3" /> Tag
                    </button>
                  </div>
                ))}
              </div>
            </FloatingBubble>

            {/* Note */}
            <FloatingBubble className="community-card" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white mb-1">Verified Government Advice</p>
                  <p className="text-xs text-slate-400 leading-relaxed">All extension officers are certified by ICAR / State Agriculture Departments. AI responses are augmented with official guidelines. Always verify dosages with your local KVK.</p>
                </div>
              </div>
            </FloatingBubble>
          </aside>
        </div>
      )}

      {activeTab === "qa" && (
        <div className="expert-qa-feed">
          {EXPERT_QA.map((qa, i) => (
            <FloatingBubble key={qa.id} className="community-card" style={{ animationDelay: `${i * 0.15}s` }}>
              {/* Question */}
              <div className="flex items-start gap-3 mb-3">
                <div className="community-avatar" style={{ background: `${qa.qColor}20`, border: `1.5px solid ${qa.qColor}50` }}>
                  <span style={{ color: qa.qColor, fontSize: "0.8rem", fontWeight: 800 }}>{qa.qAvatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="community-post-name">{qa.qName}</span>
                    <span className="community-post-time ml-auto">{qa.time}</span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-1 leading-snug">{qa.question}</p>
                  <div className="flex gap-1.5 mt-1.5">
                    {qa.tags.map(t => <span key={t} className="community-post-tag" style={{ color: "#14b8a6", borderColor: "#14b8a640", background: "#14b8a610" }}><Hash className="w-2.5 h-2.5" />{t.slice(1)}</span>)}
                  </div>
                </div>
              </div>

              {/* Expert Answer */}
              <div className="expert-answer-block">
                <div className="expert-answer-block-header">
                  <ExpertBadge officer={qa.expert} small />
                  <BadgeCheck className="w-4 h-4 text-teal-400" />
                  <span className="expert-verified-label">Verified Answer</span>
                </div>
                <p className="expert-answer-text mt-2">{qa.answer}</p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                  <button className="community-action-btn liked"><ThumbsUp className="w-3.5 h-3.5" />{qa.helpful} helpful</button>
                  <button className="community-action-btn"><Share2 className="w-3.5 h-3.5" />Share</button>
                  <button className="community-action-btn ml-auto"><Bookmark className="w-3.5 h-3.5" />Save</button>
                </div>
              </div>
            </FloatingBubble>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN COMMUNITY DASHBOARD
// ─────────────────────────────────────────────────────────

export default function CommunityDashboard({ userName = "You" }: { userName?: string }) {
  const [activeView, setActiveView] = useState<"feed" | "chat" | "prices" | "expert">("feed");
  const [discussions, setDiscussions] = useState(DISCUSSIONS);
  const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const handleLike = useCallback((id: number) => setDiscussions(ds => ds.map(d => d.id === id ? { ...d, liked: !d.liked, likes: d.liked ? d.likes - 1 : d.likes + 1 } : d)), []);
  const handleBookmark = useCallback((id: number) => setDiscussions(ds => ds.map(d => d.id === id ? { ...d, bookmarked: !d.bookmarked } : d)), []);

  const sendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    setChatMessages(msgs => [...msgs, { id: msgs.length + 1, avatar: "Y", color: "#8b5cf6", name: "You", text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isMe: true }]);
    setChatInput("");
  }, [chatInput]);

  const filtered = discussions.filter(d => !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.body.toLowerCase().includes(searchQuery.toLowerCase()));

  const TABS = [
    { id: "feed" as const,   icon: <Globe className="w-4 h-4" />,         label: "Feed" },
    { id: "expert" as const, icon: <Stethoscope className="w-4 h-4" />,   label: "Ask Expert", badge: "NEW" },
    { id: "chat" as const,   icon: <MessageCircle className="w-4 h-4" />, label: "Chat",       badgeNum: 7 },
    { id: "prices" as const, icon: <BarChart2 className="w-4 h-4" />,     label: "Crop Prices" },
  ];

  return (
    <div className="community-root">
      <div className="community-orb community-orb-1" />
      <div className="community-orb community-orb-2" />
      <div className="community-orb community-orb-3" />

      {/* Header */}
      <div className="community-header">
        <div className="flex items-center gap-3">
          <div className="community-icon-badge"><Users className="w-5 h-5 text-orange-400" /></div>
          <div>
            <h1 className="community-title">Farmer Community</h1>
            <p className="community-subtitle"><span className="community-live-dot" /> 1,842 farmers online now</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="community-search-wrap">
            <Search className="w-4 h-4 text-slate-400 community-search-icon" />
            <input className="community-search-input" placeholder="Search discussions…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="community-notify-btn"><Bell className="w-4 h-4 text-teal-400" /><span className="community-notify-badge">3</span></button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="community-tabbar">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveView(tab.id)} className={`community-tab${activeView === tab.id ? " active" : ""}`}>
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && <span className="expert-tab-badge">{tab.badge}</span>}
            {tab.badgeNum && <span className="community-tab-badge">{tab.badgeNum}</span>}
          </button>
        ))}
      </div>

      <div className="community-content">

        {/* ── FEED ── */}
        {activeView === "feed" && (
          <div className="community-three-col">
            <aside className="community-sidebar">
              <FloatingBubble className="community-card" style={{ animationDelay: "0s" }}>
                <div className="community-card-header">
                  <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-teal-400" /><span className="community-card-title">Online Farmers</span></div>
                  <span className="community-online-count">{ONLINE_MEMBERS.filter(m => m.online).length} online</span>
                </div>
                <div className="space-y-3 mt-3">
                  {ONLINE_MEMBERS.map((m, i) => (
                    <div key={i} className="community-member-row">
                      <div className="community-avatar" style={{ background: `${m.color}20`, border: `1.5px solid ${m.color}50` }}>
                        <span style={{ color: m.color }}>{m.avatar}</span>
                        {m.online && <span className="community-online-pip" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="community-member-name">{m.name}</p>
                        <p className="community-member-region"><MapPin className="w-2.5 h-2.5" />{m.region}</p>
                      </div>
                      {m.online && <button className="community-msg-btn"><MessageCircle className="w-3 h-3" /></button>}
                    </div>
                  ))}
                </div>
              </FloatingBubble>

              <FloatingBubble className="community-card" style={{ animationDelay: "0.3s" }}>
                <div className="community-card-header">
                  <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /><span className="community-card-title">Trending Topics</span></div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {TRENDING_TAGS.map((tag, i) => <button key={i} className="community-trending-tag">{tag}</button>)}
                </div>
              </FloatingBubble>

              <FloatingBubble className="community-card" style={{ animationDelay: "0.6s" }}>
                <div className="community-card-header">
                  <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-orange-400" /><span className="community-card-title">Today's Prices</span></div>
                  <button className="community-view-all-btn" onClick={() => setActiveView("prices")}>View all <ArrowRight className="w-3 h-3" /></button>
                </div>
                <div className="space-y-2 mt-3">
                  {CROP_PRICES.slice(0, 4).map((c, i) => (
                    <div key={i} className="community-price-row">
                      <span className="text-base">{c.icon}</span>
                      <span className="community-price-name">{c.name}</span>
                      <span className="community-price-val">₹{c.price}</span>
                      <span className={`community-price-change ${c.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                        {c.trend === "up" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}{Math.abs(c.change)}%
                      </span>
                    </div>
                  ))}
                </div>
              </FloatingBubble>
            </aside>

            <main className="community-feed">
              <FloatingBubble className="community-card community-composer" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center gap-3">
                  <div className="community-avatar-lg" style={{ background: "#8b5cf620", border: "1.5px solid #8b5cf650" }}><span style={{ color: "#8b5cf6" }}>Y</span></div>
                  <div className="community-composer-input"><span className="text-slate-500">Share crop insights, weather updates, market news…</span></div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  {[{ icon: "📊", label: "Prices" }, { icon: "🌦️", label: "Weather" }, { icon: "🌾", label: "Crop" }, { icon: "🤝", label: "Trade" }, { icon: "🔰", label: "Expert" }].map(a => (
                    <button key={a.label} className="community-compose-action" onClick={a.label === "Expert" ? () => setActiveView("expert") : undefined}>
                      <span>{a.icon}</span>{a.label}
                    </button>
                  ))}
                </div>
              </FloatingBubble>

              {filtered.map((d, i) => (
                <FloatingBubble key={d.id} className="community-card community-discussion" style={{ animationDelay: `${i * 0.15}s` }}>
                  {d.trending && <div className="community-trending-badge"><Flame className="w-3 h-3" />Trending</div>}
                  <div className="flex items-start gap-3">
                    <div className="community-avatar-lg flex-shrink-0" style={{ background: `${d.avatarColor}20`, border: `1.5px solid ${d.avatarColor}50` }}>
                      <span style={{ color: d.avatarColor }}>{d.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="community-post-name">{d.name}</span>
                        <span className="community-post-handle">{d.handle}</span>
                        <span className="community-post-tag" style={{ color: d.tagColor, borderColor: `${d.tagColor}40`, background: `${d.tagColor}10` }}><Hash className="w-2.5 h-2.5" />{d.tag}</span>
                        <span className="community-post-time ml-auto">{d.time}</span>
                      </div>
                      <p className="community-post-role">{d.role}</p>
                    </div>
                  </div>
                  <h3 className="community-post-title">{d.title}</h3>
                  <p className="community-post-body">{d.body}</p>
                  <div className="community-post-actions">
                    <button className={`community-action-btn ${d.liked ? "liked" : ""}`} onClick={() => handleLike(d.id)}><ThumbsUp className="w-4 h-4" /><span>{d.likes}</span></button>
                    <button className="community-action-btn"><MessageCircle className="w-4 h-4" /><span>{d.comments}</span></button>
                    <button className={`community-action-btn ${d.bookmarked ? "bookmarked" : ""}`} onClick={() => handleBookmark(d.id)}><Bookmark className="w-4 h-4" /></button>
                    <button className="community-action-btn" onClick={() => setActiveView("expert")} title="Ask Expert about this">
                      <Stethoscope className="w-4 h-4 text-teal-400" />
                    </button>
                    <button className="community-action-btn ml-auto"><Share2 className="w-4 h-4" /></button>
                    <span className="community-post-views">{d.views.toLocaleString()} views</span>
                  </div>
                </FloatingBubble>
              ))}
            </main>

            <aside className="community-sidebar">
              {/* AI Weekly Digest */}
              <WeeklyDigestCard />

              <FloatingBubble className="community-card" style={{ animationDelay: "0.2s" }}>
                <div className="community-card-header">
                  <div className="flex items-center gap-2"><Award className="w-4 h-4 text-orange-400" /><span className="community-card-title">Community Stats</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[{ label: "Members", val: "48.2K", icon: "👨‍🌾", color: "#f59e0b" }, { label: "Discussions", val: "12.4K", icon: "💬", color: "#14b8a6" }, { label: "Expert Q&As", val: "1.2K", icon: "🔰", color: "#8b5cf6" }, { label: "Deals Made", val: "921", icon: "🤝", color: "#10b981" }].map(s => (
                    <div key={s.label} className="community-stat-card" style={{ borderColor: `${s.color}25` }}>
                      <span className="community-stat-icon">{s.icon}</span>
                      <span className="community-stat-val" style={{ color: s.color }}>{s.val}</span>
                      <span className="community-stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </FloatingBubble>

              <FloatingBubble className="community-card" style={{ animationDelay: "0.5s" }}>
                <div className="community-card-header">
                  <div className="flex items-center gap-2"><Star className="w-4 h-4 text-orange-400" /><span className="community-card-title">Top Contributors</span></div>
                </div>
                <div className="space-y-3 mt-3">
                  {[{ name: "Ananya R.", pts: "4,120 pts", avatar: "A", color: "#10b981", badge: "🥇" }, { name: "Mohan P.", pts: "3,680 pts", avatar: "M", color: "#8b5cf6", badge: "🥈" }, { name: "Rajesh K.", pts: "2,910 pts", avatar: "R", color: "#f59e0b", badge: "🥉" }].map((c, i) => (
                    <div key={i} className="community-contributor-row">
                      <span className="text-base">{c.badge}</span>
                      <div className="community-avatar" style={{ background: `${c.color}20`, border: `1.5px solid ${c.color}50` }}><span style={{ color: c.color }}>{c.avatar}</span></div>
                      <div className="flex-1"><p className="community-member-name">{c.name}</p><p className="community-member-region">{c.pts}</p></div>
                      <button className="community-follow-btn">Follow</button>
                    </div>
                  ))}
                </div>
              </FloatingBubble>

              <FloatingBubble className="community-advisory-card" style={{ animationDelay: "0.8s" }}>
                <div className="community-advisory-glow" />
                <Sprout className="w-6 h-6 text-teal-400 mb-2" />
                <p className="community-advisory-title">AI Crop Advisory</p>
                <p className="community-advisory-text">Optimum sowing window for Kharif crops opens in <strong className="text-orange-400">12 days</strong>. Check your soil health now.</p>
                <button className="community-advisory-btn" onClick={() => setActiveView("expert")}>Ask an Expert <ArrowRight className="w-3 h-3" /></button>
              </FloatingBubble>
            </aside>
          </div>
        )}

        {/* ── ASK EXPERT ── */}
        {activeView === "expert" && <AskExpertView />}

        {/* ── CHAT ── */}
        {activeView === "chat" && (
          <div className="community-chat-layout">
            <aside className="community-chat-sidebar">
              <div className="community-card-header mb-3">
                <span className="community-card-title flex items-center gap-2"><Hash className="w-4 h-4 text-teal-400" />Channels</span>
              </div>
              {[{ name: "general", icon: "💬", active: true, unread: 7 }, { name: "wheat-market", icon: "🌾", active: false, unread: 0 }, { name: "paddy-growers", icon: "🌱", active: false, unread: 2 }, { name: "expert-advice", icon: "🔰", active: false, unread: 1 }, { name: "weather-alerts", icon: "🌧️", active: false, unread: 1 }, { name: "pest-control", icon: "🐛", active: false, unread: 0 }].map(ch => (
                <button key={ch.name} className={`community-channel${ch.active ? " active" : ""}`}>
                  <span>{ch.icon}</span><span className="flex-1 text-left">#{ch.name}</span>
                  {ch.unread > 0 && <span className="community-channel-badge">{ch.unread}</span>}
                </button>
              ))}
            </aside>

            <div className="community-chat-main">
              <div className="community-chat-header">
                <Hash className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-white"># general</span>
                <span className="community-subtitle ml-3">1,842 members · Open to all farmers</span>
              </div>
              <div className="community-chat-messages">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`community-chat-msg${msg.isMe ? " is-me" : ""}`}>
                    {!msg.isMe && (
                      <div className="relative">
                        <div className="community-avatar flex-shrink-0" style={{ background: `${msg.color}20`, border: `1.5px solid ${msg.color}50` }}>
                          <span style={{ color: msg.color }}>{msg.avatar}</span>
                        </div>
                        {(msg as any).isExpert && <BadgeCheck className="w-3 h-3 text-teal-400 absolute -top-1 -right-1" />}
                      </div>
                    )}
                    <div className={`community-chat-bubble${msg.isMe ? " mine" : ""}${(msg as any).isExpert ? " expert-msg" : ""}`} style={msg.isMe ? {} : { borderColor: `${msg.color}20` }}>
                      {!msg.isMe && (
                        <p className="community-chat-sender flex items-center gap-1" style={{ color: msg.color }}>
                          {msg.name}
                          {(msg as any).isExpert && <BadgeCheck className="w-3 h-3 text-teal-400" />}
                        </p>
                      )}
                      <p className="community-chat-text">{msg.text}</p>
                      <p className="community-chat-time">{msg.time}</p>
                    </div>
                    {msg.isMe && (
                      <div className="community-avatar flex-shrink-0" style={{ background: `${msg.color}20`, border: `1.5px solid ${msg.color}50` }}>
                        <span style={{ color: msg.color }}>{msg.avatar}</span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="community-chat-input-row">
                <input className="community-chat-input" placeholder="Share crop insights, tag @experts, or ask a question…" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} />
                <button className="community-chat-send" onClick={sendChat} disabled={!chatInput.trim()}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <aside className="community-chat-members">
              <div className="community-card-header mb-3">
                <span className="community-card-title flex items-center gap-2"><Users className="w-4 h-4 text-orange-400" />Online</span>
                <span className="community-online-count">{ONLINE_MEMBERS.filter(m => m.online).length}</span>
              </div>
              {ONLINE_MEMBERS.map((m, i) => (
                <div key={i} className="community-member-row mb-2">
                  <div className="community-avatar relative" style={{ background: `${m.color}20`, border: `1.5px solid ${m.color}50` }}>
                    <span style={{ color: m.color }}>{m.avatar}</span>
                    {m.online && <span className="community-online-pip" />}
                  </div>
                  <div><p className="community-member-name">{m.name}</p><p className="community-member-region">{m.region}</p></div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="community-card-title mb-2 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-teal-400" />Expert Officers</p>
                {EXTENSION_OFFICERS.slice(0, 2).map(o => (
                  <div key={o.id} className="community-member-row mb-2">
                    <div className="community-avatar relative" style={{ background: `${o.color}18`, border: `1.5px solid ${o.color}45` }}>
                      <span style={{ color: o.color, fontSize: "0.65rem", fontWeight: 800 }}>{o.avatar}</span>
                      <BadgeCheck className="w-3 h-3 text-teal-400 absolute -top-1 -right-1" />
                    </div>
                    <div><p className="community-member-name">{o.name}</p><p className="community-member-region">{o.speciality.split(",")[0]}</p></div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}

        {/* ── PRICES ── */}
        {activeView === "prices" && (
          <div className="community-prices-layout">
            <div className="community-prices-grid">
              {CROP_PRICES.map((c, i) => (
                <FloatingBubble key={i} className={`community-price-card${selectedCrop === i ? " selected" : ""}`} style={{ animationDelay: `${i * 0.1}s`, borderColor: selectedCrop === i ? `${c.color}60` : undefined }} onClick={() => setSelectedCrop(i)}>
                  <div className="community-price-card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${c.color}15, transparent 70%)` }} />
                  <div className="flex items-start justify-between mb-3">
                    <div className="community-price-icon" style={{ background: `${c.color}15`, borderColor: `${c.color}30` }}><span className="text-lg">{c.icon}</span></div>
                    <span className={`community-price-badge ${c.trend === "up" ? "up" : "down"}`}>{c.trend === "up" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}{Math.abs(c.change)}%</span>
                  </div>
                  <MiniSparkline data={CHART_DATA[i]} color={c.color} />
                  <div className="mt-2">
                    <p className="community-price-crop-name">{c.name}</p>
                    <p className="community-price-crop-val" style={{ color: c.color }}>{c.price.toLocaleString()}<span className="community-price-crop-unit">{c.unit}</span></p>
                  </div>
                </FloatingBubble>
              ))}
            </div>

            <FloatingBubble className="community-chart-panel" style={{ animationDelay: "0.4s" }}>
              <div className="community-chart-panel-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${CROP_PRICES[selectedCrop].color}12, transparent 60%)` }} />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{CROP_PRICES[selectedCrop].icon}</span>
                    <h2 className="text-xl font-bold text-white">{CROP_PRICES[selectedCrop].name}</h2>
                    <span className={`community-price-badge large ${CROP_PRICES[selectedCrop].trend === "up" ? "up" : "down"}`}>
                      {CROP_PRICES[selectedCrop].trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(CROP_PRICES[selectedCrop].change)}% this week
                    </span>
                  </div>
                  <p className="community-subtitle mt-1">7-day price trend · APMC data</p>
                </div>
                <div className="text-right">
                  <p className="community-subtitle">Current Price</p>
                  <p className="text-3xl font-black" style={{ color: CROP_PRICES[selectedCrop].color }}>₹{CROP_PRICES[selectedCrop].price.toLocaleString()}</p>
                  <p className="community-subtitle">{CROP_PRICES[selectedCrop].unit}</p>
                </div>
              </div>
              <div className="community-barchart-wrap"><CropBarChart selectedCrop={selectedCrop} /></div>
              <div className="community-market-insights">
                {[{ label: "7-day High", val: `₹${Math.max(...CHART_DATA[selectedCrop]).toLocaleString()}`, color: "#10b981" }, { label: "7-day Low", val: `₹${Math.min(...CHART_DATA[selectedCrop]).toLocaleString()}`, color: "#ef4444" }, { label: "Volume", val: "24,800 qtl", color: "#f59e0b" }, { label: "Demand", val: "High", color: "#14b8a6" }].map(kpi => (
                  <div key={kpi.label} className="community-market-kpi">
                    <p className="community-market-kpi-label">{kpi.label}</p>
                    <p className="community-market-kpi-val" style={{ color: kpi.color }}>{kpi.val}</p>
                  </div>
                ))}
              </div>
              <div className="community-ai-prediction">
                <div className="community-ai-glow" />
                <div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-teal-400" /><span className="community-ai-label">AI Price Forecast</span><span className="community-live-badge">LIVE</span></div>
                <p className="community-ai-text">
                  {CROP_PRICES[selectedCrop].name} prices are predicted to{" "}
                  <strong style={{ color: CROP_PRICES[selectedCrop].trend === "up" ? "#10b981" : "#ef4444" }}>
                    {CROP_PRICES[selectedCrop].trend === "up" ? "rise" : "fall"} by {Math.abs(CROP_PRICES[selectedCrop].change)}%
                  </strong>
                  {" "}over the next 7 days based on export demand, mandi arrivals, and seasonal patterns.{" "}
                  <span className="text-teal-400 font-semibold">85% confidence.</span>
                </p>
              </div>
            </FloatingBubble>

            <div className="community-prices-right">
              <FloatingBubble className="community-card" style={{ animationDelay: "0.5s" }}>
                <div className="community-card-header mb-3">
                  <span className="community-card-title flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-400" />Live Mandi Rates</span>
                  <span className="community-live-badge">LIVE</span>
                </div>
                <div className="space-y-2">
                  {[{ mandi: "Ludhiana", crop: "Wheat", price: "₹2,185", dir: "up" }, { mandi: "Azadpur", crop: "Tomato", price: "₹46/kg", dir: "down" }, { mandi: "Nashik", crop: "Onion", price: "₹33/kg", dir: "up" }, { mandi: "Rajkot", crop: "Cotton", price: "₹6,820", dir: "up" }, { mandi: "Agra", crop: "Potato", price: "₹23/kg", dir: "down" }].map((m, i) => (
                    <div key={i} className="community-mandi-row">
                      <div><p className="community-member-name">{m.mandi}</p><p className="community-member-region">{m.crop}</p></div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white text-sm">{m.price}</span>
                        {m.dir === "up" ? <ArrowUp className="w-3 h-3 text-emerald-400" /> : <ChevronDown className="w-3 h-3 text-red-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </FloatingBubble>

              <FloatingBubble className="community-card" style={{ animationDelay: "0.7s" }}>
                <div className="community-card-header mb-3">
                  <span className="community-card-title flex items-center gap-2"><Stethoscope className="w-4 h-4 text-teal-400" />Expert on Prices</span>
                </div>
                <div className="space-y-3">
                  {EXPERT_QA.slice(0, 1).map(qa => (
                    <div key={qa.id} className="community-related-discussion">
                      <div className="flex items-center gap-1 mb-1">
                        <BadgeCheck className="w-3 h-3 text-teal-400" />
                        <span className="text-[10px] font-bold text-teal-400">Verified Expert Insight</span>
                      </div>
                      <p className="community-related-title">{qa.question}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{qa.answer}</p>
                      <button className="community-view-all-btn mt-2" onClick={() => setActiveView("expert")}>See full answer <ArrowRight className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </FloatingBubble>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
