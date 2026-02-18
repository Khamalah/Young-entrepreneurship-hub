import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface BookingPageProps {
  isLoggedIn?: boolean;
}

interface ExpertiseCategory {
  id: string;
  name: string;
  description: string;
}

export function BookingPage({ isLoggedIn = false }: BookingPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expertiseCategory: '',
    date: '',
    time: '',
    message: ''
  });

  const [expertiseCategories, setExpertiseCategories] = useState<ExpertiseCategory[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    checkUserRole();
    fetchExpertiseCategories();
  }, []);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setUserRole(data?.role || 'mentee');
    }
    setCheckingRole(false);
  };

  const fetchExpertiseCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('expertise_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load mentorship categories');
      } else if (data && data.length > 0) {
        setExpertiseCategories(data);
      } else {
        console.warn('No expertise categories found');
        // Fallback to some default categories if table is empty for some reason
        const fallbacks = [
          { id: '1', name: 'General Business Advice', description: 'Business mentorship' },
          { id: '2', name: 'Strategic Planning', description: 'Strategy mentorship' }
        ];
        // Only set if really empty to avoid overwriting database data
        if (!data || data.length === 0) {
          // setExpertiseCategories(fallbacks); // Optional: add fallback categories
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('You must be logged in to book a session');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        mentor_name: 'To be assigned',
        date: formData.date,
        time: formData.time,
        topic: expertiseCategories.find(c => c.id === formData.expertiseCategory)?.name || 'General Consultation',
        notes: formData.message,
        expertise_category_id: formData.expertiseCategory,
        booking_status: 'scheduled',
        approval_status: 'pending_assignment'
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSubmitted(true);
        toast.success('Booking request submitted! An admin will assign a mentor soon.');
      }
    } catch (error) {
      toast.error('Failed to submit booking');
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
              <h2 className="text-3xl mb-4">Request Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your mentorship request. We've sent a confirmation email to <strong>{formData.email}</strong>.
              </p>
              <p className="text-muted-foreground mb-8">
                Our admin team will review your request and assign an appropriate mentor based on your selected expertise area. You'll be notified once a mentor is assigned.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                >
                  Back to Home
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary hover:bg-primary/90"
                >
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (checkingRole) {
    return (
      <div className="w-full min-h-screen bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Silently redirect non-mentees to their dashboard
  if (userRole && userRole !== 'mentee') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-[#0d4a07] text-white py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl mb-6">Request Mentorship</h1>
            <p className="text-xl text-white/90">
              Tell us what you need help with, and we'll match you with the perfect mentor from our expert network.
            </p>
          </div>
        </div>
      </section>

      {/* Login Notice for Non-Members */}
      {!isLoggedIn && (
        <section className="py-6 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-black">
                Already a member?
                <button
                  onClick={() => navigate('/login')}
                  className="ml-2 underline font-medium hover:no-underline"
                >
                  Login here
                </button>
                {' '}for faster booking and to track your mentorship journey.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="text-3xl mb-6">Request a Session</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="John Doe"
                      autoComplete="name"
                      name="full-name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      autoComplete="email"
                      name="email"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+254 700 816 697"
                      autoComplete="tel"
                      name="phone"
                      required
                    />
                  </div>

                  {/* Expertise Category */}
                  <div>
                    <label className="block mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      What do you need help with? *
                    </label>
                    <Select
                      value={formData.expertiseCategory}
                      onValueChange={(value) => handleInputChange('expertiseCategory', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an area of expertise" />
                      </SelectTrigger>
                      <SelectContent>
                        {expertiseCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.expertiseCategory && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {expertiseCategories.find(c => c.id === formData.expertiseCategory)?.description}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Preferred Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Preferred Time *
                    </label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) => handleInputChange('time', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block mb-2">
                      Tell us more about what you'd like to discuss
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Describe your business challenge or what you'd like guidance on..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </form>
              </div>

              {/* Info Sidebar */}
              <div>
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-xl mb-4">How It Works</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary font-bold">1</span>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Submit Your Request</div>
                          <p className="text-sm text-muted-foreground">
                            Tell us what area you need help with
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary font-bold">2</span>
                        </div>
                        <div>
                          <div className="font-medium mb-1">We Match You</div>
                          <p className="text-sm text-muted-foreground">
                            Our admin assigns the best mentor for your needs
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary font-bold">3</span>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Mentor Confirms</div>
                          <p className="text-sm text-muted-foreground">
                            Your assigned mentor reviews and confirms availability
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary font-bold">4</span>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Start Learning</div>
                          <p className="text-sm text-muted-foreground">
                            Get personalized guidance from an expert
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <h4 className="mb-3">Need Help?</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        If you have questions about our mentorship program, feel free to contact us.
                      </p>
                      <Button
                        onClick={() => navigate('/contact')}
                        variant="outline"
                        className="w-full"
                      >
                        Contact Us
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-2">How long are the sessions?</h3>
                  <p className="text-muted-foreground">
                    Standard sessions are 60 minutes. Extended sessions can be arranged for more complex topics.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-2">How are mentors assigned?</h3>
                  <p className="text-muted-foreground">
                    Our admin team reviews your request and matches you with a mentor who has expertise in your selected area and availability for your preferred time.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-2">Are sessions conducted online or in-person?</h3>
                  <p className="text-muted-foreground">
                    We offer both options. Online sessions are conducted via video call, and in-person sessions are available at our Nairobi office.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-2">Is there a fee for the first consultation?</h3>
                  <p className="text-muted-foreground">
                    The first consultation is complimentary for new clients. Subsequent sessions are part of our membership packages.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
