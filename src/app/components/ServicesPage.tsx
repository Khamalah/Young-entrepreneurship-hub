import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Users, MessageSquare, Sparkles, Calendar,
  CheckCircle, ArrowRight, BookOpen, Target,
  TrendingUp, Lightbulb, Award, Clock
} from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

export function ServicesPage() {
  const navigate = useNavigate();

  const mainServices = [
    {
      icon: Users,
      title: 'Mentorship Programs',
      description: 'One-on-one guidance from experienced entrepreneurs',
      image: 'https://images.unsplash.com/photo-1761933799610-c9a75f115794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lbnRvcnNoaXB8ZW58MXx8fHwxNzY2NTc4MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      features: [
        'Personalized mentorship matching',
        'Monthly one-on-one sessions',
        'Access to mentor network',
        'Business plan review',
        'Strategic guidance',
        '6-month program duration'
      ],
      iconBg: 'bg-primary/20',
      iconColor: 'text-primary'
    },
    {
      icon: MessageSquare,
      title: 'Talks & Speaking',
      description: 'Inspiring keynotes and workshops from industry leaders and successful entrepreneurs',
      image: 'https://images.unsplash.com/photo-1574593749297-cb33a69cd8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RpdmF0aW9uYWwlMjBzcGVha2luZ3xlbnwxfHx8fDE3NjY1NzgyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      features: [
        'Monthly guest speakers',
        'Industry expert panels',
        'Q&A sessions',
        'Networking opportunities',
        'Live and virtual events',
        'Topics across all industries'
      ],
      iconBg: 'bg-secondary/20',
      iconColor: 'text-secondary-foreground'
    },
    {
      icon: Sparkles,
      title: 'Empowerment Sessions',
      description: 'Interactive workshops to build skills and confidence',
      image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NjY0OTA2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      features: [
        'Leadership development',
        'Financial literacy',
        'Marketing & branding',
        'Sales strategies',
        'Team building',
        'Practical skill workshops'
      ],
      iconBg: 'bg-accent/20',
      iconColor: 'text-accent-foreground'
    }
  ];

  const additionalServices = [
    {
      icon: BookOpen,
      title: 'Resource Library',
      description: 'Access templates, guides, and business tools'
    },
    {
      icon: Target,
      title: 'Business Planning',
      description: 'Support in developing comprehensive business plans'
    },
    {
      icon: TrendingUp,
      title: 'Growth Strategy',
      description: 'Scaling strategies for established businesses'
    },
    {
      icon: Lightbulb,
      title: 'Innovation Labs',
      description: 'Collaborative spaces for ideation and prototyping'
    },
    {
      icon: Award,
      title: 'Pitch Competitions',
      description: 'Opportunities to pitch and win funding'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      description: 'Weekly drop-in sessions with experts'
    }
  ];

  const packages = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for aspiring entrepreneurs',
      features: [
        'Access to monthly talks',
        'Community forum access',
        'Resource library (basic)',
        'Monthly newsletter',
        'Event invitations'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Growth',
      price: 'KES 5,000/month',
      description: 'For serious entrepreneurs ready to scale',
      features: [
        'All Starter benefits',
        '1-on-1 mentorship (2 sessions/month)',
        'Full resource library',
        'Empowerment workshops',
        'Networking events',
        'Priority event registration'
      ],
      cta: 'Choose Growth',
      highlighted: true
    },
    {
      name: 'Premium',
      price: 'KES 15,000/month',
      description: 'Complete support for high-growth ventures',
      features: [
        'All Growth benefits',
        'Weekly mentorship sessions',
        'Business plan review',
        'Pitch deck development',
        'Investor introductions',
        'Dedicated account manager',
        'Office space access'
      ],
      cta: 'Go Premium',
      highlighted: false
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-[#0d4a07] text-white py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl mb-6">Our Services</h1>
            <p className="text-xl text-white/90">
              Comprehensive support designed to help you succeed at every stage of your entrepreneurial journey.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="space-y-20">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  <div className={isEven ? '' : 'md:order-2'}>
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${service.iconBg}`}
                    >
                      <Icon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>
                    <h2 className="text-3xl md:text-4xl mb-4">{service.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => navigate('/booking')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Book This Service
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                  <div className={isEven ? '' : 'md:order-1'}>
                    <ImageWithFallback
                      src={service.image}
                      alt={service.title}
                      className="rounded-lg shadow-xl w-full h-[400px] object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Additional Benefits</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              More ways we support your entrepreneurial journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Choose Your Package</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select the plan that best fits your entrepreneurial needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative ${pkg.highlighted ? 'border-primary border-2 shadow-xl md:scale-105' : ''}`}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl mb-2">{pkg.name}</h3>
                  <div className="text-3xl mb-2 text-primary">
                    {pkg.price}
                  </div>
                  <p className="text-muted-foreground mb-6">{pkg.description}</p>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => navigate('/booking')}
                    className={`w-full ${pkg.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={pkg.highlighted ? 'default' : 'outline'}
                  >
                    {pkg.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Need a custom package for your organization?
            </p>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
            >
              Contact Us for Enterprise Solutions
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-[#0d4a07] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Book a free consultation to discuss which services are right for you
          </p>
          <Button
            onClick={() => navigate('/booking')}
            size="lg"
            className="bg-secondary hover:bg-accent text-black"
          >
            Schedule Free Consultation
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
