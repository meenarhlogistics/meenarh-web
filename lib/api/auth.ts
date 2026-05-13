import apiClient from "./client";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ProfileResponse,
  User,
} from "@/types";

export const authApi = {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/user/login",
      credentials
    );
    return response.data;
  },

  // Signup
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/user/signup",
      userData
    );
    return response.data;
  },

  // Logout — clears the server session cookie and CSRF token.
  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      "/user/logout",
      {}
    );
    return response.data;
  },

  // Get user profile
  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<ProfileResponse>("/user/profile");
    return response.data;
  },

  // Update user profile
  async updateProfile(
    userData: Partial<SignupRequest>
  ): Promise<ProfileResponse> {
    const response = await apiClient.patch<ProfileResponse>(
      "/user/profile",
      userData
    );
    return response.data;
  },

  async requestPhoneVerificationCode(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      "/user/phone-verification/request",
      {}
    );
    return response.data;
  },

  async verifyPhoneCode(code: string): Promise<{ success: boolean; message: string; data?: User; reason?: string }> {
    const response = await apiClient.post<{ success: boolean; message: string; data?: User; reason?: string }>(
      "/user/phone-verification/verify",
      { code }
    );
    return response.data;
  },

  async requestEmailVerification(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      "/user/email-verification/request",
      {}
    );
    return response.data;
  },
};
