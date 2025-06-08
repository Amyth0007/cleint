export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
    token: string;
  };
}
