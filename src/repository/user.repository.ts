import {
  getCookieCustom,
  removeCookieCustom,
  setCookieCustom,
} from "@/utils/cookies";

interface UsersParams {
  page: number;
  itemsPerPage: number;
  search?: string;
  sortBy?: string;
  sortDesc?: boolean;
}

export class AuthRepository {
  private readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.backendUrl}/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setCookieCustom("accessToken", data.accessToken, 1);
        setCookieCustom("refreshToken", data.refreshToken, 3);
      }
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const response = await fetch(`${this.backendUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("refreshToken")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        removeCookieCustom("accessToken");
        removeCookieCustom("refreshToken");
      }
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  async getUserList(params: UsersParams) {
    try {
      let url = `${this.backendUrl}/users/getUsers?page=${params.page}&itemsPerPage=${params.itemsPerPage}`;
      if (params.search) {
        url += `&search=${params.search}`;
      }
      url += `&sortBy=${params.sortBy}&sortDesc=${params.sortDesc}`;
      const response = await fetch(url, {
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

  async banUser(userId: string) {
    try {
      const response = await fetch(`${this.backendUrl}/users/banUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("accessToken")}`,
        },
        body: JSON.stringify({ id_user: userId }),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  async unbanUser(userId: string) {
    try {
      const response = await fetch(`${this.backendUrl}/users/unbanUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("accessToken")}`,
        },
        body: JSON.stringify({ id_user: userId }),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  async getTopUsersLogin(limit: number) {
    try {
      const response = await fetch(
        `${this.backendUrl}/users/getTopUsersLogin?limit=${limit}`,
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
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }
}
