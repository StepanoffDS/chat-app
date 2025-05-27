import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import type { LoginData, SignUpData, User } from '@/types';
import toast from 'react-hot-toast';

interface State {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;

  checkAuth: () => void;
  signup: (data: SignUpData) => void;
  login: (data: LoginData) => void;
  logout: () => void;
}

export const useAuthStore = create<State>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      set({ authUser: response.data });
    } catch (error) {
      console.log('Error on checkAuth', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data: SignUpData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post('/auth/signup', data);
      toast.success('Account created successfully');
      set({ authUser: response.data });
    } catch (error) {
      console.log('Error on signup', error);
      toast.error('Something went wrong');
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/auth/login', data);
      set({ authUser: response.data });
      toast.success('Logged in successfully');
    } catch (error) {
      console.log('Error on login', error);
      toast.error('Something went wrong');
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logout successful');
    } catch (error) {
      console.log('Error on logout', error);
      toast.error('Something went wrong');
    }
  },
}));
