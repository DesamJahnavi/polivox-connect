import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth, AuthSession } from '@/utils/mockAuth';
import AdminDashboard from './RolePages/AdminDashboard';
import CitizenDashboard from './RolePages/CitizenDashboard';
import PoliticianDashboard from './RolePages/PoliticianDashboard';
import ModeratorDashboard from './RolePages/ModeratorDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentSession = mockAuth.getCurrentUser();
    
    if (!currentSession) {
      navigate('/signin');
      return;
    }

    setSession(currentSession);
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (session.user.role) {
      case 'admin':
        return <AdminDashboard user={session.user} />;
      case 'citizen':
        return <CitizenDashboard user={session.user} />;
      case 'politician':
        return <PoliticianDashboard user={session.user} />;
      case 'moderator':
        return <ModeratorDashboard user={session.user} />;
      default:
        return <CitizenDashboard user={session.user} />;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
