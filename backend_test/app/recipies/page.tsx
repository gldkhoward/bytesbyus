// app/recipes/page.jsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState([]);
  
  // New recipe form state
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    servings: 4,
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    difficulty: "medium",
    is_private: false,
  });
  
  // Ingredients and steps for the new recipe
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit_id: "", notes: "", is_optional: false, display_order: 0 }
  ]);
  
  const [steps, setSteps] = useState([
    { step_number: 1, instruction: "", timer_minutes: null }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from("recipes")
        .select(`
          id, 
          title, 
          description,
          created_at,
          servings,
          prep_time_minutes,
          cook_time_minutes,
          difficulty,
          is_private,
          version,
          branch_name
        `)
        .order("created_at", { ascending: false });
      
      if (recipesError) {
        console.error("Error fetching recipes:", recipesError);
        toast({
          title: "Error fetching recipes",
          description: recipesError.message,
          variant: "destructive",
        });
      } else {
        setRecipes(recipesData || []);
      }
      
      // Fetch units for ingredient form
      const { data: unitsData, error: unitsError } = await supabase
        .from("units")
        .select("id, name, abbreviation, system, type")
        .order("name");
        
      if (unitsError) {
        console.error("Error fetching units:", unitsError);
      } else {
        setUnits(unitsData || []);
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRecipe({
      ...newRecipe,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
      display_order: index,
    };
    setIngredients(updatedIngredients);
  };
  
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", quantity: "", unit_id: "", notes: "", is_optional: false, display_order: ingredients.length }
    ]);
  };
  
  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const updatedIngredients = ingredients.filter((_, i) => i !== index);
      // Update display order after removal
      updatedIngredients.forEach((ing, i) => {
        ing.display_order = i;
      });
      setIngredients(updatedIngredients);
    }
  };
  
  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value,
    };
    setSteps(updatedSteps);
  };
  
  const addStep = () => {
    setSteps([
      ...steps,
      { step_number: steps.length + 1, instruction: "", timer_minutes: null }
    ]);
  };
  
  const removeStep = (index) => {
    if (steps.length > 1) {
      const updatedSteps = steps.filter((_, i) => i !== index);
      // Renumber steps after removal
      updatedSteps.forEach((step, i) => {
        step.step_number = i + 1;
      });
      setSteps(updatedSteps);
    }
  };
  
  const createRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Creating recipe");
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create recipes",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      console.log("User found", user);
      // Insert recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          ...newRecipe,
          creator_id: user.id,
          root_id: null,  // This is a new recipe, not a fork or branch
          parent_id: null,
          version: 1,
        })
        .select("id")
        .single();
      
      if (recipeError) {
        throw recipeError;
      }
      console.log("Recipe created", recipeData);
      const recipeId = recipeData.id;
      
      // Update the root_id to point to itself (as it's the original recipe)
      await supabase
        .from("recipes")
        .update({ root_id: recipeId })
        .eq("id", recipeId);
      
      // Insert ingredients
      const validIngredients = ingredients.filter(ing => ing.name.trim() !== "");
      if (validIngredients.length > 0) {
        const { error: ingredientsError } = await supabase
          .from("recipe_ingredients")
          .insert(
            validIngredients.map(ing => ({
              recipe_id: recipeId,
              name: ing.name,
              quantity: ing.quantity || null,
              unit_id: ing.unit_id || null,
              notes: ing.notes || null,
              is_optional: ing.is_optional,
              display_order: ing.display_order,
            }))
          );
        
        if (ingredientsError) {
          throw ingredientsError;
        }
      }
      
      // Insert steps
      const validSteps = steps.filter(step => step.instruction.trim() !== "");
      if (validSteps.length > 0) {
        const { error: stepsError } = await supabase
          .from("recipe_steps")
          .insert(
            validSteps.map(step => ({
              recipe_id: recipeId,
              step_number: step.step_number,
              instruction: step.instruction,
              timer_minutes: step.timer_minutes || null,
            }))
          );
        
        if (stepsError) {
          throw stepsError;
        }
      }
      
      toast({
        title: "Recipe created",
        description: "Your recipe has been created successfully!",
      });
      
      // Reset form
      setNewRecipe({
        title: "",
        description: "",
        servings: 4,
        prep_time_minutes: 15,
        cook_time_minutes: 30,
        difficulty: "medium",
        is_private: false,
      });
      
      setIngredients([
        { name: "", quantity: "", unit_id: "", notes: "", is_optional: false, display_order: 0 }
      ]);
      
      setSteps([
        { step_number: 1, instruction: "", timer_minutes: null }
      ]);
      
      // Refresh recipes list
      const { data: refreshedRecipes } = await supabase
        .from("recipes")
        .select(`
          id, 
          title, 
          description,
          created_at,
          servings,
          prep_time_minutes,
          cook_time_minutes,
          difficulty,
          is_private,
          version,
          branch_name,
          profiles(username, avatar_url)
        `)
        .order("created_at", { ascending: false });
        
      setRecipes(refreshedRecipes || []);
      
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast({
        title: "Error creating recipe",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">BytesByUs Recipes</h1>
        <Button variant="default" onClick={() => router.push('/recipes/new')}>
          Create New Recipe
        </Button>
      </div>
      
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Recipes</TabsTrigger>
          <TabsTrigger value="create">Create Recipe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4 mt-6">
          {loading ? (
            <div className="text-center p-12">Loading recipes...</div>
          ) : recipes.length === 0 ? (
            <div className="text-center p-12">
              <p className="text-muted-foreground mb-4">No recipes found</p>
              <Button onClick={() => document.querySelector('[value="create"]').click()}>
                Create your first recipe
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                  <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="mr-2">{recipe.title}</CardTitle>
                        {recipe.is_private && (
                          <Badge variant="outline">Private</Badge>
                        )}
                      </div>
                      {recipe.branch_name && (
                        <Badge className="bg-blue-500">{recipe.branch_name}</Badge>
                      )}

                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-muted-foreground">
                        {recipe.description || "No description provided"}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between text-sm text-muted-foreground">
                      <div>Prep: {recipe.prep_time_minutes} min</div>
                      <div>Cook: {recipe.cook_time_minutes} min</div>
                      <div>Servings: {recipe.servings}</div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Recipe</CardTitle>
              <CardDescription>
                Share your culinary creativity with the BytesByUs community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createRecipe}>
                <div className="space-y-6">
                  {/* Basic Recipe Information */}
                  <div className="space-y-4">
                    <div className="grid w-full gap-2">
                      <Label htmlFor="title">Recipe Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter the recipe title"
                        value={newRecipe.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid w-full gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your recipe"
                        rows={3}
                        value={newRecipe.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="servings">Servings</Label>
                        <Input
                          id="servings"
                          name="servings"
                          type="number"
                          min="1"
                          value={newRecipe.servings}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="prep_time_minutes">Prep Time (minutes)</Label>
                        <Input
                          id="prep_time_minutes"
                          name="prep_time_minutes"
                          type="number"
                          min="0"
                          value={newRecipe.prep_time_minutes}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cook_time_minutes">Cook Time (minutes)</Label>
                        <Input
                          id="cook_time_minutes"
                          name="cook_time_minutes"
                          type="number"
                          min="0"
                          value={newRecipe.cook_time_minutes}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select 
                          value={newRecipe.difficulty} 
                          onValueChange={(value) => setNewRecipe({...newRecipe, difficulty: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2 h-full pt-8">
                        <input
                          type="checkbox"
                          id="is_private"
                          name="is_private"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={newRecipe.is_private}
                          onChange={handleInputChange}
                        />
                        <Label htmlFor="is_private">Make this recipe private</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Ingredients */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Ingredients</h3>
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 mb-3">
                        <div className="col-span-4">
                          <Input
                            placeholder="Ingredient name"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Input
                            placeholder="Qty"
                            type="number"
                            step="0.01"
                            min="0"
                            value={ingredient.quantity}
                            onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Select
                            value={ingredient.unit_id}
                            onValueChange={(value) => handleIngredientChange(index, "unit_id", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id}>
                                  {unit.abbreviation || unit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-3">
                          <Input
                            placeholder="Notes (optional)"
                            value={ingredient.notes}
                            onChange={(e) => handleIngredientChange(index, "notes", e.target.value)}
                          />
                        </div>
                        
                        <div className="col-span-1 flex items-center justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIngredient(index)}
                            disabled={ingredients.length === 1}
                          >
                            <span className="sr-only">Remove</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addIngredient}
                    >
                      Add Ingredient
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  {/* Steps */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Instructions</h3>
                    {steps.map((step, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 mb-4">
                        <div className="col-span-1 flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                            {step.step_number}
                          </div>
                        </div>
                        
                        <div className="col-span-9">
                          <Textarea
                            placeholder={`Step ${step.step_number} instructions`}
                            value={step.instruction}
                            onChange={(e) => handleStepChange(index, "instruction", e.target.value)}
                            rows={2}
                            required
                          />
                        </div>
                        
                        <div className="col-span-1">
                          <Input
                            placeholder="Timer"
                            type="number"
                            min="0"
                            value={step.timer_minutes || ""}
                            onChange={(e) => handleStepChange(index, "timer_minutes", e.target.value)}
                            aria-label="Timer in minutes"
                          />
                        </div>
                        
                        <div className="col-span-1 flex items-center justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStep(index)}
                            disabled={steps.length === 1}
                          >
                            <span className="sr-only">Remove</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addStep}
                    >
                      Add Step
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto"
                    onClick={createRecipe}
                  >
                    {loading ? "Creating Recipe..." : "Create Recipe"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}