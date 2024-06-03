import { ProfileRepository } from "@/repository/profile.repository";

export class ProfileUseCase {
  private profileRepository: ProfileRepository;

  constructor(profileRepository: ProfileRepository) {
    this.profileRepository = profileRepository;
  }

  async getProfile() {
    try {
      const response = await this.profileRepository.getProfile();
      return response;
    } catch (error) {
      throw error;
    }
  }
}