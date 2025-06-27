
import React, { useState } from 'react'
import { Search, Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ProjectCard } from '@/components/ProjectCard'

export const ProjectsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const projects = [
    {
      id: '1',
      title: 'Full-Stack E-commerce Platform',
      description: 'Complete e-commerce solution with React frontend, Node.js backend, and PostgreSQL database. Includes payment integration, user authentication, and admin panel.',
      price: 149.99,
      thumbnail_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400',
      creator: {
        username: 'fullstack_dev',
        avatar_url: '',
        is_verified: true
      },
      rating: 4.9,
      view_count: 3247,
      tags: ['React', 'Node.js', 'PostgreSQL', 'E-commerce'],
      is_featured: true
    },
    {
      id: '2',
      title: 'Machine Learning Image Classifier',
      description: 'Python-based image classification model using TensorFlow and Keras. Includes data preprocessing, model training, and deployment scripts.',
      price: 89.99,
      thumbnail_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      creator: {
        username: 'ai_researcher',
        avatar_url: '',
        is_verified: true
      },
      rating: 4.8,
      view_count: 1892,
      tags: ['Python', 'TensorFlow', 'Machine Learning', 'AI'],
      is_featured: false
    },
    {
      id: '3',
      title: 'Mobile App UI/UX Design Kit',
      description: 'Complete mobile app design system with 50+ screens, components, and design tokens. Available in Figma and Sketch formats.',
      price: 59.99,
      thumbnail_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
      creator: {
        username: 'design_master',
        avatar_url: '',
        is_verified: true
      },
      rating: 4.9,
      view_count: 2156,
      tags: ['UI/UX', 'Mobile', 'Figma', 'Design System'],
      is_featured: false
    },
    {
      id: '4',
      title: 'Blockchain Cryptocurrency Wallet',
      description: 'Secure cryptocurrency wallet application with multi-currency support, transaction history, and hardware wallet integration.',
      price: 199.99,
      thumbnail_url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400',
      creator: {
        username: 'blockchain_dev',
        avatar_url: '',
        is_verified: true
      },
      rating: 4.7,
      view_count: 1567,
      tags: ['Blockchain', 'Cryptocurrency', 'Security', 'Wallet'],
      is_featured: true
    }
  ]

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business' },
    { value: 'design', label: 'Design' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' }
  ]

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: '$0 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: '$200+' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Projects</h1>
        <p className="text-muted-foreground">Discover ready-made academic projects from expert creators</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, topics, or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {selectedCategory !== 'all' && (
          <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
            {categories.find(c => c.value === selectedCategory)?.label} ×
          </Badge>
        )}
        {priceRange !== 'all' && (
          <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange('all')}>
            {priceRanges.find(r => r.value === priceRange)?.label} ×
          </Badge>
        )}
        {searchQuery && (
          <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery('')}>
            "{searchQuery}" ×
          </Badge>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {projects.length} results
        </p>
      </div>

      {/* Projects Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>

      {/* Load More */}
      <div className="mt-12 text-center">
        <Button variant="outline" size="lg">
          Load More Projects
        </Button>
      </div>
    </div>
  )
}
