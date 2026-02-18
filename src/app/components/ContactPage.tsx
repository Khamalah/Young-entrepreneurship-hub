import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '123 Business Street, Nairobi, Kenya',
      link: 'https://maps.google.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+254 700 816 697',
      link: 'tel:+254700816697'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'info@younghub.co.ke',
      link: 'mailto:info@younghub.co.ke'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      content: 'Mon - Fri: 9:00 AM - 5:00 PM',
      link: null
    }
  ];

  const departments = [
    'General Inquiry',
    'Mentorship Programs',
    'Partnership Opportunities',
    'Technical Support',
    'Media & Press',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('messages').insert({
        user_id: user?.id || null, // Allow guests to message
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        status: 'unread'
      });

      if (error) {
        toast.error('Failed to send message: ' + error.message);
      } else {
        // Construct WhatsApp message
        const phoneNumber = '254700816697';
        const text = `*New Message from Contact Form*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Subject:* ${formData.subject}\n\n*Message:*\n${formData.message}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        setIsSubmitted(true);
        toast.success('Message sent successfully!');
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
              <h2 className="text-3xl mb-4">Message Sent Successfully!</h2>
              <p className="text-muted-foreground mb-8">
                Thank you for contacting us. We've received your message and will get back to you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                >
                  Back to Home
                </Button>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      subject: '',
                      message: ''
                    });
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Send Another Message
                </Button>
              </div>
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
            <MessageSquare className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl mb-6">Get in Touch</h1>
            <p className="text-xl text-white/90">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="mb-2">{info.title}</h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{info.content}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl mb-6">Send Us a Message</h2>
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block mb-2">Your Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2">Email Address *</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2">Phone Number</label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+254 700 816 697"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2">Subject *</label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => handleInputChange('subject', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block mb-2">Message *</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us how we can help you..."
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
                      <Send className="mr-2 w-5 h-5" />
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map & Additional Info */}
            <div>
              <h2 className="text-3xl mb-6">Visit Our Office</h2>

              {/* Map Placeholder */}
              <Card className="mb-6 overflow-hidden">
                <div className="w-full h-[400px] bg-muted flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">
                      123 Business Street, Nairobi, Kenya
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => window.open('https://maps.google.com', '_blank')}
                    >
                      Open in Google Maps
                    </Button>
                  </div>
                </div>
              </Card>

              {/* FAQ */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Quick Questions?</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-1">How quickly will I get a response?</h4>
                      <p className="text-sm text-muted-foreground">
                        We aim to respond to all inquiries within 24 hours during business days.
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1">Can I schedule a visit?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes! We welcome visitors. Please book an appointment through our booking page.
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1">Need immediate assistance?</h4>
                      <p className="text-sm text-muted-foreground">
                        Call us directly at +254 700 816 697 during office hours.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/booking')}
                    className="w-full mt-6 bg-primary hover:bg-primary/90"
                  >
                    Book an Appointment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl mb-6">Follow Us on Social Media</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay connected and get the latest updates, tips, and insights from our community
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
