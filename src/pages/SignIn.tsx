import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2, Shield, Users, Briefcase, Eye as EyeIcon, ShieldCheck } from 'lucide-react';
import { validateEmail, validateAdminKey, Role } from '@/utils/validation';
import { mockAuth } from '@/utils/mockAuth';
import { toast } from 'sonner';

interface FormData {
  email: string;
  password: string;
  role: Role;
  adminKey: string;
  rememberMe: boolean;
}

interface FormErrors {
  email: string | null;
  password: string | null;
  adminKey: string | null;
  general: string | null;
}

const roleOptions: { value: Role; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'citizen', label: 'Citizen', icon: Users, color: 'bg-role-citizen' },
  { value: 'politician', label: 'Politician', icon: Briefcase, color: 'bg-role-politician' },
  { value: 'moderator', label: 'Moderator', icon: EyeIcon, color: 'bg-role-moderator' },
  { value: 'admin', label: 'Admin', icon: ShieldCheck, color: 'bg-role-admin' },
];

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    role: 'citizen',
    adminKey: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: null,
    password: null,
    adminKey: null,
    general: null,
  });

  // Check if already logged in
  useEffect(() => {
    const session = mockAuth.getCurrentUser();
    if (session) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Validate on change
  useEffect(() => {
    const newErrors: FormErrors = {
      email: touched.email ? validateEmail(formData.email) : null,
      password: touched.password && !formData.password ? 'Password is required' : null,
      adminKey: touched.adminKey && formData.role === 'admin' 
        ? validateAdminKey(formData.adminKey) 
        : null,
      general: null,
    };
    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleSelect = (role: Role) => {
    setFormData(prev => ({ ...prev, role, adminKey: role !== 'admin' ? '' : prev.adminKey }));
    setTouched(prev => ({ ...prev, adminKey: false }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isFormValid = (): boolean => {
    const emailError = validateEmail(formData.email);
    const passwordValid = !!formData.password;
    const adminKeyValid = formData.role !== 'admin' || !validateAdminKey(formData.adminKey);
    
    return !emailError && passwordValid && adminKeyValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
      adminKey: formData.role === 'admin',
    });

    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: null }));

    try {
      const session = await mockAuth.signIn({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        adminKey: formData.role === 'admin' ? formData.adminKey : undefined,
        rememberMe: formData.rememberMe,
      });

      toast.success(`Welcome back, ${session.user.fullName}!`);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed. Please try again.';
      setErrors(prev => ({ ...prev, general: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (field: keyof FormErrors) => {
    const baseClass = 'form-input';
    if (!touched[field]) return baseClass;
    if (errors[field]) return `${baseClass} error`;
    return `${baseClass} valid`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-background">
      <div className="w-full max-w-md animate-scale-in">
        <div className="auth-card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl hero-gradient flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account</p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="form-label block mb-3">Select Your Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.role === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleRoleSelect(option.value)}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2
                      ${isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 bg-background'
                      }
                    `}
                  >
                    <div className={`w-8 h-8 rounded-lg ${option.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* General Error */}
          {errors.general && (
            <div 
              role="alert" 
              aria-live="assertive"
              className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-field mb-4">
              <label htmlFor="email" className="form-label">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={getInputClassName('email')}
                placeholder="john@example.com"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
              />
              {touched.email && errors.email && (
                <p id="email-error" className="error-text" aria-live="polite">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-field mb-4">
              <label htmlFor="password" className="form-label">
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className={`${getInputClassName('password')} pr-12`}
                  placeholder="••••••••"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p id="password-error" className="error-text" aria-live="polite">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Admin Key (conditional) */}
            {formData.role === 'admin' && (
              <div className="form-field mb-4 animate-slide-up">
                <label htmlFor="adminKey" className="form-label">
                  Admin Key <span className="text-destructive">*</span>
                </label>
                <input
                  id="adminKey"
                  name="adminKey"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={formData.adminKey}
                  onChange={handleChange}
                  onBlur={() => handleBlur('adminKey')}
                  className={getInputClassName('adminKey')}
                  placeholder="Enter 6-digit key"
                  aria-describedby={errors.adminKey ? 'adminKey-error' : 'adminKey-hint'}
                  aria-invalid={!!errors.adminKey}
                />
                <p id="adminKey-hint" className="text-xs text-muted-foreground mt-1">
                  Demo key: 123456 | Email: admin@fedf.gov | Password: Admin@123
                </p>
                {touched.adminKey && errors.adminKey && (
                  <p id="adminKey-error" className="error-text" aria-live="polite">
                    <AlertCircle className="w-4 h-4" />
                    {errors.adminKey}
                  </p>
                )}
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-medium text-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Citizen:</strong> john.citizen@email.com (any password)</p>
              <p><strong>Politician:</strong> sarah.rep@gov.com (any password)</p>
              <p><strong>Moderator:</strong> mod@fedf.gov (any password)</p>
              <p><strong>Admin:</strong> admin@fedf.gov / Admin@123 / Key: 123456</p>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
