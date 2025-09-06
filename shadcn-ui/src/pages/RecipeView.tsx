import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, ChefHat, Users, Heart } from 'lucide-react'
import { Recipe } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function RecipeView() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (location.state?.recipe) {
      setRecipe(location.state.recipe)
    } else {
      // If no recipe data, redirect back to home
      navigate('/')
    }
  }, [location.state, navigate])

  const handleSaveRecipe = async () => {
    if (!user) {
      toast.error('Please log in to save recipes')
      return
    }

    if (!recipe) {
      toast.error('No recipe data available')
      return
    }

    setIsSaving(true)
    try {
      // Call the backend function 'save-recipe' with the entire recipe object
      const response = await fetch('/api/save-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token || ''}`,
        },
        body: JSON.stringify(recipe),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      setIsSaved(true)
      toast.success('Recipe saved successfully!')
    } catch (error) {
      console.error('Error saving recipe:', error)
      toast.error('Sorry, we could not save the recipe.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading recipe...</div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Recipes
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Recipe Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-white">{recipe.title}</h1>
              {recipe.difficulty && (
                <Badge className={`${getDifficultyColor(recipe.difficulty)} border text-lg px-3 py-1`}>
                  {recipe.difficulty}
                </Badge>
              )}
            </div>
            <p className="text-xl text-gray-300 leading-relaxed">{recipe.description}</p>
            
            {/* Save Recipe Button */}
            <div className="mt-6">
              <Button 
                onClick={handleSaveRecipe}
                disabled={isSaving || isSaved || !user}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50 px-6 py-3 text-lg"
              >
                <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaving ? 'Saving...' : isSaved ? 'Recipe Saved!' : 'Save Recipe'}
              </Button>
              {!user && (
                <p className="text-sm text-gray-400 mt-2">Please log in to save recipes</p>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recipe Image */}
            {recipe.image_url && (
              <div className="relative">
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-96 object-cover rounded-lg shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}

            {/* Recipe Info */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="glass border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recipe Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recipe.cookingTime && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-lg">{recipe.cookingTime} minutes</span>
                    </div>
                  )}
                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <ChefHat className="w-5 h-5 text-green-400" />
                      <span className="text-lg">{recipe.ingredients.length} ingredients</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ingredients */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <Card className="glass border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Ingredients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-300 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Instructions */}
          {recipe.instructions && (
            <Card className="glass border-gray-800 mt-8">
              <CardHeader>
                <CardTitle className="text-white">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {recipe.instructions}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}