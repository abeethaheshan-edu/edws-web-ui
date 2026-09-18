export interface LoginPayload {
  email: string;
  password: string;
  rememberDevice: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {

  token: string;
  password: string;
  confirmPassword: string;
}

export type PasswordResetMode = 'reset-link' | 'first-login';

export interface PasswordRule {
  key: string;
  label: string;
  met: boolean;
}
