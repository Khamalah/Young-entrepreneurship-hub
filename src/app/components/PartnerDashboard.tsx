import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Building, Mail, Phone, Globe, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface PartnerProfile {
    organization_name: string;
    organization_type: string;
    website: string;
    description: string;
}

interface Profile {
    full_name: string;
    email: string;
    phone: string;
    approval_status: string;
}

export function PartnerDashboard() {
    const navigate = useNavigate();
    const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

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

                if (profileData.approval_status === 'pending') {
                    toast.info('Your partnership application is pending admin approval');
                }
            }

            // Fetch partner profile
            const { data: partnerData, error: partnerError } = await supabase
                .from('partner_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (partnerError) {
                console.error('Error fetching partner profile:', partnerError);
            } else {
                setPartnerProfile(partnerData);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
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
                    <div className="flex items-center gap-3">
                        <Building className="w-10 h-10" />
                        <div>
                            <h1 className="text-3xl md:text-4xl mb-2">Partner Dashboard</h1>
                            <p className="text-white/90">Manage your partnership with Young Entrepreneurship Hub</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {profile?.approval_status === 'pending' && (
                    <Card className="mb-8 bg-yellow-50 border-yellow-200">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-2 text-yellow-800">Application Pending</h3>
                            <p className="text-sm text-yellow-700">
                                Your partnership application is currently under review. We'll notify you once it's been approved by our admin team.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Organization Profile */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold mb-6">Organization Profile</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm text-muted-foreground">Organization Name</label>
                                        <p className="text-lg font-semibold">{partnerProfile?.organization_name || 'Not set'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground">Organization Type</label>
                                        <p className="font-medium capitalize">{partnerProfile?.organization_type || 'Not set'}</p>
                                    </div>

                                    {partnerProfile?.website && (
                                        <div>
                                            <label className="text-sm text-muted-foreground">Website</label>
                                            <a
                                                href={partnerProfile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-primary hover:underline"
                                            >
                                                <Globe className="w-4 h-4" />
                                                {partnerProfile.website}
                                            </a>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm text-muted-foreground">Description</label>
                                        <p className="text-sm mt-1">{partnerProfile?.description || 'Not set'}</p>
                                    </div>

                                    <div className="pt-6 border-t">
                                        <h3 className="font-semibold mb-4">Contact Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-muted-foreground" />
                                                <span>{profile?.email}</span>
                                            </div>
                                            {profile?.phone && (
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-5 h-5 text-muted-foreground" />
                                                    <span>{profile.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card className={
                            profile?.approval_status === 'approved'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-yellow-50 border-yellow-200'
                        }>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Partnership Status</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${profile?.approval_status === 'approved'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-yellow-600 text-white'
                                    }`}>
                                    {profile?.approval_status === 'approved' ? 'ACTIVE' : 'PENDING APPROVAL'}
                                </span>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Button
                                        onClick={() => navigate('/partnership')}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        View Partnership Opportunities
                                    </Button>
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

                        {/* Info Card */}
                        <Card className="bg-secondary">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2 text-black">Partnership Benefits</h3>
                                <ul className="text-sm text-black/80 space-y-2">
                                    <li>• Access to our entrepreneur network</li>
                                    <li>• Collaborative project opportunities</li>
                                    <li>• Brand visibility and recognition</li>
                                    <li>• Community impact initiatives</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
