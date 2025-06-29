
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, User, Menu, X, ShoppingBag, MessageCircle, Bell, Moon, Sun } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/contexts/ThemeContext'

export const Header = () => {
  const { user, profile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/741cf823-96bd-4315-a0b0-2cf8a87a72be.png" 
              alt="PROJECT02" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              PROJECT02
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, creators..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <>
                {/* Navigation Icons */}
                <div className="hidden md:flex items-center space-x-3">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={profile?.role === 'creator' ? '/creator/orders' : '/student/orders'}>
                      <ShoppingBag className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={profile?.role === 'creator' ? '/creator/messages' : '/student/messages'}>
                      <MessageCircle className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={profile?.role === 'creator' ? '/creator/notifications' : '/student/notifications'}>
                      <Bell className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback>
                          {profile?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem asChild>
                      <Link to={profile?.role === 'creator' ? '/creator/dashboard' : profile?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}>
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={profile?.role === 'creator' ? '/creator/profile' : '/student/profile'}>
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link to="/auth?mode=signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-10" />
              </div>
              
              {user && (
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to={profile?.role === 'creator' ? '/creator/dashboard' : profile?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to={profile?.role === 'creator' ? '/creator/orders' : '/student/orders'}>
                      Orders
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to={profile?.role === 'creator' ? '/creator/messages' : '/student/messages'}>
                      Messages
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
