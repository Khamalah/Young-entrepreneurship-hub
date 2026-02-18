import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Calendar, Clock, User, Mail, Phone, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface DashboardPageProps {
  userName?: string;
}

interface Booking {
  id: string;
  mentor_name: string;
  date: string;
  time: string;
  topic: string;
  notes: string;
  status: string;
  created_at: string;
}

interface Profile {
  full_name: string;
  email: string;
  phone: string;
}

export function DashboardPage({ userName = 'Entrepreneur' }: DashboardPageProps) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
      } else {
        setBookings(bookingsData || []);
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) {
        toast.error('Failed to cancel booking');
      } else {
        toast.success('Booking cancelled successfully');
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingBookings = bookings.filter(b =>
    b.status !== 'cancelled' && b.status !== 'completed' && new Date(b.date) >= new Date()
  );
  const pastBookings = bookings.filter(b =>
    b.status === 'completed' || new Date(b.date) < new Date()
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-[#0d4a07] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2">
                Welcome back, {profile?.full_name || userName}! 👋
              </h1>
              <p className="text-white/90">
                Here's your entrepreneurial journey overview
              </p>
            </div>
            <div className="hidden md:block">
              <Button
                onClick={() => navigate('/booking')}
                size="lg"
                className="bg-secondary hover:bg-accent text-black font-bold"
              >
                Book a Session
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-1 text-primary">
                {bookings.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-1 text-green-600">
                {upcomingBookings.length}
              </div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-1 text-blue-600">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-1 text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Bookings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Bookings */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
              {upcomingBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
                    <p className="text-muted-foreground mb-4">
                      Book your first session to get started!
                    </p>
                    <Button
                      onClick={() => navigate('/booking')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Book a Session
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{booking.topic}</h3>
                            <p className="text-sm text-muted-foreground">
                              with {booking.mentor_name}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </span>
                        </div>
                        {booking.notes && (
                          <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted rounded">
                            {booking.notes}
                          </p>
                        )}
                        {booking.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                          >
                            {cancellingId === booking.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-2" />
                                Cancel Booking
                              </>
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Past Sessions</h2>
                <div className="space-y-4">
                  {pastBookings.slice(0, 3).map((booking) => (
                    <Card key={booking.id} className="opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{booking.topic}</h3>
                            <p className="text-sm text-muted-foreground">
                              with {booking.mentor_name}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(booking.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Profile & Actions */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Your Profile</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-sm">{profile?.email || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{profile?.phone || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-primary text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/booking')}
                    className="w-full bg-secondary hover:bg-accent text-black font-semibold"
                  >
                    Book a Session
                  </Button>
                  <Button
                    onClick={() => navigate('/contact')}
                    variant="outline"
                    className="w-full border-white text-white hover:bg-white hover:text-primary"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-secondary">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-black">Need Help?</h3>
                <p className="text-sm text-black/80 mb-4">
                  Our support team is here to assist you with any questions.
                </p>
                <Button
                  onClick={() => navigate('/contact')}
                  variant="outline"
                  className="w-full border-black text-black hover:bg-black hover:text-white"
                >
                  Get Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
