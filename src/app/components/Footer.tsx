import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    alert('Module under construction...thank you for your patience!');
  };

  return (
    <footer className="bg-[#1a2332] text-white border-t-8 border-primary">
      <div className="container mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <Logo className="[&_span]:text-white" />
            </div>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Empowering young people in higher learning institutions through practical entrepreneurial trainings, mentorship, and technical support.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center text-white">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center text-white">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center text-white">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://whatsapp.com/channel/0029VbBcz1bJP210iNGPFL3I" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center text-white" title="Join our WhatsApp Channel">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center text-white">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-secondary font-semibold">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Blog', path: '/blog' },
                { name: 'Contact', path: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-white hover:text-secondary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-6 text-secondary font-semibold">Our Services</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/services"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Mentorship Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Talks & Speaking
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Empowerment Sessions
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Book a Session
                </Link>
              </li>
              <li>
                <Link
                  to="/partnership"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Partnership
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-6 text-secondary font-semibold">Stay Updated</h4>
            <p className="text-gray-300 mb-4 text-sm">
              Subscribe to our newsletter for updates and insights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-[#2a3441] border-[#3b4657] text-white placeholder:text-gray-500 h-10"
                required
              />
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-10"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-white/10 py-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-secondary shrink-0" />
              <span className="text-gray-300 text-sm">
                Kisii University, Kisii, Kenya
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-secondary shrink-0" />
              <span className="text-gray-300 text-sm">+254 700 816 697</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-secondary shrink-0" />
              <span className="text-gray-300 text-sm">info@younghub.co.ke</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 mt-4">
          <p className="text-gray-400 text-xs">
            © 2026 Young Entrepreneurship Hub. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs font-medium">
            <button className="text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Terms of Service
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}