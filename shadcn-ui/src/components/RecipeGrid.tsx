import { Recipe } from '@/lib/supabase'
import RecipeCard from './RecipeCard'

interface RecipeGridProps {
  recipes: Recipe[]
  loading?: boolean
}

export default function RecipeGrid({ recipes, loading }: RecipeGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="glass rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-4 w-3/4"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="glass rounded-2xl p-8 max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-white mb-2">No recipes found</h3>
          <p className="text-gray-400">
            Try entering some ingredients above to discover delicious recipes!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}