import { ProxyRepository } from "@/repository/proxy.repository";

export class ProxyUsecase {
  private proxyRepository: ProxyRepository;

  constructor(proxyRepository: ProxyRepository) {
    this.proxyRepository = proxyRepository;
  }

  async getAnalytics(date_geq: string, date_leq: string, limit: number) {
    try {
      const response = await this.proxyRepository.getAnalytics(date_geq, date_leq, limit);
      return response;
    }
    catch (error) {
      throw error;
    }
  }
}