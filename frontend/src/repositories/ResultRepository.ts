import api from '../api/Api';
import { ResultDTO } from '../models/dto/ResultDTO';
import axios, { AxiosResponse } from 'axios';

interface MessageResponse {
  message: string;
}

class ResultRepository {
  private retries = 3;

  async addResult(resultDto: ResultDTO): Promise<string> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<MessageResponse> = await api.post('/results', {
          result: resultDto,
        });
        return response.data.message;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }

  async getWinner(id: number): Promise<any> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<any> = await api.get(`/results/winner/${id}`);
        return response.data;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }

  async getAverageResult(season: string): Promise<any> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<any> = await api.get('/results/average-results', { params: { season } });
        return response.data;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }

  async getBestResult(id: number): Promise<any> {
    for (let i = 0; i < this.retries; i++) {
      try {
        const response: AxiosResponse<any> = await api.get(`/results/best-result/${id}`);
        return response.data;
      } catch (error) {
        if (i === this.retries - 1) throw error;
      }
    }
    throw new Error('Unexpected error occurred');
  }
}

export const resultRepository = new ResultRepository();
