import { mockRequest, ApiError } from "@/services/client";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  displayName: string;
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login(input: LoginInput): Promise<{ user: { email: string } }> {
    await mockRequest({ user: { email: input.email } }, 800);
    return { user: { email: input.email } };
  },

  async register(input: RegisterInput): Promise<{ user: { email: string } }> {
    if (input.username.length < 3) {
      throw new ApiError("Username must be at least 3 characters", 422);
    }
    await mockRequest({ user: { email: input.email } }, 900);
    return { user: { email: input.email } };
  },

  async forgotPassword(_email: string): Promise<{ sent: boolean }> {
    await mockRequest({ sent: true }, 750);
    return { sent: true };
  },

  async resetPassword(
    _token: string,
    _password: string
  ): Promise<{ success: boolean }> {
    await mockRequest({ success: true }, 750);
    return { success: true };
  },
};