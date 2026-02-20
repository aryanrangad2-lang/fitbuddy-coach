import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import lookmaxxPhysique from "@/assets/lookmaxx-physique.jpg";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  Camera,
  Upload,
  Sparkles,
  ArrowLeft,
  Star,
  TrendingUp,
  Zap,
  Clock,
  ChevronRight,
  Trash2,
  Eye,
  Smile,
  Scissors,
  Droplets,
  Crown,
  Target,
  RefreshCw,
} from "lucide-react";

interface BreakdownItem {
  score: number;
  notes: string;
}

interface ImprovementTip {
  area: string;
  tip: string;
  impact: string;
  timeframe: string;
}

interface Analysis {
  overall_rating: number;
  category: string;
  breakdown: {
    facial_symmetry: BreakdownItem;
    jawline: BreakdownItem;
    skin_quality: BreakdownItem;
    eye_area: BreakdownItem;
    hair: BreakdownItem;
    overall_harmony: BreakdownItem;
  };
  strengths: string[];
  improvement_tips: ImprovementTip[];
  mewing_advice: string;
  style_recommendation: string;
}

const breakdownIcons: Record<string, React.ElementType> = {
  facial_symmetry: Target,
  jawline: Zap,
  skin_quality: Droplets,
  eye_area: Eye,
  hair: Scissors,
  overall_harmony: Smile,
};

const breakdownLabels: Record<string, string> = {
  facial_symmetry: "Symmetry",
  jawline: "Jawline",
  skin_quality: "Skin",
  eye_area: "Eyes",
  hair: "Hair",
  overall_harmony: "Harmony",
};

const impactColors: Record<string, string> = {
  high: "text-primary bg-primary/15 border-primary/30",
  medium: "text-orange-400 bg-orange-400/15 border-orange-400/30",
  low: "text-blue-400 bg-blue-400/15 border-blue-400/30",
};

function getRatingColor(score: number) {
  if (score >= 8) return "text-primary";
  if (score >= 6) return "text-orange-400";
  if (score >= 4) return "text-yellow-400";
  return "text-red-400";
}

function getRatingGlow(score: number) {
  if (score >= 8) return "shadow-[0_0_40px_hsl(var(--primary)/0.5)]";
  if (score >= 6) return "shadow-[0_0_40px_rgba(251,146,60,0.4)]";
  if (score >= 4) return "shadow-[0_0_40px_rgba(250,204,21,0.3)]";
  return "shadow-[0_0_40px_rgba(248,113,113,0.3)]";
}

