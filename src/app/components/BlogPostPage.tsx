import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Calendar, User, Clock, ArrowLeft, Share2, ThumbsUp, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

export function BlogPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');

  // In a real app, this would fetch the post data based on postId
  const post = {
    id: postId || '1',
    title: '10 Essential Skills Every Young Entrepreneur Needs',
    author: 'James Kariuki',
    date: 'December 15, 2024',
    readTime: '5 min read',
    category: 'Tips & Advice',
    image: 'https://images.unsplash.com/photo-1507099985932-87a4520ed1d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGVudHJlcHJlbmV1cnMlMjBtZWV0aW5nfGVufDF8fHx8MTc2NjU3ODI2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    content: `
      <p>Starting a business is an exciting journey, but success requires more than just a great idea. Today's young entrepreneurs need a diverse skill set to navigate the complex business landscape.</p>

      <h2>1. Financial Literacy</h2>
      <p>Understanding financial statements, cash flow management, and basic accounting principles is crucial. You don't need to be an accountant, but you should be able to read and interpret your numbers.</p>

      <h2>2. Digital Marketing</h2>
      <p>In today's digital age, knowing how to market your business online is essential. This includes social media marketing, content creation, SEO, and email marketing.</p>

      <h2>3. Sales Skills</h2>
      <p>Even if you hire a sales team, understanding the sales process and being able to sell your vision is critical. Learn to identify customer needs and communicate value effectively.</p>

      <h2>4. Leadership and Team Management</h2>
      <p>As your business grows, you'll need to build and lead a team. Develop skills in delegation, motivation, and conflict resolution.</p>

      <h2>5. Problem-Solving</h2>
      <p>Entrepreneurship is essentially problem-solving. Cultivate creative thinking and analytical skills to tackle challenges as they arise.</p>

      <h2>6. Networking</h2>
      <p>Building relationships is key to business success. Learn to network effectively, both online and in person.</p>

      <h2>7. Time Management</h2>
      <p>With limited resources and countless tasks, effective time management can make or break your business.</p>

      <h2>8. Adaptability</h2>
      <p>Markets change, technologies evolve, and customer preferences shift. Being adaptable allows you to pivot when necessary.</p>

      <h2>9. Communication</h2>
      <p>Clear communication with team members, customers, investors, and partners is essential for business success.</p>

      <h2>10. Emotional Intelligence</h2>
      <p>Understanding and managing your emotions, as well as recognizing and influencing the emotions of others, is crucial for leadership and relationship building.</p>

      <h2>Conclusion</h2>
      <p>Developing these skills takes time and practice. Don't expect to master them all at once. Focus on continuous learning and improvement, and don't hesitate to seek mentorship and guidance along the way.</p>

      <p>At Young Entrepreneurship Hub, we offer programs designed to help you develop these essential skills. Book a consultation to learn how we can support your entrepreneurial journey.</p>
    `
  };

  const comments = [
    {
      id: '1',
      name: 'Sarah Mwangi',
      date: 'December 16, 2024',
      text: 'This is exactly what I needed to read! The section on financial literacy really resonated with me. Thank you for sharing!'
    },
    {
      id: '2',
      name: 'David Kamau',
      date: 'December 17, 2024',
      text: 'Great article! I would add resilience to this list. The ability to bounce back from failures has been crucial in my journey.'
    }
  ];

  const relatedPosts = [
    {
      id: '2',
      title: 'How Sarah Built a Million-Dollar Business Before 25',
      image: 'https://images.unsplash.com/photo-1574593749297-cb33a69cd8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RpdmF0aW9uYWwlMjBzcGVha2luZ3xlbnwxfHx8fDE3NjY1NzgyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '3',
      title: 'The Power of Mentorship in Business Growth',
      image: 'https://images.unsplash.com/photo-1761933799610-c9a75f115794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lbnRvcnNoaXB8ZW58MXx8fHwxNzY2NTc4MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your comment! It will be published after review.');
    setCommentName('');
    setCommentEmail('');
    setCommentText('');
  };

  return (
    <div className="w-full bg-white">
      {/* Back Button */}
      <div className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <Button
            onClick={() => navigate('/blog')}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Meta Info */}
            <div className="mb-6">
              <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {post.readTime}
              </span>
            </div>

            {/* Featured Image */}
            <ImageWithFallback
              src={post.image}
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-lg mb-12"
            />

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share & Engage */}
            <div className="flex flex-wrap gap-4 py-6 border-y">
              <Button variant="outline" className="gap-2">
                <ThumbsUp className="w-4 h-4" />
                Like
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Comment
              </Button>
            </div>

            {/* Author Bio */}
            <Card className="my-12 bg-muted">
              <CardContent className="p-6">
                <div className="flex gap-4 items-start">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.author}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="mb-2">About {post.author}</h3>
                    <p className="text-muted-foreground">
                      Founder & CEO of Young Entrepreneurship Hub. Serial entrepreneur with 15+ years of experience in building successful startups and mentoring young entrepreneurs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <section className="my-12">
              <h2 className="text-2xl mb-6">Comments ({comments.length})</h2>

              {/* Existing Comments */}
              <div className="space-y-6 mb-12">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div>{comment.name}</div>
                          <div className="text-sm text-muted-foreground">{comment.date}</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{comment.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Comment Form */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Leave a Comment</h3>
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm">Name *</label>
                        <Input
                          value={commentName}
                          onChange={(e) => setCommentName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm">Email *</label>
                        <Input
                          type="email"
                          value={commentEmail}
                          onChange={(e) => setCommentEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm">Comment *</label>
                      <Textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Post Comment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>

            {/* Related Posts */}
            <section className="my-12">
              <h2 className="text-2xl mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/blog/${relatedPost.id}`)}
                  >
                    <ImageWithFallback
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <h3 className="text-lg">{relatedPost.title}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-[#0d4a07] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Get personalized mentorship and support to develop these essential skills
          </p>
          <Button
            onClick={() => navigate('/booking')}
            size="lg"
            className="bg-secondary hover:bg-accent text-black"
          >
            Book a Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}
