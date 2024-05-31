import { setCookieCustom } from "@/utils/cookies";

export class UserRepository {
  private readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.backendUrl}/auth/local/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body : JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setCookieCustom('accessToken', data.accessToken, 1);
        setCookieCustom('refreshToken', data.refreshToken, 3);
      }
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }
}