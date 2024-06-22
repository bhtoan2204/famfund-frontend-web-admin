import {
  GetPackages,
  PackageRepository,
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

  async updatePackage() {
    try {
      const response = await this.packageRepository.updatePackage();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
