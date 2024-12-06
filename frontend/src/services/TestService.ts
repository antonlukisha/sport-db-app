import { testRepository } from '../repositories/TestRepository';

class TestService {
  /**
   * Upload a test data.
   */
  async uploadTestData(): Promise<string> {
    return await testRepository.postTestData();
  }
}

export const testService = new TestService();
