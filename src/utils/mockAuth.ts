// Mock authentication utilities - simulates backend auth

import { Role } from './validation';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

// In-memory user database
const STORAGE_KEY = 'mock_users_db';
const SESSION_KEY = 'auth_session';

// Hard-coded admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@fedf.gov',
  password: 'Admin@123',
  adminKey: '123456',
};

// Initialize with default admin user
const initializeDB = (): User[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const defaultUsers: User[] = [
    {
      id: 'admin-001',
      email: ADMIN_CREDENTIALS.email,
      fullName: 'System Administrator',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'citizen-001',
      email: 'john.citizen@email.com',
      fullName: 'John Citizen',
      role: 'citizen',
      phone: '+1234567890',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'politician-001',
      email: 'sarah.rep@gov.com',
      fullName: 'Sarah Representative',
      role: 'politician',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'moderator-001',
      email: 'mod@fedf.gov',
      fullName: 'Mark Moderator',
      role: 'moderator',
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

const getUsers = (): User[] => {
  return initializeDB();
};

const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Simulate network latency
const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 900));

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
  role: Role;
  adminKey?: string;
  rememberMe?: boolean;
}

export const mockAuth = {
  signUp: async (data: SignUpData): Promise<{ success: true; message: string }> => {
    await simulateLatency();
    
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email.toLowerCase(),
      fullName: data.fullName,
      role: data.role,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Store password separately (in real app, this would be hashed)
    const passwords = JSON.parse(localStorage.getItem('mock_passwords') || '{}');
    passwords[data.email.toLowerCase()] = data.password;
    localStorage.setItem('mock_passwords', JSON.stringify(passwords));

    return { success: true, message: 'Account created successfully! Please sign in.' };
  },

  signIn: async (data: SignInData): Promise<AuthSession> => {
    await simulateLatency();

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());

    // Admin sign-in validation
    if (data.role === 'admin') {
      if (
        data.email.toLowerCase() !== ADMIN_CREDENTIALS.email.toLowerCase() ||
        data.password !== ADMIN_CREDENTIALS.password ||
        data.adminKey !== ADMIN_CREDENTIALS.adminKey
      ) {
        throw new Error('Invalid admin credentials. Please check your email, password, and admin key.');
      }
      
      const adminUser = users.find(u => u.role === 'admin') || {
        id: 'admin-001',
        email: ADMIN_CREDENTIALS.email,
        fullName: 'System Administrator',
        role: 'admin' as Role,
        createdAt: new Date().toISOString(),
      };

      const session: AuthSession = {
        user: adminUser,
        token: `admin-token-${Date.now()}`,
      };

      const storage = data.rememberMe ? localStorage : sessionStorage;
      storage.setItem(SESSION_KEY, JSON.stringify(session));
      
      return session;
    }

    // Non-admin sign-in
    if (!user) {
      throw new Error('No account found with this email address');
    }

    // Check password
    const passwords = JSON.parse(localStorage.getItem('mock_passwords') || '{}');
    if (passwords[data.email.toLowerCase()] !== data.password) {
      // For demo purposes, accept any password for pre-seeded users
      const isPreseededUser = ['john.citizen@email.com', 'sarah.rep@gov.com', 'mod@fedf.gov'].includes(data.email.toLowerCase());
      if (!isPreseededUser) {
        throw new Error('Invalid password. Please try again.');
      }
    }

    // Verify role matches
    if (user.role !== data.role) {
      throw new Error(`This account is registered as a ${user.role}. Please select the correct role.`);
    }

    const session: AuthSession = {
      user,
      token: `token-${Date.now()}`,
    };

    const storage = data.rememberMe ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));

    return session;
  },

  signOut: async (): Promise<void> => {
    await simulateLatency();
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): AuthSession | null => {
    const localSession = localStorage.getItem(SESSION_KEY);
    const sessionSession = sessionStorage.getItem(SESSION_KEY);
    
    const sessionData = localSession || sessionSession;
    if (!sessionData) return null;
    
    try {
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  },

  getAllUsers: (): User[] => {
    return getUsers();
  },

  updateUserRole: async (userId: string, newRole: Role): Promise<void> => {
    await simulateLatency();
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    users[userIndex].role = newRole;
    saveUsers(users);
  },
};
