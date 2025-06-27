
import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CategoryCardProps {
  name: string
  slug: string
  icon?: string
  projectCount?: number
  description?: string
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  slug,
  icon,
  projectCount = 0,
  description
}) => {
  return (
    <Link to={`/categories/${slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            {icon ? (
              <div className="h-12 w-12 mx-auto mb-3 text-4xl">
                {icon}
              </div>
            ) : (
              <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600" />
            )}
          </div>
          
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          
          {description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
          )}
          
          <Badge variant="secondary" className="text-xs">
            {projectCount} Projects
          </Badge>
        </CardContent>
      </Card>
    </Link>
  )
}
