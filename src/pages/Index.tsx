import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, ChefHat, Clock, Users, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import RecipeGrid from '@/components/RecipeGrid'
import { Recipe } from '@/lib/supabase'
import { toast } from 'sonner'

export default function Index() {
  const [ingredients, setIngredients] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  // Mock recipe generation function - replace with your actual backend call
  const generateRecipes = async (ingredientList: string[]): Promise<Recipe[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock recipes based on ingredients
    const mockRecipes: Recipe[] = [
      {
        id: '1',
        title: `${ingredientList[0]} Stir Fry`,
        description: `A delicious stir fry featuring ${ingredientList.join(', ')} with aromatic spices and fresh vegetables.`,
        image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
        ingredients: [...ingredientList, 'soy sauce', 'garlic', 'ginger', 'vegetable oil'],
        instructions: `1. Heat oil in a wok\n2. Add garlic and ginger\n3. Add ${ingredientList.join(' and ')}\n4. Stir fry for 5-7 minutes\n5. Season with soy sauce\n6. Serve hot`,
        cookingTime: 15,
        difficulty: 'Easy'
      },
      {
        id: '2',
        title: `Roasted ${ingredientList[0]} Bowl`,
        description: `A healthy and nutritious bowl with roasted ${ingredientList[0]} and complementary ingredients.`,
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        ingredients: [...ingredientList, 'olive oil', 'herbs', 'quinoa', 'mixed greens'],
        instructions: `1. Preheat oven to 400°F\n2. Toss ${ingredientList[0]} with olive oil\n3. Roast for 25 minutes\n4. Prepare quinoa\n5. Assemble bowl with greens\n6. Top with roasted ingredients`,
        cookingTime: 35,
        difficulty: 'Medium'
      },
      {
        id: '3',
        title: `${ingredientList[0]} Soup`,
        description: `A comforting and warming soup made with ${ingredientList.join(', ')} and aromatic herbs.`,
        image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
        ingredients: [...ingredientList, 'vegetable broth', 'onion', 'herbs', 'cream'],
        instructions: `1. Sauté onions until soft\n2. Add ${ingredientList.join(' and ')}\n3. Pour in broth\n4. Simmer for 20 minutes\n5. Blend if desired\n6. Add cream and season`,
        cookingTime: 30,
        difficulty: 'Easy'
      }
    ]

    return mockRecipes
  }

  const handleGetRecipes = async () => {
    if (!ingredients.trim()) {
      toast.error('Please enter some ingredients')
      return
    }

    const ingredientList = ingredients.split(',').map(item => item.trim()).filter(item => item)
    
    if (ingredientList.length === 0) {
      toast.error('Please enter valid ingredients')
      return
    }

    setIsLoading(true)
    
    try {
      // Call your backend function here - replace generateRecipes with your actual API call
      const generatedRecipes = await generateRecipes(ingredientList)
      setRecipes(generatedRecipes)
    } catch (error) {
      console.error('Error generating recipes:', error)
      toast.error('Sorry, something went wrong. Please try again.')
      setRecipes([]) // Clear any existing recipes on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="glass border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Recipe Finder</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, {user.email}</span>
                <Button 
                  onClick={handleSignOut}
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Find Amazing Recipes
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Enter your ingredients and discover delicious recipes you can make right now
          </p>
          
          {/* Search Section */}
          <Card className="glass border-gray-800 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter ingredients (e.g., chicken, broccoli, rice)"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="text-lg py-6 px-4 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleGetRecipes()}
                    disabled={isLoading}
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                
                <Button 
                  onClick={handleGetRecipes}
                  disabled={isLoading}
                  className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating recipes...
                    </>
                  ) : (
                    'Get Recipes!'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3 text-gray-300">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <span className="text-xl">Generating recipes...</span>
            </div>
          </div>
        )}

        {/* Recipes Grid */}
        {!isLoading && recipes.length > 0 && (
          <div className="mt-12">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              Here are your recipes!
            </h3>
            <RecipeGrid recipes={recipes} />
          </div>
        )}

        {/* Features Section */}
        {!isLoading && recipes.length === 0 && (
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">Why Choose Recipe Finder?</h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass border-gray-800 hover:border-gray-700 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">Smart Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-center">
                    Enter any ingredients you have and get personalized recipe suggestions instantly
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="glass border-gray-800 hover:border-gray-700 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-green-400" />
                  </div>
                  <CardTitle className="text-white">Quick & Easy</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-center">
                    Find recipes that match your time constraints and cooking skill level
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="glass border-gray-800 hover:border-gray-700 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">Save Favorites</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-center">
                    Create an account to save your favorite recipes and access them anytime
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}