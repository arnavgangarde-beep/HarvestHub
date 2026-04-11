import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Users, MessageCircle, Send, TrendingUp, TrendingDown,
  Heart, ThumbsUp, Bookmark, Share2, Search, Bell,
  ChevronUp, ChevronDown, Plus, Globe, Flame, Leaf,
  Sprout, MapPin, Star, Award, Zap, BarChart2, Filter,
  Hash, AtSign, X, ArrowUp, ArrowRight
} from "lucide-react";

// ========== DATA ==========

const CROP_PRICES = [
  { name: "Wheat", price: 2180, change: 5.2, trend: "up", icon: "🌾", color: "#f59e0b", unit: "₹/qtl" },
  { name: "Rice",  price: 3120, change: 2.8, trend: "up", icon: "🌾", color: "#14b8a6", unit: "₹/qtl" },
  { name: "Tomato", price: 48,  change: -8.1, trend: "down", icon: "🍅", color: "#ef4444", unit: "₹/kg" },
  { name: "Onion",  price: 32,  change: 12.4, trend: "up", icon: "🧅", color: "#f97316", unit: "₹/kg" },
  { name: "Cotton", price: 6800, change: 3.1, trend: "up", icon: "☁️", color: "#8b5cf6", unit: "₹/qtl" },
  { name: "Potato", price: 24,  change: -4.5, trend: "down", icon: "🥔", color: "#6b7280", unit: "₹/kg" },
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
  {
    id: 1,
    avatar: "R",
    avatarColor: "#f59e0b",
    name: "Rajesh Kumar",
    role: "Wheat Farmer · Punjabi",
    handle: "@rajesh_farm",
    tag: "Market",
    tagColor: "#f59e0b",
    title: "Wheat prices likely to rise 5-7% next month — what are your thoughts?",
    body: "Based on the export demand data from APEDA and the current procurement by FCI, I'm predicting wheat prices will see a strong uptick in the coming weeks. Fellow farmers, are you holding your stocks or selling now?",
    time: "2h ago",
    likes: 142,
    comments: 38,
    views: 1240,
    trending: true,
    bookmarked: false,
    liked: false,
  },
  {
    id: 2,
    avatar: "P",
    avatarColor: "#14b8a6",
    name: "Priya Sharma",
    role: "Rice Grower · AP",
    handle: "@priya_paddy",
    tag: "Weather",
    tagColor: "#3b82f6",
    title: "IMD predicts heavy rainfall in AP next week — paddy crop at risk?",
    body: "Got an alert from the district agri office. Unseasonal rains predicted for Godavari belt. Those of you with standing crops — please check your drainage channels. I covered my seedling nursery last night.",
    time: "4h ago",
    likes: 89,
    comments: 52,
    views: 2100,
    trending: true,
    bookmarked: true,
    liked: true,
  },
  {
    id: 3,
    avatar: "M",
    avatarColor: "#8b5cf6",
    name: "Mohan Patel",
    role: "Cotton Farmer · Gujarat",
    handle: "@mohan_kapas",
    tag: "Pests",
    tagColor: "#ef4444",
    title: "Pink bollworm infestation spreading — organic solutions?",
    body: "Had a 30% crop loss last season due to pink bollworm. This year I'm trying neem-based solutions and pheromone traps. Anyone has experience with bio-control agents that actually work at scale?",
    time: "6h ago",
    likes: 203,
    comments: 74,
    views: 3800,
    trending: false,
    bookmarked: false,
    liked: false,
  },
  {
    id: 4,
    avatar: "A",
    avatarColor: "#10b981",
    name: "Ananya Reddy",
    role: "Smart Farmer · Telangana",
    handle: "@ananya_harvest",
    tag: "Tech",
    tagColor: "#14b8a6",
    title: "AI crop monitoring reduced my water usage by 40% — full breakdown",
    body: "Using soil moisture sensors + HarvestHub's AI recommendations, I've cut irrigation costs dramatically. Here's my detailed analysis with data from the last 6 months. DM me for the template.",
    time: "1d ago",
    likes: 412,
    comments: 91,
    views: 6500,
    trending: false,
    bookmarked: false,
    liked: false,
  },
];

