import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { User, X, Loader2, Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentProfile: {
        full_name: string;
        email: string;
        phone: string;
        gender?: string;
        profile_photo_url?: string | null;
    };
    onProfileUpdated: () => void;
}

export function ProfileEditModal({ isOpen, onClose, currentProfile, onProfileUpdated }: ProfileEditModalProps) {
    const [formData, setFormData] = useState({
        full_name: currentProfile.full_name || '',
        gender: currentProfile.gender || ''
    });
    const [loading, setLoading] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    useEffect(() => {
        setFormData({
            full_name: currentProfile.full_name || '',
            gender: currentProfile.gender || ''
        });
    }, [currentProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error('Not authenticated');
                return;
            }

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    gender: formData.gender
                })
                .eq('id', user.id);

            if (error) {
                toast.error('Failed to update profile');
            } else {
                toast.success('Profile updated successfully!');
                onProfileUpdated();
                onClose();
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Edit Profile
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo Section */}
                    <div className="flex flex-col items-center gap-4 py-2 border-b pb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 bg-muted flex items-center justify-center">
                            {currentProfile.profile_photo_url ? (
                                <img
                                    src={currentProfile.profile_photo_url}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-12 h-12 text-muted-foreground" />
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => setIsPhotoModalOpen(true)}
                        >
                            <Camera className="w-4 h-4" />
                            Change Profile Photo
                        </Button>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block mb-2 font-medium">Full Name *</label>
                        <Input
                            value={formData.full_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                            placeholder="Your full name"
                            autoComplete="name"
                            required
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block mb-2 font-medium">Gender</label>
                        <Select
                            value={formData.gender}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Read-only fields */}
                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-3">The following fields cannot be changed:</p>
                        <div className="space-y-3">
                            <div>
                                <label className="block mb-1 text-sm text-muted-foreground">Email</label>
                                <Input
                                    value={currentProfile.email}
                                    disabled
                                    className="bg-muted cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm text-muted-foreground">Phone</label>
                                <Input
                                    value={currentProfile.phone}
                                    disabled
                                    className="bg-muted cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>

            <ProfilePhotoUpload
                isOpen={isPhotoModalOpen}
                onClose={() => setIsPhotoModalOpen(false)}
                currentPhotoUrl={currentProfile.profile_photo_url || undefined}
                onPhotoUpdated={onProfileUpdated}
            />
        </Dialog>
    );
}
