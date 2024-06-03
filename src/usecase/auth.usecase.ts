import { AuthRepository } from "@/repository/user.repository";

export class AuthUseCase {
  private authRepository: AuthRepository;

  constructor(AuthRepository: AuthRepository) {
    this.authRepository = AuthRepository;
  }

  async login(email: string, password: string) {
    try {
      const response = await this.authRepository.login(email, password);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.authRepository.logout();
      return response;
    } catch (error) {
      throw error;
    }
  }
}