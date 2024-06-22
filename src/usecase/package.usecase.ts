import {
  CreatePackage,
  GetPackages,
  PackageRepository,
  UpdateExtraPackage,
  UpdatePackage,
} from "@/repository/package.repository";

export class PackageUseCase {
  private packageRepository: PackageRepository;

  constructor(packageRepository: PackageRepository) {
    this.packageRepository = packageRepository;
  }

  async getPackages(
    data: GetPackages,
  ): Promise<{ data: any; message: string }> {
    try {
      const response = await this.packageRepository.getPackages(data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createPackage(
    values: CreatePackage,
  ): Promise<{ data: any; message: string }> {
    try {
      const response = await this.packageRepository.createPackage(values);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updatePackage(
    values?: UpdatePackage,
  ): Promise<{ data: any; message: string }> {
    try {
      const response = await this.packageRepository.updatePackage(values);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deletePackage(id: number): Promise<void> {
    try {
      await this.packageRepository.deletePackage(id);
    } catch (error) {
      throw error;
    }
  }

  async updateExtraPackage(
    values?: UpdateExtraPackage,
  ): Promise<{ data: any; message: string }> {
    try {
      const response = await this.packageRepository.updatePackage(values);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
