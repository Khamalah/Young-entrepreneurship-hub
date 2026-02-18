import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function BlogPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Entrepreneurship', 'Mentorship', 'Success Stories', 'Tips & Advice', 'Industry Insights'];

  const blogPosts = [
    {
      id: '1',
      title: '10 Essential Skills Every Young Entrepreneur Needs',
      excerpt: 'Discover the critical skills that separate successful entrepreneurs from the rest. From financial literacy to emotional intelligence...',
      author: 'James Kariuki',
      date: 'December 15, 2024',
      category: 'Tips & Advice',
      image: 'https://images.unsplash.com/photo-1507099985932-87a4520ed1d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGVudHJlcHJlbmV1cnMlMjBtZWV0aW5nfGVufDF8fHx8MTc2NjU3ODI2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '5 min read'
    },
    {
      id: '2',
      title: 'How Sarah Built a Million-Dollar Business Before 25',
      excerpt: 'An inspiring journey of determination, innovation, and strategic mentorship that led to extraordinary success...',
      author: 'Mary Wanjiru',
      date: 'December 10, 2024',
      category: 'Success Stories',
      image: 'https://images.unsplash.com/photo-1574593749297-cb33a69cd8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RpdmF0aW9uYWwlMjBzcGVha2luZ3xlbnwxfHx8fDE3NjY1NzgyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '8 min read'
    },
    {
      id: '3',
      title: 'The Power of Mentorship in Business Growth',
      excerpt: 'Why having the right mentor can accelerate your business growth by years and how to find one...',
      author: 'Peter Ochieng',
      date: 'December 5, 2024',
      category: 'Mentorship',
      image: 'https://images.unsplash.com/photo-1761933799610-c9a75f115794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lbnRvcnNoaXB8ZW58MXx8fHwxNzY2NTc4MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '6 min read'
    },
    {
      id: '4',
      title: 'Navigating the African Startup Ecosystem in 2024',
      excerpt: 'Current trends, opportunities, and challenges facing entrepreneurs in Africa\'s rapidly evolving market...',
      author: 'Linda Akinyi',
      date: 'November 28, 2024',
      category: 'Industry Insights',
      image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NjY0OTA2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '10 min read'
    },
    {
      id: '5',
      title: 'From Idea to Launch: A Step-by-Step Guide',
      excerpt: 'A comprehensive roadmap for taking your business idea from concept to market launch successfully...',
      author: 'James Kariuki',
      date: 'November 20, 2024',
      category: 'Entrepreneurship',
      image: 'https://images.unsplash.com/photo-1507099985932-87a4520ed1d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGVudHJlcHJlbmV1cnMlMjBtZWV0aW5nfGVufDF8fHx8MTc2NjU3ODI2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '12 min read'
    },
    {
      id: '6',
      title: 'Funding Your Startup: Beyond Traditional Investors',
      excerpt: 'Exploring alternative funding options for young entrepreneurs including grants, competitions, and crowdfunding...',
      author: 'Mary Wanjiru',
      date: 'November 15, 2024',
      category: 'Tips & Advice',
      image: 'https://images.unsplash.com/photo-1574593749297-cb33a69cd8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RpdmF0aW9uYWwlMjBzcGVha2luZ3xlbnwxfHx8fDE3NjY1NzgyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      readTime: '7 min read'
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts[0];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-[#0d4a07] text-white py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl mb-6">Our Blog</h1>
            <p className="text-xl text-white/90 mb-8">
              Insights, stories, and advice for aspiring entrepreneurs
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white text-black"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={selectedCategory === category ? 'bg-primary hover:bg-primary/90' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {selectedCategory === 'All' && !searchQuery && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-4">
                <span className="inline-block bg-secondary text-black px-3 py-1 rounded-full text-sm">
                  Featured Article
                </span>
              </div>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate(`/blog/${featuredPost.id}`)}>
                <div className="grid md:grid-cols-2 gap-6">
                  <ImageWithFallback
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </span>
                    </div>
                    <h2 className="text-3xl mb-4">{featuredPost.title}</h2>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{featuredPost.readTime}</span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/blog/${featuredPost.id}`);
                        }}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl mb-8">
                  {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.slice(selectedCategory === 'All' && !searchQuery ? 1 : 0).map((post) => (
                    <Card
                      key={post.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="w-4 h-4 text-primary" />
                          <span className="text-sm text-primary">{post.category}</span>
                        </div>
                        <h3 className="text-xl mb-3">{post.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary to-[#0d4a07] text-white">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl mb-4">Stay Updated</h2>
              <p className="text-white/90 mb-6">
                Subscribe to our newsletter and get the latest articles, tips, and insights delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing!');
              }}>
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white text-black h-12"
                  required
                />
                <Button
                  type="submit"
                  className="bg-secondary hover:bg-accent text-black h-12 px-8"
                >
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
