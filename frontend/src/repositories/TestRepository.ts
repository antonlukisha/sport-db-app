import api from '../api/Api';
import axios, { AxiosResponse } from 'axios';

interface MessageResponse {
  message: string;
}

class TestRepository {
  private retries = 3;
  /**
   * Upload test data.
   * @returns Promise<string>.
   */
  async postTestData(): Promise<string> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<MessageResponse> = await api.post('/test');
        return response.data.message;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }
}

export const testRepository = new TestRepository();
