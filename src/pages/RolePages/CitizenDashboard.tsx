import { useState } from 'react';
import { User } from '@/utils/mockAuth';
import { 
  MessageSquare, 
  Bell, 
  FileText, 
  Send, 
  MapPin, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  user: User;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
}

interface Update {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

const CitizenDashboard = ({ user }: Props) => {
  const [activeTab, setActiveTab] = useState<'issues' | 'feedback' | 'updates'>('issues');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [issueForm, setIssueForm] = useState({ title: '', description: '', location: '' });
  const [feedback, setFeedback] = useState('');
  
  // Mock data
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      title: 'Street light outage on Main St',
      description: 'Multiple street lights not working near the park.',
      location: '123 Main Street',
      status: 'in-progress',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Pothole on Oak Avenue',
      description: 'Large pothole causing traffic issues.',
      location: '456 Oak Avenue',
      status: 'pending',
      createdAt: '2024-01-18',
    },
  ]);

  const updates: Update[] = [
    {
      id: '1',
      title: 'New Community Center Opening',
      content: 'We are excited to announce the opening of the new community center next month.',
      author: 'Mayor Johnson',
      date: '2024-01-20',
    },
    {
      id: '2',
      title: 'Road Construction Schedule',
      content: 'Highway 101 will undergo repairs starting February. Please plan alternate routes.',
      author: 'Transportation Dept',
      date: '2024-01-18',
    },
    {
      id: '3',
      title: 'Town Hall Meeting Announcement',
      content: 'Join us this Friday for a discussion on local budget allocation.',
      author: 'City Council',
      date: '2024-01-16',
    },
  ];

  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.title.trim() || !issueForm.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    
    const newIssue: Issue = {
      id: Date.now().toString(),
      title: issueForm.title,
      description: issueForm.description,
      location: issueForm.location || 'Not specified',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setIssues(prev => [newIssue, ...prev]);
    setIssueForm({ title: '', description: '', location: '' });
    setIsSubmitting(false);
    toast.success('Issue reported successfully!');
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    
    setFeedback('');
    setIsSubmitting(false);
    toast.success('Thank you for your feedback!');
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
    'in-progress': { icon: AlertTriangle, color: 'text-primary', bg: 'bg-primary/10', label: 'In Progress' },
    resolved: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Resolved' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Welcome, {user.fullName}
        </h1>
        <p className="text-muted-foreground">
          Report issues, share feedback, and stay updated on community matters.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
        {[
          { id: 'issues', label: 'Report Issues', icon: MessageSquare },
          { id: 'feedback', label: 'Provide Feedback', icon: FileText },
          { id: 'updates', label: 'View Updates', icon: Bell },
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
        {activeTab === 'issues' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Report Form */}
            <div className="dashboard-card">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Report New Issue
              </h2>
              <form onSubmit={handleSubmitIssue} className="space-y-4">
                <div className="form-field">
                  <label htmlFor="issue-title" className="form-label">
                    Issue Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="issue-title"
                    type="text"
                    value={issueForm.title}
                    onChange={(e) => setIssueForm(prev => ({ ...prev, title: e.target.value }))}
                    className="form-input"
                    placeholder="Brief description of the issue"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="issue-description" className="form-label">
                    Detailed Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="issue-description"
                    value={issueForm.description}
                    onChange={(e) => setIssueForm(prev => ({ ...prev, description: e.target.value }))}
                    className="form-input min-h-[100px] resize-y"
                    placeholder="Provide more details about the issue..."
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="issue-location" className="form-label">
                    Location <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="issue-location"
                      type="text"
                      value={issueForm.location}
                      onChange={(e) => setIssueForm(prev => ({ ...prev, location: e.target.value }))}
                      className="form-input pl-10"
                      placeholder="Enter address or location"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Report
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* My Issues */}
            <div className="dashboard-card">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                My Reported Issues
              </h2>
              <div className="space-y-4">
                {issues.map((issue) => {
                  const status = statusConfig[issue.status];
                  const StatusIcon = status.icon;
                  return (
                    <div key={issue.id} className="p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-medium text-foreground">{issue.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {issue.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {issue.createdAt}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="max-w-2xl">
            <div className="dashboard-card">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Share Your Feedback
              </h2>
              <p className="text-muted-foreground mb-4">
                Your feedback helps improve our community. Share your thoughts on policies, 
                services, or any suggestions you have.
              </p>
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="form-field">
                  <label htmlFor="feedback" className="form-label">
                    Your Feedback <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="form-input min-h-[150px] resize-y"
                    placeholder="Share your thoughts, suggestions, or concerns..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Community Updates
            </h2>
            {updates.map((update) => (
              <div key={update.id} className="dashboard-card">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {update.title}
                </h3>
                <p className="text-muted-foreground mb-4">{update.content}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{update.author}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {update.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
