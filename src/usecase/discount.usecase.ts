import { DiscountRepository } from "@/repository/discount.repository";

interface Discount {
  code: string;
  percenrage?: number;
  expired_at?: string;
}

export class DiscountUseCase {
  private discountRepository: DiscountRepository;

  constructor(discountRepository: DiscountRepository) {
    this.discountRepository = discountRepository;
  }

  async getDiscounts() {
    try {
      const response = await this.discountRepository.getDiscounts();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createDiscount(discount: Discount) {
    try {
      const response = await this.discountRepository.createDiscount(discount);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateDiscount(discount: Discount) {
    try {
      const response = await this.discountRepository.updateDiscount(discount);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteDiscount(code: string) {
    try {
      const response = await this.discountRepository.deleteDiscount(code);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
