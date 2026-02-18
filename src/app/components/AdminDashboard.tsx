import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Users, UserCheck, UserX, Loader2, Shield, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface PendingBooking {
    id: string;
    topic: string;
    date: string;
    time: string;
    notes: string;
    expertise_category_id: string;
    user_id: string;
    profiles: {
        full_name: string;
        email: string;
    };
    expertise_categories: {
        name: string;
    };
}

interface AvailableMentor {
    id: string;
    user_id: string;
    bio: string;
    company: string;
    job_title: string;
    total_sessions: number;
    profiles: {
        full_name: string;
    };
}

interface PendingUser {
    id: string;
    full_name: string;
    email: string;
    role: string;
    approval_status: string;
    created_at: string;
}

export function AdminDashboard() {
    const navigate = useNavigate();
    const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [availableMentors, setAvailableMentors] = useState<Record<string, AvailableMentor[]>>({});
    const [selectedMentors, setSelectedMentors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState<string | null>(null);
    const [approving, setApproving] = useState<string | null>(null);

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

            // Verify admin/superadmin role
            const { data: profileData } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const role = profileData?.role?.toLowerCase();
            if (role !== 'admin' && role !== 'superadmin') {
                navigate('/dashboard');
                return;
            }

            // Fetch pending bookings (awaiting assignment)
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select(`
          *,
          profiles!inner(full_name, email),
          expertise_categories(name)
        `)
                .eq('approval_status', 'pending_assignment')
                .order('created_at', { ascending: false });

            if (bookingsError) {
                console.error('Error fetching bookings:', bookingsError);
            } else {
                setPendingBookings(bookingsData || []);

                // Fetch available mentors for each booking's expertise
                const mentorsByExpertise: Record<string, AvailableMentor[]> = {};
                for (const booking of bookingsData || []) {
                    if (booking.expertise_category_id && !mentorsByExpertise[booking.expertise_category_id]) {
                        const { data: mentorsData } = await supabase
                            .from('mentor_profiles')
                            .select(`
                *,
                profiles!inner(full_name, approval_status),
                mentor_expertise!inner(expertise_category_id)
              `)
                            .eq('is_active', true)
                            .eq('profiles.approval_status', 'approved')
                            .eq('mentor_expertise.expertise_category_id', booking.expertise_category_id);

                        mentorsByExpertise[booking.expertise_category_id] = mentorsData || [];
                    }
                }
                setAvailableMentors(mentorsByExpertise);
            }

            // Fetch pending user approvals (mentors and partners)
            const { data: usersData, error: usersError } = await supabase
                .from('profiles')
                .select('*')
                .eq('approval_status', 'pending')
                .in('role', ['mentor', 'partner'])
                .order('created_at', { ascending: false });

            if (usersError) {
                console.error('Error fetching users:', usersError);
            } else {
                setPendingUsers(usersData || []);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignMentor = async (bookingId: string, mentorId: string) => {
        setAssigning(bookingId);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Create assignment
            const { error: assignmentError } = await supabase
                .from('booking_assignments')
                .insert({
                    booking_id: bookingId,
                    mentor_id: mentorId,
                    assigned_by: user.id,
                    mentor_response: 'pending'
                });

            if (assignmentError) throw assignmentError;

            // Update booking status
            const { error: bookingError } = await supabase
                .from('bookings')
                .update({
                    mentor_id: mentorId,
                    assigned_by: user.id,
                    approval_status: 'assigned_pending_mentor'
                })
                .eq('id', bookingId);

            if (bookingError) throw bookingError;

            toast.success('Mentor assigned successfully!');
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to assign mentor');
        } finally {
            setAssigning(null);
        }
    };

    const handleUserApproval = async (userId: string, approved: boolean) => {
        setApproving(userId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ approval_status: approved ? 'approved' : 'rejected' })
                .eq('id', userId);

            if (error) throw error;

            toast.success(approved ? 'User approved!' : 'User rejected');
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to update user status');
        } finally {
            setApproving(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-muted flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-muted min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-[#0d4a07] text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3">
                        <Shield className="w-10 h-10" />
                        <div>
                            <h1 className="text-3xl md:text-4xl mb-2">Admin Dashboard</h1>
                            <p className="text-white/90">Manage mentorship assignments and approvals</p>
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
                            <div className="text-3xl font-bold mb-1 text-yellow-600">
                                {pendingBookings.length}
                            </div>
                            <div className="text-sm text-muted-foreground">Pending Assignments</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-blue-600">
                                {pendingUsers.length}
                            </div>
                            <div className="text-sm text-muted-foreground">Pending Approvals</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-green-600">
                                {Object.values(availableMentors).flat().length}
                            </div>
                            <div className="text-sm text-muted-foreground">Active Mentors</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-primary">
                                {pendingBookings.length + pendingUsers.length}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Pending</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Pending Bookings - Assign Mentors */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Assign Mentors to Mentees</h2>
                        {pendingBookings.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">No pending assignments</h3>
                                    <p className="text-muted-foreground">
                                        All booking requests have been assigned to mentors.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {pendingBookings.map((booking) => (
                                    <Card key={booking.id}>
                                        <CardContent className="p-6">
                                            <div className="mb-4">
                                                <h3 className="font-semibold mb-1">{booking.topic}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Mentee: {booking.profiles.full_name} ({booking.profiles.email})
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Expertise: {booking.expertise_categories?.name || 'Not specified'}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(booking.date).toLocaleDateString()}
                                                </span>
                                                <span>{booking.time}</span>
                                            </div>

                                            {booking.notes && (
                                                <div className="mb-4 p-3 bg-muted rounded">
                                                    <p className="text-sm">{booking.notes}</p>
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium">Assign Mentor:</label>
                                                <Select
                                                    value={selectedMentors[booking.id] || ''}
                                                    onValueChange={(value) => setSelectedMentors(prev => ({ ...prev, [booking.id]: value }))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a mentor" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(availableMentors[booking.expertise_category_id] || []).map((mentor) => (
                                                            <SelectItem key={mentor.id} value={mentor.id}>
                                                                {mentor.profiles.full_name} - {mentor.job_title} ({mentor.total_sessions} sessions)
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Button
                                                    onClick={() => handleAssignMentor(booking.id, selectedMentors[booking.id])}
                                                    disabled={!selectedMentors[booking.id] || assigning === booking.id}
                                                    className="w-full bg-primary hover:bg-primary/90"
                                                >
                                                    {assigning === booking.id ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Assigning...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserCheck className="w-4 h-4 mr-2" />
                                                            Assign Mentor
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pending User Approvals */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Pending User Approvals</h2>
                        {pendingUsers.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">No pending approvals</h3>
                                    <p className="text-muted-foreground">
                                        All mentor and partner applications have been reviewed.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {pendingUsers.map((user) => (
                                    <Card key={user.id}>
                                        <CardContent className="p-6">
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold">{user.full_name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'mentor'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                        {user.role.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Applied: {new Date(user.created_at).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    onClick={() => handleUserApproval(user.id, true)}
                                                    disabled={approving === user.id}
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                >
                                                    {approving === user.id ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                    )}
                                                    Approve
                                                </Button>
                                                <Button
                                                    onClick={() => handleUserApproval(user.id, false)}
                                                    disabled={approving === user.id}
                                                    variant="destructive"
                                                    className="flex-1"
                                                >
                                                    {approving === user.id ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                    )}
                                                    Reject
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
