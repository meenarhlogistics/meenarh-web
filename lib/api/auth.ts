import apiClient from "./client";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ProfileResponse,
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
};