const CHAT_MESSAGES = [
  { id: 1, avatar: "R", color: "#f59e0b", name: "Rajesh", text: "Price alert: Wheat hit ₹2180/qtl at Ludhiana mandi! 🌾", time: "11:02 AM", isMe: false },
  { id: 2, avatar: "P", color: "#14b8a6", name: "Priya", text: "Anyone selling high-yield paddy seeds? Need 50 kg for next season.", time: "11:15 AM", isMe: false },
  { id: 3, avatar: "Y", color: "#8b5cf6", name: "You", text: "I have surplus paddy seeds from Sona Masoori variety. DM me!", time: "11:18 AM", isMe: true },
  { id: 4, avatar: "M", color: "#ef4444", name: "Mohan", text: "Quick question — has anyone tried vertical farming for tomatoes?", time: "11:32 AM", isMe: false },
  { id: 5, avatar: "A", color: "#10b981", name: "Ananya", text: "Yes! Great ROI. I'll share my hydroponic setup guide in the community thread.", time: "11:35 AM", isMe: false },
  { id: 6, avatar: "Y", color: "#8b5cf6", name: "You", text: "The onion prices at Nashik mandi are really volatile today 📊", time: "11:41 AM", isMe: true },
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

// ========== MINI CHART ==========
function MiniSparkline({ data, color, trend }: { data: number[]; color: string; trend: "up" | "down" }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  const areaPath = `M${pts.split(" ").map((p, i) => (i === 0 ? `${p}` : `L${p}`)).join(" ")} L${w},${h} L0,${h} Z`;
  const linePath = `M${pts.split(" ").map((p, i) => (i === 0 ? `${p}` : `L${p}`)).join(" ")}`;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${color.replace("#","")})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(6 / 6) * w} cy={h - ((data[data.length - 1] - min) / range) * (h - 4) - 2} r="2.5" fill={color} />
    </svg>
  );
}

