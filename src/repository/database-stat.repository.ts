import { getCookieCustom } from "@/utils/cookies";

export class DatabaseStatRepository {
  private readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async getPostgresql() {
    try {
      const response = await fetch(`${this.backendUrl}/database-stat/posgresql`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getCookieCustom('accessToken')}`
        },
      });
      const data = await response.json();
      return { data, status: response.status };
    }
    catch (error) {
      throw error;
    }
  }

  async getMongoDB() {
    try {
      const response = await fetch(`${this.backendUrl}/database-stat/mongoose`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getCookieCustom('accessToken')}`
        },
      });
      const data = await response.json();
      return { data, status: response.status };
    }
    catch (error) {
      throw error;
    }
  }
}