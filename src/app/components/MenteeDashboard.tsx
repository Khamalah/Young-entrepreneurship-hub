import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Calendar, Clock, User, Mail, Phone, X, Loader2, UserCheck, BookOpen, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { ProfileEditModal } from './ProfileEditModal';

interface Booking {
    id: string;
    mentor_name: string;
    date: string;
    time: string;
    topic: string;
    notes: string;
    booking_status: string;
    approval_status: string;
    created_at: string;
    expertise_category_id: string;
}

interface Profile {
    full_name: string;
    email: string;
    phone: string;
    gender: string;
    profile_photo_url?: string | null;
}

interface AssignedMentor {
    mentor_name: string;
    bio: string;
    company: string;
    job_title: string;
    rating: number;
}

export function MenteeDashboard() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [assignedMentor, setAssignedMentor] = useState<AssignedMentor | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
                .select('*, profile_photo_url')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
            } else {
                setProfile(profileData);
            }

            // Check if mentee has an assigned mentor (from latest approved booking)
            const approvedBooking = bookingsData?.find(b => b.approval_status === 'approved');
            if (approvedBooking?.mentor_id) {
                const { data: mentorData } = await supabase
                    .from('mentor_profiles')
                    .select('*, profiles!inner(full_name)')
                    .eq('id', approvedBooking.mentor_id)
                    .single();

                if (mentorData) {
                    setAssignedMentor({
                        mentor_name: mentorData.profiles.full_name,
                        bio: mentorData.bio,
                        company: mentorData.company,
                        job_title: mentorData.job_title,
                        rating: mentorData.rating
                    });
                }
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
                .update({ approval_status: 'cancelled' })
                .eq('id', bookingId);

            if (error) {
                toast.error('Failed to cancel booking');
            } else {
                toast.success('Booking cancelled successfully');
                fetchDashboardData();
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending_assignment':
                return 'bg-yellow-100 text-yellow-800';
            case 'assigned_pending_mentor':
                return 'bg-blue-100 text-blue-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-purple-100 text-purple-800';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending_assignment':
                return 'Awaiting Assignment';
            case 'assigned_pending_mentor':
                return 'Awaiting Mentor Approval';
            case 'approved':
                return 'Confirmed';
            case 'completed':
                return 'Completed';
            case 'cancelled':
                return 'Cancelled';
            case 'rejected':
                return 'Rejected';
            default:
                return status;
        }
    };

    const upcomingBookings = bookings.filter(b =>
        b.approval_status !== 'cancelled' && b.approval_status !== 'rejected' &&
        b.approval_status !== 'completed' && new Date(b.date) >= new Date()
    );

    const pastBookings = bookings.filter(b =>
        b.approval_status === 'completed' || new Date(b.date) < new Date()
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
            <section className="bg-gradient-to-r from-primary to-[#0d4a07] text-white py-8 md:py-12">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl md:text-4xl mb-2">
                                Welcome, {profile?.full_name}! 👋
                            </h1>
                            <p className="text-white/90">
                                Your mentorship journey dashboard
                            </p>
                        </div>
                        <div className="w-full md:w-auto">
                            <Button
                                onClick={() => navigate('/booking')}
                                size="lg"
                                className="w-full md:w-auto bg-secondary hover:bg-accent text-black font-bold h-12"
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
                            <div className="text-sm text-muted-foreground">Total Requests</div>
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
                                {bookings.filter(b => b.approval_status === 'completed').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Completed</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-yellow-600">
                                {bookings.filter(b => b.approval_status === 'pending_assignment').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Pending</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Bookings */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Assigned Mentor */}
                        {assignedMentor && (
                            <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <UserCheck className="w-6 h-6" />
                                        <h3 className="text-xl font-semibold">Your Assigned Mentor</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-2xl font-bold">{assignedMentor.mentor_name}</p>
                                        <p className="text-white/90">{assignedMentor.job_title} at {assignedMentor.company}</p>
                                        <p className="text-sm text-white/80 mt-3">{assignedMentor.bio}</p>
                                        {assignedMentor.rating > 0 && (
                                            <div className="flex items-center gap-2 mt-3">
                                                <span className="text-secondary">★</span>
                                                <span>{assignedMentor.rating.toFixed(1)} Rating</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Upcoming Sessions */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Your Booking Requests</h2>
                            {upcomingBookings.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold mb-2">No active requests</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Request a mentorship session to get started!
                                        </p>
                                        <Button
                                            onClick={() => navigate('/booking')}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            Request Mentorship
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
                                                            {booking.mentor_name || 'Mentor not yet assigned'}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.approval_status)}`}>
                                                        {getStatusLabel(booking.approval_status)}
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
                                                {(booking.approval_status === 'pending_assignment' || booking.approval_status === 'assigned_pending_mentor') && (
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
                                                                Cancel Request
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

                        {/* Past Sessions */}
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
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.approval_status)}`}>
                                                        {getStatusLabel(booking.approval_status)}
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
                                <div className="flex flex-col items-center mb-6 pt-2">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 bg-muted flex items-center justify-center mb-4">
                                        {profile?.profile_photo_url ? (
                                            <img
                                                src={profile.profile_photo_url}
                                                alt={profile.full_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-12 h-12 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-xl">{profile?.full_name || 'Your Profile'}</h3>
                                        <p className="text-sm text-muted-foreground">Mentee Member</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="mt-4 w-full"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </div>
                                <div className="space-y-3 pt-4 border-t">
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

                        {/* Profile Edit Modal */}
                        {profile && (
                            <ProfileEditModal
                                isOpen={isEditModalOpen}
                                onClose={() => setIsEditModalOpen(false)}
                                currentProfile={profile}
                                onProfileUpdated={fetchDashboardData}
                            />
                        )}
                        {/* Quick Actions */}
                        <Card className="bg-primary text-white">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link to="/booking">
                                        <Button
                                            className="w-full bg-secondary hover:bg-accent text-black font-semibold"
                                        >
                                            Request Mentorship
                                        </Button>
                                    </Link>
                                    <Link to="/contact">
                                        <Button
                                            variant="outline"
                                            className="w-full border-white text-white hover:bg-white hover:text-primary"
                                        >
                                            Contact Support
                                        </Button>
                                    </Link>
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
