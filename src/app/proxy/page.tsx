"use client"

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ProxyRepository } from "@/repository/proxy.repository";
import { ProxyUsecase } from "@/usecase/proxy.usecase";
import { useState, useEffect } from "react";
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, ChartData, registerables } from 'chart.js';
import WorldMap from "react-svg-worldmap";
import { DatePicker, Spin, Typography, message } from "antd";
import dayjs from "dayjs";
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

const backgroundColor = [
  'rgba(255, 99, 132, 0.4)',
  'rgba(54, 162, 235, 0.4)',
  'rgba(255, 206, 86, 0.4)',
  'rgba(75, 192, 192, 0.4)',
  'rgba(153, 102, 255, 0.4)',
  'rgba(255, 159, 64, 0.4)',
  'rgba(255, 0, 0, 0.4)',
  'rgba(0, 255, 0, 0.4)',
  'rgba(0, 0, 255, 0.4)',
  'rgba(128, 128, 128, 0.4)',
  'rgba(0, 255, 255, 0.4)',
  'rgba(255, 0, 255, 0.4)',
  'rgba(128, 0, 128, 0.4)',
  'rgba(255, 165, 0, 0.4)',
  'rgba(0, 128, 0, 0.4)',
  'rgba(0, 0, 128, 0.4)',
  'rgba(128, 0, 0, 0.4)',
  'rgba(0, 128, 128, 0.4)',
  'rgba(255, 255, 0, 0.4)',
  'rgba(255, 255, 255, 0.4)',
  'rgba(0, 0, 0, 0.4)',
  'rgba(128, 128, 0, 0.4)',
  'rgba(192, 192, 192, 0.4)',
  'rgba(255, 140, 0, 0.4)',
  'rgba(0, 255, 255, 0.4)',
  'rgba(255, 0, 255, 0.4)',
  'rgba(0, 255, 0, 0.4)',
  'rgba(255, 255, 255, 0.4)',
  'rgba(0, 0, 0, 0.4)',
  'rgba(255, 255, 255, 0.4)',
]

interface Requests {
  date: string;
  requests: number;
}

interface CachedRequests {
  date: string;
  cachedRequests: number;
}

interface Bytes {
  date: string;
  bytes: number;
}

interface CachedBytes {
  date: string;
  cachedBytes: number;
}

interface Threats {
  date: string;
  threats: number;
}

interface EncryptedBytes {
  date: string;
  encryptedBytes: number;
}

interface EncryptedRequests {
  date: string;
  encryptedRequests: number;
}

interface BrowserMap {
  date: string;
  browserMap: [
    {
      pageViews: number;
      uaBrowserFamily: string;
    }
  ];
}

interface ContentTypeMap {
  date: string;
  contentTypeMap: [
    {
      bytes: number;
      edgeResponseContentTypeName: string;
      requests: number;
    }
  ];
}

interface CountryMap {
  date: string;
  countryMap: [
    {
      bytes: number;
      clientCountryName: string;
      requests: number;
      threats: number;
    }
  ];
}

interface ResponseStatusMap {
  date: string;
  responseStatusMap: [
    {
      requests: number;
      edgeResponseStatus: number;
    }
  ];
}

interface Uniques {
  date: string;
  uniques: number;
}

interface CombinedChartProps {
  requests: Requests[];
  cachedRequests: CachedRequests[];
  bytes: Bytes[];
  cachedBytes: CachedBytes[];
  threats: Threats[];
  encryptedBytes: EncryptedBytes[];
  encryptedRequests: EncryptedRequests[];
}

const CombinedChart: React.FC<CombinedChartProps> = ({
  requests,
  cachedRequests,
  bytes,
  cachedBytes,
  threats,
  encryptedBytes,
  encryptedRequests,
}) => {
  const labels = requests.map(item => item.date);
  const requestsData = {
    labels: labels,
    datasets: [
      {
        label: 'Requests',
        data: requests.map(item => item.requests),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        fill: false,
      },
      {
        label: 'Cached Requests',
        data: cachedRequests.map(item => item.cachedRequests),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.4)',
        fill: false,
      },
      {
        label: 'Threats',
        data: threats.map(item => item.threats),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        fill: false,
      },
      {
        label: 'Encrypted Requests',
        data: encryptedRequests.map(item => item.encryptedRequests),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        fill: false,
      },
    ],
  };

  const bytesData = {
    labels: labels,
    datasets: [
      {
        label: 'Bytes',
        data: bytes.map(item => item.bytes),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.4)',
        fill: false,
      },
      {
        label: 'Cached Bytes',
        data: cachedBytes.map(item => item.cachedBytes),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.4)',
        fill: false,
      },
      {
        label: 'Encrypted Bytes',
        data: encryptedBytes.map(item => item.encryptedBytes),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.4)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Data Over Time',
      },
    },
  };

  return (
    <div className="flex flex-row gap-4">
      <div className="w-1/2">
        <h2 className="text-xl font-bold">⌛Requests and Threats Chart</h2>
        <Line data={requestsData} options={options} />
      </div>
      <div className="w-1/2">
        <h2 className="text-xl font-bold">⌛Bytes and Encrypted Data Chart</h2>
        <Line data={bytesData} options={options} />
      </div>
    </div>
  );
};

