import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ServicesPage } from './components/ServicesPage';
import { BlogPage } from './components/BlogPage';
import { BlogPostPage } from './components/BlogPostPage';
import { BookingPage } from './components/BookingPage';
import { PartnershipPage } from './components/PartnershipPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { MenteeDashboard } from './components/MenteeDashboard';
import { MentorDashboard } from './components/MentorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PartnerDashboard } from './components/PartnerDashboard';
import { SuperadminDashboard } from './components/SuperadminDashboard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
        setUserName('');
        setProfilePhotoUrl(null);
        navigate('/');
      } else if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, approval_status, full_name, profile_photo_url')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUserRole('mentee'); // Default fallback
      } else {
        // Check if mentor/partner is pending approval
        if (data.approval_status === 'pending' && (data.role === 'mentor' || data.role === 'partner')) {
          toast.info('Your application is pending admin approval');
        }
        setUserRole(data.role?.toLowerCase());
        setUserName(data.full_name || '');
        setProfilePhotoUrl(data.profile_photo_url);
      }
    } catch (error) {
      console.error('Error:', error);
      setUserRole('mentee');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const showHeaderFooter = !['/login', '/signup'].includes(location.pathname);

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Determine dashboard route based on role
  const getDashboardRoute = () => {
    if (!user) return <LoginPage />;

    // Route to role-specific dashboard
    switch (userRole) {
      case 'superadmin':
        return <SuperadminDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'mentor':
        return <MentorDashboard />;
      case 'partner':
        return <PartnerDashboard />;
      case 'mentee':
      default:
        return <MenteeDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />

      {showHeaderFooter && (
        <Header
          isLoggedIn={!!user}
          onLogout={handleLogout}
          userRole={userRole}
          profilePhotoUrl={profilePhotoUrl}
          userName={userName}
          onPhotoUpdated={() => user && fetchUserProfile(user.id)}
        />
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={!!user} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:postId" element={<BlogPostPage />} />
          <Route path="/booking" element={<BookingPage isLoggedIn={!!user} />} />
          <Route path="/partnership" element={<PartnershipPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={getDashboardRoute()} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {showHeaderFooter && (
        <Footer />
      )}
    </div>
  );
}

export default App;
