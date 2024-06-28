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

  async updateProfile(data: any) {
    try {
      const response = await this.profileRepository.updateProfile(data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateAvatar(data: string) {
    try {
      const response = await this.profileRepository.updateAvatar(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
}