
import React, { useState } from 'react'
import { Search, Filter, Star, Eye, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link } from 'react-router-dom'

export const BrowseProjects = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  const projects = [
    {
      id: '1',
      title: 'React E-commerce Website',
      description: 'Complete e-commerce solution with admin panel, payment integration, and responsive design.',
      price: 89.99,
      category: 'Web Development',
      rating: 4.8,
      views: 1247,
      sales: 23,
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
      creator: 'webdev_pro',
      tags: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: '2',
      title: 'Data Analysis with Python',
      description: 'Comprehensive data analysis project using pandas, numpy, and matplotlib.',
      price: 59.99,
      category: 'Data Science',
      rating: 4.9,
      views: 892,
      sales: 15,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      creator: 'data_scientist',
      tags: ['Python', 'Pandas', 'Matplotlib']
    },
    {
      id: '3',
      title: 'Mobile App UI Design',
      description: 'Modern mobile app UI/UX design with Figma files and design system.',
      price: 79.99,
      category: 'Design',
      rating: 4.7,
      views: 654,
      sales: 8,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop',
      creator: 'ui_designer',
      tags: ['Figma', 'UI/UX', 'Mobile']
    }
  ]

  const categories = [
    'All Categories',
    'Web Development',
    'Mobile Development', 
    'Data Science',
    'Design',
    'Machine Learning',
    'Database',
    'Cybersecurity'
  ]

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Projects</h1>
        <p className="text-muted-foreground">Discover ready-made projects for your academic needs</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category === 'All Categories' ? 'all' : category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-50">$0 - $50</SelectItem>
              <SelectItem value="50-100">$50 - $100</SelectItem>
              <SelectItem value="100+">$100+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="card-hover">
            <div className="relative">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge className="absolute top-2 right-2 bg-primary">
                {project.category}
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${project.price}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{project.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{project.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{project.sales}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">by {project.creator}</p>
                <Button asChild>
                  <Link to={`/student/projects/${project.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
