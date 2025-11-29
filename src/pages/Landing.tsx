import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Bell, Users, Shield, ChevronRight, CheckCircle } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Report Issues',
      description: 'Easily report community issues directly to your elected representatives with detailed descriptions and location data.',
    },
    {
      icon: Bell,
      title: 'Receive Updates',
      description: 'Stay informed with real-time notifications about the status of your reports and community updates.',
    },
    {
      icon: Users,
      title: 'Provide Feedback',
      description: 'Share your thoughts on policies, initiatives, and government decisions that affect your community.',
    },
    {
      icon: Shield,
      title: 'Transparent Governance',
      description: 'Access a moderated platform ensuring constructive dialogue between citizens and politicians.',
    },
  ];

  const roles = [
    { name: 'Citizen', description: 'Report issues, provide feedback, and track updates', color: 'bg-role-citizen' },
    { name: 'Politician', description: 'Respond to concerns and post community updates', color: 'bg-role-politician' },
    { name: 'Moderator', description: 'Monitor interactions and ensure quality discourse', color: 'bg-role-moderator' },
    { name: 'Admin', description: 'Oversee platform operations and manage roles', color: 'bg-role-admin' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Civic Engagement Platform
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              FEDF-PS08 — Improve Interaction Between{' '}
              <span className="text-primary">Citizens</span> and{' '}
              <span className="text-accent">Politicians</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A modern platform making it easier for citizens to communicate with elected representatives — 
              report issues, provide feedback, and receive updates in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/signin" className="btn-outline inline-flex items-center justify-center gap-2 text-lg">
                Sign In
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Bridging the Gap
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform provides the tools needed for effective civic engagement and transparent governance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="dashboard-card group hover:border-primary/30 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Role-Based Access
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Different stakeholders have tailored experiences designed for their unique needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <div 
                key={role.name}
                className="relative p-6 rounded-2xl bg-card border border-border overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${role.color}`} />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {role.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of citizens and representatives using our platform to build stronger communities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup" className="btn-primary inline-flex items-center justify-center gap-2">
              Create Your Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Free to use
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Secure & Private
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Real-time updates
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">FEDF-PS08</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Civic Engagement Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
