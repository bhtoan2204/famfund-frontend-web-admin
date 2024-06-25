import { getCookieCustom } from "@/utils/cookies";

export class ProfileRepository {
  private readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async getProfile() {
    try {
      const response = await fetch(`${this.backendUrl}/user/profile`, {
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

  async updateProfile(data: any) {
    try {
      const response = await fetch(`${this.backendUrl}/user/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("accessToken")}`,
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return { data: responseData, status: response.status };
    }
    catch (error) {
      throw error;
    }
  }
}