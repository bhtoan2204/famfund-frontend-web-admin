import { getCookieCustom } from "@/utils/cookies";

export interface GetFeedbacks {
  page?: number;
  itemsPerPage?: number;
  search: string;
  sortBy: string;
  sortDesc: boolean;
}

export interface FeedBack {
  id_feedback: number;
  comment: string;
  rating: number;
  id_user: string;
  created_at: string;
  updated_at: string;
  user: {
    firstname: string;
    lastname: string;
    avatar: string;
  };
}

export interface FeedbackStats {
  metadata_key: string;
  totalFeedbacks: number;
  averageRating: number;
}

export class FeedbackRepository {
  protected readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async getFeedbacks(values: GetFeedbacks): Promise<any> {
    try {
      const response = await fetch(
        `${this.backendUrl}/feedback?sortDesc=${values.sortDesc}&sortBy=${values.sortBy}&search=${values.search}&itemsPerPage=${values.itemsPerPage}&page=${values.page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getCookieCustom("accessToken")}`,
          },
        },
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getFeedbackStats(): Promise<any> {
    try {
      const response = await fetch(
        `${this.backendUrl}/feedback/getStatistics`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getCookieCustom("accessToken")}`,
          },
        },
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
}
