
import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const faqCategories = [
    {
      title: 'General',
      faqs: [
        {
          id: 'general-1',
          question: 'What is PROJECT02?',
          answer: 'PROJECT02 is an online marketplace that connects students with expert creators for academic projects. Students can purchase ready-made projects or request custom work, while creators can sell their expertise and earn money.'
        },
        {
          id: 'general-2',
          question: 'How does PROJECT02 work?',
          answer: 'Students can browse our catalog of ready-made projects or post custom requests. Creators can upload projects for sale or bid on custom requests. All transactions are secure and protected by our platform.'
        },
        {
          id: 'general-3',
          question: 'Is PROJECT02 free to use?',
          answer: 'Creating an account is free for both students and creators. Students pay for projects they purchase. Creators pay a small commission on sales to cover platform costs and payment processing.'
        }
      ]
    },
    {
      title: 'For Students',
      faqs: [
        {
          id: 'student-1',
          question: 'How do I purchase a project?',
          answer: 'Browse our project catalog, select a project you like, and click "Purchase Now". You\'ll be guided through a secure checkout process. Once payment is confirmed, you\'ll receive immediate access to download the project files.'
        },
        {
          id: 'student-2',
          question: 'Can I request custom projects?',
          answer: 'Yes! Click "Request Custom Project" and describe your requirements. Creators will submit bids, and you can choose the best offer. Custom projects are great for specific requirements or unique assignments.'
        },
        {
          id: 'student-3',
          question: 'What if I\'m not satisfied with a project?',
          answer: 'We offer revision requests for custom projects and a satisfaction guarantee. If you encounter issues, contact the creator directly or reach out to our support team for assistance.'
        },
        {
          id: 'student-4',
          question: 'Are the projects original and plagiarism-free?',
          answer: 'All projects are created by verified creators and go through quality checks. We have strict policies against plagiarism and ensure all work is original. However, we recommend using projects as learning references and adapting them for your specific needs.'
        }
      ]
    },
    {
      title: 'For Creators',
      faqs: [
        {
          id: 'creator-1',
          question: 'How do I become a creator?',
          answer: 'Sign up for a creator account, complete your profile with your skills and experience, and start uploading projects. New creators go through a verification process to ensure quality standards.'
        },
        {
          id: 'creator-2',
          question: 'What commission does PROJECT02 charge?',
          answer: 'We charge a 20% commission on all sales, which covers payment processing, platform maintenance, and customer support. This is competitive with other freelancing platforms.'
        },
        {
          id: 'creator-3',
          question: 'How and when do I get paid?',
          answer: 'Payments are processed weekly to your chosen payment method (PayPal, bank transfer, etc.). You can withdraw your earnings once they reach the minimum threshold of $20.'
        },
        {
          id: 'creator-4',
          question: 'What types of projects can I sell?',
          answer: 'You can sell any academic project including code, designs, research papers, business plans, and more. Projects must be original work and meet our quality standards.'
        }
      ]
    },
    {
      title: 'Payments & Security',
      faqs: [
        {
          id: 'payment-1',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, PayPal, and various digital payment methods. All payments are processed securely through our encrypted payment system.'
        },
        {
          id: 'payment-2',
          question: 'Is my payment information secure?',
          answer: 'Yes, we use industry-standard encryption and security measures. We don\'t store your payment information on our servers - all transactions are processed through secure payment gateways.'
        },
        {
          id: 'payment-3',
          question: 'Can I get a refund?',
          answer: 'Refunds are handled on a case-by-case basis. For ready-made projects, refunds are generally not available once downloaded. For custom projects, refunds may be available if the creator fails to deliver as agreed.'
        }
      ]
    }
  ]

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about PROJECT02
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQs.map((category) => (
            <div key={category.title}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold">{category.title}</h2>
                <Badge variant="secondary">{category.faqs.length}</Badge>
              </div>
              
              <div className="space-y-4">
                {category.faqs.map((faq) => (
                  <Card key={faq.id}>
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleItem(faq.id)}
                    >
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>{faq.question}</span>
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    {openItems.includes(faq.id) && (
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No FAQs found matching "{searchQuery}"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <Button asChild>
            <a href="/contact">Contact Support</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
