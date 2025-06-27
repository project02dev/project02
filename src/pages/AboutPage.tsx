
import React from 'react'
import { Users, Target, Award, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To connect students with expert creators and provide high-quality academic projects that enhance learning and academic success.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building a supportive community where students and creators can collaborate, learn, and grow together.'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Every project is reviewed and tested to ensure it meets our high standards for code quality, documentation, and educational value.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'We prioritize the security and privacy of our users with secure payments, data protection, and dispute resolution.'
    }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former software engineer turned educator, passionate about bridging the gap between academic theory and practical application.',
      image: ''
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Full-stack developer with 10+ years of experience building scalable platforms and educational technology solutions.',
      image: ''
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of Community',
      bio: 'Community builder and educator focused on creating positive learning experiences for students and creators.',
      image: ''
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About PROJECT02</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're building the world's largest marketplace for academic projects, connecting students with expert creators to enhance learning and academic success.
        </p>
      </section>

      {/* Story Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                PROJECT02 was born from a simple observation: students need practical, hands-on projects to truly understand their coursework, while talented creators want to share their expertise and earn from their skills.
              </p>
              <p>
                Founded in 2023, we've grown from a small team of educators and developers to a thriving platform serving thousands of students and creators worldwide. Our mission remains the same: to make quality academic projects accessible to everyone.
              </p>
              <p>
                Today, PROJECT02 hosts over 10,000 projects across multiple disciplines, from computer science and engineering to business and design. We're proud to be the bridge between academic learning and real-world application.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">Projects Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">5K+</div>
                <div className="text-sm text-muted-foreground">Happy Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">1K+</div>
                <div className="text-sm text-muted-foreground">Expert Creators</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">4.9</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="h-24 w-24 bg-muted rounded-full mx-auto mb-4">
                  {/* Placeholder for team member image */}
                </div>
                <CardTitle>{member.name}</CardTitle>
                <p className="text-green-600 font-medium">{member.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="text-xl mb-8 opacity-90">
          Whether you're a student looking for quality projects or a creator wanting to share your expertise, PROJECT02 is your platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Start as Student
          </button>
          <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-green-600 transition-colors">
            Become a Creator
          </button>
        </div>
      </section>
    </div>
  )
}
