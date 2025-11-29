import { useState } from 'react';
import { User } from '@/utils/mockAuth';
import { 
  MessageSquare, 
  Send, 
  Users, 
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Reply
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  user: User;
}

interface Concern {
  id: string;
  title: string;
  description: string;
  citizenName: string;
  status: 'pending' | 'responded' | 'resolved';
  createdAt: string;
  response?: string;
}

interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
}

const PoliticianDashboard = ({ user }: Props) => {
  const [activeTab, setActiveTab] = useState<'concerns' | 'updates' | 'issues'>('concerns');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseText, setResponseText] = useState<Record<string, string>>({});
  const [updateForm, setUpdateForm] = useState({ title: '', content: '' });

  const [concerns, setConcerns] = useState<Concern[]>([
    {
      id: '1',
      title: 'Request for More Public Transportation',
      description: 'Many residents in the Oak District lack access to reliable public transit. Could we discuss expanding bus routes?',
      citizenName: 'Maria Garcia',
      status: 'pending',
      createdAt: '2024-01-19',
    },
    {
      id: '2',
      title: 'School Funding Concerns',
      description: 'Our local elementary school is in need of updated facilities and more teachers.',
      citizenName: 'James Wilson',
      status: 'responded',
      createdAt: '2024-01-17',
      response: 'Thank you for bringing this to our attention. We are reviewing the education budget.',
    },
    {
      id: '3',
      title: 'Park Maintenance Issues',
      description: 'The playground equipment at Central Park needs repairs. Several pieces are broken.',
      citizenName: 'Lisa Chen',
      status: 'pending',
      createdAt: '2024-01-20',
    },
  ]);

  const [updates, setUpdates] = useState<Update[]>([
    {
      id: '1',
      title: 'Budget Meeting Results',
      content: 'The city council has approved the infrastructure improvement budget for 2024.',
      date: '2024-01-18',
    },
  ]);

  const assignedIssues = [
    { id: '1', title: 'Road repair on Highway 101', priority: 'high', assignedDate: '2024-01-15' },
    { id: '2', title: 'Community center renovation', priority: 'medium', assignedDate: '2024-01-16' },
    { id: '3', title: 'Street lighting expansion', priority: 'low', assignedDate: '2024-01-17' },
  ];

  const handleRespond = async (concernId: string) => {
    const response = responseText[concernId];
    if (!response?.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 900));

    setConcerns(prev => prev.map(c => 
      c.id === concernId 
        ? { ...c, status: 'responded' as const, response } 
        : c
    ));
    setResponseText(prev => ({ ...prev, [concernId]: '' }));
    setIsSubmitting(false);
    toast.success('Response sent successfully!');
  };

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateForm.title.trim() || !updateForm.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 900));

    const newUpdate: Update = {
      id: Date.now().toString(),
      title: updateForm.title,
      content: updateForm.content,
      date: new Date().toISOString().split('T')[0],
    };

    setUpdates(prev => [newUpdate, ...prev]);
    setUpdateForm({ title: '', content: '' });
    setIsSubmitting(false);
    toast.success('Update posted successfully!');
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
    responded: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Responded' },
    resolved: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Resolved' },
  };

  const priorityConfig = {
    high: 'bg-destructive/10 text-destructive',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-success/10 text-success',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Welcome, {user.fullName}
        </h1>
        <p className="text-muted-foreground">
          Respond to citizen concerns, post updates, and manage assigned issues.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {concerns.filter(c => c.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending Concerns</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {concerns.filter(c => c.status === 'responded').length}
              </p>
              <p className="text-sm text-muted-foreground">Responded</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{updates.length}</p>
              <p className="text-sm text-muted-foreground">Updates Posted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
        {[
          { id: 'concerns', label: 'Citizen Concerns', icon: MessageSquare },
          { id: 'updates', label: 'Post Updates', icon: FileText },
          { id: 'issues', label: 'Assigned Issues', icon: AlertTriangle },
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
        {activeTab === 'concerns' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Citizen Concerns
            </h2>
            {concerns.map((concern) => {
              const status = statusConfig[concern.status];
              const StatusIcon = status.icon;
              return (
                <div key={concern.id} className="dashboard-card">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-medium text-foreground text-lg">{concern.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        From: {concern.citizenName} • {concern.createdAt}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{concern.description}</p>
                  
                  {concern.response && (
                    <div className="mb-4 p-3 rounded-lg bg-success/5 border border-success/20">
                      <p className="text-sm font-medium text-success mb-1">Your Response:</p>
                      <p className="text-sm text-foreground">{concern.response}</p>
                    </div>
                  )}

                  {concern.status === 'pending' && (
                    <div className="space-y-3">
                      <textarea
                        value={responseText[concern.id] || ''}
                        onChange={(e) => setResponseText(prev => ({ ...prev, [concern.id]: e.target.value }))}
                        className="form-input min-h-[80px] resize-y"
                        placeholder="Write your response..."
                      />
                      <button
                        onClick={() => handleRespond(concern.id)}
                        disabled={isSubmitting}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Reply className="w-4 h-4" />
                        {isSubmitting ? 'Sending...' : 'Send Response'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="dashboard-card">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Post New Update
              </h2>
              <form onSubmit={handlePostUpdate} className="space-y-4">
                <div className="form-field">
                  <label htmlFor="update-title" className="form-label">Title</label>
                  <input
                    id="update-title"
                    type="text"
                    value={updateForm.title}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, title: e.target.value }))}
                    className="form-input"
                    placeholder="Update title"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="update-content" className="form-label">Content</label>
                  <textarea
                    id="update-content"
                    value={updateForm.content}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, content: e.target.value }))}
                    className="form-input min-h-[120px] resize-y"
                    placeholder="Share updates with your constituents..."
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
                  {isSubmitting ? 'Posting...' : (
                    <>
                      <Send className="w-4 h-4" />
                      Post Update
                    </>
                  )}
                </button>
              </form>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Previous Updates
              </h2>
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="dashboard-card">
                    <h3 className="font-medium text-foreground mb-2">{update.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{update.content}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {update.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Assigned Issues
            </h2>
            <div className="space-y-4">
              {assignedIssues.map((issue) => (
                <div key={issue.id} className="dashboard-card flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{issue.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Assigned: {issue.assignedDate}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${priorityConfig[issue.priority as keyof typeof priorityConfig]}`}>
                    {issue.priority} priority
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliticianDashboard;
