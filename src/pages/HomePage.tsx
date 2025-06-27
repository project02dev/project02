
import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, BookOpen, Shield, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ProjectCard } from '@/components/ProjectCard'
import { CategoryCard } from '@/components/CategoryCard'

export const HomePage = () => {
  const featuredProjects = [
    {
      id: '1',
      title: 'AI-Powered Chat Application',
      description: 'Complete React chat app with real-time messaging, user authentication, and AI integration.',
      price: 49.99,
      thumbnail_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400',
      creator: {
        username: 'techmaster',
        avatar_url: '',
        is_verified: true
      },
      rating: 4.9,
      view_count: 2847,
      tags: ['React', 'AI', 'Chat', 'WebSocket'],
      is_featured: true
    },
    {
      id: '2',
      title: 'E-commerce Mobile App Design',
      description: 'Complete mobile app design with user flow, wireframes, and high-fidelity prototypes.',
      price: 79.99,
      thumbnail_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      creator: {
        username: 'designpro',
        avatar_url: '',
        is_verified: true
      },
      rating: 4.8,
      view_count: 1923,
      tags: ['UI/UX', 'Mobile', 'E-commerce', 'Figma'],
      is_featured: true
    },
    {
      id: '3',
      title: 'Data Analytics Dashboard',
      description: 'Interactive dashboard with charts, graphs, and real-time data visualization.',
      price: 89.99,
      thumbnail_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
      creator: {
        username: 'dataexpert',
        avatar_url: '',
        is_verified: true
      },
      rating: 4.9,
      view_count: 3156,
      tags: ['Python', 'Data', 'Analytics', 'Visualization'],
      is_featured: true
    }
  ]

  const categories = [
    {
      name: 'Computer Science',
      slug: 'computer-science',
      icon: '💻',
      projectCount: 1247,
      description: 'Web development, mobile apps, algorithms, and more'
    },
    {
      name: 'Engineering',
      slug: 'engineering',
      icon: '⚙️',
      projectCount: 892,
      description: 'Mechanical, electrical, civil engineering projects'
    },
    {
      name: 'Business',
      slug: 'business',
      icon: '📊',
      projectCount: 634,
      description: 'Business plans, market research, financial models'
    },
    {
      name: 'Design',
      slug: 'design',
      icon: '🎨',
      projectCount: 756,
      description: 'UI/UX, graphic design, branding, and visual content'
    },
    {
      name: 'Mathematics',
      slug: 'mathematics',
      icon: '📐',
      projectCount: 423,
      description: 'Statistics, calculus, mathematical modeling'
    },
    {
      name: 'Science',
      slug: 'science',
      icon: '🔬',
      projectCount: 567,
      description: 'Physics, chemistry, biology research projects'
    }
  ]

  const stats = [
    { value: '10K+', label: 'Projects Delivered' },
    { value: '5K+', label: 'Happy Students' },
    { value: '1K+', label: 'Expert Creators' },
    { value: '4.9', label: 'Average Rating' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Your Academic Project Marketplace
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with expert creators to get ready-made projects or request custom academic work. 
              Quality guaranteed, delivered on time.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                <Link to="/projects">
                  Browse Projects <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/custom-request">Request Custom Project</Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for projects, topics, or creators..."
                  className="pl-12 pr-4 py-6 text-lg"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find projects in your field of study from our comprehensive collection
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                slug={category.slug}
                icon={category.icon}
                projectCount={category.projectCount}
                description={category.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-xl text-muted-foreground">
                Handpicked projects from our top creators
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/projects">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How PROJECT02 Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, secure, and efficient academic project marketplace
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>1. Browse & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find ready-made projects or post custom requests. Filter by category, price, and rating.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>2. Connect & Collaborate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chat with creators, discuss requirements, and track progress through our secure platform.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>3. Secure Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive your project with full documentation, source code, and unlimited revisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Your Project Done?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who trust PROJECT02 for their academic success
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth?mode=signup&role=student">Start as Student</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600" asChild>
              <Link to="/auth?mode=signup&role=creator">Become a Creator</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
