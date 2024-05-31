import { UserRepository } from "@/repository/user.repository";

export class LoginUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(email: string, password: string) {
    try {
      const response = await this.userRepository.login(email, password);
      return response;
    } catch (error) {
      throw error;
    }
  }
}