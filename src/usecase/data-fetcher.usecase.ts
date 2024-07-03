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
    } catch (error) {
      throw error;
    }
  }

  async getSummary() {
    try {
      const response = await this.datafetcherRepository.getSummary();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getRevenueLast6Months() {
    try {
      const response = await this.datafetcherRepository.getRevenueLast6Months();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getUserOrders(dto: {
    page: number;
    itemsPerPage: number;
    search: string | null;
    sortBy: string | null;
    sortDirection: "ASC" | "DESC" | null;
  }) {
    try {
      const response = await this.datafetcherRepository.getUserOrders(dto);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
