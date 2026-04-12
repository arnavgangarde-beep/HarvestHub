import React, { useState, useEffect, useCallback } from "react";
import {
  Package, AlertTriangle, Zap, Clock, Tag, Users, ChevronDown,
  ChevronUp, X, Bell, Flame, TrendingDown, ArrowRight, Percent,
  CheckCircle2, Eye, Send, MapPin, ShoppingBag, RefreshCw
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

interface InventoryItem {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  expiresInDays?: number;    // perishable items have this
  unit: string;
  isPerishable: boolean;
}

interface FlashSale {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  originalPrice: number;
  discountPct: number;
  quantity: number;
  unit: string;
  expiresInDays: number;
  location: string;
  createdAt: number;          // timestamp ms
  durationHours: number;      // flash window
  interestedBuyers: number;
  status: "active" | "sold" | "expired";
}

interface ZeroGInventoryProps {
  products: Array<{
    id: string;
    title: string;
    category: string;
    price: number;
    stock: number;
    image: string;
  }>;
}

// ─────────────────────────────────────────────────────────
// MOCK PERISHABLE DATA (augments real products)
// ─────────────────────────────────────────────────────────

const PERISHABLE_META: Record<string, { expiresInDays: number; unit: string; isPerishable: boolean }> = {
  default: { expiresInDays: 30, unit: "kg", isPerishable: false },
};

const EXTRA_PERISHABLES: InventoryItem[] = [
  { id: "p-t1", title: "Fresh Tomatoes", category: "Vegetables", price: 48, stock: 420, image: "https://images.unsplash.com/photo-1546470427-e26264be0b11?w=80&q=80", expiresInDays: 2, unit: "kg", isPerishable: true },
  { id: "p-t2", title: "Spinach Leaves", category: "Vegetables", price: 35, stock: 180, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=80&q=80", expiresInDays: 3, unit: "kg", isPerishable: true },
  { id: "p-t3", title: "Green Mangoes", category: "Fruits", price: 65, stock: 600, image: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=80&q=80", expiresInDays: 5, unit: "kg", isPerishable: true },
  { id: "p-t4", title: "Baby Potatoes", category: "Vegetables", price: 28, stock: 800, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&q=80", expiresInDays: 8, unit: "kg", isPerishable: true },
  { id: "p-t5", title: "Coriander Bunch", category: "Herbs", price: 12, stock: 240, image: "https://images.unsplash.com/photo-1594282420370-5e9e3d0d56eb?w=80&q=80", expiresInDays: 1, unit: "bunch", isPerishable: true },
];

const DEMO_FLASH_SALES: FlashSale[] = [
  {
    id: "zg-1", itemId: "p-t1", itemTitle: "Fresh Tomatoes", itemImage: EXTRA_PERISHABLES[0].image,
    originalPrice: 48, discountPct: 35, quantity: 420, unit: "kg", expiresInDays: 2,
    location: "Nashik, Maharashtra", createdAt: Date.now() - 3_600_000, durationHours: 4,
    interestedBuyers: 12, status: "active"
  },
  {
    id: "zg-2", itemId: "p-t5", itemTitle: "Coriander Bunch", itemImage: EXTRA_PERISHABLES[4].image,
    originalPrice: 12, discountPct: 50, quantity: 240, unit: "bunch", expiresInDays: 1,
    location: "Pune, Maharashtra", createdAt: Date.now() - 7_200_000, durationHours: 3,
    interestedBuyers: 8, status: "active"
  },
];

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

function urgencyColor(days: number) {
  if (days <= 1) return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/25", bar: "bg-red-500", label: "Critical", glow: "rgba(239,68,68,0.4)" };
  if (days <= 3) return { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/25", bar: "bg-orange-500", label: "High Alert", glow: "rgba(249,115,22,0.3)" };
  if (days <= 7) return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/25", bar: "bg-yellow-500", label: "Warning", glow: "rgba(234,179,8,0.2)" };
  return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25", bar: "bg-emerald-500", label: "Safe", glow: "transparent" };
}

function CountdownTimer({ createdAt, durationHours }: { createdAt: number; durationHours: number }) {
  const endMs = createdAt + durationHours * 3_600_000;
  const [remaining, setRemaining] = useState(Math.max(0, endMs - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  const pct = Math.max(0, (remaining / (durationHours * 3_600_000)) * 100);

  return (
    <div className="zerog-countdown">
      <div className="zerog-countdown-bar" style={{ width: `${pct}%` }} />
      <span className="zerog-countdown-text">
        <Clock className="w-3 h-3" />
        {h > 0 ? `${h}h ` : ""}{String(m).padStart(2, "0")}m {String(s).padStart(2, "0")}s left
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// TRIGGER MODAL
// ─────────────────────────────────────────────────────────

function TriggerFlashModal({
  item,
  onClose,
  onLaunch,
}: {
  item: InventoryItem;
  onClose: () => void;
  onLaunch: (sale: FlashSale) => void;
}) {
  const [discount, setDiscount] = useState(30);
  const [quantity, setQuantity] = useState(Math.min(item.stock, 100));
  const [duration, setDuration] = useState(4);
  const [location, setLocation] = useState("Nashik, Maharashtra");
  const [launched, setLaunched] = useState(false);

  const discountedPrice = +(item.price * (1 - discount / 100)).toFixed(2);
  const urgency = urgencyColor(item.expiresInDays ?? 5);

  const handleLaunch = () => {
    setLaunched(true);
    setTimeout(() => {
      const sale: FlashSale = {
        id: `zg-${Date.now()}`,
        itemId: item.id,
        itemTitle: item.title,
        itemImage: item.image,
        originalPrice: item.price,
        discountPct: discount,
        quantity,
        unit: item.unit,
        expiresInDays: item.expiresInDays ?? 5,
        location,
        createdAt: Date.now(),
        durationHours: duration,
        interestedBuyers: Math.floor(Math.random() * 8) + 3,
        status: "active",
      };
      onLaunch(sale);
    }, 1800);
  };

  return (
    <div className="zerog-modal-backdrop" onClick={onClose}>
      <div className="zerog-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="zerog-modal-header">
          <div className="zerog-modal-icon"><Zap className="w-5 h-5 text-orange-400" /></div>
          <div>
            <h2 className="text-base font-bold text-white">Trigger Zero-G Flash Sale</h2>
            <p className="text-xs text-slate-400">Alert nearby buyers before stock expires</p>
          </div>
          <button className="ml-auto text-slate-500 hover:text-white" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        {/* Item preview */}
        <div className={`zerog-modal-item-preview ${urgency.bg} ${urgency.border} border rounded-xl`}>
          <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-slate-700" />
          <div className="flex-1">
            <p className="font-bold text-white text-sm">{item.title}</p>
            <p className="text-xs text-slate-400">{item.stock} {item.unit} available · <span className={`font-bold ${urgency.text}`}>{item.expiresInDays} day{(item.expiresInDays ?? 1) !== 1 ? "s" : ""} until expiry</span></p>
          </div>
          <span className={`zerog-urgency-badge ${urgency.bg} ${urgency.border} border ${urgency.text}`}>{urgency.label}</span>
        </div>

        {/* Controls */}
        <div className="zerog-modal-controls">
          {/* Discount slider */}
          <div className="zerog-control-group">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Discount</label>
              <div className="flex items-center gap-2">
                <span className="zerog-discount-badge">{discount}% OFF</span>
                <span className="text-xs text-slate-500 line-through">₹{item.price}/{item.unit}</span>
                <span className="text-sm font-black text-orange-400">₹{discountedPrice}/{item.unit}</span>
              </div>
            </div>
            <input
              type="range" min="10" max="70" value={discount} step="5"
              onChange={e => setDiscount(+e.target.value)}
              className="zerog-slider"
            />
            <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>10%</span><span>40%</span><span>70%</span></div>
          </div>

          {/* Quantity */}
          <div className="zerog-control-group">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">Quantity to Flash</label>
            <div className="flex items-center gap-3">
              <input
                type="number" min="1" max={item.stock} value={quantity}
                onChange={e => setQuantity(Math.min(item.stock, Math.max(1, +e.target.value)))}
                className="zerog-number-input"
              />
              <span className="text-slate-400 text-sm">{item.unit}</span>
              <span className="text-xs text-slate-500">of {item.stock} {item.unit} total</span>
            </div>
          </div>

          {/* Duration */}
          <div className="zerog-control-group">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">Sale Window</label>
            <div className="flex gap-2">
              {[2, 4, 6, 12, 24].map(h => (
                <button
                  key={h}
                  onClick={() => setDuration(h)}
                  className={`zerog-duration-btn ${duration === h ? "active" : ""}`}
                >{h}h</button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="zerog-control-group">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">Your Location (for buyer matching)</label>
            <div className="flex items-center gap-2 zerog-location-input">
              <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white outline-none"
                placeholder="City, State"
              />
            </div>
          </div>

          {/* Buyers estimate */}
          <div className="zerog-buyers-estimate">
            <Users className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-slate-300">Estimated <strong className="text-white">24–38 buyers</strong> within 50 km will be notified</span>
          </div>
        </div>

        {/* Launch button */}
        <button className={`zerog-launch-btn ${launched ? "launched" : ""}`} onClick={handleLaunch} disabled={launched}>
          {launched ? (
            <><CheckCircle2 className="w-5 h-5" />Zero-G Alert Launched! Notifying buyers…</>
          ) : (
            <><Zap className="w-5 h-5" />Launch Zero-G Flash Sale</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// FLASH SALE CARD
// ─────────────────────────────────────────────────────────

function FlashSaleCard({ sale, onClaim }: { sale: FlashSale; onClaim: (id: string) => void }) {
  const [interested, setInterested] = useState(sale.interestedBuyers);
  const urgency = urgencyColor(sale.expiresInDays);
  const discounted = +(sale.originalPrice * (1 - sale.discountPct / 100)).toFixed(2);

  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.7) setInterested(v => v + 1);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="zerog-flash-card" style={{ boxShadow: `0 0 24px ${urgency.glow}, 0 4px 16px rgba(0,0,0,0.3)` }}>
      {/* Urgency pulse ring */}
      {sale.expiresInDays <= 2 && <div className="zerog-pulse-ring" />}

      <div className="zerog-flash-card-inner">
        {/* Image + badge */}
        <div className="relative flex-shrink-0">
          <img src={sale.itemImage} alt={sale.itemTitle} className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
          <div className={`zerog-discount-pill`}>-{sale.discountPct}%</div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-white text-sm leading-tight">{sale.itemTitle}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{sale.location}</p>
            </div>
            <span className={`zerog-urgency-badge ${urgency.bg} ${urgency.border} border ${urgency.text} flex-shrink-0`}>
              {sale.expiresInDays}d left
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-lg font-black text-orange-400">₹{discounted}/{sale.unit}</span>
            <span className="text-xs text-slate-500 line-through">₹{sale.originalPrice}</span>
            <span className="text-xs text-slate-400">{sale.quantity} {sale.unit} available</span>
          </div>

          {/* Countdown + buyers */}
          <div className="mt-2 space-y-1.5">
            <CountdownTimer createdAt={sale.createdAt} durationHours={sale.durationHours} />
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Eye className="w-3 h-3 text-teal-400" />
                <span className="text-teal-400 font-bold">{interested}</span> buyers interested
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Nearby bulk buyers notified</span>
            </div>
          </div>
        </div>

        {/* Claim / Contact CTA */}
        <button
          className="zerog-claim-btn flex-shrink-0"
          onClick={() => onClaim(sale.id)}
        >
          <Send className="w-4 h-4" />
          Contact
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────

export default function ZeroGInventory({ products }: ZeroGInventoryProps) {
  const [activeView, setActiveView] = useState<"inventory" | "board">("inventory");
  const [flashSales, setFlashSales] = useState<FlashSale[]>(DEMO_FLASH_SALES);
  const [triggerItem, setTriggerItem] = useState<InventoryItem | null>(null);
  const [notifPulse, setNotifPulse] = useState(false);

  // Merge real products + extra perishables
  const allItems: InventoryItem[] = [
    ...products.map(p => ({
      ...p,
      expiresInDays: undefined,
      unit: "kg",
      isPerishable: ["Vegetables", "Fruits", "Herbs"].includes(p.category),
    })),
    ...EXTRA_PERISHABLES,
  ];

  const perishableItems = allItems.filter(i => i.isPerishable || (i.expiresInDays ?? 99) <= 14);
  const activeSales = flashSales.filter(s => s.status === "active");

  const handleLaunch = useCallback((sale: FlashSale) => {
    setFlashSales(prev => [sale, ...prev]);
    setTriggerItem(null);
    setActiveView("board");
    setNotifPulse(true);
    setTimeout(() => setNotifPulse(false), 4000);
  }, []);

  const handleClaim = useCallback((id: string) => {
    alert("Connecting you with the seller… (In production, this opens a chat or sends a contact request)");
  }, []);

  return (
    <div className="zerog-root">
      {/* ── Tab Header ── */}
      <div className="zerog-header">
        <div className="flex items-center gap-3">
          <div className="zerog-header-icon"><Package className="w-5 h-5 text-orange-400" /></div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Inventory</h1>
            <p className="text-xs text-slate-400">Track stock · Trigger Zero-G Flash Sales</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab pills */}
          <div className="zerog-tab-group">
            <button onClick={() => setActiveView("inventory")} className={`zerog-tab-pill ${activeView === "inventory" ? "active" : ""}`}>
              <Package className="w-3.5 h-3.5" /> Stock Table
            </button>
            <button onClick={() => setActiveView("board")} className={`zerog-tab-pill ${activeView === "board" ? "active" : ""} relative`}>
              <Flame className="w-3.5 h-3.5" /> Zero-G Board
              {activeSales.length > 0 && (
                <span className={`zerog-board-badge ${notifPulse ? "pulse" : ""}`}>{activeSales.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── INVENTORY TABLE VIEW ── */}
      {activeView === "inventory" && (
        <div className="space-y-5">
          {/* Perishable Alert Strip */}
          {perishableItems.filter(i => (i.expiresInDays ?? 99) <= 5).length > 0 && (
            <div className="zerog-alert-strip">
              <div className="zerog-alert-strip-glow" />
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 animate-pulse" />
              <p className="text-sm text-red-300 font-semibold">
                <strong>{perishableItems.filter(i => (i.expiresInDays ?? 99) <= 5).length} perishable items</strong> expire within 5 days.
                Trigger a Zero-G Flash Sale to clear stock before loss.
              </p>
              <button className="zerog-strip-btn" onClick={() => setActiveView("board")}>
                View Board <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Main Inventory Table */}
          <div className="zerog-table-card">
            <div className="zerog-table-header">
              <h2 className="text-base font-bold text-white">Stock Overview</h2>
              <span className="text-xs text-slate-500">{allItems.length} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="zerog-thead">
                  <tr>
                    <th className="zerog-th">Product</th>
                    <th className="zerog-th">Category</th>
                    <th className="zerog-th">Price</th>
                    <th className="zerog-th">Stock</th>
                    <th className="zerog-th">Expiry</th>
                    <th className="zerog-th text-right">Status / Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allItems.map(item => {
                    const days = item.expiresInDays;
                    const urgency = days !== undefined ? urgencyColor(days) : null;
                    const hasActiveSale = flashSales.some(s => s.itemId === item.id && s.status === "active");

                    return (
                      <tr key={item.id} className="zerog-tbody-row">
                        <td className="zerog-td">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-slate-700/50" />
                              {item.isPerishable && <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-[#0f172a]" title="Perishable" />}
                            </div>
                            <span className="font-semibold text-white">{item.title}</span>
                          </div>
                        </td>
                        <td className="zerog-td">
                          <span className="zerog-category-badge">{item.category}</span>
                        </td>
                        <td className="zerog-td font-medium text-white">₹{item.price.toLocaleString()}/{item.unit}</td>
                        <td className="zerog-td">
                          <div className="flex items-center gap-2">
                            <div className="zerog-stock-bar-wrap">
                              <div
                                className="zerog-stock-bar"
                                style={{ width: `${Math.min(100, (item.stock / 1000) * 100)}%`, background: item.stock < 50 ? "#ef4444" : item.stock < 200 ? "#f59e0b" : "#10b981" }}
                              />
                            </div>
                            <span className="text-white font-bold text-xs">{item.stock}</span>
                          </div>
                        </td>
                        <td className="zerog-td">
                          {days !== undefined ? (
                            <span className={`zerog-expiry-chip ${urgency?.bg} ${urgency?.border} border ${urgency?.text}`}>
                              <Clock className="w-3 h-3" />{days}d
                            </span>
                          ) : (
                            <span className="text-xs text-slate-600">—</span>
                          )}
                        </td>
                        <td className="zerog-td text-right">
                          {hasActiveSale ? (
                            <span className="zerog-active-sale-badge">
                              <Zap className="w-3 h-3 animate-pulse" /> LIVE SALE
                            </span>
                          ) : item.isPerishable && (days ?? 99) <= 7 ? (
                            <button
                              className="zerog-trigger-btn"
                              onClick={() => setTriggerItem(item)}
                            >
                              <Zap className="w-3.5 h-3.5" /> Zero-G Alert
                            </button>
                          ) : item.stock > 10 ? (
                            <span className="zerog-status in-stock">In Stock</span>
                          ) : item.stock > 0 ? (
                            <span className="zerog-status low-stock">Low Stock</span>
                          ) : (
                            <span className="zerog-status out-stock">Out of Stock</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Perishable urgency cards at bottom */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white">Perishable Watch</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {perishableItems.map(item => {
                const days = item.expiresInDays ?? 14;
                const u = urgencyColor(days);
                const hasActiveSale = flashSales.some(s => s.itemId === item.id && s.status === "active");
                return (
                  <div key={item.id} className={`zerog-perishable-card ${u.bg} border ${u.border}`}
                    style={{ boxShadow: days <= 2 ? `0 0 20px ${u.glow}` : "none" }}>
                    <div className="flex items-start justify-between mb-2">
                      <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                      <span className={`zerog-urgency-badge ${u.bg} ${u.border} border ${u.text} text-[10px]`}>{u.label}</span>
                    </div>
                    <p className="text-white font-bold text-xs leading-tight mb-1">{item.title}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-black ${u.text}`}>{days}d left</span>
                      <span className="text-xs text-slate-500">{item.stock} {item.unit}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full ${u.bar} transition-all`} style={{ width: `${Math.min(100, (days / 14) * 100)}%` }} />
                    </div>
                    {hasActiveSale ? (
                      <div className="zerog-active-sale-badge w-full justify-center text-[10px]">
                        <Zap className="w-3 h-3 animate-pulse" /> Flash Sale LIVE
                      </div>
                    ) : (
                      <button className="zerog-trigger-btn w-full justify-center text-[10px] py-1.5" onClick={() => setTriggerItem(item)}>
                        <Zap className="w-3 h-3" /> Zero-G Alert
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── ZERO-G FLASH BOARD ── */}
      {activeView === "board" && (
        <div className="space-y-5">
          {/* Board Header */}
          <div className="zerog-board-header">
            <div className="zerog-board-header-glow" />
            <div className="flex items-center gap-3">
              <div className="zerog-board-icon">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Emergency Flash Sale Board</h2>
                <p className="text-xs text-slate-400">Live Zero-G alerts visible to nearby sellers &amp; bulk buyers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1.5 text-xs text-teal-400">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                {activeSales.length} active alerts
              </div>
              <button
                className="zerog-new-sale-btn"
                onClick={() => setActiveView("inventory")}
              >
                <Zap className="w-3.5 h-3.5" /> New Alert
              </button>
            </div>
          </div>

          {/* How it works strip */}
          <div className="zerog-howto-strip">
            {[
              { step: "1", icon: <AlertTriangle className="w-4 h-4 text-red-400" />, text: "Seller triggers Zero-G alert on expiring stock" },
              { step: "2", icon: <Bell className="w-4 h-4 text-orange-400" />, text: "Nearby buyers & sellers get instant push notification" },
              { step: "3", icon: <ShoppingBag className="w-4 h-4 text-teal-400" />, text: "Stock cleared at discounted rate — zero loss" },
            ].map((s, i) => (
              <React.Fragment key={s.step}>
                <div className="zerog-howto-step">
                  <div className="zerog-howto-icon">{s.icon}</div>
                  <p className="text-xs text-slate-400">{s.text}</p>
                </div>
                {i < 2 && <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>

          {/* Active flash sales */}
          {activeSales.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" /> Live Flash Sales
              </h3>
              {activeSales.map(sale => (
                <FlashSaleCard key={sale.id} sale={sale} onClaim={handleClaim} />
              ))}
            </div>
          ) : (
            <div className="zerog-empty-board">
              <Zap className="w-10 h-10 text-slate-700 mb-3" />
              <p className="text-slate-400 font-semibold">No active flash sales right now</p>
              <p className="text-slate-500 text-sm mt-1">Go to Inventory → click "Zero-G Alert" on any perishable item</p>
              <button className="zerog-trigger-btn mt-4" onClick={() => setActiveView("inventory")}>
                <Package className="w-4 h-4" /> Go to Inventory
              </button>
            </div>
          )}

          {/* Suggestions: items that should be flashed */}
          <div>
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-red-400" /> Suggested for Flash Sale
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {perishableItems
                .filter(i => (i.expiresInDays ?? 99) <= 5 && !flashSales.some(s => s.itemId === i.id && s.status === "active"))
                .map(item => {
                  const u = urgencyColor(item.expiresInDays ?? 5);
                  return (
                    <div key={item.id} className={`zerog-suggestion-card ${u.bg} border ${u.border}`}>
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm">{item.title}</p>
                        <p className={`text-xs font-bold ${u.text}`}>{item.expiresInDays}d until expiry · {item.stock} {item.unit}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Estimated loss: <strong className="text-red-400">₹{(item.price * item.stock * 0.8).toLocaleString()}</strong> if unsold</p>
                      </div>
                      <button className="zerog-trigger-btn flex-shrink-0" onClick={() => { setTriggerItem(item); }}>
                        <Zap className="w-3.5 h-3.5" /> Alert
                      </button>
                    </div>
                  );
                })}
              {perishableItems.filter(i => (i.expiresInDays ?? 99) <= 5 && !flashSales.some(s => s.itemId === i.id && s.status === "active")).length === 0 && (
                <p className="text-slate-500 text-sm col-span-3">All urgent items already have active flash sales. 🎉</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TRIGGER MODAL ── */}
      {triggerItem && (
        <TriggerFlashModal
          item={triggerItem}
          onClose={() => setTriggerItem(null)}
          onLaunch={handleLaunch}
        />
      )}
    </div>
  );
}