export default function LooksMaxx() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Image must be under 10MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("lookmaxx-analysis", {
        body: { image: imagePreview },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data.analysis);
    } catch (e: any) {
      toast({ title: "Analysis failed", description: e.message, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-30 px-4 pt-5 pb-3 bg-background/80 backdrop-blur-xl border-b border-border/30"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link to="/">
            <motion.button
              className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground tracking-tight">LooksMaxx</h1>
              <p className="text-[10px] text-muted-foreground font-medium -mt-0.5">AI Face Analysis</p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-2xl mx-auto px-4 pb-12 pt-6">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Hero */}
              <div className="relative overflow-hidden rounded-3xl p-6 shadow-soft min-h-[160px]">
                <img src={lookmaxxPhysique} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-block mb-3"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-white mb-1">
                    Unlock Your Best Look
                  </h2>
                  <p className="text-white/80 text-sm">
                    Upload a clear face photo and our AI will analyze your facial features, rate your aesthetics, and give personalized lookmaxxing tips.
                  </p>
                </div>
              </div>

              {/* Upload area */}
              {!imagePreview ? (
                <motion.div
                  className="border-2 border-dashed border-border/60 rounded-3xl p-8 text-center bg-card/50 hover:border-primary/40 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Camera className="w-10 h-10 text-muted-foreground" />
                  </motion.div>
                  <p className="text-foreground font-bold mb-1">Upload Your Photo</p>
                  <p className="text-muted-foreground text-xs mb-5">
                    Clear, front-facing photo works best. No filters.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <input
                      ref={cameraRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                    <Button
                      variant="gradient"
                      onClick={() => cameraRef.current?.click()}
                      className="shadow-soft"
                    >
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => fileRef.current?.click()}
                      className="border-border/60"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="relative rounded-3xl overflow-hidden border border-border/40 shadow-card">
                    <img
                      src={imagePreview}
                      alt="Your photo"
                      className="w-full max-h-[400px] object-cover"
                    />
                    <motion.button
                      onClick={reset}
                      className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>

                  <Button
                    variant="gradient"
                    className="w-full h-14 text-base font-black shadow-glow"
                    onClick={analyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <motion.div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                        Analyzing Your Features...
                      </motion.div>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Analyze My Face
                      </>
                    )}
                  </Button>

                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Scanning facial features...</span>
                        <span>AI Processing</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          className="h-full gradient-primary rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "90%" }}
                          transition={{ duration: 8, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Features */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Star, label: "Face Rating", sub: "1-10 Scale" },
                  { icon: TrendingUp, label: "Glow Up Tips", sub: "Personalized" },
                  { icon: Zap, label: "Free Forever", sub: "Unlimited Use" },
                ].map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-card rounded-2xl p-3 border border-border/40 text-center"
                  >
                    <f.icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-foreground">{f.label}</p>
                    <p className="text-[10px] text-muted-foreground">{f.sub}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Score Hero */}
              <motion.div
                className="relative overflow-hidden rounded-3xl bg-card border border-border/40 p-6 text-center shadow-card"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-30" />
                
                {/* Photo thumbnail */}
                {imagePreview && (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/40 mx-auto mb-4">
                    <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <motion.div
                  className={`text-7xl font-black mb-1 ${getRatingColor(result.overall_rating)}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {result.overall_rating}
                </motion.div>
                <p className="text-muted-foreground text-sm font-medium mb-2">out of 10</p>
                <motion.div
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${getRatingColor(result.overall_rating)} bg-card ${getRatingGlow(result.overall_rating)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {result.category}
                </motion.div>
              </motion.div>

              {/* Breakdown Grid */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Feature Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.entries(result.breakdown).map(([key, val], i) => {
                    const Icon = breakdownIcons[key] || Star;
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="bg-card rounded-2xl p-3 border border-border/40"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-semibold text-foreground">
                              {breakdownLabels[key] || key}
                            </span>
                          </div>
                          <span className={`text-sm font-black ${getRatingColor(val.score)}`}>
                            {val.score}
                          </span>
                        </div>
                        <Progress value={val.score * 10} className="h-1.5 mb-1.5" />
                        <p className="text-[10px] text-muted-foreground leading-tight">{val.notes}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Your Strengths
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.strengths.map((s, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20"
                    >
                      ✨ {s}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Improvement Tips */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Glow Up Tips
                </h3>
                <div className="space-y-2.5">
                  {result.improvement_tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                      className="bg-card rounded-2xl p-4 border border-border/40"
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="text-xs font-bold text-foreground">{tip.area}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${impactColors[tip.impact] || impactColors.medium}`}
                        >
                          {tip.impact} impact
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{tip.tip}</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {tip.timeframe}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mewing & Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card rounded-2xl p-4 border border-border/40"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-bold text-foreground">Mewing & Posture</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{result.mewing_advice}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="bg-card rounded-2xl p-4 border border-border/40"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-xs font-bold text-foreground">Style Tips</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{result.style_recommendation}</p>
                </motion.div>
              </div>

              {/* Try Again */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="gradient"
                  className="w-full h-12 font-bold shadow-soft"
                  onClick={reset}
                >
                  <RefreshCw className="w-4 h-4" />
                  Analyze Another Photo
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
