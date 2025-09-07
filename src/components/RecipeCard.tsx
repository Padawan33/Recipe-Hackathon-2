import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, ChefHat, Heart } from 'lucide-react'
import { Recipe } from '@/lib/supabase'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleCardClick = () => {
    navigate('/recipe', { state: { recipe } })
  }

  const handleSaveRecipe = async (e: React.MouseEvent) => {
    // Prevent card click when save button is clicked
    e.stopPropagation()
    
    if (!user) {
      toast.error('Please log in to save recipes')
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <Card 
      className="glass border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 group h-full overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Recipe Image */}
      {recipe.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
          {recipe.difficulty && (
            <Badge className={`absolute top-3 right-3 ${getDifficultyColor(recipe.difficulty)} border`}>
              {recipe.difficulty}
            </Badge>
          )}
        </div>
      )}

      <CardHeader className={recipe.image_url ? 'pb-2' : ''}>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-colors line-clamp-2">
            {recipe.title}
          </CardTitle>
          {!recipe.image_url && recipe.difficulty && (
            <Badge className={`${getDifficultyColor(recipe.difficulty)} border`}>
              {recipe.difficulty}
            </Badge>
          )}
        </div>
        <CardDescription className="text-gray-400 leading-relaxed line-clamp-3">
          {recipe.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {(recipe.cookingTime || recipe.ingredients) && (
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {recipe.cookingTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.cookingTime} min</span>
              </div>
            )}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4" />
                <span>{recipe.ingredients.length} ingredients</span>
              </div>
            )}
          </div>
        )}

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">Key Ingredients:</p>
            <div className="flex flex-wrap gap-1">
              {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                  {ingredient}
                </Badge>
              ))}
              {recipe.ingredients.length > 3 && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                  +{recipe.ingredients.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <Button 
          onClick={handleSaveRecipe}
          disabled={isSaving || isSaved}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50"
        >
          <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
          {isSaving ? 'Saving...' : isSaved ? 'Saved to Favorites!' : 'Save to Favorites'}
        </Button>
      </CardContent>
    </Card>
  )
}