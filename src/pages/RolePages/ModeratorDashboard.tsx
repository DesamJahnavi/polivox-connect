import { useState } from 'react';
import { User } from '@/utils/mockAuth';
import { 
  Eye, 
  Flag, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  MessageSquare,
  Calendar,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  user: User;
}

interface FlaggedItem {
  id: string;
  type: 'comment' | 'report' | 'feedback';
  content: string;
  author: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface InteractionLog {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
}

const ModeratorDashboard = ({ user }: Props) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'flagged' | 'logs'>('monitor');
  const [isProcessing, setIsProcessing] = useState(false);

  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([
    {
      id: '1',
      type: 'comment',
      content: 'This is completely unacceptable behavior from our representatives!',
      author: 'Anonymous User',
      reason: 'Potentially inflammatory content',
      status: 'pending',
      createdAt: '2024-01-20',
    },
    {
      id: '2',
      type: 'feedback',
      content: 'The new policy is terrible and whoever approved it should be fired.',
      author: 'John D.',
      reason: 'Aggressive language',
      status: 'pending',
      createdAt: '2024-01-19',
    },
    {
      id: '3',
      type: 'report',
      content: 'I saw someone dumping trash near the river last night.',
      author: 'Lisa M.',
      reason: 'Requires verification',
      status: 'approved',
      createdAt: '2024-01-18',
    },
  ]);

  const [interactionLogs] = useState<InteractionLog[]>([
    { id: '1', action: 'Issue Reported', user: 'Maria Garcia', target: 'Street Lighting Issue', timestamp: '2024-01-20 14:32' },
    { id: '2', action: 'Feedback Submitted', user: 'James Wilson', target: 'Education Policy', timestamp: '2024-01-20 13:15' },
    { id: '3', action: 'Response Sent', user: 'Rep. Johnson', target: 'Transit Request', timestamp: '2024-01-20 12:45' },
    { id: '4', action: 'Update Posted', user: 'Mayor Smith', target: 'Budget Announcement', timestamp: '2024-01-20 11:30' },
    { id: '5', action: 'Issue Resolved', user: 'System', target: 'Pothole Report #234', timestamp: '2024-01-20 10:00' },
  ]);

  const stats = {
    totalInteractions: 156,
    activeUsers: 42,
    pendingReviews: flaggedItems.filter(i => i.status === 'pending').length,
    resolvedToday: 12,
  };

  const handleModerateItem = async (itemId: string, action: 'approved' | 'rejected') => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 900));

    setFlaggedItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, status: action } : item
    ));

    setIsProcessing(false);
    toast.success(`Item ${action === 'approved' ? 'approved' : 'rejected'} successfully`);
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending Review' },
    approved: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Approved' },
    rejected: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Rejected' },
  };

  const typeConfig = {
    comment: { icon: MessageSquare, color: 'text-primary' },
    report: { icon: AlertTriangle, color: 'text-warning' },
    feedback: { icon: Flag, color: 'text-accent' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Welcome, {user.fullName}
        </h1>
        <p className="text-muted-foreground">
          Monitor platform interactions, review flagged content, and ensure quality discourse.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalInteractions}</p>
              <p className="text-xs text-muted-foreground">Total Interactions</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.activeUsers}</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Flag className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pendingReviews}</p>
              <p className="text-xs text-muted-foreground">Pending Reviews</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.resolvedToday}</p>
              <p className="text-xs text-muted-foreground">Resolved Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
        {[
          { id: 'monitor', label: 'Monitor Activity', icon: Eye },
          { id: 'flagged', label: 'Flagged Content', icon: Flag },
          { id: 'logs', label: 'Activity Logs', icon: Shield },
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
        {activeTab === 'monitor' && (
          <div className="space-y-6">
            <div className="dashboard-card">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Platform Health Overview
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Average Response Time</span>
                  <span className="font-semibold text-foreground">2.4 hours</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Issues Resolved This Week</span>
                  <span className="font-semibold text-foreground">47</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Citizen Satisfaction Rate</span>
                  <span className="font-semibold text-success">94%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Content Flagged Rate</span>
                  <span className="font-semibold text-foreground">1.2%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'flagged' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
              <Flag className="w-5 h-5 text-warning" />
              Flagged Content for Review
            </h2>
            {flaggedItems.map((item) => {
              const status = statusConfig[item.status];
              const type = typeConfig[item.type];
              const StatusIcon = status.icon;
              const TypeIcon = type.icon;

              return (
                <div key={item.id} className="dashboard-card">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <TypeIcon className={`w-5 h-5 ${type.color}`} />
                      <span className="text-sm font-medium text-foreground capitalize">{item.type}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  <p className="text-foreground mb-2 p-3 rounded-lg bg-muted/30 border-l-4 border-warning">
                    "{item.content}"
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      By: {item.author} • {item.createdAt}
                    </p>
                    <p className="text-sm text-warning">
                      Reason: {item.reason}
                    </p>
                  </div>

                  {item.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleModerateItem(item.id, 'approved')}
                        disabled={isProcessing}
                        className="btn-accent flex items-center gap-2 flex-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerateItem(item.id, 'rejected')}
                        disabled={isProcessing}
                        className="btn-secondary flex items-center gap-2 flex-1 border border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Recent Activity Logs
            </h2>
            <div className="dashboard-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Target</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interactionLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground">{log.action}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{log.user}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{log.target}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {log.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;
