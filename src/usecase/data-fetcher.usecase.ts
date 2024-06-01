import { DataFetcherRepository } from "@/repository/data-fetcher.repository";

export class DatafetcherUsecase {
  private datafetcherRepository: DataFetcherRepository;

  constructor(datafetcherRepository: DataFetcherRepository) {
    this.datafetcherRepository = datafetcherRepository;
  }

  async getIpData(ip: string) {
    try {
      const response = await this.datafetcherRepository.getIpData(ip);
      return response;
    }
    catch (error) {
      throw error;
    }
  }
}