import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Lock, Mail, User, Phone, Eye, EyeOff, Briefcase, Building } from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'mentee', // default role
    gender: '',
    // Mentor-specific
    bio: '',
    yearsExperience: '',
    company: '',
    jobTitle: '',
    linkedinUrl: '',
    // Partner-specific
    organizationName: '',
    organizationType: '',
    website: '',
    organizationDescription: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
            role: formData.role,
            gender: formData.gender
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data.user) {
        toast.error('Failed to create account');
        return;
      }

      // Create role-specific profile
      if (formData.role === 'mentor') {
        // Create mentor profile (will be pending approval)
        const { error: mentorError } = await supabase
          .from('mentor_profiles')
          .insert({
            user_id: data.user.id,
            bio: formData.bio,
            years_experience: parseInt(formData.yearsExperience) || 0,
            company: formData.company,
            job_title: formData.jobTitle,
            linkedin_url: formData.linkedinUrl
          });

        if (mentorError) {
          console.error('Error creating mentor profile:', mentorError);
        }

        // Update profile to pending approval
        await supabase
          .from('profiles')
          .update({ approval_status: 'pending' })
          .eq('id', data.user.id);

        toast.success('Mentor application submitted! Awaiting admin approval.');
      } else if (formData.role === 'partner') {
        // Create partner profile (will be pending approval)
        const { error: partnerError } = await supabase
          .from('partner_profiles')
          .insert({
            user_id: data.user.id,
            organization_name: formData.organizationName,
            organization_type: formData.organizationType,
            website: formData.website,
            description: formData.organizationDescription
          });

        if (partnerError) {
          console.error('Error creating partner profile:', partnerError);
        }

        // Update profile to pending approval
        await supabase
          .from('profiles')
          .update({ approval_status: 'pending' })
          .eq('id', data.user.id);

        toast.success('Partner application submitted! Awaiting admin approval.');
      } else {
        toast.success('Account created successfully!');
      }

      // Redirect based on session
      if (data.session) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full min-h-screen bg-muted flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <button onClick={() => navigate('/')} className="inline-block">
              <Logo />
            </button>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl text-center mb-2">Create Account</h2>
              <p className="text-muted-foreground text-center mb-8">
                Join our community of entrepreneurs
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block mb-2 font-semibold">I want to join as *</label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mentee">Mentee (Seeking Mentorship)</SelectItem>
                      <SelectItem value="mentor">Mentor (Provide Guidance)</SelectItem>
                      <SelectItem value="partner">Partner (Organization/Institution)</SelectItem>
                    </SelectContent>
                  </Select>
                  {(formData.role === 'mentor' || formData.role === 'partner') && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ⚠️ Your application will require admin approval
                    </p>
                  )}
                </div>

                {/* Common Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="John Doe"
                        className="pl-10"
                        autoComplete="name"
                        name="full-name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Gender</label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
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
                </div>

                <div>
                  <label className="block mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10"
                      autoComplete="email"
                      name="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+254 700 816 697"
                      className="pl-10"
                      autoComplete="tel"
                      name="phone"
                      required
                    />
                  </div>
                </div>

                {/* Mentor-Specific Fields */}
                {formData.role === 'mentor' && (
                  <>
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Mentor Information
                      </h3>
                    </div>

                    <div>
                      <label className="block mb-2">Professional Bio *</label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about your experience and expertise..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2">Years of Experience *</label>
                        <Input
                          type="number"
                          value={formData.yearsExperience}
                          onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                          placeholder="5"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2">Current Company</label>
                        <Input
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2">Job Title</label>
                        <Input
                          value={formData.jobTitle}
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                          placeholder="Senior Consultant"
                        />
                      </div>
                      <div>
                        <label className="block mb-2">LinkedIn URL</label>
                        <Input
                          type="url"
                          value={formData.linkedinUrl}
                          onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Partner-Specific Fields */}
                {formData.role === 'partner' && (
                  <>
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Organization Information
                      </h3>
                    </div>

                    <div>
                      <label className="block mb-2">Organization Name *</label>
                      <Input
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        placeholder="Your Organization"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2">Organization Type *</label>
                      <Select
                        value={formData.organizationType}
                        onValueChange={(value) => handleInputChange('organizationType', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="educational">Educational Institution</SelectItem>
                          <SelectItem value="ngo">NGO/Non-Profit</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block mb-2">Website</label>
                      <Input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://yourorganization.com"
                      />
                    </div>

                    <div>
                      <label className="block mb-2">Organization Description *</label>
                      <Textarea
                        value={formData.organizationDescription}
                        onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                        placeholder="Describe your organization and partnership interests..."
                        rows={4}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Password Fields */}
                <div className="border-t pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Create a password"
                          className="pl-10 pr-10"
                          autoComplete="new-password"
                          name="password"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Must be at least 6 characters
                      </p>
                    </div>

                    <div>
                      <label className="block mb-2">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="Confirm your password"
                          className="pl-10"
                          autoComplete="new-password"
                          name="confirm-password"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{' '}
                    <button type="button" className="text-primary hover:underline">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-primary hover:underline">
                      Privacy Policy
                    </button>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