const WorldMapComponent: React.FC<{ countryMap: CountryMap[] }> = ({ countryMap }) => {
  const data = countryMap.flatMap((item) => item.countryMap).reduce<
    { country: string; value: number }[]
  >((acc, current) => {
    const existingCountry = acc.find(
      (item) => item.country === current.clientCountryName
    );
    if (existingCountry) {
      existingCountry.value += current.requests;
    } else {
      acc.push({
        country: current.clientCountryName,
        value: current.requests,
      });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  return (
    <div className="flex border">
      <div className="w-3/4 mb-8 rounded-md p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🌍 Requests by Country in the last 30 days
          </h2>
          <WorldMap
            color="blue"
            value-suffix="requests"
            size={1200}
            data={data}
            backgroundColor="transparent"
          />
        </div>
      </div>
      <div className="w-1/4 mb-8 rounded-md p-4">
        <h2 className="text-xl font-bold">Top Countries by Requests</h2>
        <div style={{ maxHeight: '900px', overflowY: 'auto' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Country/Region
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Traffics
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.country}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface PieChartProps {
  browserMap: BrowserMap[];
  contentTypeMap: ContentTypeMap[];
  responseStatusMap: ResponseStatusMap[];
}

const PieChartCombined: React.FC<PieChartProps> = ({
  browserMap,
  contentTypeMap,
  responseStatusMap,
}) => {
  const browserData = browserMap.reduce((acc, item) => {
    item.browserMap.forEach(browser => {
      const existingBrowser = acc.find(b => b.uaBrowserFamily === browser.uaBrowserFamily);
      if (existingBrowser) {
        existingBrowser.pageViews += browser.pageViews;
      } else {
        acc.push({
          uaBrowserFamily: browser.uaBrowserFamily,
          pageViews: browser.pageViews,
        });
      }
    });
    return acc;
  }, [] as { uaBrowserFamily: string; pageViews: number }[]);

  const contentTypeData = contentTypeMap.reduce((acc, item) => {
    item.contentTypeMap.forEach(contentType => {
      const existingContentType = acc.find(c => c.edgeResponseContentTypeName === contentType.edgeResponseContentTypeName);
      if (existingContentType) {
        existingContentType.bytes += contentType.bytes;
        existingContentType.requests += contentType.requests;
      } else {
        acc.push({
          edgeResponseContentTypeName: contentType.edgeResponseContentTypeName,
          bytes: contentType.bytes,
          requests: contentType.requests,
        });
      }
    });
    return acc;
  }, [] as { edgeResponseContentTypeName: string; bytes: number; requests: number }[]);

  const responseStatusData = responseStatusMap.reduce((acc, item) => {
    item.responseStatusMap.forEach(responseStatus => {
      const existingResponseStatus = acc.find(r => r.edgeResponseStatus === responseStatus.edgeResponseStatus);
      if (existingResponseStatus) {
        existingResponseStatus.requests += responseStatus.requests;
      } else {
        acc.push({
          edgeResponseStatus: responseStatus.edgeResponseStatus,
          requests: responseStatus.requests,
        });
      }
    });
    return acc;
  }, [] as { edgeResponseStatus: number; requests: number }[]);

  const browserChartData = {
    labels: browserData.map((item) => item.uaBrowserFamily),
    datasets: [
      {
        data: browserData.map((item) => item.pageViews),
        backgroundColor: backgroundColor,
        percentage: browserData.map((item) => Math.round((item.pageViews / browserData.reduce((sum, i) => sum + i.pageViews, 0)) * 100))
      },
    ],
  };

  const contentTypeChartData = {
    labels: contentTypeData.map((item) => item.edgeResponseContentTypeName),
    datasets: [
      {
        data: contentTypeData.map((item) => item.bytes),
        backgroundColor: backgroundColor,
        percentage: contentTypeData.map((item) => Math.round((item.bytes / contentTypeData.reduce((sum, i) => sum + i.bytes, 0)) * 100))
      },
    ],
  };

  const responseStatusChartData = {
    labels: responseStatusData.map(
      (item) => item.edgeResponseStatus
    ),
    datasets: [
      {
        data: responseStatusData.map((item) => item.requests),
        backgroundColor: backgroundColor,
        percentage: responseStatusData.map((item) => Math.round((item.requests / responseStatusData.reduce((sum, i) => sum + i.requests, 0)) * 100))
      },
    ],
  };

  return (
    <div className="flex flex-row gap-4">
      <div className="w-1/3 m-5">
        <h2 className="text-xl font-bold">🌐 Browser</h2>
        <Pie data={browserChartData}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                },
                maxWidth: 200,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || '';
                    const value = context.parsed;
                    const total = context.dataset.data.reduce((sum, i) => sum + i, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  },
                },
              },
            },
          }} />
      </div>
      <div className="w-1/3 m-5">
        <h2 className="text-xl font-bold">✍️ Content Type</h2>
        <Pie data={contentTypeChartData}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                },
                maxWidth: 200,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || '';
                    const value = context.parsed;
                    const total = context.dataset.data.reduce((sum, i) => sum + i, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  },
                },
              },
            },
          }} />
      </div>
      <div className="w-1/3 m-5">
        <h2 className="text-xl font-bold">🫀 Response Status</h2>
        <Pie data={responseStatusChartData}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                },
                maxWidth: 200,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || '';
                    const value = context.parsed;
                    const total = context.dataset.data.reduce((sum, i) => sum + i, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  },
                },
              },
            },
          }} />
      </div>
    </div>
  )
};

