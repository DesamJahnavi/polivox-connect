import { Link, useNavigate } from 'react-router-dom';
import { mockAuth } from '@/utils/mockAuth';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Shield, Users, Briefcase, Eye } from 'lucide-react';

const roleIcons = {
  admin: Shield,
  citizen: Users,
  politician: Briefcase,
  moderator: Eye,
};

const NavBar = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(mockAuth.getCurrentUser());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      setSession(mockAuth.getCurrentUser());
    };
    
    window.addEventListener('storage', checkSession);
    window.addEventListener('focus', checkSession);
    
    return () => {
      window.removeEventListener('storage', checkSession);
      window.removeEventListener('focus', checkSession);
    };
  }, []);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await mockAuth.signOut();
    setSession(null);
    setIsLoggingOut(false);
    navigate('/');
  };

  const RoleIcon = session?.user.role ? roleIcons[session.user.role] : User;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block">FEDF-PS08</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                  <div className={`role-badge role-badge-${session.user.role}`}>
                    <RoleIcon className="w-3 h-3 mr-1" />
                    {session.user.role}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {session.user.fullName}
                  </span>
                  <button
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/signin" className="nav-link">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary py-2 px-4 text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            {session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className={`role-badge role-badge-${session.user.role}`}>
                    <RoleIcon className="w-3 h-3 mr-1" />
                    {session.user.role}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {session.user.fullName}
                  </span>
                </div>
                <Link
                  to="/dashboard"
                  className="block py-2 nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="w-full btn-secondary py-2 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/signin"
                  className="block py-3 text-center nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
