import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Shield, Award, Lightbulb, Users, Globe, Target, Eye } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

import mutisoImg from '../../assets/mutiso1.jpg';
import khamalaImg from '../../assets/khamala1.jpg'
import edgarImg from '../../assets/edgar3.jpg';
import manuImg from '../../assets/manu1.jpg';
import faithImg from '../../assets/faith2.jpg';



export function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: 'Integrity and Accountability',
      description: 'We uphold the highest standards of honesty and take full responsibility for our actions.'
    },
    {
      icon: Award,
      title: 'Courageous Leadership',
      description: 'Nurturing leaders who are bold enough to challenge the status quo and drive change.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation and Creativity',
      description: 'Encouraging "out-of-the-box" thinking to solve complex business and societal problems.'
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'Creating an environment where everyone, regardless of background, has equal opportunity to thrive.'
    },
    {
      icon: Globe,
      title: 'Community Impact',
      description: 'Ensuring that our entrepreneurial ventures contribute positively to society.'
    }
  ];

  const team = [
    {
      name: 'Onesmus Mutiso',
      role: 'Founder & CEO',
      image: mutisoImg,
      bio: 'Visionary leader dedicated to nurturing the next generation of African entrepreneurs.'
    },
    {
      name: 'Edgar Elmut',
      role: 'Chief Operations Officer (COO)',
      image: edgarImg,
      bio: 'Operations expert focused on scaling our hub\'s impact across higher learning institutions.'
    },
    {
      name: 'Clifton Khamala',
      role: 'Chief Technical Officer (CTO)',
      image: khamalaImg,
      bio: 'Driving technical innovation and providing robust support for young skilled and unskilled innovators.'
    },
    {
      name: 'Emmanuel John',
      role: 'Chief Marketing Officer (CMO)',
      image: manuImg,
      bio: 'Strategic marketer connecting our entrepreneurs with vital market linkages.'
    },
    {
      name: 'Faith Lechuta',
      role: 'Chief Financial Officer (CFO)',
      image: faithImg,
      bio: 'Ensuring financial sustainability and integrity in all our entrepreneurial trainings and programs.'
    }
  ];

  const milestones = [
    { year: '2025', event: 'Young Entrepreneurship Hub Founded' },
    { year: '2026', event: 'Mentored First 5 Entrepreneurs' },
    { year: '2026', event: 'Launched Virtual Programs During Pandemic' },
    { year: '2026', event: 'Reached 5+ Successful Businesses' },
    { year: '2026', event: 'Launched Partnership Program' },
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
                  Founded in 2025, we started with a small group of mentors and a handful of aspiring entrepreneurs. Today, we've grown into a thriving community of over 220 entrepreneurs, 5+ mentors, and countless success stories.
                </p>
                <p>
                  Our mission has remained constant: To empower young people in higher learning institutions both skilled and unskilled by providing practical entrepreneurial trainings, mentorship, technical support and market linkage.
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
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
                alt="Young African entrepreneurs collaborating"
                className="rounded-lg shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-secondary p-6 rounded-lg shadow-xl">
                <div className="text-4xl font-bold text-black">220+</div>
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
                  To empower young people in higher learning institutions both skilled and unskilled by providing practical entrepreneurial trainings, mentorship, technical support and market linkage.
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
                  To become a leading young driven hub that nurtures innovation, self-reliance and impactful entrepreneurs.
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
