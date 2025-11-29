// Validation utilities for form fields

export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return "Full name is required";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }
  if (name.trim().length > 50) {
    return "Name must be less than 50 characters";
  }
  if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) {
    return null; // Phone is optional
  }
  // Accepts formats like: +1234567890, (123) 456-7890, 123-456-7890, 1234567890
  const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return "Please enter a valid phone number";
  }
  return null;
};

export const validateAdminKey = (adminKey: string): string | null => {
  if (!adminKey) {
    return "Admin key is required";
  }
  if (!/^\d{6}$/.test(adminKey)) {
    return "Admin key must be exactly 6 digits";
  }
  return null;
};

export const passwordRequirementsMsg = `Password must contain:
• At least 8 characters
• One uppercase letter
• One lowercase letter
• One number
• One special character (!@#$%^&*(),.?":{}|<>)`;

export type Role = 'admin' | 'citizen' | 'politician' | 'moderator';

export const validateRole = (role: string): role is Role => {
  return ['admin', 'citizen', 'politician', 'moderator'].includes(role.toLowerCase());
};
