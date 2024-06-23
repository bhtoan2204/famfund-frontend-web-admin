import { getCookieCustom } from "@/utils/cookies";

export interface MainPackage {
  id_main_package: number;
  name: string;
  description?: string;
  is_active: boolean;
  price: string;
  duration_months: number;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ExtraPackage {
  id_extra_package: number;
  name: string;
  price: string;
  description?: string;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ComboPackage {
  id_combo_package: number;
  name: string;
  price: string;
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

export interface CreatePackage {
  name: string;
  description: string;
  price: string;
  duration_months: number;
}

export interface UpdatePackage {
  id_main_package: number;
  name: string;
  description: string;
  price: string;
  duration_months: number;
  is_active: boolean;
}

export interface UpdateExtraPackage {
  id_extra_package: number;
  price: number;
  description?: string;
  is_active: boolean;
}

export interface CreateComboPackage {
  name: string;
  description: string;
  id_package_extra: number[];
  price: number;
}

export interface EditComboPackage {
  id_combo_package: number;
  name: string;
  description: string;
  id_package_extra: number[];
  price: number;
  is_active: boolean;
}

export class PackageRepository {
  protected readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async getPackages(data: GetPackages): Promise<any> {}

  async createPackage(values?: any): Promise<any> {}

  async updatePackage(values?: any): Promise<any> {}

  async deletePackage(id: number): Promise<void> {}
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

  override async createPackage(values: CreateComboPackage): Promise<any> {
    try {
      const response = await fetch(`${this.backendUrl}/packageCombo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("accessToken")}`,
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          id_package_extra: values.id_package_extra,
          price: values.price,
        }),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  override async updatePackage(values: EditComboPackage): Promise<any> {
    console.log(values);
    try {
      const response = await fetch(
        `${this.backendUrl}/packageCombo/${values.id_combo_package}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getCookieCustom("accessToken")}`,
          },
          body: JSON.stringify({
            name: values.name,
            description: values.description,
            id_package_extra: values.id_package_extra,
            price: values.price,
            is_active: values.is_active,
          }),
        },
      );
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  override async deletePackage(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.backendUrl}/packageCombo/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("accessToken")}`,
        },
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete package");
      }
    } catch (error) {
      console.log(error);
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

  override async createPackage(values: CreatePackage): Promise<any> {
    try {
      const response = await fetch(`${this.backendUrl}/packageMain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("accessToken")}`,
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          price: parseInt(values.price),
          duration_months: values.duration_months,
        }),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  override async updatePackage(values: UpdatePackage): Promise<any> {
    try {
      const response = await fetch(`${this.backendUrl}/packageMain`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("accessToken")}`,
        },
        body: JSON.stringify({
          id_main_package: values.id_main_package,
          name: values.name,
          description: values.description,
          price: parseInt(values.price),
          duration_months: values.duration_months,
          is_active: values.is_active,
        }),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  override async deletePackage(id: number): Promise<void> {
    try {
      const response = await fetch(
        `${this.backendUrl}/packageMain/${id}?id_main_package=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getCookieCustom("accessToken")}`,
          },
        },
      );
      if (response.status !== 204) {
        throw new Error("Failed to delete package");
      }
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

  override async updatePackage(values: UpdateExtraPackage): Promise<any> {
    try {
      const response = await fetch(`${this.backendUrl}/packageExtra`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieCustom("accessToken")}`,
        },
        body: JSON.stringify({
          id_extra_package: values.id_extra_package,
          price: values.price,
          description: values.description,
          is_active: values.is_active,
        }),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }
}
