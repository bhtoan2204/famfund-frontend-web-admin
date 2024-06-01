import { DatabaseStatRepository } from "@/repository/database-stat.repository";

export class DatabaseStatUsecase {
  private databaseStatRepository: DatabaseStatRepository;

  constructor(databaseStatRepository: DatabaseStatRepository) {
    this.databaseStatRepository = databaseStatRepository;
  }

  async getPostgresql() {
    try {
      const response = await this.databaseStatRepository.getPostgresql();
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getMongoDB() {
    try {
      const response = await this.databaseStatRepository.getMongoDB();
      return response;
    }
    catch (error) {
      throw error;
    }
  }
}