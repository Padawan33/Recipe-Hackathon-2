import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChefHat, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AuthForm from '@/components/AuthForm'
import { Button } from '@/components/ui/button'

export default function Login() {
  const { signIn, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 dark-gradient opacity-20"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            <ChefHat className="w-8 h-8 text-blue-400" />
            RecipeFinder
          </Link>
        </div>

        {/* Auth Form */}
        <AuthForm 
          mode="login" 
          onSubmit={signIn} 
          loading={authLoading} 
        />

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-4">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up here
            </Link>
          </p>
          
          <Link to="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}