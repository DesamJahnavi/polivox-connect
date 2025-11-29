import { useState, useEffect } from 'react';
import { User, mockAuth } from '@/utils/mockAuth';
import { Role } from '@/utils/validation';
import { 
  Shield, 
  Users, 
  Database, 
  Settings,
  UserCog,
  Activity,
  CheckCircle,
  AlertTriangle,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  user: User;
}

const AdminDashboard = ({ user }: Props) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'data'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = mockAuth.getAllUsers();
    setUsers(allUsers);
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setIsUpdating(userId);
    try {
      await mockAuth.updateUserRole(userId, newRole);
      loadUsers();
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    loadUsers();
    setIsLoading(false);
    toast.success('Data refreshed successfully');
  };

  const stats = {
    totalUsers: users.length,
    citizens: users.filter(u => u.role === 'citizen').length,
    politicians: users.filter(u => u.role === 'politician').length,
    moderators: users.filter(u => u.role === 'moderator').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const systemHealth = [
    { name: 'Database', status: 'healthy', uptime: '99.9%' },
    { name: 'API Services', status: 'healthy', uptime: '99.8%' },
    { name: 'Authentication', status: 'healthy', uptime: '100%' },
    { name: 'Storage', status: 'warning', uptime: '98.5%' },
  ];

  const roleColors: Record<Role, string> = {
    admin: 'bg-role-admin',
    citizen: 'bg-role-citizen',
    politician: 'bg-role-politician',
    moderator: 'bg-role-moderator',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Oversee platform operations, manage users, and ensure data integrity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-role-citizen/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-role-citizen" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.citizens}</p>
              <p className="text-xs text-muted-foreground">Citizens</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-role-politician/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-role-politician" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.politicians}</p>
              <p className="text-xs text-muted-foreground">Politicians</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-role-moderator/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-role-moderator" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.moderators}</p>
              <p className="text-xs text-muted-foreground">Moderators</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-role-admin/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-role-admin" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
              <p className="text-xs text-muted-foreground">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
        {[
          { id: 'overview', label: 'Platform Overview', icon: Activity },
          { id: 'users', label: 'Manage Users', icon: UserCog },
          { id: 'data', label: 'Data Integrity', icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`
              flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap
              ${activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="dashboard-card">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                System Health
              </h2>
              <div className="space-y-3">
                {systemHealth.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      {service.status === 'healthy' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-warning" />
                      )}
                      <span className="text-foreground">{service.name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${service.status === 'healthy' ? 'text-success' : 'text-warning'}`}>
                        {service.uptime}
                      </span>
                      <p className="text-xs text-muted-foreground">uptime</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Platform Statistics
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Issues Reported (This Month)</span>
                  <span className="font-semibold text-foreground">234</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Issues Resolved</span>
                  <span className="font-semibold text-success">189</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Feedback Received</span>
                  <span className="font-semibold text-foreground">156</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Updates Posted</span>
                  <span className="font-semibold text-foreground">47</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <UserCog className="w-5 h-5 text-primary" />
                User Management
              </h2>
              <button
                onClick={handleRefreshData}
                disabled={isLoading}
                className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            
            <div className="dashboard-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${roleColors[u.role]} flex items-center justify-center text-primary-foreground text-xs font-bold`}>
                              {u.fullName.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-foreground">{u.fullName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`role-badge role-badge-${u.role}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                            disabled={isUpdating === u.id || u.id === user.id}
                            className="text-sm px-3 py-1 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                          >
                            <option value="citizen">Citizen</option>
                            <option value="politician">Politician</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="dashboard-card">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Data Integrity Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-success" />
                    <div>
                      <p className="font-medium text-foreground">User Database</p>
                      <p className="text-sm text-muted-foreground">All records validated</p>
                    </div>
                  </div>
                  <span className="text-success font-medium">Healthy</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-success" />
                    <div>
                      <p className="font-medium text-foreground">Issue Reports</p>
                      <p className="text-sm text-muted-foreground">No orphaned records</p>
                    </div>
                  </div>
                  <span className="text-success font-medium">Healthy</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-success" />
                    <div>
                      <p className="font-medium text-foreground">Feedback Records</p>
                      <p className="text-sm text-muted-foreground">Integrity verified</p>
                    </div>
                  </div>
                  <span className="text-success font-medium">Healthy</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                    <div>
                      <p className="font-medium text-foreground">Session Storage</p>
                      <p className="text-sm text-muted-foreground">3 stale sessions detected</p>
                    </div>
                  </div>
                  <button className="text-warning font-medium hover:underline">
                    Clean Up
                  </button>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Backup Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Last Backup</span>
                  <span className="font-medium text-foreground">Today, 3:00 AM</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Backup Size</span>
                  <span className="font-medium text-foreground">2.4 GB</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Next Scheduled Backup</span>
                  <span className="font-medium text-foreground">Tomorrow, 3:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
