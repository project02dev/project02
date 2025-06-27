
import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Eye, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  price: number
  thumbnail_url?: string
  creator: {
    username: string
    avatar_url?: string
    is_verified: boolean
  }
  rating?: number
  view_count: number
  tags?: string[]
  is_featured?: boolean
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  price,
  thumbnail_url,
  creator,
  rating = 4.8,
  view_count,
  tags = [],
  is_featured = false
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="relative">
        {is_featured && (
          <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-500 to-orange-500">
            Featured
          </Badge>
        )}
        
        <Link to={`/projects/${id}`}>
          <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
            {thumbnail_url ? (
              <img
                src={thumbnail_url}
                alt={title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600" />
                  <p className="text-sm">Project Preview</p>
                </div>
              </div>
            )}
          </div>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/projects/${id}`} className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={creator.avatar_url} />
              <AvatarFallback className="text-xs">
                {creator.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{creator.username}</span>
            {creator.is_verified && (
              <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{view_count}</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-primary">${price}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
