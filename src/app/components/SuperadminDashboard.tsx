import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, Users, UserCog, Search, Loader2, Crown, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface User {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    role: string;
    approval_status: string;
    gender: string;
    created_at: string;
}

interface MentorReview {
    id: string;
    mentor_id: string;
    mentee_id: string;
    rating: number;
    comment: string;
    created_at: string;
    mentee_name: string;
    mentor_name: string;
}

export function SuperadminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [mentorReviews, setMentorReviews] = useState<MentorReview[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, roleFilter, users]);

    const fetchDashboardData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/login');
                return;
            }

            // Verify superadmin role
            const { data: profileData } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profileData?.role?.toLowerCase() !== 'superadmin') {
                navigate('/dashboard');
                return;
            }

            // Fetch all users
            const { data: usersData, error: usersError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (usersError) {
                console.error('Error fetching users:', usersError);
            } else {
                setUsers(usersData || []);
            }

            // Fetch mentor reviews (placeholder - table needs to be created)
            // const { data: reviewsData } = await supabase
            //   .from('mentor_reviews')
            //   .select('*, mentee:profiles!mentee_id(full_name), mentor:profiles!mentor_id(full_name)')
            //   .order('created_at', { ascending: false });
            // setMentorReviews(reviewsData || []);

        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by role
        if (roleFilter !== 'all') {
            filtered = filtered.filter(u => u.role === roleFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(u =>
                u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdatingUserId(userId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            toast.success(`User role updated to ${newRole}`);
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to update user role');
        } finally {
            setUpdatingUserId(null);
        }
    };

    const handleApprovalChange = async (userId: string, status: string) => {
        setUpdatingUserId(userId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ approval_status: status })
                .eq('id', userId);

            if (error) throw error;

            toast.success(`User ${status}`);
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to update approval status');
        } finally {
            setUpdatingUserId(null);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'bg-purple-100 text-purple-800';
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'mentor':
                return 'bg-blue-100 text-blue-800';
            case 'partner':
                return 'bg-green-100 text-green-800';
            case 'mentee':
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-muted flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading superadmin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-muted min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3">
                        <Crown className="w-10 h-10" />
                        <div>
                            <h1 className="text-3xl md:text-4xl mb-2">Superadmin Dashboard</h1>
                            <p className="text-white/90">Complete system control and user management</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-purple-600">
                                {users.filter(u => u.role === 'superadmin').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Superadmins</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-red-600">
                                {users.filter(u => u.role === 'admin').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Admins</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-blue-600">
                                {users.filter(u => u.role === 'mentor').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Mentors</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-gray-600">
                                {users.filter(u => u.role === 'mentee').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Mentees</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-3xl font-bold mb-1 text-green-600">
                                {users.filter(u => u.role === 'partner').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Partners</div>
                        </CardContent>
                    </Card>
                </div>

                {/* User Management */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <UserCog className="w-6 h-6" />
                                User Management
                            </h2>
                        </div>

                        {/* Filters */}
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="superadmin">Superadmin</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="mentor">Mentor</SelectItem>
                                    <SelectItem value="mentee">Mentee</SelectItem>
                                    <SelectItem value="partner">Partner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Users Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-semibold">User</th>
                                        <th className="text-left p-3 font-semibold">Contact</th>
                                        <th className="text-left p-3 font-semibold">Current Role</th>
                                        <th className="text-left p-3 font-semibold">Status</th>
                                        <th className="text-left p-3 font-semibold">Change Role</th>
                                        <th className="text-left p-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/50">
                                            <td className="p-3">
                                                <div>
                                                    <p className="font-medium">{user.full_name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-sm">
                                                    <p>{user.email}</p>
                                                    <p className="text-muted-foreground">{user.phone}</p>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs ${user.approval_status === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : user.approval_status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.approval_status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <Select
                                                    value={user.role}
                                                    onValueChange={(value) => handleRoleChange(user.id, value)}
                                                    disabled={updatingUserId === user.id}
                                                >
                                                    <SelectTrigger className="w-40">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="mentee">Mentee</SelectItem>
                                                        <SelectItem value="mentor">Mentor</SelectItem>
                                                        <SelectItem value="partner">Partner</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="superadmin">Superadmin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    {user.approval_status !== 'approved' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApprovalChange(user.id, 'approved')}
                                                            disabled={updatingUserId === user.id}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {user.approval_status !== 'rejected' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleApprovalChange(user.id, 'rejected')}
                                                            disabled={updatingUserId === user.id}
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground">No users found</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
