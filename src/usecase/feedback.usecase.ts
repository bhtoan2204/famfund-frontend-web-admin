import {
  FeedbackRepository,
  GetFeedbacks,
} from "@/repository/feedback.repository";

export class FeedbackUseCase {
  private feedbackRepository: FeedbackRepository;

  constructor(feedbackRepository: FeedbackRepository) {
    this.feedbackRepository = feedbackRepository;
  }

  async getFeedbacks(
    data: GetFeedbacks,
  ): Promise<{ data: any; total: number; message: string }> {
    try {
      const response = await this.feedbackRepository.getFeedbacks(data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getFeedbackStats(): Promise<{
    data: any;
    message: string;
  }> {
    try {
      const response = await this.feedbackRepository.getFeedbackStats();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
