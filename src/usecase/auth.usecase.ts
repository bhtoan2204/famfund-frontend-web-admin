import { AuthRepository } from "@/repository/user.repository";

interface UsersParams {
  page: number;
  itemsPerPage: number;
  search?: string;
  sortBy?: string;
  sortDesc?: boolean;
}

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

  async getUserList(params: UsersParams) {
    try {
      const response = await this.authRepository.getUserList(params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async banUser(id: string) {
    try {
      const response = await this.authRepository.banUser(id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async unbanUser(id: string) {
    try {
      const response = await this.authRepository.unbanUser(id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getTopUsersLogin(limit: number) {
    try {
      const response = await this.authRepository.getTopUsersLogin(limit);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
