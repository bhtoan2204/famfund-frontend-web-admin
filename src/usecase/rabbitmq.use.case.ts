import { RabbitmqRepository } from "@/repository/rabbitmq.repository";

export class RabbitmqUsecase {
  private rabbitmqRepository: RabbitmqRepository;

  constructor(rabbitmqRepository: RabbitmqRepository) {
    this.rabbitmqRepository = rabbitmqRepository;
  }

  async getQueues() {
    try {
      const response = await this.rabbitmqRepository.getQueues();
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getNodeStatistics() {
    try {
      const response = await this.rabbitmqRepository.getNodeStatistics();
      return response;
    }
    catch (error) {
      throw error;
    }
  }
}