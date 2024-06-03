import { getCookieCustom } from "@/utils/cookies";

export class DataFetcherRepository {
  private readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async getIpData(ip: string) {
    try {
      const response = await fetch(`${this.backendUrl}/ipData/${ip}`, {
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

  async getSummary() {
    try {
      const response = await fetch(`${this.backendUrl}/summary`, {
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

  async getRevenueLast6Months () {
    try {
      const response = await fetch(`${this.backendUrl}/revenueLast6Months`, {
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