const UniquesChart: React.FC<{ uniques: Uniques[] }> = ({ uniques }) => {
  const dataSet: ChartData<"bar", number[], string> = {
    labels: uniques.map(item => item.date),
    datasets: [
      {
        data: uniques.map(item => item.uniques),
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false
      }
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">🧑‍💻Unique Users Chart</h2>
      <Bar data={dataSet} options={options} />
    </div>
  )
};

const ProxyPage = () => {
  const logsUseCase = new ProxyUsecase(new ProxyRepository());
  const [date_geq, setDate_geq] = useState(dayjs().subtract(30, 'day'));
  const [date_leq, setDate_leq] = useState(dayjs());
  const [limit, setLimit] = useState(30);
  const [request, setRequest] = useState<Requests[]>([]);
  const [cachedRequests, setCachedRequests] = useState<CachedRequests[]>([]);
  const [bytes, setBytes] = useState<Bytes[]>([]);
  const [cachedBytes, setCachedBytes] = useState<CachedBytes[]>([]);
  const [threats, setThreats] = useState<Threats[]>([]);
  const [encryptedBytes, setEncryptedBytes] = useState<EncryptedBytes[]>([]);
  const [encryptedRequests, setEncryptedRequests] = useState<EncryptedRequests[]>([]);
  const [countryMap, setCountryMap] = useState<CountryMap[]>([]);
  const [browserMap, setBrowserMap] = useState<BrowserMap[]>([]);
  const [contentTypeMap, setContentTypeMap] = useState<ContentTypeMap[]>([]);
  const [responseStatusMap, setResponseStatusMap] = useState<ResponseStatusMap[]>([]);
  const [uniques, setUniques] = useState<Uniques[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getProxyAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await logsUseCase.getAnalytics(date_geq.format('YYYY-MM-DD'), date_leq.format('YYYY-MM-DD'), limit);
      if (response.status !== 200) throw new Error(response.data.message);
      else {
        const data = response.data.viewer.zones[0].httpRequests1dGroups;
        const requests: Requests[] = [];
        const cachedRequests: CachedRequests[] = [];
        const bytes: Bytes[] = [];
        const cachedBytes: CachedBytes[] = [];
        const threats: Threats[] = [];
        const encryptedBytes: EncryptedBytes[] = [];
        const encryptedRequests: EncryptedRequests[] = [];
        const browserMap: BrowserMap[] = [];
        const contentTypeMap: ContentTypeMap[] = [];
        const countryMap: CountryMap[] = [];
        const responseStatusMap: ResponseStatusMap[] = [];
        const uniques: Uniques[] = [];
        data.forEach((item: any) => {
          const date = item.dimensions.date;
          requests.push({
            date,
            requests: item.sum.requests,
          });
          cachedRequests.push({
            date,
            cachedRequests: item.sum.cachedRequests,
          });
          bytes.push({
            date,
            bytes: item.sum.bytes,
          });
          cachedBytes.push({
            date,
            cachedBytes: item.sum.cachedBytes,
          });
          threats.push({
            date,
            threats: item.sum.threats,
          });
          encryptedBytes.push({
            date,
            encryptedBytes: item.sum.encryptedBytes,
          });
          encryptedRequests.push({
            date,
            encryptedRequests: item.sum.encryptedRequests,
          });
          browserMap.push({
            date,
            browserMap: item.sum.browserMap,
          });
          contentTypeMap.push({
            date,
            contentTypeMap: item.sum.contentTypeMap,
          });
          countryMap.push({
            date,
            countryMap: item.sum.countryMap,
          });
          responseStatusMap.push({
            date,
            responseStatusMap: item.sum.responseStatusMap,
          });
          uniques.push({
            date,
            uniques: item.uniq.uniques,
          });
        });
        setRequest(requests);
        setCachedRequests(cachedRequests);
        setBytes(bytes);
        setCachedBytes(cachedBytes);
        setThreats(threats);
        setEncryptedBytes(encryptedBytes);
        setEncryptedRequests(encryptedRequests);
        setBrowserMap(browserMap);
        setContentTypeMap(contentTypeMap);
        setCountryMap(countryMap);
        setResponseStatusMap(responseStatusMap);
        setUniques(uniques);
      }
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const calculateDateDifference = (startDate: Date, endDate: Date) => {
    const differenceInTime = endDate.getTime() - startDate.getTime();
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
  };

  const handleDateChange = (date: dayjs.Dayjs | null, type: 'geq' | 'leq') => {
    if (date) {
      const newDateString = date.format('YYYY-MM-DD');
      const startDate = type === 'geq' ? new Date(newDateString) : new Date(date_geq.format('YYYY-MM-DD'));
      const endDate = type === 'leq' ? new Date(newDateString) : new Date(date_leq.format('YYYY-MM-DD'));

      if (endDate < startDate) {
        message.error('End date must be greater than start date', 3);
        return;
      }

      const differenceInDays = calculateDateDifference(startDate, endDate);

      if (differenceInDays > 394) {
        message.warning('Maximum date difference must lower than 394 days', 3);
        return;
      }

      if (type === 'geq') {
        setDate_geq(date);
      } else {
        setDate_leq(date);
      }

      setLimit(differenceInDays);
    }
  };

  useEffect(() => {
    getProxyAnalytics();
  }, [limit, date_geq, date_leq])

  return (
    <DefaultLayout>
      <Typography.Title level={2}>Proxy Statistics</Typography.Title>
      <Spin spinning={isLoading}>
        <div className="flex flex-col gap-8">
          <div className="stickyDatepicker top-0 z-10 flex items-center gap-4 bg-gray-100 p-4 rounded-md">
            <DatePicker
              value={date_geq}
              onChange={(date) => handleDateChange(date, 'geq')}
              format="YYYY-MM-DD"
              className="w-full border border-gray-300 rounded-md"
              contentEditable="false"
            />
            <span className="font-bold text-gray-600">to</span>
            <DatePicker
              value={date_leq}
              onChange={(date) => handleDateChange(date, 'leq')}
              format="YYYY-MM-DD"
              className="w-full border border-gray-300 rounded-md"
              contentEditable="false"
            />
          </div>
          <div className="p-4 rounded-md">
            <UniquesChart uniques={uniques} />
          </div>
          <hr className="my-4 border-t-1 border-gray-800 w-2/4 mx-auto" />
          <div className="p-4 rounded-md">
            <PieChartCombined
              browserMap={browserMap}
              contentTypeMap={contentTypeMap}
              responseStatusMap={responseStatusMap}>
            </PieChartCombined>
          </div>
          <hr className="my-4 border-t-1 border-gray-300 w-2/4 mx-auto" />
          <div className="p-4 rounded-md">
            <CombinedChart
              requests={request}
              cachedRequests={cachedRequests}
              bytes={bytes}
              cachedBytes={cachedBytes}
              threats={threats}
              encryptedBytes={encryptedBytes}
              encryptedRequests={encryptedRequests}>
            </CombinedChart>
          </div>
          <hr className="my-4 border-t-1 border-gray-800 w-2/4 mx-auto" />
          <div className="p-4 rounded-md">
            <WorldMapComponent countryMap={countryMap} />
          </div>
        </div>
      </Spin>
    </DefaultLayout>
  );
}

export default ProxyPage;