import { getCookieCustom } from "@/utils/cookies";

export class ProxyRepository {
  private readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async getAnalytics(date_geq: string, date_leq: string, limit: number) {
    try {
      const response = await fetch(`${this.backendUrl}/proxy/getAnalytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getCookieCustom('accessToken')}`
        },
        body: JSON.stringify({ date_geq, date_leq, limit })
      });
      const data = await response.json();
      return { data, status: response.status };
    }
    catch (error) {
      throw error;
    }
  }
}