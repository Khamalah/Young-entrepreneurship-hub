import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowRight, Users, Target, Lightbulb, TrendingUp, CheckCircle, Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  isLoggedIn?: boolean;
}

export function HomePage({ isLoggedIn = false }: HomePageProps) {
  const navigate = useNavigate();

  const services = [
    {
      icon: Users,
      title: 'Mentorship Programs',
      description: 'Connect with experienced entrepreneurs who guide you through your business journey.',
      className: 'border-t-primary',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/20'
    },
    {
      icon: Target,
      title: 'Talks & Speaking',
      description: 'Inspiring talks and workshops from industry leaders and successful entrepreneurs.',
      className: 'border-t-secondary',
      iconColor: 'text-secondary-foreground',
      iconBg: 'bg-secondary/20'
    },
    {
      icon: Lightbulb,
      title: 'Empowerment Sessions',
      description: 'Interactive sessions designed to build your skills and confidence.',
      className: 'border-t-accent',
      iconColor: 'text-accent-foreground',
      iconBg: 'bg-accent/20'
    },
    {
      icon: TrendingUp,
      title: 'Business Growth',
      description: 'Strategies and tools to scale your business and achieve sustainable growth.',
      className: 'border-t-primary',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/20'
    }
  ];

  const stats = [
    { number: '...+', label: 'Entrepreneurs Mentored' },
    { number: '...', label: 'Workshops Conducted' },
    { number: '...+', label: 'Business Partners' },
    { number: '95%', label: 'Success Rate' }
  ];

  const testimonials = [
    {
      name: 'Khamalah Cliff',
      role: 'Tech Startup Founder',
      content: 'Young Entrepreneurship Hub transformed my business idea into a thriving reality. The mentorship was invaluable!',
      image: 'https://images.unsplash.com/photo-1507099985932-87a4520ed1d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGVudHJlcHJlbmV1cnMlMjBtZWV0aW5nfGVufDF8fHx8MTc2NjU3ODI2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      name: 'Khamalah Khamalah',
      role: 'E-commerce Entrepreneur',
      content: 'The practical advice and networking opportunities here are unmatched. I found my first investor through this hub!',
      image: 'https://images.unsplash.com/photo-1761933799610-c9a75f115794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lbnRvcnNoaXB8ZW58MXx8fHwxNzY2NTc4MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      name: 'Mutiso Mutiso',
      role: 'Social Enterprise Founder',
      content: 'From idea to impact - this hub gave me the tools, confidence, and connections to make a real difference.',
      image: 'https://images.unsplash.com/photo-1574593749297-cb33a69cd8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RpdmF0aW9uYWwlMjBzcGVha2luZ3xlbnwxfHx8fDE3NjY1NzgyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  return (
    <div className="w-full">
      { /* Hero Section */}
      { /* Hero Section */}
      <section className="relative min-h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden py-12 md:py-0">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NjY0OTA2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral")'
            }}
          />
          <div className="absolute inset-0 bg-[#0f1419]/90" />
        </div>

        <div className="container mx-auto px-6 md:px-8 relative z-20 pt-10 md:pt-20">
          <div className="max-w-3xl text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-6xl mb-4 md:mb-6 font-bold text-white leading-tight">
              Empowering Young Entrepreneurs to Build Tomorrow
            </h1>
            <p className="text-lg md:text-2xl mb-6 md:mb-8 text-gray-300 max-w-2xl mx-auto md:mx-0">
              Transform your business vision into reality with expert mentorship, resources, and a supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              {!isLoggedIn ? (
                <>
                  <Link to="/signup">
                    <Button
                      size="lg"
                      className="bg-secondary hover:bg-secondary/90 text-navy font-bold px-8 h-12"
                    >
                      Create Account
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-white text-white hover:bg-white hover:text-navy px-8 h-12 font-bold"
                    >
                      Login
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="bg-secondary hover:bg-secondary/90 text-navy font-bold px-8 h-12"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/booking">
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-white text-white hover:bg-white hover:text-navy px-8 h-12 font-bold"
                    >
                      Book a Session
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl mb-2 text-primary">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">
              Why Choose Young Entrepreneurship Hub?
            </h2>
            <p className="text-muted-foreground text-lg">
              We provide comprehensive support to help young entrepreneurs succeed in today's competitive business landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className={`hover:shadow-lg transition-shadow border-t-4 ${service.className}`}>
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${service.iconBg}`}
                    >
                      <Icon className={`w-6 h-6 ${service.iconColor}`} />
                    </div>
                    <h3 className="mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/services')}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Explore All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">
              Your Journey to Success
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple steps to transform your entrepreneurial dreams into reality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Join Our Community',
                description: 'Sign up and get access to our resources, events, and mentorship programs.',
              },
              {
                step: '02',
                title: 'Get Matched with Mentors',
                description: 'Connect with experienced entrepreneurs in your industry for personalized guidance.',
              },
              {
                step: '03',
                title: 'Grow Your Business',
                description: 'Implement insights, build connections, and scale your business with confidence.',
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl bg-secondary text-primary-foreground font-bold"
                >
                  {item.step}
                </div>
                <h3 className="mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">
              Success Stories
            </h2>
            <p className="text-muted-foreground text-lg">
              Hear from entrepreneurs who have transformed their businesses with our support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary mb-4 opacity-50" />
                  <p className="mb-6 text-muted-foreground">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div>{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-[#0d4a07] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">
            Ready to Start Your Entrepreneurial Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join hundreds of young entrepreneurs who are building successful businesses with our support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/booking')}
              size="lg"
              className="bg-secondary hover:bg-accent text-navy"
            >
              Book a Free Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}