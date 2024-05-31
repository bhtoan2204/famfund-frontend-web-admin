import { getCookieCustom } from "@/utils/cookies";

interface Filter {
  logLevel: string | null;
  ip: string | null;
  url: string | null;
  method: string | null;
  statusCode: number | null;
  message: string | null;
  page: number;
  itemsPerPage: number;
  sortDirection: string | null;
}

export class LogsRepository {
  private readonly backendUrl = process.env.NEXT_PUBLIC_API_URL;

  async getLogsCount() {
    try {
      const response = await fetch(`${this.backendUrl}/logs/getLogsCount`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getCookieCustom('accessToken')}`
        }
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  async getChartData(timeStart: string, timeEnd: string) {
    try {
      const response = await fetch(`${this.backendUrl}/logs/getLogsCountByTimeRange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getCookieCustom('accessToken')}`
        },
        body: JSON.stringify({ timeStart, timeEnd })
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  async getLogs(filter: Filter) {
    try {
      const requestBody = {
        ...filter,
        sortBy: '@timestamp',
        page: filter.page + 1
      };
      const response = await fetch(`${this.backendUrl}/logs/getLogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getCookieCustom('accessToken')}`,
        },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      return { data, status: response.status }
    } catch (error) {
      throw error;
    }
  }
}