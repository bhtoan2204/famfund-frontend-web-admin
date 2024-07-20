import { getCookieCustom } from "@/utils/cookies";

interface Discount {
  code: string;
  percenrage?: number;
  expired_at?: string;
}

export class DiscountRepository {
  private readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async getDiscounts() {
    try {
      const response = await fetch(`${this.backendUrl}/admin/discount`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("accessToken")}`,
        },
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  async createDiscount(discount: Discount) {
    try {
      const response = await fetch(`${this.backendUrl}/admin/discount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("accessToken")}`,
        },
        body: JSON.stringify(discount),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  async updateDiscount(discount: Discount) {
    try {
      const response = await fetch(`${this.backendUrl}/admin/discount`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("accessToken")}`,
        },
        body: JSON.stringify(discount),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  async deleteDiscount(code: string) {
    try {
      const response = await fetch(
        `${this.backendUrl}/admin/discount/${code}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getCookieCustom("accessToken")}`,
          },
        },
      );
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }
}
