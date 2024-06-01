import { getCookieCustom } from "@/utils/cookies";

export class RabbitmqRepository {
  private readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async getQueues() {
    try {
      const response = await fetch(`${this.backendUrl}/rabbitmq/queues`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getCookieCustom('accessToken')}`
        }
      });
      const data = await response.json();
      return { data, status: response.status };
    }
    catch (error) {
      throw error;
    }
  }

  async getNodeStatistics () {
    try {
      const nodeResponse = await fetch(`${this.backendUrl}/rabbitmq/nodes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getCookieCustom('accessToken')}`
        }
      });
      if (nodeResponse.status !== 200) {
        throw new Error('Error fetching node statistics');
      }
      const nodeData = await nodeResponse.json();
      const nodeName = nodeData[0].name;
      const response = await fetch(`${this.backendUrl}/rabbitmq/nodes/${nodeName}/statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getCookieCustom('accessToken')}`
        }
      });
      const data = await response.json();
      return { data, status: response.status };
    }
    catch (error) {
      throw error;
    }
  }
}