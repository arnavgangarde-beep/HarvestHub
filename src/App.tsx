import React, { useState, useEffect, type ChangeEvent } from "react";
import {
  LayoutDashboard,
  Search,
  ShoppingCart,
  User,
  Store,
  Plus,
  Package,
  LogOut,
  Menu,
  X,
  Filter,
  Tag,
  Sprout,
  MessageSquare,
  MapPin,
  MessageCircle,
  ChevronRight,
  Send,
  IndianRupee,
  TrendingUp,
  Mail,
  Key,
  Eye,
  EyeOff,
  Circle,
  CheckCircle2,
  ShoppingBag,
  Settings,
  Languages,
  Moon,
  Sun,
  CloudSun,
  ClipboardList,
  Users,
  ChevronDown,
  Upload,
  Thermometer,
  Droplets,
  CloudRain,
  Waves,
  Locate,
  Leaf,
  Target,
  Wind,
  Cloud,
  Scissors,
  Tractor,
  Bug,
  Camera,
  AlertTriangle,
  Shield,
  Calendar,
  Stethoscope
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User as UserType, Product, CartItem } from "./types";
import ReactMarkdown from "react-markdown";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

function LanguageToggle() {
  const toggleTranslate = () => {
    document.getElementById('google_translate_element')?.classList.toggle('show');
  };
  return (
    <button onClick={toggleTranslate} className="p-2 text-slate-400 hover:text-white transition-colors" title="Translate Page">
      <Languages className="w-5 h-5" />
    </button>
  );
}

