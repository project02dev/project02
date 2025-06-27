
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, TrendingUp, Users, Award, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProjectCard } from '@/components/ProjectCard'
import { CategoryCard } from '@/components/CategoryCard'
import { supabase } from '@/lib/supabase'

export const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedProjects()
    loadCategories()
  }, [])

  const loadFeaturedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles!projects_creator_id_fkey (
            username,
            avatar_url,
            is_verified
          )
        `)
        .eq('is_featured', true)
        .eq('is_approved', true)
        .limit(6)

      if (error) throw error
      setFeaturedProjects(data || [])
    } catch (error) {
      console.error('Error loading featured projects:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .limit(8)

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Craft Your Academic Success
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with talented creators to get custom projects, assignments, and academic materials tailored to your needs.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="What project do you need help with?"
                className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary"
              />
              <Button className="absolute right-2 top-2 rounded-full px-6">
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link to="/projects">Browse Projects</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <Link to="/custom-request">Request Custom Project</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-2">1,000+</h3>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-2">500+</h3>
              <p className="text-muted-foreground">Verified Creators</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-2">98%</h3>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Button variant="outline" asChild>
              <Link to="/projects" className="flex items-center space-x-2">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project: any) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  price={project.price}
                  thumbnail_url={project.thumbnail_url}
                  creator={{
                    username: project.profiles.username,
                    avatar_url: project.profiles.avatar_url,
                    is_verified: project.profiles.is_verified
                  }}
                  view_count={project.view_count}
                  tags={project.tags}
                  is_featured={project.is_featured}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find projects in your field of study from our diverse range of academic categories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category: any) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                icon={category.icon}
                projectCount={0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who have already found success with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-white border-white hover:bg-white hover:text-indigo-600" asChild>
              <Link to="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
