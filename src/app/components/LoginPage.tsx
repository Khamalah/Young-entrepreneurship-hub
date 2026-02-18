import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-muted flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <button onClick={() => navigate('/')} className="inline-block">
              <Logo />
            </button>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl text-center mb-2">Welcome Back</h2>
              <p className="text-muted-foreground text-center mb-8">
                Sign in to access your account
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10"
                      autoComplete="email"
                      name="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      autoComplete="current-password"
                      name="password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-primary hover:underline"
                >
                  Sign up
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
