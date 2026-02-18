import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Menu, X, ChevronDown, User as UserIcon, LogOut, Camera } from 'lucide-react';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
  userRole?: string | null;
  profilePhotoUrl?: string | null;
  userName?: string;
  onPhotoUpdated?: () => void;
}

export function Header({ isLoggedIn = false, onLogout, userRole, profilePhotoUrl, userName, onPhotoUpdated }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    {

      name: 'Services',
      path: '/services',
      dropdown: [
        { name: 'Mentorship Programs', path: '/services' },
        { name: 'Talks & Speaking', path: '/services' },
        { name: 'Empowerment Sessions', path: '/services' },
      ]
    },
    { name: 'Blog', path: '/blog' },
    // Only show Booking for mentees or non-logged-in users
    ...((!userRole || userRole === 'mentee') ? [{ name: 'Booking', path: '/booking' }] : []),
    { name: 'Partnership', path: '/partnership' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="hover:opacity-80 transition-opacity"
          >
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              item.dropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className={`flex items-center gap-1 transition-colors font-bold text-sm ${isActive(item.path)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                    }`}>
                    {item.name}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem
                        key={subItem.name}
                        onClick={() => navigate(subItem.path)}
                        className="font-medium text-sm"
                      >
                        {subItem.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`transition-colors font-bold text-sm ${isActive(item.path)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                    }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {/* Profile Photo / User Menu (Google Style) */}
                {userRole !== 'superadmin' ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors bg-muted flex items-center justify-center">
                        {profilePhotoUrl ? (
                          <img
                            src={profilePhotoUrl}
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-lg">
                            {userName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex flex-col items-center p-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2 bg-muted flex items-center justify-center">
                          {profilePhotoUrl ? (
                            <img src={profilePhotoUrl} alt={userName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-2xl">
                              {userName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <p className="font-bold text-sm text-center truncate w-full">{userName}</p>
                        <p className="text-xs text-muted-foreground transition-colors mb-4 uppercase tracking-wider">{userRole}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 font-bold"
                          onClick={() => setIsPhotoUploadOpen(true)}
                        >
                          <Camera className="w-4 h-4" />
                          Change Photo
                        </Button>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer font-bold">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive focus:text-destructive font-bold">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link to="/dashboard">
                      <Button variant="ghost" className="font-bold text-sm">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={onLogout}
                      className="font-bold text-sm"
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-bold text-sm text-foreground hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link to="/booking">
                  <Button variant="outline" className="font-bold text-sm text-primary border-primary hover:bg-primary/10">
                    Book a Session
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <ProfilePhotoUpload
            isOpen={isPhotoUploadOpen}
            onClose={() => setIsPhotoUploadOpen(false)}
            currentPhotoUrl={profilePhotoUrl || undefined}
            onPhotoUpdated={() => onPhotoUpdated && onPhotoUpdated()}
          />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t max-h-[calc(100vh-80px)] overflow-y-auto">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <div key={item.name} className="flex flex-col gap-1">
                  {item.dropdown ? (
                    <>
                      <div className="px-4 py-2 font-bold text-sm text-primary/70 uppercase tracking-wider">
                        {item.name}
                      </div>
                      <div className="flex flex-col gap-1 pl-4">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-left px-4 py-2 rounded-lg transition-colors font-semibold text-sm ${isActive(subItem.path)
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted'
                              }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-left px-4 py-2 rounded-lg transition-colors font-bold text-sm ${isActive(item.path)
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                        }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-4 mt-4 pt-4 border-t px-2">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-primary/10">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 bg-background flex items-center justify-center">
                        {profilePhotoUrl ? (
                          <img src={profilePhotoUrl} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                            {userName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{userRole}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-center gap-2 font-bold"
                        onClick={() => {
                          setIsPhotoUploadOpen(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Camera className="w-4 h-4" />
                        Photo
                      </Button>
                      <Button
                        onClick={() => {
                          navigate('/dashboard');
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        size="sm"
                        className="justify-center font-bold"
                      >
                        Dashboard
                      </Button>
                    </div>
                    <Button
                      onClick={() => {
                        onLogout && onLogout();
                        setMobileMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-center font-bold text-sm text-destructive"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button variant="ghost" className="w-full font-bold text-sm">
                        Login
                      </Button>
                    </Link>
                    <Link to="/booking" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full font-bold text-sm text-primary border-primary">
                        Book a Session
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-sm">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
