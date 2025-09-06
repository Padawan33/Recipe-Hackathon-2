import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield, Smartphone, Palette, Code, Users } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Lightning Fast",
      description: "Optimized for speed with modern web technologies and best practices for maximum performance."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Secure by Design",
      description: "Built with security in mind, featuring end-to-end encryption and robust protection mechanisms."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-400" />,
      title: "Mobile First",
      description: "Responsive design that works perfectly across all devices, from mobile to desktop."
    },
    {
      icon: <Palette className="w-8 h-8 text-purple-400" />,
      title: "Beautiful UI",
      description: "Carefully crafted interface with attention to detail and modern design principles."
    },
    {
      icon: <Code className="w-8 h-8 text-pink-400" />,
      title: "Developer Friendly",
      description: "Clean, maintainable code with comprehensive documentation and easy customization."
    },
    {
      icon: <Users className="w-8 h-8 text-cyan-400" />,
      title: "Team Collaboration",
      description: "Built for teams with real-time collaboration features and seamless workflow integration."
    }
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to build modern, scalable applications with confidence and style.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="glass border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 group"
            >
              <CardHeader>
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-400 mb-6">
              Join thousands of developers who are already building amazing things.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105">
                Start Building
              </button>
              <button className="border border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-200">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}