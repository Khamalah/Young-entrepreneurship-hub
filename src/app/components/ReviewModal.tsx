import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Star, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    mentorName: string;
    mentorId: string;
    onReviewSubmitted: () => void;
}

export function ReviewModal({ isOpen, onClose, bookingId, mentorName, mentorId, onReviewSubmitted }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error('Not authenticated');
                return;
            }

            const { error } = await supabase
                .from('mentor_reviews')
                .insert({
                    booking_id: bookingId,
                    mentor_id: mentorId,
                    mentee_id: user.id,
                    rating: rating,
                    comment: comment
                });

            if (error) {
                if (error.code === '23505') {
                    toast.error('You have already reviewed this session');
                } else {
                    toast.error('Failed to submit review');
                }
            } else {
                toast.success('Thank you for your feedback!');
                onReviewSubmitted();
                onClose();
                setRating(0);
                setComment('');
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
                    <DialogTitle>Rate Your Session with {mentorName}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div>
                        <label className="block mb-3 font-medium text-center">How was your experience?</label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${star <= (hoveredRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-center mt-2 text-sm text-muted-foreground">
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block mb-2 font-medium">Share your feedback (optional)</label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you learn? How was the mentor helpful?"
                            rows={4}
                        />
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
                            disabled={loading || rating === 0}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Review'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
