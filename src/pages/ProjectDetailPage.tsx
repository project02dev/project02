
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Eye, Heart, Download, Share, MessageCircle, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

export const ProjectDetailPage = () => {
  const { id } = useParams()
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Mock project data
  const project = {
    id: '1',
    title: 'Full-Stack E-commerce Platform',
    description: 'Complete e-commerce solution with React frontend, Node.js backend, and PostgreSQL database. Includes payment integration, user authentication, and admin panel.',
    longDescription: `This comprehensive e-commerce platform is built using modern web technologies and follows industry best practices. The project includes:

- React frontend with responsive design
- Node.js backend with Express.js
- PostgreSQL database with optimized queries
- Stripe payment integration
- JWT authentication system
- Admin dashboard for inventory management
- Order tracking and email notifications
- RESTful API with proper error handling
- Unit and integration tests
- Docker containerization for easy deployment

Perfect for students learning full-stack development or for use as a starting point for commercial projects.`,
    
    price: 149.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800',
    preview_images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800'
    ],
    creator: {
      username: 'fullstack_dev',
      full_name: 'Alex Johnson',
      avatar_url: '',
      is_verified: true,
      bio: 'Senior Full-Stack Developer with 8+ years of experience building scalable web applications.',
      rating: 4.9,
      total_projects: 45,
      total_sales: 1247
    },
    rating: 4.9,
    total_reviews: 127,
    view_count: 3247,
    sales_count: 89,
    tags: ['React', 'Node.js', 'PostgreSQL', 'E-commerce', 'Stripe', 'JWT'],
    is_featured: true,
    delivery_time: '2-3 days',
    revisions: 'Unlimited',
    files_included: [
      'Complete source code',
      'Database setup scripts',
      'API documentation',
      'Deployment guide',
      'User manual',
      'Video tutorials'
    ],
    requirements: [
      'Node.js 16+ installed',
      'PostgreSQL database',
      'Basic knowledge of React',
      'Text editor (VS Code recommended)'
    ],
    last_updated: '2024-01-10'
  }

  const reviews = [
    {
      id: '1',
      user: 'student123',
      rating: 5,
      comment: 'Excellent project! Very well documented and easy to understand. The code is clean and follows best practices.',
      date: '2023-12-15',
      helpful_count: 12
    },
    {
      id: '2',
      user: 'webdev_learner',
      rating: 4,
      comment: 'Great starting point for learning full-stack development. The video tutorials were especially helpful.',
      date: '2023-12-10',
      helpful_count: 8
    },
    {
      id: '3',
      user: 'coding_newbie',
      rating: 5,
      comment: 'Amazing project! The creator was very responsive and helped me with setup. Highly recommended!',
      date: '2023-12-05',
      helpful_count: 15
    }
  ]

  const handlePurchase = () => {
    // Handle purchase logic
    console.log('Purchasing project:', id)
  }

  const handleContactCreator = () => {
    // Handle contact creator logic
    console.log('Contacting creator')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Project Images */}
          <div className="mb-8">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {project.preview_images.slice(0, 3).map((image, index) => (
                <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {project.is_featured && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                  Featured
                </Badge>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{project.rating}</span>
                <span className="text-muted-foreground">({project.total_reviews})</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{project.view_count} views</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-muted-foreground">{project.sales_count} sales</span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="files">Files Included</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none dark:prose-invert">
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="whitespace-pre-line">{project.longDescription}</div>
                </div>
              </TabsContent>
              
              <TabsContent value="files" className="mt-6">
                <div className="space-y-2">
                  {project.files_included.map((file, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-green-600" />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="requirements" className="mt-6">
                <div className="space-y-2">
                  {project.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-600 rounded-full" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-center gap-4 mb-3">
                        <Avatar>
                          <AvatarFallback>
                            {review.user.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.user}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{review.comment}</p>
                      <Button variant="ghost" size="sm">
                        Helpful ({review.helpful_count})
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-600">
                ${project.price}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Delivery</span>
                </div>
                <span className="font-medium">{project.delivery_time}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Revisions</span>
                </div>
                <span className="font-medium">{project.revisions}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Button onClick={handlePurchase} className="w-full bg-green-600 hover:bg-green-700">
                  Purchase Now
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creator Card */}
          <Card>
            <CardHeader>
              <CardTitle>About the Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={project.creator.avatar_url} />
                  <AvatarFallback>
                    {project.creator.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{project.creator.full_name}</div>
                  <div className="text-sm text-muted-foreground">
                    @{project.creator.username}
                    {project.creator.is_verified && (
                      <span className="ml-2 text-blue-600">✓</span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {project.creator.bio}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{project.creator.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Projects:</span>
                  <span>{project.creator.total_projects}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales:</span>
                  <span>{project.creator.total_sales}</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleContactCreator}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Creator
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
