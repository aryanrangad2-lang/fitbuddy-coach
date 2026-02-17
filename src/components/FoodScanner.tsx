import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Loader2, X, Utensils, Flame, Beef, Wheat, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NutritionResult {
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  serving_size: string;
  confidence: string;
  tips?: string;
}

export function FoodScanner() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 10MB.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeFood = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('food-scanner', {
        body: { image: imagePreview },
      });

      if (error) throw error;

      if (data?.nutrition) {
        setResult(data.nutrition);
        toast({ title: "Analysis complete! 🍽️", description: `Detected: ${data.nutrition.food_name}` });
      } else {
        throw new Error(data?.error || "Could not analyze the food");
      }
    } catch (err) {
      console.error("Food scan error:", err);
      toast({
        title: "Analysis failed",
        description: err instanceof Error ? err.message : "Please try again with a clearer photo.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
  };

  return (
    <Card className="overflow-hidden border border-border/50 shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <CardTitle className="text-base">Food Calorie Scanner</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          {!imagePreview ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera className="w-6 h-6 text-primary" />
                    <span className="text-xs">Take Photo</span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6 text-primary" />
                    <span className="text-xs">Upload Photo</span>
                  </Button>
                </motion.div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Take or upload a photo of your food to get instant calorie info
              </p>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3"
            >
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Food"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <motion.button
                  onClick={reset}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              {!result && (
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    className="w-full gap-2"
                    onClick={analyzeFood}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Utensils className="w-4 h-4" />
                        Analyze Food
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Result */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <h4 className="font-semibold text-foreground mb-1">{result.food_name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Serving: {result.serving_size} · Confidence: {result.confidence}
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-card rounded-lg p-2 text-center">
                          <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-foreground">{result.calories}</p>
                          <p className="text-[10px] text-muted-foreground">Calories</p>
                        </div>
                        <div className="bg-card rounded-lg p-2 text-center">
                          <Beef className="w-4 h-4 text-red-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-foreground">{result.protein_g}g</p>
                          <p className="text-[10px] text-muted-foreground">Protein</p>
                        </div>
                        <div className="bg-card rounded-lg p-2 text-center">
                          <Wheat className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-foreground">{result.carbs_g}g</p>
                          <p className="text-[10px] text-muted-foreground">Carbs</p>
                        </div>
                        <div className="bg-card rounded-lg p-2 text-center">
                          <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-foreground">{result.fat_g}g</p>
                          <p className="text-[10px] text-muted-foreground">Fat</p>
                        </div>
                      </div>

                      {result.tips && (
                        <p className="mt-3 text-xs text-muted-foreground bg-card rounded-lg p-2">
                          💡 {result.tips}
                        </p>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="w-full" onClick={reset}>
                      Scan Another Food
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}