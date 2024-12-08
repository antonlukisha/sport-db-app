import { testRepository } from '../repositories/TestRepository';

class TestService {
  /**
   * Upload a test data.
   */
  async uploadTestData(): Promise<string> {
    return await testRepository.postTestData();
  }
  /**
   * Delete a data.
   */
  async deleteData(): Promise<string> {
    return await testRepository.deleteData();
  }
}

export const testService = new TestService();
