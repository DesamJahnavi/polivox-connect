import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2, Shield } from 'lucide-react';
import { 
  validateName, 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword, 
  validatePhone,
  passwordRequirementsMsg,
  Role 
} from '@/utils/validation';
import { mockAuth } from '@/utils/mockAuth';
import { toast } from 'sonner';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: Role | '';
  agreeTerms: boolean;
}

interface FormErrors {
  fullName: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
  phone: string | null;
  role: string | null;
  agreeTerms: string | null;
  general: string | null;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    fullName: null,
    email: null,
    password: null,
    confirmPassword: null,
    phone: null,
    role: null,
    agreeTerms: null,
    general: null,
  });

  // Validate on change
  useEffect(() => {
    const newErrors: FormErrors = {
      fullName: touched.fullName ? validateName(formData.fullName) : null,
      email: touched.email ? validateEmail(formData.email) : null,
      password: touched.password ? validatePassword(formData.password) : null,
      confirmPassword: touched.confirmPassword 
        ? validateConfirmPassword(formData.password, formData.confirmPassword) 
        : null,
      phone: touched.phone ? validatePhone(formData.phone) : null,
      role: touched.role && !formData.role ? 'Please select a role' : null,
      agreeTerms: touched.agreeTerms && !formData.agreeTerms 
        ? 'You must agree to the terms and conditions' 
        : null,
      general: null,
    };
    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isFormValid = (): boolean => {
    const nameError = validateName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
    const phoneError = validatePhone(formData.phone);
    
    return (
      !nameError &&
      !emailError &&
      !passwordError &&
      !confirmError &&
      !phoneError &&
      !!formData.role &&
      formData.agreeTerms
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields to show errors
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      role: true,
      agreeTerms: true,
    });

    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: null }));

    try {
      await mockAuth.signUp({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role as Role,
        phone: formData.phone || undefined,
      });

      toast.success('Account created successfully! Please sign in.');
      navigate('/signin');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
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
            <h1 className="font-display text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground mt-2">Join the civic engagement platform</p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div 
              role="alert" 
              className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-field mb-4">
              <label htmlFor="fullName" className="form-label">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={() => handleBlur('fullName')}
                className={getInputClassName('fullName')}
                placeholder="John Doe"
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                aria-invalid={!!errors.fullName}
              />
              {touched.fullName && errors.fullName && (
                <p id="fullName-error" className="error-text" aria-live="polite">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

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
                  aria-describedby="password-requirements password-error"
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
              <p id="password-requirements" className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
                {passwordRequirementsMsg}
              </p>
              {touched.password && errors.password && (
                <p id="password-error" className="error-text" aria-live="polite">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-field mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`${getInputClassName('confirmPassword')} pr-12`}
                  placeholder="••••••••"
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p id="confirmPassword-error" className="error-text" aria-live="polite">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
              {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                <p className="text-sm text-success mt-1 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="form-field mb-4">
              <label htmlFor="phone" className="form-label">
                Phone Number <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                className={getInputClassName('phone')}
                placeholder="+1 (123) 456-7890"
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                aria-invalid={!!errors.phone}
              />
              {touched.phone && errors.phone && (
                <p id="phone-error" className="error-text" aria-live="polite">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="form-field mb-4">
              <label htmlFor="role" className="form-label">
                Select Your Role <span className="text-destructive">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                onBlur={() => handleBlur('role')}
                className={getInputClassName('role')}
                aria-describedby={errors.role ? 'role-error' : undefined}
                aria-invalid={!!errors.role}
              >
                <option value="">Choose a role...</option>
                <option value="citizen">Citizen</option>
                <option value="politician">Politician</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
              {touched.role && errors.role && (
                <p id="role-error" className="error-text" aria-live="polite">
                  <AlertCircle className="w-4 h-4" />
                  {errors.role}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="form-field mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  onBlur={() => handleBlur('agreeTerms')}
                  className="mt-1 w-4 h-4 rounded border-input text-primary focus:ring-ring"
                  aria-describedby={errors.agreeTerms ? 'terms-error' : undefined}
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  <span className="text-destructive"> *</span>
                </span>
              </label>
              {touched.agreeTerms && errors.agreeTerms && (
                <p id="terms-error" className="error-text mt-1" aria-live="polite">
                  <AlertCircle className="w-4 h-4" />
                  {errors.agreeTerms}
                </p>
              )}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
