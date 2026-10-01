import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import * as authServices from '../../services/authServices.js';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const clearAllAuthStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_role');
  localStorage.removeItem('auth_user');
};

const persistAuthData = (user, accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('auth_token', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  if (user) {
    localStorage.setItem('auth_role', user.role);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }
};

const initialState = {
  user: getStoredUser(),
  accessToken: localStorage.getItem('accessToken') || localStorage.getItem('auth_token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: Boolean(
    localStorage.getItem('accessToken') || localStorage.getItem('auth_token')
  ),
  isLoading: false,
  isEmailVerified: getStoredUser()?.isEmailVerified || false,
  error: null,
  otpSent: false,
  pendingEmail: getStoredUser()?.email || null,
  success: false,
  debugOtp: null,
  emailSendFailed: false,
  resendingVerification: false,
};

const extractFieldErrors = (error) => {
  const issues = error?.response?.data?.errors;
  if (Array.isArray(issues) && issues.length) {
    const first = issues[0];
    if (first?.path && first?.message) {
      const labelMap = {
        fullName: 'Full name', email: 'Email', phone: 'Phone', password: 'Password',
        confirmPassword: 'Confirm password', role: 'Role', otp: 'Code',
        newPassword: 'New password', currentPassword: 'Current password',
      };
      const path = String(first.path).split('.').pop();
      const label = labelMap[path] || path;
      return {
        summary: `${label}: ${first.message}`,
        fields: issues.reduce((acc, cur) => {
          const p = String(cur.path || '').split('.').pop();
          if (p) acc[p] = (acc[p] || []).concat(cur.message);
          return acc;
        }, {}),
      };
    }
  }
  return null;
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authServices.register(userData);
      return response;
    } catch (error) {
      const details = extractFieldErrors(error);
      const message = details?.summary || error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authServices.login(credentials);
      return response;
    } catch (error) {
      const details = extractFieldErrors(error);
      const message = details?.summary || error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const adminLoginUser = createAsyncThunk(
  'auth/adminLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authServices.adminLogin(credentials);
      return { ...response, email: credentials.email };
    } catch (error) {
      const details = extractFieldErrors(error);
      const message = details?.summary || error.response?.data?.message || error.message || 'Admin login failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authServices.logout();
      return null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await authServices.refreshToken(auth.refreshToken);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Token refresh failed';
      return rejectWithValue(message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authServices.verifyEmail(email, otp);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Email verification failed';
      return rejectWithValue(message);
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerification',
  async (email, { rejectWithValue }) => {
    try {
      await authServices.resendVerification(email);
      return email;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to resend verification';
      return rejectWithValue(message);
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      await authServices.forgotPassword(email);
      return email;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send reset email';
      return rejectWithValue(message);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, otp, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      await authServices.resetPassword(email, otp, newPassword, confirmPassword);
      return null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Password reset failed';
      return rejectWithValue(message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authServices.getProfile();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch profile';
      return rejectWithValue(message);
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authServices.updateProfile(profileData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Profile update failed';
      return rejectWithValue(message);
    }
  }
);

export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      await authServices.changePassword(currentPassword, newPassword, confirmPassword);
      return null;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Password change failed';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    setPendingEmail: (state, action) => {
      state.pendingEmail = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isEmailVerified = false;
      state.error = null;
      state.success = false;
      state.otpSent = false;
      state.pendingEmail = null;
      clearAllAuthStorage();
    },
    setDemoAuth: (state, action) => {
      const { role } = action.payload;
      const demoToken = 'demo_token_' + Date.now();
      const demoUser = {
        id: 'demo_user',
        fullName: role.charAt(0) + role.slice(1).toLowerCase() + ' Demo',
        email: `demo+${role.toLowerCase()}@example.com`,
        role,
        isEmailVerified: true,
        isActive: true,
      };
      state.user = demoUser;
      state.accessToken = demoToken;
      state.refreshToken = 'demo_refresh';
      state.isAuthenticated = true;
      state.isEmailVerified = true;
      persistAuthData(demoUser, demoToken, 'demo_refresh');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload || {};
        const { user, accessToken, refreshToken, resendingVerification, emailSendFailed, debugOtp, message } = payload;
        if (accessToken && refreshToken) {
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
        }
        if (user) {
          state.user = user;
          state.isEmailVerified = user.isEmailVerified || false;
          state.pendingEmail = user.email || null;
          localStorage.setItem('pending_verification_email', user.email || '');
          if (accessToken && refreshToken) {
            state.isAuthenticated = true;
            persistAuthData(user, accessToken, refreshToken);
          } else {
            state.isAuthenticated = false;
            clearAllAuthStorage();
          }
        }
        state.debugOtp = debugOtp || state.debugOtp || undefined;
        state.emailSendFailed = !!emailSendFailed;
        state.resendingVerification = !!resendingVerification;
        state.success = true;
        if (emailSendFailed && debugOtp) {
          toast.success(`Account created! Email couldn't be sent — use code ${debugOtp} to verify.`);
        } else if (resendingVerification) {
          toast.success(message || 'Verification code resent. Please check your inbox.');
        } else {
          toast.success(message || 'Account created. Verify your email to continue.');
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Registration failed');
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { user, accessToken, refreshToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.isEmailVerified = user?.isEmailVerified || false;
        state.success = true;
        persistAuthData(user, accessToken, refreshToken);
        state.pendingEmail = user?.email || null;
        toast.success(user?.isEmailVerified ? 'Login successful' : 'Please verify your email to continue');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Login failed');
      })

      .addCase(adminLoginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { user, accessToken, refreshToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.isEmailVerified = user?.isEmailVerified || false;
        state.success = true;
        persistAuthData(user, accessToken, refreshToken);
        state.pendingEmail = user?.email || null;
        toast.success('Admin login successful');
      })
      .addCase(adminLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Admin login failed');
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isEmailVerified = false;
        state.success = true;
        clearAllAuthStorage();
        toast.success('Logged out successfully');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isEmailVerified = false;
        clearAllAuthStorage();
        state.error = action.payload;
        toast.error(action.payload || 'Logout failed');
      })

      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        if (user) state.user = user;
        persistAuthData(user || state.user, accessToken, refreshToken);
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        clearAllAuthStorage();
      })

      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.isEmailVerified = true;
        if (state.user) state.user.isEmailVerified = true;
        state.success = true;
        if (state.user) {
          localStorage.setItem('auth_user', JSON.stringify(state.user));
        }
        toast.success('Email verified successfully');
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Email verification failed');
      })

      .addCase(resendVerificationEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true;
        state.success = true;
        toast.success('Verification email sent');
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to resend verification');
      })

      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true;
        state.success = true;
        toast.success('Password reset email sent');
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to send reset email');
      })

      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        toast.success('Password reset successfully');
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Password reset failed');
      })

      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isEmailVerified = action.payload?.isEmailVerified || state.isEmailVerified;
        if (action.payload?.role) {
          localStorage.setItem('auth_role', action.payload.role);
        }
        localStorage.setItem('auth_user', JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.success = true;
        if (action.payload?.role) {
          localStorage.setItem('auth_role', action.payload.role);
        }
        localStorage.setItem('auth_user', JSON.stringify(action.payload));
        toast.success('Profile updated successfully');
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Profile update failed');
      })

      .addCase(changePasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        toast.success('Password changed successfully');
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Password change failed');
      });
  },
});

export const { clearError, resetSuccess, setPendingEmail, clearAuth, setDemoAuth } = authSlice.actions;
export default authSlice.reducer;