// ========== MAIN PRICE BAR CHART ==========
function CropBarChart({ selectedCrop }: { selectedCrop: number }) {
  const data = CHART_DATA[selectedCrop];
  const crop = CROP_PRICES[selectedCrop];
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-24 w-full">
      {data.map((v, i) => {
        const pct = (v / max) * 100;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-1">
            <div
              className="w-full rounded-t-md transition-all duration-700"
              style={{
                height: `${pct}%`,
                background: i === data.length - 1
                  ? `linear-gradient(180deg, ${crop.color}, ${crop.color}80)`
                  : `${crop.color}30`,
                boxShadow: i === data.length - 1 ? `0 0 12px ${crop.color}60` : "none",
              }}
            />
            <span className="text-[9px] text-slate-500">{DAYS[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

// ========== FLOATING BUBBLE ==========
interface BubbleProps { children: React.ReactNode; style?: React.CSSProperties; className?: string }
function FloatingBubble({ children, style, className }: BubbleProps) {
  return (
    <div
      className={`community-bubble ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

// ========== MAIN COMPONENT ==========
export default function CommunityDashboard({ userName = "You" }: { userName?: string }) {
  const [activeView, setActiveView] = useState<"feed" | "chat" | "prices">("feed");
  const [discussions, setDiscussions] = useState(DISCUSSIONS);
  const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(0);
  const [activePriceTab, setActivePriceTab] = useState<"chart"|"table">("chart");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleLike = useCallback((id: number) => {
    setDiscussions(ds => ds.map(d =>
      d.id === id ? { ...d, liked: !d.liked, likes: d.liked ? d.likes - 1 : d.likes + 1 } : d
    ));
  }, []);

  const handleBookmark = useCallback((id: number) => {
    setDiscussions(ds => ds.map(d =>
      d.id === id ? { ...d, bookmarked: !d.bookmarked } : d
    ));
  }, []);

  const sendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    setChatMessages(msgs => [...msgs, {
      id: msgs.length + 1,
      avatar: "Y",
      color: "#8b5cf6",
      name: "You",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    }]);
    setChatInput("");
  }, [chatInput]);

  const filteredDiscussions = discussions.filter(d =>
    !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="community-root">
      {/* ─── Ambient Background Orbs ─── */}
      <div className="community-orb community-orb-1" />
      <div className="community-orb community-orb-2" />
      <div className="community-orb community-orb-3" />

      {/* ─── Header ─── */}
      <div className="community-header">
        <div className="flex items-center gap-3">
          <div className="community-icon-badge">
            <Users className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h1 className="community-title">Farmer Community</h1>
            <p className="community-subtitle">
              <span className="community-live-dot" /> 1,842 farmers online now
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="community-search-wrap">
            <Search className="w-4 h-4 text-slate-400 community-search-icon" />
            <input
              className="community-search-input"
              placeholder="Search discussions…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="community-notify-btn">
            <Bell className="w-4 h-4 text-teal-400" />
            <span className="community-notify-badge">3</span>
          </button>
        </div>
      </div>

      {/* ─── Tab Bar ─── */}
      <div className="community-tabbar">
        {(["feed", "chat", "prices"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveView(tab)}
            className={`community-tab${activeView === tab ? " active" : ""}`}
          >
            {tab === "feed" && <Globe className="w-4 h-4" />}
            {tab === "chat" && <MessageCircle className="w-4 h-4" />}
            {tab === "prices" && <BarChart2 className="w-4 h-4" />}
            <span className="capitalize">{tab === "prices" ? "Crop Prices" : tab}</span>
            {tab === "chat" && <span className="community-tab-badge">6</span>}
          </button>
        ))}
      </div>

      {/* ─── Main Content ─── */}
      <div className="community-content">

        {/* ========== FEED VIEW ========== */}
        {activeView === "feed" && (
          <div className="community-three-col">
            {/* Left: Sidebar */}
            <aside className="community-sidebar">

              {/* Members Online */}
              <FloatingBubble className="community-card" style={{ animationDelay: "0s" }}>
                <div className="community-card-header">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-teal-400" />
                    <span className="community-card-title">Online Farmers</span>
                  </div>
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
                        <p className="community-member-region"><MapPin className="w-2.5 h-2.5" /> {m.region}</p>
                      </div>
                      {m.online && (
                        <button className="community-msg-btn">
                          <MessageCircle className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </FloatingBubble>

              {/* Trending Tags */}
              <FloatingBubble className="community-card" style={{ animationDelay: "0.3s" }}>
                <div className="community-card-header">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="community-card-title">Trending Topics</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {TRENDING_TAGS.map((tag, i) => (
                    <button key={i} className="community-trending-tag">{tag}</button>
                  ))}
                </div>
              </FloatingBubble>

              {/* Quick Price Snapshot */}
              <FloatingBubble className="community-card" style={{ animationDelay: "0.6s" }}>
                <div className="community-card-header">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                    <span className="community-card-title">Today's Prices</span>
                  </div>
                  <button className="community-view-all-btn" onClick={() => setActiveView("prices")}>
                    View all <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2 mt-3">
                  {CROP_PRICES.slice(0, 4).map((c, i) => (
                    <div key={i} className="community-price-row">
                      <span className="text-base">{c.icon}</span>
                      <span className="community-price-name">{c.name}</span>
                      <span className="community-price-val">₹{c.price}</span>
                      <span className={`community-price-change ${c.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                        {c.trend === "up" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {Math.abs(c.change)}%
                      </span>
                    </div>
                  ))}
                </div>
              </FloatingBubble>
            </aside>

            {/* Center: Feed */}
            <main className="community-feed">
              {/* Post Composer */}
              <FloatingBubble className="community-card community-composer" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center gap-3">
                  <div className="community-avatar-lg" style={{ background: "#8b5cf620", border: "1.5px solid #8b5cf650" }}>
                    <span style={{ color: "#8b5cf6" }}>Y</span>
                  </div>
                  <div className="community-composer-input">
                    <span className="text-slate-500">Share crop insights, weather updates, market news…</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  {[{ icon: "📊", label: "Prices" }, { icon: "🌦️", label: "Weather" }, { icon: "🌾", label: "Crop" }, { icon: "🤝", label: "Trade" }].map(a => (
                    <button key={a.label} className="community-compose-action">
                      <span>{a.icon}</span> {a.label}
                    </button>
                  ))}
                </div>
              </FloatingBubble>

              {/* Discussion Cards */}
              {filteredDiscussions.map((d, i) => (
                <FloatingBubble
                  key={d.id}
                  className="community-card community-discussion"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {d.trending && (
                    <div className="community-trending-badge">
                      <Flame className="w-3 h-3" /> Trending
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="community-avatar-lg flex-shrink-0" style={{ background: `${d.avatarColor}20`, border: `1.5px solid ${d.avatarColor}50` }}>
                      <span style={{ color: d.avatarColor }}>{d.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="community-post-name">{d.name}</span>
                        <span className="community-post-handle">{d.handle}</span>
                        <span className="community-post-tag" style={{ color: d.tagColor, borderColor: `${d.tagColor}40`, background: `${d.tagColor}10` }}>
                          <Hash className="w-2.5 h-2.5" />{d.tag}
                        </span>
                        <span className="community-post-time ml-auto">{d.time}</span>
                      </div>
                      <p className="community-post-role">{d.role}</p>
                    </div>
                  </div>
                  <h3 className="community-post-title">{d.title}</h3>
                  <p className="community-post-body">{d.body}</p>
                  <div className="community-post-actions">
                    <button
                      className={`community-action-btn ${d.liked ? "liked" : ""}`}
                      onClick={() => handleLike(d.id)}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{d.likes}</span>
                    </button>
                    <button className="community-action-btn">
                      <MessageCircle className="w-4 h-4" />
                      <span>{d.comments}</span>
                    </button>
                    <button
                      className={`community-action-btn ${d.bookmarked ? "bookmarked" : ""}`}
                      onClick={() => handleBookmark(d.id)}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="community-action-btn ml-auto">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <span className="community-post-views">{d.views.toLocaleString()} views</span>
                  </div>
                </FloatingBubble>
              ))}
            </main>

            {/* Right: Stats */}
            <aside className="community-sidebar">
              {/* Community Stats */}
              <FloatingBubble className="community-card" style={{ animationDelay: "0.2s" }}>
                <div className="community-card-header">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-400" />
                    <span className="community-card-title">Community Stats</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    { label: "Total Members", val: "48.2K", icon: "👨‍🌾", color: "#f59e0b" },
                    { label: "Discussions", val: "12.4K", icon: "💬", color: "#14b8a6" },
                    { label: "Crop Reports", val: "3.8K", icon: "📊", color: "#8b5cf6" },
                    { label: "Deals Made", val: "921", icon: "🤝", color: "#10b981" },
                  ].map(stat => (
                    <div key={stat.label} className="community-stat-card" style={{ borderColor: `${stat.color}25` }}>
                      <span className="community-stat-icon">{stat.icon}</span>
                      <span className="community-stat-val" style={{ color: stat.color }}>{stat.val}</span>
                      <span className="community-stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </FloatingBubble>

              {/* Top Contributors */}
              <FloatingBubble className="community-card" style={{ animationDelay: "0.5s" }}>
                <div className="community-card-header">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-400" />
                    <span className="community-card-title">Top Contributors</span>
                  </div>
                </div>
                <div className="space-y-3 mt-3">
                  {[
                    { name: "Ananya R.", pts: "4,120 pts", avatar: "A", color: "#10b981", badge: "🥇" },
                    { name: "Mohan P.", pts: "3,680 pts", avatar: "M", color: "#8b5cf6", badge: "🥈" },
                    { name: "Rajesh K.", pts: "2,910 pts", avatar: "R", color: "#f59e0b", badge: "🥉" },
                  ].map((c, i) => (
                    <div key={i} className="community-contributor-row">
                      <span className="text-base">{c.badge}</span>
                      <div className="community-avatar" style={{ background: `${c.color}20`, border: `1.5px solid ${c.color}50` }}>
                        <span style={{ color: c.color }}>{c.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <p className="community-member-name">{c.name}</p>
                        <p className="community-member-region">{c.pts}</p>
                      </div>
                      <button className="community-follow-btn">Follow</button>
                    </div>
                  ))}
                </div>
              </FloatingBubble>

              {/* Crop Advisory Banner */}
              <FloatingBubble className="community-advisory-card" style={{ animationDelay: "0.8s" }}>
                <div className="community-advisory-glow" />
                <Sprout className="w-6 h-6 text-teal-400 mb-2" />
                <p className="community-advisory-title">AI Crop Advisory</p>
                <p className="community-advisory-text">
                  Optimum sowing window for Kharif crops opens in <strong className="text-orange-400">12 days</strong>. Check your soil health now.
                </p>
                <button className="community-advisory-btn">
                  Get AI Advice <ArrowRight className="w-3 h-3" />
                </button>
              </FloatingBubble>
            </aside>
          </div>
        )}

        {/* ========== CHAT VIEW ========== */}
        {activeView === "chat" && (
          <div className="community-chat-layout">
            {/* Channel List */}
            <aside className="community-chat-sidebar">
              <div className="community-card-header mb-3">
                <span className="community-card-title flex items-center gap-2">
                  <Hash className="w-4 h-4 text-teal-400" /> Channels
                </span>
              </div>
              {[
                { name: "general", icon: "💬", active: true, unread: 6 },
                { name: "wheat-market", icon: "🌾", active: false, unread: 0 },
                { name: "paddy-growers", icon: "🌱", active: false, unread: 2 },
                { name: "weather-alerts", icon: "🌧️", active: false, unread: 1 },
                { name: "trade-deals", icon: "🤝", active: false, unread: 0 },
                { name: "pest-control", icon: "🐛", active: false, unread: 0 },
              ].map(ch => (
                <button key={ch.name} className={`community-channel${ch.active ? " active" : ""}`}>
                  <span>{ch.icon}</span>
                  <span className="flex-1 text-left">#{ch.name}</span>
                  {ch.unread > 0 && <span className="community-channel-badge">{ch.unread}</span>}
                </button>
              ))}
            </aside>

            {/* Chat Main */}
            <div className="community-chat-main">
              <div className="community-chat-header">
                <Hash className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-white"># general</span>
                <span className="community-subtitle ml-3">1,842 members · Open to all farmers</span>
              </div>

              <div className="community-chat-messages">
                {chatMessages.map((msg, i) => (
                  <div key={msg.id} className={`community-chat-msg${msg.isMe ? " is-me" : ""}`}>
                    {!msg.isMe && (
                      <div className="community-avatar flex-shrink-0" style={{ background: `${msg.color}20`, border: `1.5px solid ${msg.color}50` }}>
                        <span style={{ color: msg.color }}>{msg.avatar}</span>
                      </div>
                    )}
                    <div className={`community-chat-bubble${msg.isMe ? " mine" : ""}`}
                      style={msg.isMe ? {} : { borderColor: `${msg.color}20` }}>
                      {!msg.isMe && <p className="community-chat-sender" style={{ color: msg.color }}>{msg.name}</p>}
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
                <input
                  className="community-chat-input"
                  placeholder="Share crop insights, prices, or ask a question…"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChat()}
                />
                <button className="community-chat-send" onClick={sendChat} disabled={!chatInput.trim()}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Online Members */}
            <aside className="community-chat-members">
              <div className="community-card-header mb-3">
                <span className="community-card-title flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-400" /> Online
                </span>
                <span className="community-online-count">{ONLINE_MEMBERS.filter(m=>m.online).length}</span>
              </div>
              {ONLINE_MEMBERS.map((m, i) => (
                <div key={i} className="community-member-row mb-2">
                  <div className="community-avatar relative" style={{ background: `${m.color}20`, border: `1.5px solid ${m.color}50` }}>
                    <span style={{ color: m.color }}>{m.avatar}</span>
                    {m.online && <span className="community-online-pip" />}
                  </div>
                  <div>
                    <p className="community-member-name">{m.name}</p>
                    <p className="community-member-region">{m.region}</p>
                  </div>
                </div>
              ))}
            </aside>
          </div>
        )}

        {/* ========== PRICES VIEW ========== */}
        {activeView === "prices" && (
          <div className="community-prices-layout">
            {/* Price Cards Grid */}
            <div className="community-prices-grid">
              {CROP_PRICES.map((c, i) => (
                <FloatingBubble
                  key={i}
                  className={`community-price-card${selectedCrop === i ? " selected" : ""}`}
                  style={{ animationDelay: `${i * 0.1}s`, borderColor: selectedCrop === i ? `${c.color}60` : undefined }}
                  onClick={() => setSelectedCrop(i)}
                >
                  <div className="community-price-card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${c.color}15, transparent 70%)` }} />
                  <div className="flex items-start justify-between mb-3">
                    <div className="community-price-icon" style={{ background: `${c.color}15`, borderColor: `${c.color}30` }}>
                      <span className="text-lg">{c.icon}</span>
                    </div>
                    <span className={`community-price-badge ${c.trend === "up" ? "up" : "down"}`}>
                      {c.trend === "up" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {Math.abs(c.change)}%
                    </span>
                  </div>
                  <MiniSparkline data={CHART_DATA[i]} color={c.color} trend={c.trend as "up"|"down"} />
                  <div className="mt-2">
                    <p className="community-price-crop-name">{c.name}</p>
                    <p className="community-price-crop-val" style={{ color: c.color }}>
                      {c.price.toLocaleString()}
                      <span className="community-price-crop-unit">{c.unit}</span>
                    </p>
                  </div>
                </FloatingBubble>
              ))}
            </div>

            {/* Main Chart Panel */}
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
                  <p className="text-3xl font-black" style={{ color: CROP_PRICES[selectedCrop].color }}>
                    ₹{CROP_PRICES[selectedCrop].price.toLocaleString()}
                  </p>
                  <p className="community-subtitle">{CROP_PRICES[selectedCrop].unit}</p>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="community-barchart-wrap">
                <CropBarChart selectedCrop={selectedCrop} />
              </div>

              {/* Market Insights Row */}
              <div className="community-market-insights">
                {[
                  { label: "7-day High", val: `₹${Math.max(...CHART_DATA[selectedCrop]).toLocaleString()}`, color: "#10b981" },
                  { label: "7-day Low",  val: `₹${Math.min(...CHART_DATA[selectedCrop]).toLocaleString()}`, color: "#ef4444" },
                  { label: "Volume",     val: "24,800 qtl", color: "#f59e0b" },
                  { label: "Demand",     val: "High",       color: "#14b8a6" },
                ].map(kpi => (
                  <div key={kpi.label} className="community-market-kpi">
                    <p className="community-market-kpi-label">{kpi.label}</p>
                    <p className="community-market-kpi-val" style={{ color: kpi.color }}>{kpi.val}</p>
                  </div>
                ))}
              </div>

              {/* AI Prediction Banner */}
              <div className="community-ai-prediction">
                <div className="community-ai-glow" />
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-teal-400" />
                  <span className="community-ai-label">AI Price Forecast</span>
                  <span className="community-live-badge">LIVE</span>
                </div>
                <p className="community-ai-text">
                  {CROP_PRICES[selectedCrop].name} prices are predicted to{" "}
                  <strong style={{ color: CROP_PRICES[selectedCrop].trend === "up" ? "#10b981" : "#ef4444" }}>
                    {CROP_PRICES[selectedCrop].trend === "up" ? "rise" : "fall"} by {Math.abs(CROP_PRICES[selectedCrop].change)}%
                  </strong>{" "}
                  over the next 7 days based on export demand, mandi arrivals, and seasonal patterns.
                  <span className="text-teal-400 font-semibold ml-1">85% confidence.</span>
                </p>
              </div>
            </FloatingBubble>

            {/* Right: Mandi Ticker & Related Discussions */}
            <div className="community-prices-right">
              <FloatingBubble className="community-card" style={{ animationDelay: "0.5s" }}>
                <div className="community-card-header mb-3">
                  <span className="community-card-title flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" /> Live Mandi Rates
                  </span>
                  <span className="community-live-badge">LIVE</span>
                </div>
                <div className="space-y-2">
                  {[
                    { mandi: "Ludhiana", crop: "Wheat", price: "₹2,185", dir: "up" },
                    { mandi: "Azadpur", crop: "Tomato", price: "₹46/kg", dir: "down" },
                    { mandi: "Nashik", crop: "Onion", price: "₹33/kg", dir: "up" },
                    { mandi: "Rajkot", crop: "Cotton", price: "₹6,820", dir: "up" },
                    { mandi: "Agra", crop: "Potato", price: "₹23/kg", dir: "down" },
                  ].map((m, i) => (
                    <div key={i} className="community-mandi-row">
                      <div>
                        <p className="community-member-name">{m.mandi}</p>
                        <p className="community-member-region">{m.crop}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white text-sm">{m.price}</span>
                        {m.dir === "up"
                          ? <ArrowUp className="w-3 h-3 text-emerald-400" />
                          : <ChevronDown className="w-3 h-3 text-red-400" />
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </FloatingBubble>

              <FloatingBubble className="community-card" style={{ animationDelay: "0.7s" }}>
                <div className="community-card-header mb-3">
                  <span className="community-card-title flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-teal-400" /> Related Discussions
                  </span>
                </div>
                <div className="space-y-3">
                  {discussions.slice(0, 2).map(d => (
                    <div key={d.id} className="community-related-discussion">
                      <span className="community-post-tag" style={{ color: d.tagColor, borderColor: `${d.tagColor}40`, background: `${d.tagColor}10` }}>
                        <Hash className="w-2.5 h-2.5" />{d.tag}
                      </span>
                      <p className="community-related-title">{d.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="community-post-time flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> {d.likes}
                        </span>
                        <span className="community-post-time flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> {d.comments}
                        </span>
                      </div>
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
