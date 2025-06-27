
import React, { useState } from 'react'
import { MessageCircle, Phone, Mail, Clock, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export const SupportPage = () => {
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    message: ''
  })

  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24 hours',
      action: 'Send Email'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Talk to our support team directly',
      availability: 'Mon-Fri, 9AM-6PM EST',
      action: 'Call Now'
    }
  ]

  const faqs = [
    {
      id: '1',
      question: 'How do I purchase a project?',
      answer: 'To purchase a project, browse our project library, select the project you want, and click "Purchase". You\'ll be guided through the secure checkout process.'
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely.'
    },
    {
      id: '3',
      question: 'How do I become a creator?',
      answer: 'Sign up for a creator account, complete your profile verification, and start uploading your projects. Our team will review your first project before it goes live.'
    },
    {
      id: '4',
      question: 'What is the commission rate for creators?',
      answer: 'PROJECT02 takes a 20% commission on all sales. This helps us maintain the platform, provide customer support, and continue improving our services.'
    },
    {
      id: '5',
      question: 'How do I request a custom project?',
      answer: 'Go to the "Custom Request" page, fill out the project requirements, set your budget and deadline, and creators will submit bids for your project.'
    },
    {
      id: '6',
      question: 'Can I get a refund?',
      answer: 'Refunds are handled case-by-case. For ready-made projects, refunds are generally not available once downloaded. For custom projects, refunds may be available under certain circumstances.'
    }
  ]

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle ticket submission
    console.log('Ticket submitted:', ticketForm)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Support Center</h1>
        <p className="text-muted-foreground">Get help with your PROJECT02 experience</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {supportOptions.map((option, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <option.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-lg">{option.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{option.description}</p>
              <div className="flex items-center justify-center gap-1 mb-4">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{option.availability}</span>
              </div>
              <Button className="w-full">{option.action}</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submit Ticket */}
        <Card>
          <CardHeader>
            <CardTitle>Submit a Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={ticketForm.category} onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="account">Account Management</SelectItem>
                    <SelectItem value="projects">Project Issues</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue in detail"
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  rows={6}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Submit Ticket</Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search FAQs..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {faqs.map((faq) => (
                <Collapsible key={faq.id} open={openFaq === faq.id} onOpenChange={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-muted rounded-lg">
                    <span className="font-medium">{faq.question}</span>
                    {openFaq === faq.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-3">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <MessageCircle className="h-6 w-6 mb-2" />
              User Guide
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Phone className="h-6 w-6 mb-2" />
              Video Tutorials
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Mail className="h-6 w-6 mb-2" />
              Community Forum
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Status Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
