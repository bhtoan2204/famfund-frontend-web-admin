import { LogsRepository } from "@/repository/logs.repository";

interface Filter {
  logLevel: string | null;
  ip: string | null;
  url: string | null;
  method: string | null;
  statusCode: number | null;
  message: string | null;
  page: number;
  itemsPerPage: number;
  sortDirection: string | null;
}

export class LogsUseCase {
  private logsRepository: LogsRepository;

  constructor(logsRepository: LogsRepository) {
    this.logsRepository = logsRepository;
  }

  async getLogsCount() {
    try {
      const response = await this.logsRepository.getLogsCount();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getChartData(timeStart: string, timeEnd: string) {
    try {
      const response = await this.logsRepository.getChartData(timeStart, timeEnd);
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getLogs(filter: Filter) {
    try {
      const response = await this.logsRepository.getLogs(filter);
      return response;
    }
    catch (error) {
      throw error;
    }
  }
}