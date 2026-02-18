import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Calendar, Clock, User, Check, X, Loader2, Users, Award, BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface PendingAssignment {
    id: string;
    booking_id: string;
    assigned_at: string;
    mentor_response: string;
    booking: {
        id: string;
        topic: string;
        date: string;
        time: string;
        notes: string;
        profiles: {
            full_name: string;
            email: string;
            phone: string;
        };
    };
}

interface MentorProfile {
    bio: string;
    years_experience: number;
    company: string;
    job_title: string;
    rating: number;
    total_sessions: number;
    is_active: boolean;
}

export function MentorDashboard() {
    const navigate = useNavigate();
    const [pendingAssignments, setPendingAssignments] = useState<PendingAssignment[]>([]);
    const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [respondingId, setRespondingId] = useState<string | null>(null);

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

            // Check approval status
            const { data: profileData } = await supabase
                .from('profiles')
                .select('approval_status')
                .eq('id', user.id)
                .single();

            if (profileData?.approval_status === 'pending') {
                toast.info('Your mentor application is pending admin approval');
            }

            // Fetch mentor profile
            const { data: mentorData, error: mentorError } = await supabase
                .from('mentor_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (mentorError) {
                console.error('Error fetching mentor profile:', mentorError);
            } else {
                setMentorProfile(mentorData);
            }

            // Fetch pending assignments
            const { data: assignmentsData, error: assignmentsError } = await supabase
                .from('booking_assignments')
                .select(`
          *,
          bookings!inner(
            id,
            topic,
            date,
            time,
            notes,
            user_id,
            profiles!inner(full_name, email, phone)
          )
        `)
                .eq('mentor_id', mentorData?.id)
                .eq('mentor_response', 'pending')
                .order('assigned_at', { ascending: false });

            if (assignmentsError) {
                console.error('Error fetching assignments:', assignmentsError);
            } else {
                setPendingAssignments(assignmentsData || []);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async (assignmentId: string, bookingId: string, response: 'accepted' | 'rejected') => {
        setRespondingId(assignmentId);
        try {
            // Update assignment response
            const { error: assignmentError } = await supabase
                .from('booking_assignments')
                .update({
                    mentor_response: response,
                    mentor_response_at: new Date().toISOString()
                })
                .eq('id', assignmentId);

            if (assignmentError) throw assignmentError;

            // Update booking approval status
            const newStatus = response === 'accepted' ? 'approved' : 'rejected';
            const { error: bookingError } = await supabase
                .from('bookings')
                .update({ approval_status: newStatus })
                .eq('id', bookingId);

            if (bookingError) throw bookingError;

            toast.success(response === 'accepted' ? 'Booking approved!' : 'Booking rejected');
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to respond to assignment');
        } finally {
            setRespondingId(null);
        }
    };

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
                    <div>
                        <h1 className="text-3xl md:text-4xl mb-2">
                            Mentor Dashboard 🎓
                        </h1>
                        <p className="text-white/90">
                            Manage your mentees and sessions
                        </p>
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
                                {mentorProfile?.total_sessions || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Sessions</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-yellow-600">
                                {pendingAssignments.length}
                            </div>
                            <div className="text-sm text-muted-foreground">Pending Requests</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-green-600">
                                {mentorProfile?.rating.toFixed(1) || '0.0'}
                            </div>
                            <div className="text-sm text-muted-foreground">Rating</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-blue-600">
                                {mentorProfile?.years_experience || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">Years Experience</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Pending Assignments */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Pending Mentorship Requests</h2>
                            {pendingAssignments.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                                        <p className="text-muted-foreground">
                                            You'll see mentorship requests here when admins assign mentees to you.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {pendingAssignments.map((assignment) => (
                                        <Card key={assignment.id}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold mb-1">{assignment.booking.topic}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Mentee: {assignment.booking.profiles.full_name}
                                                        </p>
                                                    </div>
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Awaiting Your Response
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(assignment.booking.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {assignment.booking.time}
                                                    </span>
                                                </div>

                                                {assignment.booking.notes && (
                                                    <div className="mb-4 p-3 bg-muted rounded">
                                                        <p className="text-sm font-medium mb-1">Mentee's Message:</p>
                                                        <p className="text-sm text-muted-foreground">{assignment.booking.notes}</p>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                                                    <User className="w-4 h-4" />
                                                    <span>{assignment.booking.profiles.email}</span>
                                                    <span>•</span>
                                                    <span>{assignment.booking.profiles.phone}</span>
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button
                                                        onClick={() => handleResponse(assignment.id, assignment.booking.id, 'accepted')}
                                                        disabled={respondingId === assignment.id}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        {respondingId === assignment.id ? (
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <Check className="w-4 h-4 mr-2" />
                                                        )}
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleResponse(assignment.id, assignment.booking.id, 'rejected')}
                                                        disabled={respondingId === assignment.id}
                                                        variant="destructive"
                                                    >
                                                        {respondingId === assignment.id ? (
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <X className="w-4 h-4 mr-2" />
                                                        )}
                                                        Decline
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Profile */}
                    <div className="space-y-6">
                        {/* Mentor Profile Card */}
                        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Award className="w-6 h-6" />
                                    <h3 className="text-xl font-semibold">Your Mentor Profile</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-white/80 text-sm">Position</p>
                                        <p className="font-semibold">{mentorProfile?.job_title || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/80 text-sm">Company</p>
                                        <p className="font-semibold">{mentorProfile?.company || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/80 text-sm">Bio</p>
                                        <p className="text-sm">{mentorProfile?.bio || 'Not set'}</p>
                                    </div>
                                    <div className="pt-3 border-t border-white/20">
                                        <p className="text-white/80 text-sm mb-2">Status</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${mentorProfile?.is_active
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                            }`}>
                                            {mentorProfile?.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Button
                                        onClick={() => navigate('/contact')}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Contact Support
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help Card */}
                        <Card className="bg-secondary">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2 text-black">Mentor Guidelines</h3>
                                <p className="text-sm text-black/80 mb-4">
                                    Review requests carefully and respond within 48 hours. Quality mentorship builds our community!
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
