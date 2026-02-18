import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Upload, Loader2, Camera, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface ProfilePhotoUploadProps {
    isOpen: boolean;
    onClose: () => void;
    currentPhotoUrl?: string;
    onPhotoUpdated: (newUrl: string) => void;
}

export function ProfilePhotoUpload({ isOpen, onClose, currentPhotoUrl, onPhotoUpdated }: ProfilePhotoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB');
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a photo');
            return;
        }

        setUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error('Not authenticated');
                return;
            }

            // Delete old photo if exists
            if (currentPhotoUrl) {
                const oldPath = currentPhotoUrl.split('/').pop();
                if (oldPath) {
                    await supabase.storage
                        .from('profile-photos')
                        .remove([`${user.id}/${oldPath}`]);
                }
            }

            // Upload new photo
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('profile-photos')
                .upload(filePath, selectedFile, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profile-photos')
                .getPublicUrl(filePath);

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_photo_url: publicUrl })
                .eq('id', user.id);

            if (updateError) {
                throw updateError;
            }

            toast.success('Profile photo updated!');
            onPhotoUpdated(publicUrl);
            onClose();
            setPreview(null);
            setSelectedFile(null);
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async () => {
        if (!currentPhotoUrl) return;

        setUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            // Delete from storage
            const oldPath = currentPhotoUrl.split('/').pop();
            if (oldPath) {
                await supabase.storage
                    .from('profile-photos')
                    .remove([`${user.id}/${oldPath}`]);
            }

            // Update profile
            await supabase
                .from('profiles')
                .update({ profile_photo_url: null })
                .eq('id', user.id);

            toast.success('Profile photo removed');
            onPhotoUpdated('');
            onClose();
        } catch (error) {
            toast.error('Failed to remove photo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Profile Photo
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Preview */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-full overflow-hidden bg-muted flex items-center justify-center border-4 border-primary/20">
                                {preview || currentPhotoUrl ? (
                                    <img
                                        src={preview || currentPhotoUrl}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Camera className="w-16 h-16 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* File Input */}
                    <div>
                        <label className="block mb-2 font-medium text-center">
                            Choose a photo (Max 2MB)
                        </label>
                        <div className="flex justify-center">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <div className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Select Photo
                                </div>
                            </label>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            JPG, JPEG or PNG format
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        {currentPhotoUrl && !preview && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleRemove}
                                disabled={uploading}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Remove Photo
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        {selectedFile && (
                            <Button
                                onClick={handleUpload}
                                className="bg-primary hover:bg-primary/90"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
