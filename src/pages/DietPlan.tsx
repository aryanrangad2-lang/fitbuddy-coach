import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Utensils, Loader2, ShoppingCart, Clock, Flame } from "lucide-react";

interface Meal {
  name: string;
  time: string;
  ingredients: string[];
  recipe: string;
  calories: number;
  protein_g: number;
}

interface DietPlanResult {
  daily_calories: number;
  meals: Meal[];
  shopping_list: string[];
  notes?: string;
}

const DIET_PLAN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/diet-plan`;

const DietPlan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<DietPlanResult | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "",
    dietType: "",
    budget: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.age || !formData.weight || !formData.height || !formData.goal) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPlan(null);
    setRawResponse(null);

    try {
      const response = await fetch(DIET_PLAN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          age: parseInt(formData.age),
          weight: parseInt(formData.weight),
          height: parseInt(formData.height),
          goal: formData.goal,
          dietType: formData.dietType,
          budget: formData.budget,
          meals: 3,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate diet plan");
      }

      const data = await response.json();
      
      if (data.ok && data.plan) {
        setPlan(data.plan);
        toast({
          title: "Diet plan generated!",
          description: "Your personalized meal plan is ready.",
        });
      } else if (data.raw) {
        setRawResponse(data.raw);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Diet plan error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate diet plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-warm overflow-y-auto">
      {/* Header */}
      <motion.header 
        className="px-4 pt-6 pb-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <motion.div whileHover={{ scale: 1.1, x: -2 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
          </Link>
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center shadow-soft"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Utensils className="w-6 h-6 text-accent-foreground" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Diet Plan</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Nutrition</p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      <main className="px-4 pb-12 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card className="shadow-card border border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Your Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div 
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="bg-secondary border-0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg) *</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="70"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="bg-secondary border-0"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="height">Height (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Label htmlFor="goal">Goal *</Label>
                    <Select
                      value={formData.goal}
                      onValueChange={(value) => setFormData({ ...formData, goal: value })}
                    >
                      <SelectTrigger className="bg-secondary border-0">
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle gain">Muscle Gain</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="lean bulk">Lean Bulk</SelectItem>
                        <SelectItem value="general health">General Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="dietType">Diet Type</Label>
                    <Select
                      value={formData.dietType}
                      onValueChange={(value) => setFormData({ ...formData, dietType: value })}
                    >
                      <SelectTrigger className="bg-secondary border-0">
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="high protein">High Protein</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <Label htmlFor="budget">Budget</Label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) => setFormData({ ...formData, budget: value })}
                    >
                      <SelectTrigger className="bg-secondary border-0">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Budget-Friendly</SelectItem>
                        <SelectItem value="medium">Moderate</SelectItem>
                        <SelectItem value="high">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button 
                      type="submit" 
                      variant="gradient" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating Plan...
                        </>
                      ) : (
                        <>
                          <Utensils className="w-4 h-4" />
                          Generate Diet Plan
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {!plan && !rawResponse && !isLoading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-card h-full flex items-center justify-center border border-border/50">
                    <CardContent className="text-center py-12">
                      <motion.div 
                        className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center shadow-soft"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Utensils className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                      <h3 className="font-semibold text-foreground mb-2">No plan yet</h3>
                      <p className="text-muted-foreground text-sm">
                        Fill in your details and generate a personalized diet plan.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-card h-full flex items-center justify-center border border-border/50">
                    <CardContent className="text-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary" />
                      </motion.div>
                      <h3 className="font-semibold text-foreground mb-2">Creating your plan...</h3>
                      <p className="text-muted-foreground text-sm">
                        Our AI dietitian is preparing your personalized meal plan.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {plan && (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Daily Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="shadow-glow gradient-primary text-primary-foreground border-0">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Daily Calories</span>
                          <span className="text-2xl font-bold">{plan.daily_calories} kcal</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Meals */}
                  {plan.meals?.map((meal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className="shadow-card border border-border/50">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{meal.name}</CardTitle>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {meal.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Flame className="w-3 h-3 text-primary" />
                                {meal.calories} kcal
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-muted-foreground">{meal.recipe}</p>
                          <div className="flex flex-wrap gap-1">
                            {meal.ingredients?.map((ing, i) => (
                              <motion.span 
                                key={i} 
                                className="text-xs bg-secondary px-2 py-1 rounded-full"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.03 }}
                              >
                                {ing}
                              </motion.span>
                            ))}
                          </div>
                          <p className="text-xs text-primary font-medium">
                            Protein: {meal.protein_g}g
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {/* Shopping List */}
                  {plan.shopping_list && plan.shopping_list.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Card className="shadow-card border border-border/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Shopping List
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {plan.shopping_list.map((item, i) => (
                              <motion.span 
                                key={i} 
                                className="text-sm bg-secondary px-3 py-1 rounded-full"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.55 + i * 0.03 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                {item}
                              </motion.span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Notes */}
                  {plan.notes && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Card className="shadow-card border-primary/20 bg-primary/5">
                        <CardContent className="py-4">
                          <p className="text-sm text-foreground">{plan.notes}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {rawResponse && (
                <motion.div
                  key="raw"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-card border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base">Diet Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                        {rawResponse}
                      </pre>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DietPlan;