import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Handshake, Building, Users, TrendingUp, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export function PartnershipPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    partnershipType: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const partnershipTypes = [
    {
      icon: Building,
      title: 'Corporate Partnerships',
      description: 'Collaborate with us to support young entrepreneurs through CSR initiatives, sponsorships, and employee engagement programs.',
      benefits: [
        'Brand visibility',
        'Community impact',
        'Access to innovation',
        'Employee engagement opportunities'
      ]
    },
    {
      icon: Users,
      title: 'Educational Institutions',
      description: 'Partner with us to provide entrepreneurship programs, workshops, and mentorship for your students.',
      benefits: [
        'Enhanced curriculum',
        'Student career support',
        'Industry connections',
        'Joint research opportunities'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Investment Partners',
      description: 'Connect with our vetted entrepreneurs and gain access to investment opportunities in promising startups.',
      benefits: [
        'Curated deal flow',
        'Due diligence support',
        'Portfolio company access',
        'Co-investment opportunities'
      ]
    },
    {
      icon: Award,
      title: 'Service Providers',
      description: 'Offer your services to our community and help young entrepreneurs access essential business resources.',
      benefits: [
        'Market access',
        'Client referrals',
        'Collaborative projects',
        'Brand partnerships'
      ]
    }
  ];

  const currentPartners = [
    'Tech Innovation Hub',
    'Global Ventures Capital',
    'University of Nairobi',
    'Business Leaders Forum',
    'Digital Marketing Agency',
    'Legal Advisory Services'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Partnership inquiries are essentially messages with more details
      // using the messages table for simplicity, but appending details to the body
      const { error } = await supabase.from('messages').insert({
        name: formData.organizationName + ' - ' + formData.contactName,
        email: formData.email,
        phone: formData.phone,
        subject: 'Partnership Inquiry: ' + formData.partnershipType,
        message: formData.message,
        status: 'unread'
      });

      if (error) {
        toast.error('Failed to submit inquiry: ' + error.message);
      } else {
        setIsSubmitted(true);
        toast.success('Partnership inquiry submitted!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="w-full min-h-screen bg-muted flex items-center justify-center">
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl mb-4">Thank You for Your Interest!</h2>
              <p className="text-muted-foreground mb-8">
                We've received your partnership inquiry. Our team will review your information and get back to you within 48 hours to discuss potential collaboration opportunities.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-primary hover:bg-primary/90"
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-[#0d4a07] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Handshake className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl mb-6">Partnership Opportunities</h1>
            <p className="text-xl text-white/90">
              Join us in empowering the next generation of African entrepreneurs. Together, we can create lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Ways to Partner</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We offer flexible partnership models to suit different organizations and goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {partnershipTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl mb-3">{type.title}</h3>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    <div className="space-y-2">
                      {type.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-4">Let's Collaborate</h2>
              <p className="text-muted-foreground text-lg">
                Fill out the form below and we'll get in touch to discuss partnership opportunities
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block mb-2">Organization Name *</label>
                    <Input
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      placeholder="Your organization"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Contact Person *</label>
                      <Input
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        placeholder="Full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Email Address *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Phone Number *</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+254 700 816 697"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Partnership Type *</label>
                      <Select
                        value={formData.partnershipType}
                        onValueChange={(value) => handleInputChange('partnershipType', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate Partnership</SelectItem>
                          <SelectItem value="educational">Educational Institution</SelectItem>
                          <SelectItem value="investment">Investment Partner</SelectItem>
                          <SelectItem value="service">Service Provider</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Tell Us About Your Interest *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Describe your organization and how you'd like to partner with us..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Partnership Inquiry'}
                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Our Partners</h2>
            <p className="text-muted-foreground text-lg">
              Trusted organizations we work with to support young entrepreneurs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {currentPartners.map((partner, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg bg-muted flex items-center justify-center p-4 text-center hover:shadow-md transition-shadow"
              >
                <span className="text-sm">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-[#0d4a07] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Questions About Partnership?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Get in touch with our partnerships team to learn more
          </p>
          <Button
            onClick={() => navigate('/contact')}
            size="lg"
            className="bg-secondary hover:bg-accent text-black"
          >
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
}
