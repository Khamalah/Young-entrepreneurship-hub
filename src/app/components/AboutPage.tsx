import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Target, Eye, Heart, Award, Users, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, providing top-tier mentorship and resources.'
    },
    {
      icon: Heart,
      title: 'Empowerment',
      description: 'We believe in empowering young entrepreneurs to achieve their full potential.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive community where entrepreneurs can grow together.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Encouraging innovative thinking and creative problem-solving.'
    }
  ];

  const team = [
    {
      name: 'James Kariuki',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507099985932-87a4520ed1d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGVudHJlcHJlbmV1cnMlMjBtZWV0aW5nfGVufDF8fHx8MTc2NjU3ODI2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Serial entrepreneur with 15+ years of experience in building successful startups.'
    },
    {
      name: 'Mary Wanjiru',
      role: 'Director of Programs',
      image: 'https://images.unsplash.com/photo-1574593749297-cb33a69cd8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RpdmF0aW9uYWwlMjBzcGVha2luZ3xlbnwxfHx8fDE3NjY1NzgyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Expert in entrepreneurship education and youth development programs.'
    },
    {
      name: 'Peter Ochieng',
      role: 'Head of Mentorship',
      image: 'https://images.unsplash.com/photo-1761933799610-c9a75f115794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lbnRvcnNoaXB8ZW58MXx8fHwxNzY2NTc4MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Former Fortune 500 executive now dedicated to nurturing the next generation of entrepreneurs.'
    },
    {
      name: 'Linda Akinyi',
      role: 'Community Manager',
      image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NjY0OTA2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Passionate about building connections and fostering collaborative environments.'
    }
  ];

  const milestones = [
    { year: '2018', event: 'Young Entrepreneurship Hub Founded' },
    { year: '2019', event: 'Mentored First 100 Entrepreneurs' },
    { year: '2020', event: 'Launched Virtual Programs During Pandemic' },
    { year: '2021', event: 'Expanded to 5 African Countries' },
    { year: '2022', event: 'Reached 500+ Successful Businesses' },
    { year: '2023', event: 'Launched Partnership Program' },
    { year: '2024', event: 'Opened Innovation Hub in Nairobi' }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-[#0d4a07] text-white py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl mb-6">About Us</h1>
            <p className="text-xl text-white/90">
              Building the future of entrepreneurship in Africa, one young visionary at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Young Entrepreneurship Hub was born from a simple observation: young people have incredible ideas but often lack the support, mentorship, and resources to turn those ideas into successful businesses.
                </p>
                <p>
                  Founded in 2018, we started with a small group of mentors and a handful of aspiring entrepreneurs. Today, we've grown into a thriving community of over 500 entrepreneurs, 50+ mentors, and countless success stories.
                </p>
                <p>
                  Our mission has remained constant: to empower young entrepreneurs with the knowledge, skills, connections, and confidence they need to build sustainable, impactful businesses.
                </p>
                <p>
                  We believe that entrepreneurship is not just about building businesses—it's about creating opportunities, solving problems, and making a positive impact on communities.
                </p>
              </div>
              <div className="mt-8">
                <Button
                  onClick={() => navigate('/contact')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Get in Touch
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NjY0OTA2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team collaboration"
                className="rounded-lg shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-secondary p-6 rounded-lg shadow-xl">
                <div className="text-4xl font-bold text-black">500+</div>
                <div className="text-black">Entrepreneurs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-t-4 border-t-primary">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To empower young entrepreneurs across Africa with world-class mentorship, resources, and community support to build successful, sustainable businesses that create positive change.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-2xl mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  A thriving Africa where every young person with entrepreneurial ambition has the opportunity, support, and resources to transform their ideas into impactful businesses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Our Journey</h2>
            <p className="text-muted-foreground text-lg">
              Key milestones in our growth story
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1 pt-4">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-lg">{milestone.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Passionate leaders dedicated to empowering the next generation of entrepreneurs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="mb-1">{member.name}</h3>
                  <div className="text-primary mb-3">{member.role}</div>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-[#0d4a07] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Be part of a network that's transforming entrepreneurship in Africa
          </p>
          <Button
            onClick={() => navigate('/booking')}
            size="lg"
            className="bg-secondary hover:bg-accent text-black"
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
}
