import { getCookieCustom } from "@/utils/cookies";

export interface MainPackage {
  id_main_package: number;
  name: string;
  description?: string;
  is_active: boolean;
  price: number;
  duration_months: number;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ExtraPackage {
  id_extra_package: number;
  name: string;
  price: number;
  description?: string;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ComboPackage {
  id_combo_package: number;
  name: string;
  price: number;
  description?: string;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  id_package_extra: ExtraPackage[];
}

export interface GetPackages {
  page?: number;
  itemsPerPage?: number;
  search: string;
  sortBy: string;
  sortDesc: boolean;
}

export class PackageRepository {
  protected readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async getPackages(data: GetPackages): Promise<any> {}

  async updatePackage(): Promise<any> {}
}

export class PackageComboRepository extends PackageRepository {
  override async getPackages(data: GetPackages): Promise<any> {
    try {
      const response = await fetch(
        `${this.backendUrl}/packageCombo?page=${data.page}&itemsPerPage=${data.itemsPerPage}&search=${data.search}&sortBy=${data.sortBy}&sortDesc=${data.sortDesc}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getCookieCustom("accessToken")}`,
          },
        },
      );
      const result = await response.json();
      return { data: result, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  override async updatePackage(): Promise<any> {
    try {
      const response = await fetch(`${this.backendUrl}/packages/combo`, {
        method: "PUT",
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
}

export class PackageMainRepository extends PackageRepository {
  override async getPackages(data: GetPackages): Promise<any> {
    try {
      const response = await fetch(
        `${this.backendUrl}/packageMain/getAllPackage?page=${data.page}&itemsPerPage=${data.itemsPerPage}&search=${data.search}&sortBy=${data.sortBy}&sortDesc=${data.sortDesc}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getCookieCustom("accessToken")}`,
          },
        },
      );
      const result = await response.json();
      return { data: result, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  override async updatePackage(): Promise<any> {
    try {
      const response = await fetch(`${this.backendUrl}/packages/main`, {
        method: "PUT",
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
}

export class PackageExtraRepository extends PackageRepository {
  override async getPackages(data: GetPackages): Promise<any> {
    try {
      const response = await fetch(
        `${this.backendUrl}/packageExtra?search=${data.search}&sortBy=${data.sortBy}&sortDesc=${data.sortDesc}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getCookieCustom("accessToken")}`,
          },
        },
      );
      const result = await response.json();
      return { data: result, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  override async updatePackage(): Promise<any> {
    try {
      const response = await fetch(`${this.backendUrl}/packages/extra`, {
        method: "PUT",
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
}