function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    setIsLight(document.body.classList.contains('theme-light'));
  }, []);
  const toggleTheme = () => {
    document.body.classList.toggle('theme-light');
    setIsLight(!isLight);
  };
  return (
    <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white transition-colors" title="Toggle Theme">
      {isLight ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

const MarkdownComponents = {
  h1: ({ ...props }) => <h1 className="text-xl font-bold mb-2 text-white" {...props} />,
  h2: ({ ...props }) => <h2 className="text-lg font-bold mb-2 text-white" {...props} />,
  h3: ({ ...props }) => <h3 className="text-md font-bold mb-1 text-white" {...props} />,
  p: ({ ...props }) => <p className="mb-3 text-slate-300 leading-relaxed" {...props} />,
  ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-slate-300" {...props} />,
  ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-slate-300" {...props} />,
  li: ({ ...props }) => <li className="" {...props} />,
  a: ({ ...props }) => <a className="text-[#F59E0B] hover:underline font-medium" {...props} />,
  strong: ({ ...props }) => <strong className="font-semibold text-white" {...props} />,
};

function NearbyStoresModal({ onClose }: { onClose: () => void }) {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ text: string; places: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/stores/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, query })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111827] border border-slate-800/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-800/50 flex justify-between items-center bg-[#0F172A]">
          <div className="flex items-center gap-3 text-[#F59E0B]">
            <MapPin className="w-5 h-5" />
            <h3 className="font-bold text-lg text-white">Find Nearby Suppliers</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800/50 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Your Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Fresno, CA or 93721"
                  className="w-full px-4 py-3 bg-[#0F172A] border border-slate-800/50 rounded-xl focus:ring-1 focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Looking For (Optional)</label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Organic Fertilizer, Tractor Parts"
                  className="w-full px-4 py-3 bg-[#0F172A] border border-slate-800/50 rounded-xl focus:ring-1 focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none text-white placeholder:text-slate-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#F59E0B] text-[#111827] rounded-xl font-bold hover:bg-[#D97706] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#111827]/30 border-t-[#111827] rounded-full animate-spin" />
                    Searching Maps...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Find Stores
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800/50">
                <ReactMarkdown components={MarkdownComponents}>{result.text}</ReactMarkdown>
              </div>

              {result.places && result.places.length > 0 && (
                <div className="grid gap-4">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F59E0B]" />
                    Locations Found
                  </h4>
                  {result.places.map((chunk: any, i: number) => {
                    if (!chunk.web?.uri) return null;
                    return (
                      <a
                        key={i}
                        href={chunk.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-5 border border-slate-800/50 rounded-xl hover:bg-[#0F172A] hover:border-slate-700 transition-all group bg-[#111827]"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-bold text-white group-hover:text-[#F59E0B] transition-colors text-lg">
                              {chunk.web.title}
                            </h5>
                            <p className="text-sm text-slate-400 mt-1 truncate max-w-md">{chunk.web.uri}</p>
                          </div>
                          <div className="p-2.5 bg-[#0F172A] rounded-xl group-hover:bg-[#F59E0B]/10 transition-colors">
                            <MapPin className="w-5 h-5 text-slate-500 group-hover:text-[#F59E0B]" />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}

              <button
                onClick={() => setResult(null)}
                className="w-full py-3.5 border border-slate-800/50 text-slate-300 rounded-xl hover:bg-[#0F172A] hover:text-white font-medium transition-colors"
              >
                Search Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AskAgronomistModal({ onClose }: { onClose: () => void }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (e) {
      setAnswer("Sorry, I couldn't get an answer right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111827] border border-slate-800/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-800/50 flex justify-between items-center bg-[#0F172A]">
          <div className="flex items-center gap-3 text-[#F59E0B]">
            <Sprout className="w-5 h-5" />
            <h3 className="font-bold text-lg text-white">Ask the Agronomist</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800/50 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {answer ? (
            <div className="space-y-5">
              <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800/50">
                <p className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">You Asked</p>
                <p className="text-white">{question}</p>
              </div>
              <div className="mt-4">
                <p className="font-bold text-xs text-[#F59E0B] uppercase tracking-wider mb-3">Agronomist Answer</p>
                <div className="text-slate-300">
                  <ReactMarkdown components={MarkdownComponents}>{answer}</ReactMarkdown>
                </div>
              </div>
              <button
                onClick={() => { setAnswer(""); setQuestion(""); }}
                className="w-full py-3.5 border border-slate-800/50 text-slate-300 rounded-xl hover:bg-[#0F172A] hover:text-white font-medium transition-colors mt-6"
              >
                Ask Another Question
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                What's on your mind?
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="E.g., How do I treat aphids on my tomato plants?"
                className="w-full px-4 py-3 bg-[#0F172A] border border-slate-800/50 rounded-xl focus:ring-1 focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none text-white placeholder:text-slate-500 min-h-[120px] mb-4 resize-none"
                required
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="w-full py-3.5 bg-[#F59E0B] text-[#111827] rounded-xl font-bold hover:bg-[#D97706] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#111827]/30 border-t-[#111827] rounded-full animate-spin" />
                    Consulting AI...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    Get Advice
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Navbar({
  user,
  cartCount,
  onLogout,
  onCartClick,
  onSearch,
  onAskAgronomist,
  onFindStores
}: {
  user: UserType | null,
  cartCount: number,
  onLogout: () => void,
  onCartClick: () => void,
  onSearch: (q: string) => void,
  onAskAgronomist: () => void,
  onFindStores: () => void
}) {
  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/harvesthub-logo.png" alt="HarvestHub" className="h-8" />
          </div>

          {/* Search Bar (Consumer Only) */}
          {user?.role !== "seller" && (
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-800 rounded-xl leading-5 bg-[#111827] text-slate-300 placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Search for seeds, fertilizers, equipment..."
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={onFindStores}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#111827] text-slate-300 border border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-800/50 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Find Stores
                </button>

                <button
                  onClick={onAskAgronomist}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-xl text-sm font-medium hover:bg-[#F59E0B]/20 transition-colors"
                >
                  <Sprout className="w-4 h-4" />
                  Ask AI
                </button>

                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {user.role === "seller" ? user.storeName : `Hello, ${user.name}`}
                  </span>
                </div>

                {user.role === "consumer" && (
                  <button
                    onClick={onCartClick}
                    className="relative p-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-[#111827] transform translate-x-1/4 -translate-y-1/4 bg-[#F59E0B] rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-300 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <span className="text-sm text-slate-400">Guest</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

const ProductCard: React.FC<{ product: Product; onAddToCart?: (p: Product) => void }> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-[#111827] rounded-2xl border border-slate-800/50 overflow-hidden hover:border-slate-700 transition-all group flex flex-col h-full">
      <div className="aspect-[4/3] relative overflow-hidden p-3">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-5 left-5 bg-white text-[#111827] px-3 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm">
          {product.category || "Uncategorized"}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-white text-lg mb-1 line-clamp-2 leading-tight">{product.title || "Unnamed Product"}</h3>
        {product.sellerName && (
          <p className="text-sm text-slate-400 mb-3 flex items-center gap-1.5 font-medium">
            <User className="w-4 h-4 text-slate-500" />
            Sold by {product.sellerName}
          </p>
        )}

        <div className="mt-auto">
          <div className="bg-[#0F172A] rounded-xl p-4 mb-4 border border-slate-800/50">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#F59E0B] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Prices starting from
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">
                  ₹{typeof product.price === 'number' ? product.price.toFixed(0) : "0"}
                </span>
                <span className="text-slate-400 text-sm">/kg</span>
              </div>
            </div>
          </div>

          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-3 bg-[#B45309] text-white rounded-xl font-medium hover:bg-[#92400E] transition-colors flex items-center justify-center gap-2 group-hover:bg-[#F59E0B] group-hover:text-[#111827]"
            >
              <ShoppingBag className="w-4 h-4" />
              Buy Now
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { auth, db, googleProvider } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

function AuthScreen({ onLogin }: { onLogin: (user: UserType) => void }) {
  const [showLanding, setShowLanding] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [isFarmer, setIsFarmer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Rely exclusively on App.tsx's onAuthStateChanged
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const userSnap = await getDoc(doc(db, "users", result.user.uid));
        if (userSnap.exists()) {
          onLogin(userSnap.data() as UserType);
        } else {
          // Fallback if user doc is missing
          onLogin({
            id: result.user.uid,
            name: result.user.displayName || "User",
            email: result.user.email || "",
            role: "consumer"
          });
        }
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const userData: UserType = {
          id: result.user.uid,
          name: displayName,
          email: email,
          role: isFarmer ? "seller" : "consumer",
        };
        await setDoc(doc(db, "users", result.user.uid), userData);
        onLogin(userData);
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      sessionStorage.setItem("isFarmerPending", isFarmer ? "true" : "false");
      await signInWithRedirect(auth, googleProvider);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Google Sign-in redirect failed");
      setLoading(false);
    }
  };

  if (showLanding) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 font-sans text-slate-200 overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/background-video.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#020617]/50 z-10"></div>

        {/* Foreground Content */}
        <div className="relative z-20 flex flex-col items-center w-full max-w-2xl">
          <div className="flex items-center justify-center mb-6">
            <img src="/harvesthub-logo.png" alt="HarvestHub" className="h-24 md:h-28 drop-shadow-lg opacity-80" />
          </div>
          <p className="text-xl text-slate-300/50 mb-8 max-w-lg text-center font-medium drop-shadow-md">
            Your all-in-one platform for modern farming.
          </p>
          <p className="text-md text-slate-300/50 mb-12 max-w-2xl text-center leading-relaxed drop-shadow-md">
            Get AI-powered crop insights, connect with a community of farmers, and trade<br />on our exclusive marketplace.
          </p>
          <div className="flex flex-col items-center w-full max-w-sm gap-4">
            <div className="flex gap-4 items-center w-full">
              <button
                onClick={() => {
                  setIsLogin(false);
                  setShowLanding(false);
                }}
                className="flex-1 px-8 py-3 bg-[#F59E0B] text-[#020617] font-bold rounded-lg hover:bg-[#D97706] transition-colors shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => {
                  setIsLogin(true);
                  setShowLanding(false);
                }}
                className="flex-1 px-8 py-3 border border-slate-400 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/20 transition-colors shadow-lg"
              >
                Log In
              </button>
            </div>


          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 font-sans text-slate-200 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/background-video.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#020617]/50 z-10"></div>

      {/* Top Navigation / Header (from second screenshot) */}
      <div className="absolute top-0 right-0 p-6 flex gap-4 z-20">
        <button
          onClick={() => setIsLogin(false)}
          className="px-6 py-2 bg-[#F59E0B] text-slate-900 font-semibold rounded-xl hover:bg-[#D97706] transition-colors"
        >
          Get Started
        </button>
        <button
          onClick={() => setIsLogin(true)}
          className="px-6 py-2 border border-slate-700 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
        >
          Log In
        </button>
      </div>

      <div className="relative z-20 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-3">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-slate-400">
            {isLogin
              ? "Enter your credentials to access your account."
              : "Enter your information to join the HarvestHub community."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display Name"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-slate-800 rounded-xl focus:ring-1 focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-slate-800 rounded-xl focus:ring-1 focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-slate-800 rounded-xl focus:ring-1 focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white">Region</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Enter Region"
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-slate-800 rounded-xl focus:ring-1 focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 bg-transparent border border-slate-800 rounded-xl focus:ring-1 focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none text-white placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white">Confirm Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-10 py-2.5 bg-transparent border border-slate-800 rounded-xl focus:ring-1 focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none text-white placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div
              className="flex items-center gap-3 p-4 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors"
              onClick={() => setIsFarmer(!isFarmer)}
            >
              {isFarmer ? (
                <CheckCircle2 className="w-5 h-5 text-[#F59E0B]" />
              ) : (
                <Circle className="w-5 h-5 text-slate-500" />
              )}
              <span className="text-white font-medium">Are you a farmer?</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#F59E0B] text-slate-900 rounded-xl font-bold hover:bg-[#D97706] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Please wait..." : (isLogin ? "Log In" : "Create an account")}
          </button>


        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-bold hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { collection, query, where, onSnapshot, addDoc, getDocs } from "firebase/firestore";

function CropRecommendation() {
  const [phase, setPhase] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [locationName, setLocationName] = useState("");
  const [weatherData, setWeatherData] = useState<{ temp: number; humidity: number; rainfall: number } | null>(null);
  const [soilPH, setSoilPH] = useState(6.8);
  const [recommendation, setRecommendation] = useState<{
    topCrop: string;
    score: number;
    partiallySuitable: { name: string; score: number }[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGetLocation = () => {
    setPhase("loading");
    setErrorMessage("");
    setRecommendation(null);

    if (!navigator.geolocation) {
      setPhase("error");
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Fetch weather data from OpenWeatherMap (free tier, no key needed for demo)
          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=b6907d289e10d714a6e88b30761fae22`
          );

          let temp = 28;
          let humidity = 65;
          let rainfall = 0.1;
          let locName = `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;

          if (weatherRes.ok) {
            const weatherJson = await weatherRes.json();
            temp = Math.round(weatherJson.main?.temp ?? 28);
            humidity = weatherJson.main?.humidity ?? 65;
            rainfall = weatherJson.rain?.["1h"] ?? weatherJson.rain?.["3h"] ?? 0.1;
            locName = weatherJson.name || locName;
          }

          setLocationName(locName);
          setWeatherData({ temp, humidity, rainfall });

          // Send to backend for AI recommendation
          const recRes = await fetch("/api/crop-recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ temperature: temp, humidity, rainfall, ph: soilPH, locationName: locName })
          });

          if (recRes.ok) {
            const recData = await recRes.json();
            setRecommendation(recData);
            setPhase("success");
          } else {
            throw new Error("Failed to get recommendation from server.");
          }
        } catch (err: any) {
          console.error("Recommendation error:", err);
          // Fallback: generate a local default recommendation
          setRecommendation({
            topCrop: "Pulses",
            score: 100,
            partiallySuitable: [
              { name: "Wheat", score: 78 },
              { name: "Rice", score: 72 },
              { name: "Cotton", score: 65 },
              { name: "Sugarcane", score: 60 },
              { name: "Maize", score: 55 }
            ]
          });
          setPhase("success");
        }
      },
      (err) => {
        setPhase("error");
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setErrorMessage("Location access was denied. Please enable location permissions in your browser settings to get crop recommendations.");
            break;
          case err.POSITION_UNAVAILABLE:
            setErrorMessage("Location information is unavailable. Please try again later.");
            break;
          case err.TIMEOUT:
            setErrorMessage("Location request timed out. Please try again.");
            break;
          default:
            setErrorMessage("An unknown error occurred while retrieving your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">Crop Recommendation</h2>
        <p className="text-slate-400 text-sm">Get AI-powered crop suggestions based on your location's real-time weather and soil conditions.</p>
      </div>

      {/* Get Recommendation Card */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center border border-[#F59E0B]/20">
            <Target className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Get Recommendation</h3>
            <p className="text-slate-400 text-xs">Uses your GPS location to fetch live weather data</p>
          </div>
        </div>

        {/* Soil pH Input */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Soil pH (Optional)</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.1"
              min="0"
              max="14"
              value={soilPH}
              onChange={(e) => setSoilPH(parseFloat(e.target.value) || 6.8)}
              className="w-32 px-4 py-2.5 bg-[#020617] border border-slate-800 rounded-xl text-white outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all font-medium text-center"
            />
            <span className="text-slate-500 text-sm">Default: 6.8 (neutral soil)</span>
          </div>
        </div>

        <button
          onClick={handleGetLocation}
          disabled={phase === "loading"}
          className="w-full py-4 bg-[#F59E0B] text-[#020617] rounded-xl font-bold text-base hover:bg-[#D97706] transition-all disabled:opacity-60 flex items-center justify-center gap-3 animate-pulse-glow"
        >
          {phase === "loading" ? (
            <>
              <div className="w-5 h-5 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin" />
              Fetching Location & Weather...
            </>
          ) : (
            <>
              <Locate className="w-5 h-5" />
              Use My Current Location
            </>
          )}
        </button>
      </div>

      {/* Error State */}
      {phase === "error" && (
        <div className="animate-fade-in-up bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <X className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-red-400 font-bold text-base mb-1">Location Access Error</h4>
            <p className="text-red-300/80 text-sm leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {phase === "loading" && (
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-12 flex flex-col items-center text-center shadow-lg">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-[#F59E0B] rounded-full animate-spin mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Region...</h3>
          <p className="text-slate-400 text-sm">Fetching live weather data and computing crop suitability.</p>
        </div>
      )}

      {/* Result Card */}
      {phase === "success" && recommendation && (
        <div className="animate-fade-in-up space-y-6">
          {/* Location Header */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-8 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-4 h-4 text-[#F59E0B]" />
              <h3 className="text-lg font-bold text-white">Recommendation for <span className="text-[#F59E0B]">{locationName}</span></h3>
            </div>

            {/* Top Recommended Crop */}
            <div className="bg-[#020617] rounded-xl p-6 border border-slate-800/50 mb-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5 text-[#F59E0B]" />
                Top Recommended Crop
              </p>
              <div className="flex items-end justify-between">
                <h2 className="text-4xl md:text-5xl font-black text-[#F59E0B] tracking-tight">{recommendation.topCrop}</h2>
                <div className="flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-4 py-2 rounded-full">
                  <Target className="w-4 h-4 text-[#F59E0B]" />
                  <span className="text-[#F59E0B] font-bold text-sm">Score: {recommendation.score}%</span>
                </div>
              </div>
            </div>

            {/* Weather Data Grid */}
            {weatherData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#020617] rounded-xl p-4 border border-slate-800/50 text-center">
                  <Thermometer className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{weatherData.temp}°C</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Temperature</p>
                </div>
                <div className="bg-[#020617] rounded-xl p-4 border border-slate-800/50 text-center">
                  <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{weatherData.humidity}%</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Humidity</p>
                </div>
                <div className="bg-[#020617] rounded-xl p-4 border border-slate-800/50 text-center">
                  <CloudRain className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{weatherData.rainfall}mm</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Rainfall</p>
                </div>
                <div className="bg-[#020617] rounded-xl p-4 border border-slate-800/50 text-center">
                  <Waves className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{soilPH}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Soil pH</p>
                </div>
              </div>
            )}

            {/* Partially Suitable Crops */}
            {recommendation.partiallySuitable && recommendation.partiallySuitable.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Partially Suitable Crops</p>
                <div className="flex flex-wrap gap-2">
                  {recommendation.partiallySuitable.map((crop, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#020617] border border-slate-800/50 rounded-full text-sm font-semibold text-slate-300 hover:border-slate-600 transition-colors"
                    >
                      <Sprout className="w-3.5 h-3.5 text-slate-500" />
                      {crop.name}
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-full">{crop.score}%</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Try Again button */}
          <button
            onClick={handleGetLocation}
            className="w-full py-3.5 border border-slate-800/50 text-slate-300 rounded-xl hover:bg-[#0F172A] hover:text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Locate className="w-4 h-4" />
            Refresh Recommendation
          </button>
        </div>
      )}
    </div>
  );
}

function WeatherFarmingInsights() {
  const [location, setLocation] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [weatherResult, setWeatherResult] = useState<{
    city: string;
    state: string;
    country: string;
    temp: number;
    humidity: number;
    windSpeed: number;
    rainChance: number;
    condition: string;
    conditionDesc: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Smart recommendation engine
  const getActivities = (w: NonNullable<typeof weatherResult>) => {
    const acts: string[] = [];
    if (w.rainChance <= 30) acts.push("Irrigate fields");
    if (w.rainChance <= 40 && w.windSpeed <= 20) acts.push("Apply fertilizers");
    if (w.windSpeed <= 15) acts.push("Spray pesticides");
    if (w.rainChance <= 20 && w.temp >= 20) acts.push("Ploughing");
    if (w.rainChance > 70) acts.push("Cover harvested crops");
    if (w.rainChance > 50) acts.push("Postpone irrigation");
    if (w.windSpeed > 20) acts.push("Avoid pesticide spraying");
    if (w.humidity < 60 && w.temp > 25) acts.push("Mulching recommended");
    if (acts.length === 0) acts.push("General field inspection");
    return acts;
  };

  const getHarvestCrops = (w: NonNullable<typeof weatherResult>) => {
    const crops: string[] = [];
    if (w.temp >= 15 && w.temp <= 25) crops.push("Wheat", "Barley", "Mustard");
    if (w.temp >= 20 && w.temp <= 35) crops.push("Jowar", "Bajra");
    if (w.temp >= 25 && w.humidity >= 60) crops.push("Rice", "Sugarcane");
    if (w.temp >= 20 && w.temp <= 30) crops.push("Cotton", "Pulses");
    if (w.temp >= 15 && w.temp <= 28) crops.push("Vegetables");
    // Deduplicate
    return [...new Set(crops)].slice(0, 6);
  };

  const getRecommendations = (w: NonNullable<typeof weatherResult>) => {
    const recs: { category: string; title: string; description: string }[] = [];

    // Irrigation advice
    if (w.rainChance <= 30 && w.condition.toLowerCase().includes("clear")) {
      recs.push({
        category: "Irrigation",
        title: "Optimal Drip Irrigation Window",
        description: `With ${w.conditionDesc} conditions and only ${w.rainChance}% rain chance, drip irrigation can save up to 40% water compared to flood irrigation. Best time: early morning or late evening.`
      });
    } else if (w.rainChance > 60) {
      recs.push({
        category: "Irrigation",
        title: "Skip Irrigation Today",
        description: `With ${w.rainChance}% chance of rain, natural precipitation should meet your crop's water needs. Save resources and postpone scheduled irrigation.`
      });
    }

    // Crop care
    if (w.humidity > 70) {
      recs.push({
        category: "Crop Care",
        title: "Monitor for Fungal Diseases",
        description: `High humidity at ${w.humidity}% creates ideal conditions for fungal growth. Inspect crops for signs of blight, mildew, or rust. Preventive fungicide may be needed.`
      });
    }

    // Wind advisory
    if (w.windSpeed > 15) {
      recs.push({
        category: "Wind Advisory",
        title: "Wind Protection Measures",
        description: `Wind speed of ${w.windSpeed} km/h may affect tall-standing crops and spray operations. Avoid aerial spraying and consider temporary wind barriers for young saplings.`
      });
    }

    // Temperature-based
    if (w.temp > 35) {
      recs.push({
        category: "Heat Alert",
        title: "Heat Stress Management",
        description: `Temperature of ${w.temp}°C can cause heat stress in crops. Increase irrigation frequency, apply mulch to conserve moisture, and avoid fieldwork during peak afternoon hours.`
      });
    } else if (w.temp < 10) {
      recs.push({
        category: "Cold Alert",
        title: "Frost Protection Advisory",
        description: `Temperature of ${w.temp}°C risks frost damage. Cover sensitive crops with protective sheets and consider light irrigation to raise soil temperature slightly.`
      });
    }

    // General good conditions
    if (w.temp >= 20 && w.temp <= 30 && w.humidity >= 40 && w.humidity <= 75 && w.windSpeed <= 15) {
      recs.push({
        category: "Favorable Conditions",
        title: "Ideal Day for Field Operations",
        description: `Current conditions (${w.temp}°C, ${w.humidity}% humidity, ${w.windSpeed} km/h wind) are ideal for most field operations including sowing, transplanting, and fertilizer application.`
      });
    }

    // Soil care
    recs.push({
      category: "Soil Health",
      title: "Soil Moisture Assessment",
      description: `Given today's ${w.conditionDesc} weather with ${w.humidity}% humidity, check soil moisture at 6-inch depth using the feel method. Ideal moisture for most crops is 50-75% field capacity.`
    });

    return recs;
  };

  const getConditionIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("clear") || c.includes("sunny")) return <Sun className="w-8 h-8 text-yellow-400" />;
    if (c.includes("cloud")) return <Cloud className="w-8 h-8 text-slate-400" />;
    if (c.includes("rain") || c.includes("drizzle")) return <CloudRain className="w-8 h-8 text-cyan-400" />;
    if (c.includes("wind") || c.includes("breez")) return <Wind className="w-8 h-8 text-blue-300" />;
    return <CloudSun className="w-8 h-8 text-amber-400" />;
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    setPhase("loading");
    setErrorMsg("");

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location.trim())}&units=metric&appid=b6907d289e10d714a6e88b30761fae22`
      );

      if (weatherRes.ok) {
        const data = await weatherRes.json();
        setWeatherResult({
          city: data.name || location,
          state: data.sys?.country === "IN" ? getIndianState(data.name) : "",
          country: data.sys?.country || "",
          temp: Math.round(data.main?.temp * 10) / 10,
          humidity: data.main?.humidity ?? 65,
          windSpeed: Math.round((data.wind?.speed ?? 0) * 3.6 * 10) / 10, // m/s -> km/h
          rainChance: data.clouds?.all ?? 20,
          condition: data.weather?.[0]?.main || "Clear",
          conditionDesc: data.weather?.[0]?.description || "clear sky"
        });
        setPhase("success");
      } else {
        // Fallback mock logic
        handleMockFallback();
      }
    } catch {
      handleMockFallback();
    }
  };

  const handleMockFallback = () => {
    const loc = location.trim().toLowerCase();
    if (loc.includes("pune")) {
      setWeatherResult({
        city: "Pune", state: "Maharashtra", country: "IN",
        temp: 22.9, humidity: 77, windSpeed: 14.6, rainChance: 20,
        condition: "Clear", conditionDesc: "clear sky"
      });
    } else if (loc.includes("delhi") || loc.includes("new delhi")) {
      setWeatherResult({
        city: "New Delhi", state: "Delhi", country: "IN",
        temp: 31.2, humidity: 45, windSpeed: 12.3, rainChance: 10,
        condition: "Clear", conditionDesc: "clear sky"
      });
    } else if (loc.includes("mumbai")) {
      setWeatherResult({
        city: "Mumbai", state: "Maharashtra", country: "IN",
        temp: 29.5, humidity: 82, windSpeed: 18.2, rainChance: 45,
        condition: "Clouds", conditionDesc: "scattered clouds"
      });
    } else {
      setWeatherResult({
        city: location.trim(), state: "", country: "IN",
        temp: 26.5, humidity: 60, windSpeed: 10.0, rainChance: 30,
        condition: "Clear", conditionDesc: "clear sky"
      });
    }
    setPhase("success");
  };

  const getIndianState = (city: string) => {
    const map: Record<string, string> = {
      "Pune": "Maharashtra", "Mumbai": "Maharashtra", "Nagpur": "Maharashtra",
      "Delhi": "Delhi", "New Delhi": "Delhi",
      "Bangalore": "Karnataka", "Bengaluru": "Karnataka",
      "Chennai": "Tamil Nadu", "Hyderabad": "Telangana",
      "Kolkata": "West Bengal", "Jaipur": "Rajasthan",
      "Lucknow": "Uttar Pradesh", "Ahmedabad": "Gujarat",
      "Bhopal": "Madhya Pradesh", "Patna": "Bihar"
    };
    return map[city] || "";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">
          {phase === "success" && weatherResult
            ? <>Weather for <span className="text-[#F59E0B]">{weatherResult.city}{weatherResult.state ? `, ${weatherResult.state}` : ""}{weatherResult.country ? `, ${weatherResult.country}` : ""}</span></>
            : "Weather & Farming Insights"}
        </h2>
        <p className="text-slate-400 text-sm">Translate real-time meteorological data into actionable farming recommendations.</p>
      </div>

      {/* Search Card */}
      <form onSubmit={handleAnalyze} className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center border border-[#F59E0B]/20">
            <CloudSun className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Weather Analysis</h3>
            <p className="text-slate-400 text-xs">Enter a city name to get farming-ready weather insights</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location (e.g., Pune, Mumbai, Delhi)"
              required
              className="w-full pl-11 pr-4 py-3.5 bg-[#020617] border border-slate-800 rounded-xl text-white outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all placeholder:text-slate-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={phase === "loading"}
            className="px-8 py-3.5 bg-[#F59E0B] text-[#020617] rounded-xl font-bold hover:bg-[#0d9668] transition-all disabled:opacity-60 flex items-center gap-2 flex-shrink-0"
          >
            {phase === "loading" ? (
              <>
                <div className="w-4 h-4 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Get Analysis
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading */}
      {phase === "loading" && (
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-12 flex flex-col items-center text-center shadow-lg">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-[#F59E0B] rounded-full animate-spin mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">Fetching Weather Data...</h3>
          <p className="text-slate-400 text-sm">Analyzing conditions and generating farming advice for {location}.</p>
        </div>
      )}

      {/* Error */}
      {phase === "error" && (
        <div className="animate-fade-in-up bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <X className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-red-400 font-bold mb-1">Analysis Failed</h4>
            <p className="text-red-300/80 text-sm">{errorMsg || "Could not fetch weather data. Please check the location and try again."}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {phase === "success" && weatherResult && (
        <div className="animate-fade-in-up space-y-6">

          {/* Current Condition Banner + Metrics */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-lg font-bold text-white">
                  Current Conditions
                </h3>
              </div>
              <div className="flex items-center gap-3 bg-[#020617] px-4 py-2 rounded-full border border-slate-800/50">
                {getConditionIcon(weatherResult.condition)}
                <span className="text-white font-semibold capitalize text-sm">{weatherResult.conditionDesc}</span>
              </div>
            </div>

            {/* 4-Column Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#020617] rounded-xl p-5 border border-slate-800/50 text-center hover:border-orange-500/30 transition-colors">
                <Thermometer className="w-7 h-7 text-orange-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">{weatherResult.temp}<span className="text-lg text-slate-400">°C</span></p>
                <p className="text-xs text-slate-500 font-medium mt-1.5">Temperature</p>
              </div>
              <div className="bg-[#020617] rounded-xl p-5 border border-slate-800/50 text-center hover:border-blue-500/30 transition-colors">
                <Droplets className="w-7 h-7 text-blue-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">{weatherResult.humidity}<span className="text-lg text-slate-400">%</span></p>
                <p className="text-xs text-slate-500 font-medium mt-1.5">Humidity</p>
              </div>
              <div className="bg-[#020617] rounded-xl p-5 border border-slate-800/50 text-center hover:border-cyan-500/30 transition-colors">
                <Wind className="w-7 h-7 text-cyan-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">{weatherResult.windSpeed}<span className="text-lg text-slate-400"> km/h</span></p>
                <p className="text-xs text-slate-500 font-medium mt-1.5">Wind Speed</p>
              </div>
              <div className="bg-[#020617] rounded-xl p-5 border border-slate-800/50 text-center hover:border-emerald-500/30 transition-colors">
                <CloudRain className="w-7 h-7 text-amber-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">{weatherResult.rainChance}<span className="text-lg text-slate-400">%</span></p>
                <p className="text-xs text-slate-500 font-medium mt-1.5">Chance of Rain</p>
              </div>
            </div>
          </div>

          {/* Activity Quick-Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suitable Activities */}
            <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Tractor className="w-4 h-4 text-[#F59E0B]" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Suitable Activities</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {getActivities(weatherResult).map((act, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#020617] border border-slate-800/50 rounded-full text-sm font-medium text-slate-300 hover:border-[#F59E0B]/40 hover:text-[#F59E0B] transition-colors cursor-default">
                    <CheckCircle2 className="w-3 h-3 text-[#F59E0B]" />
                    {act}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended for Harvest */}
            <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Recommended for Harvest</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {getHarvestCrops(weatherResult).map((crop, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#020617] border border-slate-800/50 rounded-full text-sm font-medium text-slate-300 hover:border-amber-500/40 hover:text-amber-400 transition-colors cursor-default">
                    <Leaf className="w-3 h-3 text-amber-500" />
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Farming Recommendations Feed */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-8 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Sprout className="w-4 h-4 text-[#F59E0B]" />
              <h4 className="text-lg font-bold text-white">Farming Recommendations</h4>
            </div>
            <div className="space-y-4">
              {getRecommendations(weatherResult).map((rec, i) => (
                <div key={i} className="bg-[#020617] rounded-xl p-5 border border-slate-800/50 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">{rec.category}</span>
                  </div>
                  <h5 className="text-white font-bold text-base mb-1.5">{rec.title}</h5>
                  <p className="text-slate-400 text-sm leading-relaxed">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analyze Again */}
          <button
            onClick={() => { setPhase("idle"); setWeatherResult(null); setLocation(""); }}
            className="w-full py-3.5 border border-slate-800/50 text-slate-300 rounded-xl hover:bg-[#0F172A] hover:text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Analyze Another Location
          </button>
        </div>
      )}
    </div>
  );
}

function CropDiseaseDiagnosis() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<any>(null);
  const [params, setParams] = useState({
    cropType: "", growthStage: "Vegetative", affectedParts: "Leaves",
    symptomDuration: "Less than a week", spreadPattern: "Localized",
    weather: "Hot and humid", irrigation: "Drip", soilType: "Loamy",
    recentFertilizer: "", recentPesticide: ""
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setImagePreview(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          setImagePreview(e.target?.result as string);
        }
        setPhase("idle");
        setResult(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleImageChange(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !imagePreview) return;
    setPhase("loading");
    setErrorMsg("");

    try {
      const payload = {
        image: imagePreview,
        ...params
      };

      const res = await fetch("/api/crop-disease-diagnosis", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) 
      });
      
      if (!res.ok) {
        let errorText = "Analysis failed. Please try again.";
        try {
          const data = await res.json();
          errorText = data.error || errorText;
        } catch (e) {
          // If the server returns HTML (e.g., 504 Gateway Timeout or 500 error)
          errorText = `Server error (${res.status}). Please try again later.`;
        }
        setErrorMsg(errorText);
        setPhase("error");
        return;
      }

      const data = await res.json();
      if (data && data.diseaseName) {
        setResult(data);
        setPhase("success");
      } else {
        setErrorMsg(data.error || "Invalid response format. Please try again.");
        setPhase("error");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Network error. Make sure the server is running.");
      setPhase("error");
    }
  };

  const severityColor = (s: string) => {
    const sl = (s || "").toLowerCase();
    if (sl.includes("critical")) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (sl.includes("severe")) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    if (sl.includes("moderate")) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };

  const categoryColor = (c: string) => {
    const cl = (c || "").toLowerCase();
    if (cl.includes("fungal")) return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (cl.includes("bacterial")) return "bg-red-500/10 text-red-400 border-red-500/20";
    if (cl.includes("viral")) return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    if (cl.includes("pest")) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (cl.includes("nutri")) return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">Crop Disease Diagnosis</h2>
        <p className="text-slate-400 text-sm">Upload a photo of the affected crop and provide field parameters for AI-powered disease identification & treatment guidance.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center border border-[#F59E0B]/20">
              <Camera className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Upload Crop Image</h3>
              <p className="text-slate-400 text-xs">Drag & drop or click to select a clear photo of the diseased area</p>
            </div>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("disease-image-input")?.click()}
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all min-h-[200px] flex flex-col items-center justify-center",
              isDragging ? "border-[#F59E0B] bg-[#F59E0B]/5" : "border-slate-700 hover:border-[#F59E0B]/50 hover:bg-[#020617]"
            )}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Crop preview" className="max-h-64 rounded-lg object-contain" />
            ) : (
              <>
                <Upload className="w-10 h-10 text-slate-500 mb-3" />
                <p className="text-slate-400 font-medium">Drop image here or click to browse</p>
                <p className="text-slate-500 text-xs mt-1">Supports JPG, PNG, WebP (max 10MB)</p>
              </>
            )}
            <input id="disease-image-input" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])} />
          </div>
          {imagePreview && (
            <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); setResult(null); setPhase("idle"); }} className="mt-3 text-xs text-slate-400 hover:text-red-400 transition-colors">Remove image</button>
          )}
        </div>

        {/* Field Parameters */}
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center border border-[#F59E0B]/20">
              <ClipboardList className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Field Parameters</h3>
              <p className="text-slate-400 text-xs">Provide as much detail as possible for accurate diagnosis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Crop Type *</label>
              <input type="text" required value={params.cropType} onChange={(e) => setParams({ ...params, cropType: e.target.value })} placeholder="e.g., Tomato, Rice, Wheat" className="w-full px-3.5 py-2.5 bg-[#020617] border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-[#F59E0B] transition-colors placeholder:text-slate-600" />
            </div>
            {[
              { key: "growthStage", label: "Growth Stage", options: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity", "Harvest"] },
              { key: "affectedParts", label: "Affected Plant Part", options: ["Leaves", "Stem", "Roots", "Fruits", "Flowers", "Whole plant"] },
              { key: "symptomDuration", label: "Symptom Onset Duration", options: ["Less than a week", "1-2 weeks", "2-4 weeks", "More than a month"] },
              { key: "spreadPattern", label: "Spread Pattern", options: ["Localized", "Spreading outward", "Random patches", "Entire field"] },
              { key: "weather", label: "Recent Weather", options: ["Hot and humid", "Hot and dry", "Cool and wet", "Cool and dry", "Rainy season", "Winter"] },
              { key: "irrigation", label: "Irrigation Method", options: ["Drip", "Flood", "Sprinkler", "Rainfed", "Furrow"] },
              { key: "soilType", label: "Soil Type", options: ["Loamy", "Sandy", "Clay", "Silt", "Black cotton", "Red", "Laterite"] }
            ].map(({ key, label, options }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                <select value={(params as any)[key]} onChange={(e) => setParams({ ...params, [key]: e.target.value })} className="w-full px-3.5 py-2.5 bg-[#020617] border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-[#F59E0B] transition-colors">
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Recent Fertilizer Use</label>
              <input type="text" value={params.recentFertilizer} onChange={(e) => setParams({ ...params, recentFertilizer: e.target.value })} placeholder="e.g., DAP, Urea, None" className="w-full px-3.5 py-2.5 bg-[#020617] border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-[#F59E0B] transition-colors placeholder:text-slate-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Recent Pesticide/Fungicide Use</label>
              <input type="text" value={params.recentPesticide} onChange={(e) => setParams({ ...params, recentPesticide: e.target.value })} placeholder="e.g., Mancozeb, None" className="w-full px-3.5 py-2.5 bg-[#020617] border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-[#F59E0B] transition-colors placeholder:text-slate-600" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={!imageFile || phase === "loading"} className="w-full py-4 bg-[#F59E0B] text-[#020617] rounded-xl font-bold text-lg hover:bg-[#D97706] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3">
          {phase === "loading" ? (
            <><div className="w-5 h-5 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin" /> Analyzing Image...</>
          ) : (
            <><Stethoscope className="w-5 h-5" /> Diagnose Disease</>
          )}
        </button>
      </form>

      {/* Error */}
      {phase === "error" && (
        <div className="animate-fade-in-up bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-red-400 font-bold mb-1">Diagnosis Failed</h4>
            <p className="text-red-300/80 text-sm">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {phase === "success" && result && (
        <div className="animate-fade-in-up space-y-6">

          {/* Disease Identity Card */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-8 shadow-lg">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Bug className="w-6 h-6 text-[#F59E0B]" />
                  <h3 className="text-2xl font-bold text-white">{result.diseaseName}</h3>
                </div>
                {result.scientificName && <p className="text-slate-400 text-sm italic ml-9">{result.scientificName}</p>}
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className={cn("text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border", categoryColor(result.category))}>{result.category}</span>
                <span className={cn("text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border", severityColor(result.severity))}>{result.severity}</span>
                {result.confidence && <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">{result.confidence} Confidence</span>}
              </div>
            </div>
            {result.cropLossRisk && (
              <div className="mt-4 bg-[#020617] rounded-xl p-4 border border-slate-800/50">
                <p className="text-sm text-slate-300"><span className="text-slate-500">Estimated Crop Loss Risk:</span> <span className="font-bold text-white">{result.cropLossRisk}</span></p>
                {result.spreadLikely && <p className="text-sm text-slate-300 mt-1"><span className="text-slate-500">Likely to Spread:</span> <span className="font-bold text-white">{result.spreadLikely}</span></p>}
              </div>
            )}
          </div>

          {/* Symptoms */}
          {result.symptoms && result.symptoms.length > 0 && (
            <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-6 shadow-lg">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Search className="w-4 h-4 text-[#F59E0B]" /> Symptom Match Summary</h4>
              <div className="space-y-2">
                {result.symptoms.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#F59E0B] mt-0.5 flex-shrink-0" /><p className="text-sm text-slate-300">{s}</p></div>
                ))}
              </div>
            </div>
          )}

          {/* Treatment Plan */}
          {result.treatment && (
            <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-6 shadow-lg">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2"><Stethoscope className="w-4 h-4 text-[#F59E0B]" /> Treatment Plan</h4>
              <div className="space-y-4">
                {result.treatment.immediate && (
                  <div className="bg-[#020617] rounded-xl p-5 border border-red-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Immediate Actions (24-48 hrs)</span>
                    <div className="mt-3 space-y-1.5">{result.treatment.immediate.map((s: string, i: number) => <p key={i} className="text-sm text-slate-300">{'\u2022'} {s}</p>)}</div>
                  </div>
                )}
                {result.treatment.chemical && (
                  <div className="bg-[#020617] rounded-xl p-5 border border-slate-800/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Chemical Treatment</span>
                    <div className="mt-3 space-y-1.5">{result.treatment.chemical.map((s: string, i: number) => <p key={i} className="text-sm text-slate-300">{'\u2022'} {s}</p>)}</div>
                  </div>
                )}
                {result.treatment.organic && (
                  <div className="bg-[#020617] rounded-xl p-5 border border-slate-800/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Organic / Natural Treatment</span>
                    <div className="mt-3 space-y-1.5">{result.treatment.organic.map((s: string, i: number) => <p key={i} className="text-sm text-slate-300">{'\u2022'} {s}</p>)}</div>
                  </div>
                )}
                {result.treatment.soilWater && (
                  <div className="bg-[#020617] rounded-xl p-5 border border-slate-800/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Soil & Water Management</span>
                    <div className="mt-3 space-y-1.5">{result.treatment.soilWater.map((s: string, i: number) => <p key={i} className="text-sm text-slate-300">{'\u2022'} {s}</p>)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prevention + Follow-up + Weather */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.prevention && result.prevention.length > 0 && (
              <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-6 shadow-lg">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-[#F59E0B]" /> Prevention</h4>
                <div className="space-y-2">{result.prevention.map((s: string, i: number) => <p key={i} className="text-sm text-slate-300">{'\u2022'} {s}</p>)}</div>
              </div>
            )}
            {result.followUp && result.followUp.length > 0 && (
              <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-6 shadow-lg">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#F59E0B]" /> Follow-up Schedule</h4>
                <div className="space-y-2">{result.followUp.map((s: string, i: number) => <p key={i} className="text-sm text-slate-300">{'\u2022'} {s}</p>)}</div>
              </div>
            )}
          </div>

          {result.weatherAdvice && result.weatherAdvice.length > 0 && (
            <div className="bg-[#0F172A] rounded-2xl border border-slate-800/50 p-6 shadow-lg">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><CloudSun className="w-4 h-4 text-[#F59E0B]" /> Weather-Specific Advice</h4>
              <div className="space-y-2">{result.weatherAdvice.map((s: string, i: number) => <p key={i} className="text-sm text-slate-300">{'\u2022'} {s}</p>)}</div>
            </div>
          )}

          {/* Start Over */}
          <button onClick={() => { setPhase("idle"); setResult(null); setImageFile(null); setImagePreview(null); setParams({ ...params, cropType: "" }); }} className="w-full py-3.5 border border-slate-800/50 text-slate-300 rounded-xl hover:bg-[#0F172A] hover:text-white font-medium transition-colors flex items-center justify-center gap-2">
            <Camera className="w-4 h-4" /> Diagnose Another Crop
          </button>
        </div>
      )}
    </div>
  );
}

function CropPricePrediction() {
  const [crop, setCrop] = useState("rice");
  const [mandi, setMandi] = useState("Pune");
  const [quantity, setQuantity] = useState("1000");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<{
    currentRevenue: number;
    predictedRevenue: number;
    confidence: number;
    factors: string[];
    percentageReturn: string;
  } | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setPrediction(null);
    try {
      const res = await fetch("/api/predict-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, mandi, quantity })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (e) {
      console.error("Failed to fetch prediction:", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Crop Price Prediction</h2>
        <p className="text-slate-400 text-sm">Predict the price of a crop based on region and date using our AI-powered model.</p>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="bg-[#FEF3C7] px-6 py-4 border-b border-[#FDE68A] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#D97706]" />
          <span className="font-bold text-[#D97706] text-sm tracking-wide">Profit Analyzer</span>
        </div>
        <form onSubmit={handlePredict} className="p-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Crop</label>
            <input
              required
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#cbd5e1] border border-slate-400/50 rounded-lg text-slate-800 outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all font-medium"
              placeholder="e.g. rice"
            />
          </div>
          <div className="flex-1 w-full space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Mandi</label>
            <input
              required
              value={mandi}
              onChange={(e) => setMandi(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#cbd5e1] border border-slate-400/50 rounded-lg text-slate-800 outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all font-medium"
              placeholder="e.g. Pune"
            />
          </div>
          <div className="flex-1 w-full space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quantity (KG)</label>
            <input
              required
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#cbd5e1] border border-slate-400/50 rounded-lg text-slate-800 outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all font-medium"
              placeholder="1000"
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="px-8 py-2.5 bg-[#D97706] text-white font-bold rounded-lg hover:bg-[#B45309] transition-colors disabled:opacity-70 flex items-center gap-2 w-full md:w-auto justify-center h-[46px]"
          >
            {isAnalyzing ? "Analyzing..." : (
              <>
                <TrendingUp className="w-5 h-5" />
                Analyze Profit
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Area */}
      {isAnalyzing ? (
        <div className="bg-[#0f172a] rounded-xl p-12 flex flex-col items-center justify-center text-center min-h-[400px] shadow-inner border border-slate-800/50">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-[#F59E0B] rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">Analyzing market trends...</h3>
            <p className="text-slate-400 text-sm">Fetching live mandi prices and applying forecasting algorithms.</p>
          </div>
        </div>
      ) : prediction ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          {/* Chart Container */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">Price Trend Analysis</h3>
                <p className="text-slate-500 text-sm">Historical vs AI-Predicted Prices (₹/quintal)</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-[#3b82f6] rounded-full"></div>
                  <span className="text-sm font-medium text-slate-500">Historical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 border-t-2 border-dashed border-[#f97316] rounded-full"></div>
                  <span className="text-sm font-medium text-slate-500">Predicted</span>
                </div>
              </div>
            </div>

            {/* SVG Mock Chart */}
            <div className="relative h-[250px] w-full text-slate-400 text-xs mt-4">
              {/* Grid */}
              <div className="absolute inset-0 flex flex-col justify-between pb-8">
                {[2400, 1800, 1200, 600, 0].map(val => (
                  <div key={val} className="flex items-center gap-4 w-full">
                    <span className="w-10 text-right font-medium">₹{val}</span>
                    <div className="flex-1 border-b border-dashed border-slate-200"></div>
                  </div>
                ))}
              </div>
              {/* X Axis labels */}
              <div className="absolute bottom-0 left-14 right-0 flex justify-between font-medium">
                {["11 Mar", "13 Mar", "15 Mar", "17 Mar", "Today", "19 Mar", "21 Mar", "23 Mar", "25 Mar"].map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
              {/* Data Lines */}
              <svg className="absolute inset-0 w-full h-full pb-8 pl-[60px]" preserveAspectRatio="none" viewBox="0 0 1000 100">
                {/* Historical Line Blue */}
                <path d="M 0 20 Q 50 25 100 20 T 200 20 T 300 24 T 400 18 L 440 20" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {/* Predicted Line Orange Dashed */}
                <path d="M 440 20 Q 500 35 600 25 T 800 22 T 1000 30" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="6,6" strokeLinecap="round" strokeLinejoin="round" />
                {/* Data Points Historical */}
                <circle cx="0" cy="20" r="4" fill="#3b82f6" />
                <circle cx="100" cy="20" r="4" fill="#3b82f6" />
                <circle cx="200" cy="20" r="4" fill="#3b82f6" />
                <circle cx="300" cy="24" r="4" fill="#3b82f6" />
                <circle cx="440" cy="20" r="4" fill="#f97316" />
                {/* Data Points Predicted */}
                <circle cx="600" cy="25" r="4" fill="#f97316" />
                <circle cx="800" cy="22" r="4" fill="#f97316" />
                <circle cx="1000" cy="30" r="4" fill="#f97316" />
              </svg>
            </div>
          </div>

          {/* Revenue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sell Today Card */}
            <div className="bg-[#FEF3C7] border-l-8 border-[#F59E0B] rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-[#B45309] font-bold text-lg">SELL TODAY</h4>
                <span className="bg-transparent border border-[#FCD34D] text-[#D97706] text-xs font-bold px-3 py-1 rounded-full">Current Rate</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#D97706] mb-1">Total Revenue</p>
                <h2 className="text-4xl font-extrabold text-white" style={{ "WebkitTextStroke": "1.5px #D97706", color: "transparent" }}>₹{prediction.currentRevenue.toLocaleString()}</h2>
              </div>
            </div>

            {/* Sell In 4 Days Card */}
            <div className="bg-[#fff7ed] border-l-8 border-[#f97316] rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-[#c2410c] font-bold text-lg">SELL IN 4 DAYS</h4>
                <span className="bg-transparent border border-[#fed7aa] text-[#ea580c] text-xs font-bold px-3 py-1 rounded-full">Predicted Rate</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-[#ea580c] mb-1">Total Revenue</p>
                  {/* Create an outlined text effect for predicted rate */}
                  <h2 className="text-4xl font-extrabold text-white" style={{ "WebkitTextStroke": "1.5px #ea580c", color: "transparent" }}>₹{prediction.predictedRevenue.toLocaleString()}</h2>
                </div>
                <div className={`flex items-center gap-1 font-bold ${prediction.percentageReturn.startsWith('-') ? 'text-[#9f1239]' : 'text-[#B45309]'}`}>
                  {prediction.percentageReturn.startsWith('-') ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21 8L12 17L3 8H21Z" /></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="rotate-180"><path d="M21 8L12 17L3 8H21Z" /></svg>
                  )}
                  {prediction.percentageReturn}
                </div>
              </div>
            </div>
          </div>

          {/* Market Factors & AI Confidence */}
          <div className="bg-[#0f172a] border border-slate-800/50 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-400">Top Market Factors</h4>
              <div className="flex flex-wrap gap-3">
                {prediction.factors.map((factor, idx) => (
                  <span key={idx} className="bg-[#020617] border border-slate-800 text-slate-300 text-sm font-bold px-4 py-1.5 rounded-full">{factor}</span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <h4 className="text-sm font-medium text-slate-400 mb-1">AI Confidence</h4>
              <h2 className="text-4xl font-black text-white">{prediction.confidence}%</h2>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-[#0f172a] rounded-xl p-12 flex flex-col items-center justify-center text-center min-h-[400px] shadow-inner border border-slate-800/50">
          <TrendingUp className="w-10 h-10 text-slate-500 mb-4 mx-auto" />
          <h3 className="text-lg font-bold text-white mb-2">Awaiting Prediction</h3>
          <p className="text-slate-400 text-sm">Your price prediction will appear here.</p>
        </div>
      )}
    </div>
  );
}

function SellerDashboard({ user, onLogout }: { user: UserType, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!user.id) return;

    const q = query(collection(db, "products"), where("sellerId", "==", user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prods);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, [user.id]);

  const [error, setError] = useState<string>("");

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = {
      sellerId: user.id,
      sellerName: user.name,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      category: formData.get("category") as string,
      stock: Number(formData.get("stock")),
      image: (formData.get("image") as string) || "https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=1974&auto=format&fit=crop", // Default placeholder if empty
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "products"), data);
      setIsAdding(false);
    } catch (e: any) {
      console.error("Error adding product:", e);
      setError(e.message || "Unknown error occurred while adding product.");
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden font-sans text-slate-200">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#111827] border-r border-slate-800/50 flex flex-col flex-shrink-0 z-20 shadow-2xl">
        <div className="p-5 flex items-center justify-center border-b border-slate-800/50">
          <img src="/harvesthub-logo.png" alt="HarvestHub" className="h-10" />
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "dashboard" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          {/* AI Tools Group */}
          <div className="px-4 mt-6 mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-400">AI Tools</p>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
          <button
            onClick={() => setActiveTab("price_prediction")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "price_prediction" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <TrendingUp className="w-4 h-4" />
            Crop Price Prediction
          </button>
          <button
            onClick={() => setActiveTab("recommendation")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "recommendation" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <Sprout className="w-4 h-4" />
            Crop Recommendation
          </button>
          <button
            onClick={() => setActiveTab("weather")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "weather" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <CloudSun className="w-4 h-4" />
            Weather & Farming Advice
          </button>
          <button
            onClick={() => setActiveTab("disease_diagnosis")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "disease_diagnosis" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <Bug className="w-4 h-4" />
            Disease Diagnosis
          </button>

          {/* Platform Group */}
          <div className="px-4 mt-6 mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-400">Platform</p>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
          <button
            onClick={() => setActiveTab("inventory")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "inventory" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <Package className="w-4 h-4" />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("marketplace")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "marketplace" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <ShoppingCart className="w-4 h-4" />
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "community" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <Users className="w-4 h-4" />
            Community
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "orders" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <ClipboardList className="w-4 h-4" />
            Orders
          </button>

          {/* Account Group */}
          <div className="px-4 mt-6 mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-400">Account</p>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
          <button
            onClick={() => setActiveTab("profile")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "profile" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "settings" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col relative">
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/50 px-8 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-white tracking-tight capitalize">
            {activeTab.replace("_", " ")}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageToggle />
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 ml-2 shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {activeTab === "dashboard" && (
            <div className="space-y-6 pb-8">

              {/* Quick Actions Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, {user.name} 👋</h1>
                  <p className="text-slate-400 text-sm mt-1">Here's what's happening with your farm today.</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => setActiveTab("marketplace")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#F2994A] hover:bg-[#e8893a] text-[#111827] font-bold rounded-xl transition-all shadow-lg shadow-[#F2994A]/20 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Product
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-medium rounded-xl transition-all text-sm">
                    <TrendingUp className="w-4 h-4" />
                    Download Report
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Card 1: Products Sold */}
                <div className="relative bg-[#0F172A]/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-800/60 shadow-xl overflow-hidden group hover:border-[#F2994A]/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F2994A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-[#F2994A]/10 rounded-xl flex items-center justify-center border border-[#F2994A]/20">
                      <Package className="w-5 h-5 text-[#F2994A]" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5H7z"/></svg>
                      +12%
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Products Sold</p>
                  <h3 className="text-3xl font-black text-white">1,248</h3>
                  <p className="text-slate-500 text-xs mt-2">vs last month</p>
                </div>

                {/* Card 2: Total Revenue */}
                <div className="relative bg-[#0F172A]/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-800/60 shadow-xl overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <IndianRupee className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5H7z"/></svg>
                      +8.3%
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-black text-white">₹45,200</h3>
                  <p className="text-slate-500 text-xs mt-2">vs last month</p>
                </div>

                {/* Card 3: Avg Order Value */}
                <div className="relative bg-[#0F172A]/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-800/60 shadow-xl overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      <svg className="w-2.5 h-2.5 rotate-180" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5H7z"/></svg>
                      -2%
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Avg. Order Value</p>
                  <h3 className="text-3xl font-black text-white">₹3,200</h3>
                  <p className="text-slate-500 text-xs mt-2">vs last month</p>
                </div>

                {/* Card 4: Active Listings */}
                <div className="relative bg-[#0F172A]/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-800/60 shadow-xl overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                      <Store className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5H7z"/></svg>
                      +5%
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Active Listings</p>
                  <h3 className="text-3xl font-black text-white">84</h3>
                  <p className="text-slate-500 text-xs mt-2">vs last month</p>
                </div>
              </div>

              {/* Main Content: Chart + AI Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Sales Overview Chart (2/3 width) */}
                <div className="lg:col-span-2 bg-[#0F172A]/80 backdrop-blur-sm rounded-2xl border border-slate-800/60 shadow-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-white">Sales Overview</h3>
                      <p className="text-slate-500 text-xs mt-0.5">Last 30 days revenue trend</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#F2994A]/10 text-[#F2994A] border border-[#F2994A]/20">↑ Growing</span>
                  </div>
                  {/* SVG Line Chart */}
                  <div className="relative h-48 w-full">
                    <svg viewBox="0 0 600 160" className="w-full h-full" preserveAspectRatio="none">
                      {/* Grid lines */}
                      {[0,40,80,120,160].map(y => (
                        <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#1e293b" strokeWidth="1" />
                      ))}
                      {/* Gradient fill */}
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F2994A" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#F2994A" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      {/* Area fill */}
                      <path
                        d="M0,140 C30,130 60,120 90,110 C120,100 150,105 180,90 C210,75 240,80 270,65 C300,50 330,55 360,40 C390,25 420,35 450,20 C480,10 510,15 540,8 C560,5 580,4 600,2 L600,160 L0,160 Z"
                        fill="url(#salesGrad)"
                      />
                      {/* Line */}
                      <path
                        d="M0,140 C30,130 60,120 90,110 C120,100 150,105 180,90 C210,75 240,80 270,65 C300,50 330,55 360,40 C390,25 420,35 450,20 C480,10 510,15 540,8 C560,5 580,4 600,2"
                        fill="none" stroke="#F2994A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      />
                      {/* Data points */}
                      {[[0,140],[90,110],[180,90],[270,65],[360,40],[450,20],[540,8],[600,2]].map(([x,y],i) => (
                        <circle key={i} cx={x} cy={y} r="3.5" fill="#F2994A" stroke="#0F172A" strokeWidth="2"/>
                      ))}
                    </svg>
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-slate-500 pointer-events-none -translate-x-6">
                      <span>₹50k</span><span>₹37k</span><span>₹25k</span><span>₹12k</span><span>₹0</span>
                    </div>
                  </div>
                  {/* X-axis labels */}
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
                    {["Mar 8","Mar 11","Mar 14","Mar 17","Mar 20","Mar 23","Mar 26","Mar 29","Apr 7"].map(d => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                </div>

                {/* AI Market Insights (1/3 width) */}
                <div className="bg-gradient-to-br from-[#1a1200] to-[#0F172A] rounded-2xl border border-[#F2994A]/20 shadow-xl p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#F2994A]/10 border border-[#F2994A]/20 flex items-center justify-center">
                      <Sprout className="w-4 h-4 text-[#F2994A]" />
                    </div>
                    <span className="text-sm font-bold text-white">AI Market Insights</span>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">LIVE</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="p-4 bg-[#F2994A]/5 border border-[#F2994A]/15 rounded-xl">
                      <p className="text-[#F2994A] text-xs font-bold uppercase tracking-wider mb-2">🌾 Wheat Forecast</p>
                      <p className="text-slate-300 text-sm leading-relaxed">Wheat prices are predicted to <strong className="text-[#F2994A]">rise by 5.2%</strong> next week due to export demand. Consider listing your inventory soon.</p>
                    </div>
                    <div className="p-4 bg-blue-500/5 border border-blue-500/15 rounded-xl">
                      <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">🌧️ Weather Alert</p>
                      <p className="text-slate-300 text-sm leading-relaxed">Unseasonal rain expected in 3 days. <strong className="text-blue-400">Harvest perishables</strong> before Tuesday.</p>
                    </div>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">📈 Top Demand</p>
                      <p className="text-slate-300 text-sm leading-relaxed">Tomatoes and onions trending <strong className="text-emerald-400">+18% demand</strong> in Delhi NCR this week.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Orders Table + Perishables */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                {/* Recent Orders Table (3/5) */}
                <div className="lg:col-span-3 bg-[#0F172A]/80 backdrop-blur-sm rounded-2xl border border-slate-800/60 shadow-xl overflow-hidden">
                  <div className="p-5 border-b border-slate-800/50 flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">Recent Orders</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-xs text-[#F2994A] hover:underline font-medium">View All →</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800/50 text-[10px] uppercase tracking-wider text-slate-500">
                          <th className="px-5 py-3 text-left font-bold">Order ID</th>
                          <th className="px-5 py-3 text-left font-bold">Product</th>
                          <th className="px-5 py-3 text-left font-bold">Date</th>
                          <th className="px-5 py-3 text-right font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: "#ORD-4821", product: "Basmati Rice (50kg)", date: "Apr 7, 2026", status: "Shipped", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                          { id: "#ORD-4820", product: "Organic Wheat Flour", date: "Apr 6, 2026", status: "Delivered", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                          { id: "#ORD-4819", product: "Fresh Tomatoes (10kg)", date: "Apr 6, 2026", status: "Pending", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
                          { id: "#ORD-4818", product: "Turmeric Powder (2kg)", date: "Apr 5, 2026", status: "Delivered", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                          { id: "#ORD-4817", product: "Red Onions (25kg)", date: "Apr 5, 2026", status: "Shipped", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                        ].map((order) => (
                          <tr key={order.id} className="border-b border-slate-800/30 hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3.5 font-mono text-xs text-[#F2994A] font-bold">{order.id}</td>
                            <td className="px-5 py-3.5 text-slate-300 font-medium">{order.product}</td>
                            <td className="px-5 py-3.5 text-slate-500 text-xs">{order.date}</td>
                            <td className="px-5 py-3.5 text-right">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${order.color}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Perishables Alert (2/5) */}
                <div className="lg:col-span-2 bg-[#0F172A]/80 backdrop-blur-sm rounded-2xl border border-slate-800/60 shadow-xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Perishables Alert</h3>
                      <p className="text-slate-500 text-xs">Days until expiry</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    {[
                      { name: "Tomatoes", days: 2, max: 7, color: "bg-red-500", label: "High Alert", labelColor: "text-red-400 bg-red-500/10 border-red-500/20" },
                      { name: "Spinach Leaves", days: 4, max: 7, color: "bg-yellow-500", label: "Warning", labelColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
                      { name: "Green Mangoes", days: 6, max: 14, color: "bg-emerald-500", label: "Safe", labelColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                    ].map((item) => (
                      <div key={item.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-300">{item.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.labelColor}`}>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${item.color}`}
                              style={{ width: `${(item.days / item.max) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 font-medium w-16 text-right flex-shrink-0">{item.days} days left</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/50">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      <span className="text-[#F2994A] font-bold">Tip:</span> List your perishables early for faster sales and less wastage.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "marketplace" && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Your Products</h2>
                <button
                  onClick={() => setIsAdding(!isAdding)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-[#111827] rounded-lg hover:bg-[#D97706] transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  {isAdding ? "Cancel" : "Add Product"}
                </button>
              </div>

              {isAdding && (
                <div className="mb-8 bg-[#0F172A] p-6 rounded-xl border border-slate-800/50 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-white">New Listing</h2>
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-1">Product Title</label>
                      <input name="title" required className="w-full px-3 py-2 bg-[#111827] border border-slate-800/50 rounded-lg text-white focus:outline-none focus:border-[#F59E0B]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                      <textarea name="description" required className="w-full px-3 py-2 bg-[#111827] border border-slate-800/50 rounded-lg text-white focus:outline-none focus:border-[#F59E0B]" rows={3} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-1">Image URL</label>
                      <input name="image" type="url" placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 bg-[#111827] border border-slate-800/50 rounded-lg text-white focus:outline-none focus:border-[#F59E0B] placeholder:text-slate-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Price (₹)</label>
                      <input name="price" type="number" step="0.01" required className="w-full px-3 py-2 bg-[#111827] border border-slate-800/50 rounded-lg text-white focus:outline-none focus:border-[#F59E0B]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Stock Quantity</label>
                      <input name="stock" type="number" required className="w-full px-3 py-2 bg-[#111827] border border-slate-800/50 rounded-lg text-white focus:outline-none focus:border-[#F59E0B]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                      <select name="category" className="w-full px-3 py-2 bg-[#111827] border border-slate-800/50 rounded-lg text-white focus:outline-none focus:border-[#F59E0B]">
                        <option>Seeds</option>
                        <option>Fertilizers</option>
                        <option>Equipment</option>
                        <option>Pesticides</option>
                        <option>Vegetables</option>
                        <option>Fruits</option>
                        <option>Grains</option>
                        <option>Staples</option>
                      </select>
                    </div>
                    <div className="col-span-2 flex justify-end gap-3 mt-2">
                      <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-400 hover:bg-slate-800/50 rounded-lg transition-colors">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-[#F59E0B] text-[#111827] rounded-lg hover:bg-[#D97706] font-medium transition-colors">Publish Listing</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}

          {activeTab === "inventory" && (
            <div className="bg-[#0F172A] border border-slate-800/50 rounded-xl shadow-lg overflow-hidden mt-6">
              <div className="p-6 border-b border-slate-800/50">
                <h2 className="text-xl font-bold text-white">Product Inventory</h2>
                <p className="text-sm text-slate-400">View and track your current stock levels</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase bg-[#111827] text-slate-400 border-b border-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">Product Name</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Category</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Price</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Stock Level</th>
                      <th className="px-6 py-4 font-bold tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-slate-800/50 hover:bg-[#111827]/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                          <img src={product.image} alt={product.title} className="w-10 h-10 rounded-lg object-cover border border-slate-700" />
                          {product.title || "Unnamed Product"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-semibold">{product.category || "Uncategorized"}</span>
                        </td>
                        <td className="px-6 py-4 font-medium">₹{typeof product.price === 'number' ? product.price.toLocaleString() : "0"}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{product.stock}</span>
                            <span className="text-slate-500 text-xs">units</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {product.stock > 10 ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div> In Stock
                            </span>
                          ) : product.stock > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Out of Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          <Package className="w-8 h-8 mx-auto mb-3 opacity-50" />
                          <p>No products in inventory yet.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Placeholders for new tabs */}
          {activeTab === "price_prediction" && (
            <CropPricePrediction />
          )}

          {activeTab === "recommendation" && (
            <CropRecommendation />
          )}

          {activeTab === "weather" && (
            <WeatherFarmingInsights />
          )}

          {activeTab === "disease_diagnosis" && (
            <CropDiseaseDiagnosis />
          )}

          {activeTab === "community" && (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
              <Users className="w-16 h-16 text-slate-700 mb-4" />
              <h2 className="text-2xl font-bold text-slate-300 mb-2">Community</h2>
              <p className="text-slate-500 max-w-md">Connect with fellow farmers, share knowledge, and join discussions in your local agricultural community.</p>
            </div>
          )}

          {activeTab === "orders" && (
            <RequestedOrdersContent userId={user.id} />
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
              <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800/50 shadow-sm max-w-2xl">
                <p className="text-slate-400 mb-4">Manage your public seller profile details.</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-bold text-slate-300 shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                    <p className="text-sm text-[#F59E0B] font-medium">Seller Account</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
                    <div className="p-3 bg-[#020617] rounded-lg border border-slate-800 text-slate-300">{user.email || "Not Provided"}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Region</label>
                    <div className="p-3 bg-[#020617] rounded-lg border border-slate-800 text-slate-300">{user.region || "Not Provided"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
              <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800/50 shadow-sm max-w-2xl text-slate-400">
                <p>Configure notifications, security settings, and payment preferences.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function CategoriesSection() {
  const categories = [
    { name: "Nutrients", image: "https://picsum.photos/seed/nutrients/100/100" },
    { name: "Fungicides", image: "https://picsum.photos/seed/fungicides/100/100" },
    { name: "Insecticides", image: "https://picsum.photos/seed/insecticides/100/100" },
    { name: "Seeds", image: "https://picsum.photos/seed/seeds/100/100" },
    { name: "Weedicides", image: "https://picsum.photos/seed/weedicides/100/100" },
    { name: "Tissue Culture", image: "https://picsum.photos/seed/tissue/100/100" },
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex flex-col items-center gap-3 cursor-pointer group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all bg-emerald-50 relative">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {cat.name === "Tissue Culture" && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-1 shadow-md z-10 hidden md:block">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
            <span className="text-slate-700 font-medium text-sm md:text-base">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BannerSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {/* WhatsApp Community Banner */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center min-h-[240px]">
        <div className="relative z-10 max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
            Join our whatsapp community for expert agronomy updates
          </h2>
          <button className="bg-[#F59E0B] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#D97706] transition-colors w-fit">
            Join Now
          </button>
        </div>
        {/* Abstract phone mockup placeholder */}
        <div className="absolute right-[-20px] bottom-[-40px] w-48 h-64 bg-slate-800 rounded-3xl border-4 border-slate-700 transform rotate-[-10deg] opacity-50 md:opacity-100"></div>
      </div>

      {/* App Download Banner */}
      <div className="bg-[#F59E0B] rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center min-h-[240px]">
        <div className="relative z-10 max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
            Access more features and products through HarvestHub app
          </h2>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors w-fit">
            Download Now
          </button>
        </div>
        {/* Abstract phone mockup placeholder */}
        <div className="absolute right-[-20px] bottom-[-40px] w-48 h-64 bg-emerald-600 rounded-3xl border-4 border-emerald-500 transform rotate-[-10deg] opacity-50 md:opacity-100"></div>
      </div>
    </div>
  );
}

function KisanChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Namaste! I am HarvestHub Assistant, your farming companion. How can I help you today?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // Ref for auto-scrolling
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg })
      });
      const data = await res.json();
      if (data.error) {
        setMessages(prev => [...prev, { role: 'bot', text: `Sorry, there was an error: ${data.error}. It might be an API key issue.` }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: data.answer }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I am having trouble connecting to the server. Please check your network." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#F59E0B] text-[#111827] p-4 rounded-full shadow-lg hover:bg-[#D97706] transition-all hover:scale-110 flex items-center gap-2 group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="font-bold hidden group-hover:inline max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap">Ask HarvestHub</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[380px] bg-[#111827] rounded-2xl shadow-2xl border border-slate-800/50 overflow-hidden flex flex-col max-h-[600px] h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-[#0F172A] p-4 flex justify-between items-center text-white border-b border-slate-800/50 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-full flex items-center justify-center border border-[#F59E0B]/20">
                <Sprout className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">HarvestHub Assistant</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-800/50 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#020617]">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                  msg.role === 'user'
                    ? "bg-[#F59E0B] text-[#111827] rounded-tr-none font-medium"
                    : "bg-[#0F172A] border border-slate-800/50 text-slate-300 rounded-tl-none"
                )}>
                  <ReactMarkdown components={{
                    ...MarkdownComponents,
                    p: ({ ...props }) => <p className="mb-1 last:mb-0 leading-relaxed" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc pl-4 mb-1 space-y-1" {...props} />,
                    li: ({ ...props }) => <li className="" {...props} />,
                  }}>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#0F172A] border border-slate-800/50 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-[#0F172A] border-t border-slate-800/50 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crops, weather..."
              className="flex-1 px-4 py-3 border border-slate-800/50 rounded-full focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] bg-[#111827] text-white placeholder:text-slate-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-[#F59E0B] text-[#111827] rounded-full hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function ConsumerStorefront({
  user,
  onAddToCart,
  cartCount,
  onCartClick,
  onFindStores,
  onLogout
}: {
  user: UserType;
  onAddToCart: (p: Product) => void;
  cartCount: number;
  onCartClick: () => void;
  onFindStores: () => void;
  onLogout: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"marketplace" | "orders" | "profile" | "settings">("marketplace");

  useEffect(() => {
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Product;
        const safeTitle = data.title || "";
        const safeCategory = data.category || "";
        if (search.trim() === "" || safeTitle.toLowerCase().includes(search.toLowerCase()) || safeCategory.toLowerCase().includes(search.toLowerCase())) {
          prods.push({ id: doc.id, ...data });
        }
      });
      setProducts(prods);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, [search]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#111827] border-r border-slate-800/50 flex flex-col flex-none min-h-screen sticky top-0">
        <div className="p-5 flex items-center justify-center">
          <img src="/harvesthub-logo.png" alt="HarvestHub" className="h-10" />
        </div>

        <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Main</p>
          </div>
          <button
            onClick={() => setActiveTab("marketplace")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "marketplace" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <ShoppingBag className="w-4 h-4" />
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "orders" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <Package className="w-4 h-4" />
            My Orders
          </button>

          <div className="px-4 mt-6 mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account</p>
          </div>
          <button
            onClick={() => setActiveTab("profile")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "profile" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={cn("w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2", activeTab === "settings" ? "border-[#F59E0B] text-[#F59E0B] bg-white/5" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col bg-[#020617] relative">
        {/* Top Dashboard Header */}
        <div className="sticky top-0 z-30 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/50 px-8 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-white tracking-tight">
            {activeTab === "marketplace" && "Marketplace"}
            {activeTab === "orders" && "My Orders"}
            {activeTab === "profile" && "Profile Details"}
            {activeTab === "settings" && "App Settings"}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onFindStores} className="p-2 text-slate-400 hover:text-white transition-colors" title="Find Stores on Map">
              <MapPin className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <LanguageToggle />
            <button onClick={onCartClick} className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-[#111827] transform translate-x-1/4 -translate-y-1/4 bg-[#F59E0B] rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 ml-2 shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {activeTab === "marketplace" && (
            <>
              <div className="mb-12">
                <h1 className="text-3xl font-bold text-white mb-2">Customer Marketplace</h1>
                <p className="text-slate-400">Buy fresh produce, vegetables, and grains directly from farmers at wholesale prices.</p>
              </div>

              <div className="relative rounded-2xl overflow-hidden mb-12 h-[300px]">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop"
                  alt="Wholesale Savings"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute inset-0 flex flex-col justify-center p-12">
                  <span className="bg-[#F59E0B] text-[#111827] text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wider shadow-sm">Super Saver Deals</span>
                  <h2 className="text-5xl font-bold text-white mb-4">Wholesale Savings</h2>
                  <p className="text-xl text-white/90">Compare farmer deals & save money</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  <button className="px-5 py-2 bg-[#F59E0B] text-[#111827] rounded-full text-sm font-bold whitespace-nowrap shadow-sm">All</button>
                  <button className="px-5 py-2 bg-[#111827] border border-slate-800 text-slate-300 rounded-full text-sm font-medium hover:bg-slate-800/50 whitespace-nowrap transition-colors">Vegetables</button>
                  <button className="px-5 py-2 bg-[#111827] border border-slate-800 text-slate-300 rounded-full text-sm font-medium hover:bg-slate-800/50 whitespace-nowrap transition-colors">Fruits</button>
                  <button className="px-5 py-2 bg-[#111827] border border-slate-800 text-slate-300 rounded-full text-sm font-medium hover:bg-slate-800/50 whitespace-nowrap transition-colors">Grains</button>
                  <button className="px-5 py-2 bg-[#111827] border border-slate-800 text-slate-300 rounded-full text-sm font-medium hover:bg-slate-800/50 whitespace-nowrap transition-colors">Staples</button>
                </div>
                <div className="relative hidden lg:block w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-11 pr-4 py-2 bg-[#111827] border border-slate-800 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#F59E0B] focus:border-[#F59E0B] text-white placeholder:text-slate-500 shadow-inner"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {products.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
                ))}
              </div>

              <KisanChatbot />
            </>
          )}

          {activeTab === "orders" && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-6">My Orders</h1>
              <div className="bg-[#0F172A] p-12 rounded-2xl border border-slate-800/50 text-center shadow-lg">
                <div className="w-20 h-20 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                  <Package className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">No orders yet</h2>
                <p className="text-slate-400 max-w-sm mx-auto mb-8">When you buy fresh produce or farming supplies, your order history will appear here.</p>
                <button
                  onClick={() => setActiveTab("marketplace")}
                  className="px-6 py-2.5 bg-[#F59E0B] text-[#111827] font-bold rounded-xl hover:bg-[#D97706] transition-colors shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-6">Profile Details</h1>
              <div className="bg-[#0F172A] p-8 rounded-2xl border border-slate-800/50 max-w-2xl shadow-lg">
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-tr from-[#F59E0B] to-[#0ea5e9] rounded-full flex items-center justify-center text-3xl font-bold text-[#111827] shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                      <span className="inline-flex bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                        {user.role} Account
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800/50">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1 tracking-wide uppercase">Email Address</label>
                      <p className="text-white font-medium bg-[#111827] px-4 py-3 rounded-xl border border-slate-800/50">{user.email || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1 tracking-wide uppercase">Username</label>
                      <p className="text-white font-medium bg-[#111827] px-4 py-3 rounded-xl border border-slate-800/50">@{user.username || "unset"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-500 mb-1 tracking-wide uppercase">Region / City</label>
                      <p className="text-white font-medium bg-[#111827] px-4 py-3 rounded-xl border border-slate-800/50">{user.region || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-6">App Settings</h1>
              <div className="bg-[#0F172A] p-8 rounded-2xl border border-slate-800/50 max-w-2xl shadow-lg">
                <div className="space-y-6 text-slate-300">
                  <div className="flex items-center justify-between py-4 border-b border-slate-800/50">
                    <div>
                      <span className="block font-medium text-white mb-1">Push Notifications</span>
                      <span className="text-sm text-slate-500">Receive alerts for order updates and new nearby listings.</span>
                    </div>
                    <div className="w-12 h-6 bg-[#F59E0B] rounded-full relative cursor-pointer shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-800/50">
                    <div>
                      <span className="block font-medium text-white mb-1">Email Newsletter</span>
                      <span className="text-sm text-slate-500">Weekly digests of the best vegetable prices.</span>
                    </div>
                    <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                    </div>
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

import { onAuthStateChanged, signOut } from "firebase/auth";



function ProfileSetup({ user, onComplete }: { user: UserType, onComplete: (u: UserType) => void }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user.username || "");
  const [region, setRegion] = useState(user.region || "");
  const [role, setRole] = useState<"seller" | "consumer">(user.role);
  const [displayName, setDisplayName] = useState(user.name || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser: UserType = {
        ...user,
        name: displayName,
        username,
        region,
        role,
        profileCompleted: true
      };
      await setDoc(doc(db, "users", user.id), updatedUser, { merge: true });
      onComplete(updatedUser);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center p-4 font-sans text-slate-200">
      <div className="w-full max-w-md bg-[#0F172A] p-8 rounded-2xl border border-slate-800/50 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Complete Your Profile</h2>
        <p className="text-slate-400 text-center mb-8">We need a few more details to customize your experience.</p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
            <input required value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full px-4 py-3 bg-[#111827] border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-[#F59E0B] outline-none transition-colors" placeholder="How should we call you?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <input required value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-[#111827] border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-[#F59E0B] outline-none transition-colors" placeholder="Choose a unique username" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Region / City</label>
            <input required value={region} onChange={e => setRegion(e.target.value)} className="w-full px-4 py-3 bg-[#111827] border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-[#F59E0B] outline-none transition-colors" placeholder="Where are you located?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">I am a...</label>
            <select value={role} onChange={e => setRole(e.target.value as "seller" | "consumer")} className="w-full px-4 py-3 bg-[#111827] border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-[#F59E0B] outline-none appearance-none cursor-pointer">
              <option value="consumer">Consumer (Looking to buy fresh produce)</option>
              <option value="seller">Farmer (Looking to sell my harvest)</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#F59E0B] text-slate-900 rounded-xl font-bold hover:bg-[#D97706] transition-colors disabled:opacity-50 mt-6 shadow-sm">
            {loading ? "Saving..." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

function RequestedOrdersContent({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, "orders"), where("sellerId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders: any[] = [];
      snapshot.forEach(doc => {
        fetchedOrders.push({ id: doc.id, ...doc.data() });
      });
      fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(fetchedOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      if (newStatus === 'processing') {
        const orderToUpdate = orders.find(o => o.id === orderId);
        if (orderToUpdate && orderToUpdate.items) {
          for (const item of orderToUpdate.items) {
            await updateDoc(doc(db, "products", item.id), {
              stock: increment(-item.quantity)
            });
          }
        }
      }
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (e) {
      console.error(e);
      alert("Error updating order status.");
    }
  };

  if (loading) return <div className="text-center p-12 text-slate-400">Loading requested orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Requested Orders</h2>
        <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm font-semibold">{orders.length} Total</span>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0F172A] border border-slate-800/50 rounded-2xl shadow-sm">
          <ClipboardList className="w-16 h-16 text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-300 mb-2">No active order requests</h3>
          <p className="text-slate-500 max-w-md">When customers place orders for your products, they will appear here for you to verify and process.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-[#0F172A] border border-slate-800/50 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-start border-b border-slate-800/50 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Order #{order.id.slice(-6).toUpperCase()}</h3>
                  <p className="text-sm text-slate-400">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  {order.status === 'requested' && <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-wide">Action Required</span>}
                  {order.status === 'pending_verification' && <span className="px-3 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 animate-pulse"><Upload className="w-3 h-3" /> Verify Payment</span>}
                  {order.status === 'processing' && <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wide">Processing</span>}
                  {order.status === 'completed' && <span className="px-3 py-1 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full text-xs font-bold uppercase tracking-wide">Completed</span>}
                  {order.status === 'cancelled' && <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold uppercase tracking-wide">Cancelled</span>}
                  {order.status === 'rejected' && <span className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-xs font-bold uppercase tracking-wide">Rejected</span>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-3 border-b border-slate-800/50 pb-2">Customer & Delivery Info</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p><span className="text-slate-500 mb-1">Name:</span> <strong className="text-white">{order.buyerName}</strong></p>
                    <p><span className="text-slate-500 mb-1">Contact:</span> <strong className="text-white">{order.buyerPhone}</strong></p>
                    <p><span className="text-slate-500 mb-1">Address:</span> {order.address.line1}, {order.address.city} - {order.address.zip}</p>
                    {order.address.instructions && <p className="text-yellow-400 bg-yellow-400/10 p-2 rounded border border-yellow-400/20 mt-2">Note: {order.address.instructions}</p>}
                    <p className="pt-2"><span className="text-slate-500 mb-1">Payment Method:</span> <strong className="uppercase text-white">{order.paymentMethod}</strong></p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-3 border-b border-slate-800/50 pb-2">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <img src={item.image} className="w-10 h-10 rounded object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{item.title}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity} Ãƒâ€” ₹{item.price}</p>
                        </div>
                        <span className="font-bold text-[#F59E0B] text-sm">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-slate-800/50 flex justify-between items-center text-white font-bold">
                      <span>Total Earnings:</span>
                      <span className="text-xl text-[#F59E0B]">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {order.paymentScreenshot && (
                <div className="mt-4 pt-4 border-t border-slate-800/50">
                  <a href={order.paymentScreenshot} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-[#F59E0B] hover:text-[#D97706] font-bold">
                    <span className="underline">View Payment Screenshot</span>
                  </a>
                </div>
              )}
              {order.status === 'pending_verification' && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-800/50">
                  <button onClick={() => updateOrderStatus(order.id, 'rejected')} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg font-bold text-sm transition-colors border border-red-500/20">Reject Payment</button>
                  <button onClick={() => updateOrderStatus(order.id, 'processing')} className="flex-1 py-2 bg-[#F59E0B] text-[#111827] hover:bg-[#D97706] rounded-lg font-bold transition-colors">Verify & Accept</button>
                </div>
              )}
              {order.status === 'requested' && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-800/50">
                  <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg font-bold text-sm transition-colors border border-red-500/20">Decline Order</button>
                  <button onClick={() => updateOrderStatus(order.id, 'processing')} className="flex-1 py-2 bg-[#F59E0B] text-[#111827] hover:bg-[#D97706] rounded-lg font-bold transition-colors">Accept & Process</button>
                </div>
              )}
              {order.status === 'processing' && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-800/50">
                  <button onClick={() => updateOrderStatus(order.id, 'completed')} className="w-full py-2 bg-[#F59E0B] text-[#111827] hover:bg-[#D97706] rounded-lg font-bold transition-colors">Mark as Delivered</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckoutModal({ isOpen, onClose, onComplete, cart, user }: { isOpen: boolean; onClose: () => void, onComplete: () => void, cart: CartItem[], user: UserType | null }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [personalDetails, setPersonalDetails] = useState({ name: '', countryCode: '+91', phone: '' });
  const [addressDetails, setAddressDetails] = useState({ line1: '', city: '', zip: '', instructions: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);

  if (!isOpen) return null;

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(s => s + 1);
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sellerOrders: { [key: string]: CartItem[] } = {};
      cart.forEach(item => {
        if (!sellerOrders[item.sellerId]) sellerOrders[item.sellerId] = [];
        sellerOrders[item.sellerId].push(item);
      });

      for (const sellerId in sellerOrders) {
        const orderData = {
          sellerId,
          buyerId: user?.id || "guest",
          buyerName: personalDetails.name,
          buyerPhone: personalDetails.countryCode + " " + personalDetails.phone,
          address: addressDetails,
          paymentMethod,
          paymentScreenshot,
          items: sellerOrders[sellerId],
          totalAmount: sellerOrders[sellerId].reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0),
          createdAt: new Date().toISOString(),
          status: (paymentMethod === 'upi' || paymentMethod === 'netbanking') ? "pending_verification" : "requested"
        };
        await addDoc(collection(db, "orders"), orderData);
      }

      alert("Order placed successfully! The sellers will be notified.");
      onComplete();
      setPersonalDetails({ name: '', countryCode: '+91', phone: '' });
      setAddressDetails({ line1: '', city: '', zip: '', instructions: '' });
      setPaymentMethod('');
      setPaymentScreenshot(null);
      setStep(1);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an issue processing your checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111827] border border-slate-800/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-800/50 flex justify-between items-center bg-[#0F172A]">
          <h3 className="font-bold text-lg text-white">
            {step === 1 && "Step 1: Personal Details"}
            {step === 2 && "Step 2: Address & Delivery"}
            {step === 3 && "Step 3: Payment"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800/50 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-6">
            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-[#F59E0B]' : 'bg-slate-800'}`}></div>
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-[#F59E0B]' : 'bg-slate-800'}`}></div>
            <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-[#F59E0B]' : 'bg-slate-800'}`}></div>
          </div>

          {step === 1 && (
            <form onSubmit={nextStep} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input required value={personalDetails.name} onChange={e => setPersonalDetails({ ...personalDetails, name: e.target.value })} className="w-full px-4 py-3 bg-[#0F172A] border border-slate-800/50 rounded-xl focus:outline-none focus:border-[#F59E0B] text-white placeholder:text-slate-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={personalDetails.countryCode}
                    onChange={e => setPersonalDetails({ ...personalDetails, countryCode: e.target.value })}
                    className="px-2 py-3 bg-[#0F172A] border border-slate-800/50 rounded-xl focus:outline-none focus:border-[#F59E0B] text-white appearance-none text-center cursor-pointer"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+49">🇩🇪 +49</option>
                  </select>
                  <input required type="tel" value={personalDetails.phone} onChange={e => setPersonalDetails({ ...personalDetails, phone: e.target.value })} className="flex-1 w-full px-4 py-3 bg-[#0F172A] border border-slate-800/50 rounded-xl focus:outline-none focus:border-[#F59E0B] text-white placeholder:text-slate-500" placeholder="XXXXX XXXXX" />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-[#F59E0B] text-[#111827] rounded-xl font-bold hover:bg-[#D97706] transition-colors mt-6">Continue to Delivery</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={nextStep} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Address Line 1</label>
                <input required value={addressDetails.line1} onChange={e => setAddressDetails({ ...addressDetails, line1: e.target.value })} className="w-full px-4 py-3 bg-[#0F172A] border border-slate-800/50 rounded-xl focus:outline-none focus:border-[#F59E0B] text-white" placeholder="Street, House No." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">City</label>
                  <input required value={addressDetails.city} onChange={e => setAddressDetails({ ...addressDetails, city: e.target.value })} className="w-full px-4 py-3 bg-[#0F172A] border border-slate-800/50 rounded-xl focus:outline-none focus:border-[#F59E0B] text-white" placeholder="City" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">ZIP / PIN Code</label>
                  <input required value={addressDetails.zip} onChange={e => setAddressDetails({ ...addressDetails, zip: e.target.value })} className="w-full px-4 py-3 bg-[#0F172A] border border-slate-800/50 rounded-xl focus:outline-none focus:border-[#F59E0B] text-white" placeholder="123456" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Delivery Instructions (Optional)</label>
                <textarea rows={2} value={addressDetails.instructions} onChange={e => setAddressDetails({ ...addressDetails, instructions: e.target.value })} className="w-full px-4 py-3 bg-[#0F172A] border border-slate-800/50 rounded-xl focus:outline-none focus:border-[#F59E0B] text-white resize-none" placeholder="e.g. Leave at front door" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors">Back</button>
                <button type="submit" className="flex-[2] py-3.5 bg-[#F59E0B] text-[#111827] rounded-xl font-bold hover:bg-[#D97706] transition-colors">Continue to Payment</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={(e) => { e.preventDefault(); if (paymentMethod === 'card' || paymentMethod === 'cod') { handleComplete(e); } else { setStep(4); } }} className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 bg-[#0F172A] border border-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800/20 transition-colors">
                  <input required type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={e => setPaymentMethod(e.target.value)} className="w-4 h-4 text-[#F59E0B] focus:ring-[#F59E0B] accent-[#F59E0B]" />
                  <span className="text-white font-medium">Credit / Debit Card</span>
                </label>

                <div className="flex flex-col gap-2 p-4 bg-[#0F172A] border border-slate-800/50 rounded-xl transition-colors">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input required type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={e => setPaymentMethod(e.target.value)} className="w-4 h-4 text-[#F59E0B] focus:ring-[#F59E0B] accent-[#F59E0B]" />
                    <span className="text-white font-medium">UPI / QR Code</span>
                  </label>
                  {paymentMethod === 'upi' && (
                    <div className="pl-7 pt-2 animate-fade-in">
                      <div className="bg-[#111827] p-4 rounded-lg border border-slate-800 flex flex-col items-center">
                        <img src="/qr_code.jpg" alt="UPI QR Code" className="w-40 h-40 rounded-lg border-2 border-white object-contain bg-white mb-3" />
                        <p className="text-sm font-medium text-slate-300">Scan & Pay to</p>
                        <p className="text-lg font-bold text-[#F59E0B] tracking-wide">hello@harvesthub.in</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 p-4 bg-[#0F172A] border border-slate-800/50 rounded-xl transition-colors">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input required type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={e => setPaymentMethod(e.target.value)} className="w-4 h-4 text-[#F59E0B] focus:ring-[#F59E0B] accent-[#F59E0B]" />
                    <span className="text-white font-medium">Net Banking</span>
                  </label>
                  {paymentMethod === 'netbanking' && (
                    <div className="pl-7 pt-2 animate-fade-in">
                      <div className="bg-[#111827] p-4 rounded-lg border border-slate-800 text-sm text-slate-300 space-y-2">
                        <p><span className="text-slate-500 inline-block w-24">Bank Name:</span> <strong className="text-white">State Bank of India</strong></p>
                        <p><span className="text-slate-500 inline-block w-24">Account No:</span> <strong className="text-white">32145678901</strong></p>
                        <p><span className="text-slate-500 inline-block w-24">IFSC Code:</span> <strong className="text-white">SBIN0001234</strong></p>
                        <p className="mt-2 text-[#F59E0B] font-medium text-xs border-t border-slate-800/50 pt-2 block w-full">Please transfer the exact order amount to this account.</p>
                      </div>
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-3 p-4 bg-[#0F172A] border border-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800/20 transition-colors">
                  <input required type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={e => setPaymentMethod(e.target.value)} className="w-4 h-4 text-[#F59E0B] focus:ring-[#F59E0B] accent-[#F59E0B]" />
                  <span className="text-white font-medium">Cash on Delivery</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(2)} className="flex-1 py-3.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors">Back</button>
                <button type="submit" disabled={!paymentMethod} className="flex-[2] py-3.5 bg-[#F59E0B] text-[#111827] rounded-xl font-bold hover:bg-[#D97706] transition-colors flex justify-center items-center">
                  {(paymentMethod === 'card' || paymentMethod === 'cod' || !paymentMethod) ? "Place Order" : "Proceed to Pay"}
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={handleComplete} className="space-y-4 animate-fade-in transition-all">
              <div className="bg-[#0F172A] border border-slate-800/50 rounded-xl p-6 text-center shadow-inner">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">Upload Payment Proof</h3>
                  <p className="text-sm text-slate-400">Please upload a clear screenshot of your successful transaction.</p>
                </div>

                <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-700 hover:border-[#F59E0B] hover:bg-[#F59E0B]/5 rounded-xl cursor-pointer transition-all group overflow-hidden bg-[#111827]">
                  {paymentScreenshot ? (
                    <img src={paymentScreenshot} alt="Payment Proof" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                      <div className="p-3 bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#F59E0B]" />
                      </div>
                      <p className="text-sm text-slate-300 font-bold mb-1">Click to upload screenshot</p>
                      <p className="text-xs text-slate-500">PNG, JPG or PDF</p>
                    </div>
                  )}
                  <input type="file" required accept="image/*,application/pdf" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setPaymentScreenshot(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(3)} className="flex-1 py-3.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors">Back</button>
                <button type="submit" disabled={loading || !paymentScreenshot} className="flex-[2] py-3.5 bg-[#F59E0B] text-[#111827] rounded-xl font-bold hover:bg-[#D97706] transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-[#111827]/30 border-t-[#111827] rounded-full animate-spin" /> : null}
                  {loading ? "Verifying..." : "Confirm & Place Order"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [isStoresOpen, setIsStoresOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seeding products automatically is now disabled per user request
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const isGoogle = firebaseUser.providerData.some((p: any) => p.providerId === 'google.com');

          if (userDoc.exists()) {
            const data = userDoc.data() as UserType;
            // Removed auto-completion logic here
            setUser(data);
          } else {
            // Document doesn't exist yet, we must create it! (e.g., first time Google Login)
            const storedIsFarmer = sessionStorage.getItem("isFarmerPending") === "true";
            const newUser: UserType = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              role: storedIsFarmer ? "seller" : "consumer",
              profileCompleted: false // Require profile completion for Google users too
            };
            await setDoc(doc(db, "users", firebaseUser.uid), newUser);
            sessionStorage.removeItem("isFarmerPending");
            setUser(newUser);
          }
        } catch (e) {
          console.error("Error fetching user data:", e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B]"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  if (!user.profileCompleted) {
    return <ProfileSetup user={user} onComplete={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-200">
      {user.role === "seller" ? (
        <SellerDashboard user={user} onLogout={handleLogout} />
      ) : (
        <ConsumerStorefront
          user={user}
          onAddToCart={handleAddToCart}
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
          onFindStores={() => setIsStoresOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {isAskOpen && <AskAgronomistModal onClose={() => setIsAskOpen(false)} />}
      {isStoresOpen && <NearbyStoresModal onClose={() => setIsStoresOpen(false)} />}

      {/* Cart Sidebar (Consumer) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#111827] h-full shadow-2xl flex flex-col border-l border-slate-800/50">
            <div className="p-5 border-b border-slate-800/50 flex items-center justify-between">
              <h2 className="font-bold text-xl text-white">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-800/50 rounded-full text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">Your cart is empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-[#0F172A] p-3 rounded-xl border border-slate-800/50">
                    <img src={item.image} className="w-20 h-20 object-cover rounded-lg bg-slate-800" />
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-bold text-white leading-tight mb-1">{item.title}</h3>
                      <p className="text-sm font-medium text-[#F59E0B]">₹{(item.price || 0).toFixed(2)}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1 bg-slate-800/50 rounded-md p-0.5 border border-slate-700/50">
                          <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded text-lg font-medium transition-colors leading-none">-</button>
                          <span className="text-xs text-slate-200 font-bold min-w-[1.5rem] text-center">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded text-lg font-medium transition-colors leading-none">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-xs font-bold transition-colors">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-5 border-t border-slate-800/50 bg-[#0F172A]">
              <div className="flex justify-between mb-4 font-bold text-lg text-white">
                <span>Total</span>
                <span className="text-[#F59E0B]">₹{cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0).toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  if (cart.length > 0) {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }
                }}
                disabled={cart.length === 0}
                className="w-full py-3.5 bg-[#F59E0B] text-[#111827] rounded-xl font-bold hover:bg-[#D97706] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onComplete={() => { setIsCheckoutOpen(false); setCart([]); }}
        cart={cart}
        user={user}
      />
    </div>
  );
}
