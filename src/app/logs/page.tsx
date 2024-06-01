"use client"

import CardDataStats from "@/components/CardDataStats";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { LogsRepository } from "@/repository/logs.repository";
import { LogsUseCase } from "@/usecase/logs.usecase";
import { useEffect, useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Button, Col, DatePicker, Descriptions, Form, Input, Modal, Pagination, Row, Select, Spin, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import dynamic from "next/dynamic";
import { DataFetcherRepository } from "@/repository/data-fetcher.repository";
import { DatafetcherUsecase } from "@/usecase/data-fetcher.usecase";

interface LogsReponse {
  url: string;
  method: string;
  statusCode: number;
  contentLength: string;
  "log.level": string;
  timestamp: string;
  responseTimeMs: string;
  message: string;
  ip: string;
};

interface Filter {
  logLevel: 'info' | 'error' | null;
  ip: string | null;
  url: string | null;
  method: string | null;
  statusCode: number | null;
  message: string | null;
  page: number;
  itemsPerPage: number;
  sortDirection: string | null;
}

interface IPData {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

const LogsPage = () => {
  const logsUseCase = new LogsUseCase(new LogsRepository());
  const datafetcherUsecase = new DatafetcherUsecase(new DataFetcherRepository());
  const [logsCount, setLogsCount] = useState({
    total: "0",
    info: "0",
    error: "0",
    rate: "0"
  });

  const [chartData, setChartData] = useState([]);

  const [isTableLoading, setIsTableLoading] = useState(true);
  const [logsData, setLogsData] = useState<LogsReponse[]>([]);

  const [filter, setFilter] = useState<Filter>({
    logLevel: null,
    ip: null,
    url: null,
    method: null,
    statusCode: null,
    message: null,
    page: 1,
    itemsPerPage: 10,
    sortDirection: "desc"
  });


  const renderLogLevel = (text: string) => {
    if (text === 'info') {
      return <Tag color="success">Successful</Tag>;
    } else if (text === 'error') {
      return <Tag color="error">Error</Tag>;
    }
    return text;
  };

  const [selectedIP, setSelectedIP] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ipData, setIPData] = useState<IPData>({
    status: "",
    country: "",
    countryCode: "",
    region: "",
    regionName: "",
    city: "",
    zip: "",
    lat: 0,
    lon: 0,
    timezone: "",
    isp: "",
    org: "",
    as: "",
    query: "",
  });

  const fetchIPDataData = async (ipAddress: string) => {
    try {
      const response = await datafetcherUsecase.getIpData(ipAddress);

      if (response.status === 200) {
        console.error("Error IPData API:");
      }
      setIPData(response.data);
    } catch (error) {
      console.error("Error IPData API:", error);
    }
  };

  const handleShowIPData = (ipAddress: string) => {
    setSelectedIP(ipAddress);
    setIsModalVisible(true);
    fetchIPDataData(ipAddress);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'No', dataIndex: 'index', key: 'index', width: 50, align: 'center' as const, render: (text: any, record: LogsReponse, index: number) => (index + 1) + (filter.page - 1) * filter.itemsPerPage },
    { title: 'URL', dataIndex: 'url', key: 'url', align: 'center' as const },
    { title: 'Method', dataIndex: 'method', key: 'method', align: 'center' as const },
    { title: 'Status Code', dataIndex: 'statusCode', key: 'statusCode', align: 'center' as const },
    { title: 'Content Length', dataIndex: 'contentLength', key: 'contentLength', align: 'center' as const },
    { title: 'Log Level', dataIndex: 'log.level', key: 'logLevel', align: 'center' as const, render: (text: string) => renderLogLevel(text), },
    { title: 'Time (ms)', dataIndex: 'responseTimeMs', key: 'responseTimeMs', align: 'center' as const },
    { title: 'Message', dataIndex: 'message', key: 'message', align: 'center' as const },
    { title: 'IP', dataIndex: 'ip', key: 'ip', align: 'center' as const },
    {
      title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp', sorter: true, align: 'center' as const,
      render: (timestamp: string) => {
        const formattedDate = new Date(timestamp).toLocaleString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return formattedDate;
      }
    },
    {
      title: "Actions",
      key: "actions",
      align: 'center' as const,
      render: (text: string, record: LogsReponse) => (
        <Button onClick={() => handleShowIPData(record.ip)}>
          IP Data
        </Button>
      ),
    },
  ];

  const columnsWithEvent = columns.map((col) => ({
    ...col,
    onHeaderCell: () => ({
      onClick: () => handleColumnTitleClick(),
    }),
  }));

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter && sorter.field) {
      const { field, order } = sorter;
      let newSortDirection: 'asc' | 'desc' = 'desc';
      if (order === 'ascend') {
        newSortDirection = 'asc';
      }
      setFilter({
        ...filter,
        sortDirection: newSortDirection,
      });
    }
    if (pagination && pagination.current && pagination.pageSize) {
      setFilter({
        ...filter,
        page: pagination.current,
        itemsPerPage: pagination.pageSize,
      });
    }
  };

  const handleColumnTitleClick = () => {
    let newSortDirection = 'desc';

    if (filter.sortDirection === 'desc') {
      newSortDirection = 'asc';
    }

    setFilter({
      ...filter,
      sortDirection: newSortDirection,
    });
  };

  const getLogsData = async () => {
    try {
      const logsResponse = await logsUseCase.getLogs(filter);
      const { data, status } = logsResponse;
      if (status !== 200) {
        console.error("Failed to fetch logs");
        return;
      }
      setLogsData(data.logs)
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleSearch = (values: any) => {
    setFilter({
      ...filter,
      ...values,
      page: 1,
    });
  };

  useEffect(() => {
    setIsTableLoading(true);
    getLogsData();
    setIsTableLoading(false);
  }, [filter]);

  const [timeStart, setTimeStart] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [isChartLoading, setIsChartLoading] = useState(true);

  const getChartData = async () => {
    try {
      const logsResponse = await logsUseCase.getChartData(timeStart.toISOString(), timeEnd.toISOString());
      const { data, status } = logsResponse;
      if (status !== 200) {
        console.error("Failed to fetch logs");
        return;
      }
      const trasnformedChartData = data.map((log: any) => {
        return {
          x: log.time,
          y: log.count
        }
      });
      setChartData(trasnformedChartData);
      setIsChartLoading(false);
    }
    catch (error) {
      console.error(error);
      setIsChartLoading(false);
    }
  }

  const getLogsCount = async () => {
    try {
      const logsCountResponse = await logsUseCase.getLogsCount();
      const { data, status } = logsCountResponse;
      if (status !== 200) {
        console.error("Failed to fetch logs count");
        return;
      }
      const { error, info, total } = data;
      setLogsCount({
        total: total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        info: info.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        error: error.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        rate: ((error / total) * 100).toFixed(2).toString()
      });
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleTimeStartChange = (date: any) => {
    setTimeStart(date);
  };

  const handleTimeEndChange = (date: any) => {
    setTimeEnd(date);
  };

  useEffect(() => {
    getLogsCount();
    getChartData();
  }, []);

  useEffect(() => {
    setIsChartLoading(true);
    getChartData();
  }, [timeStart, timeEnd]);

  return (
    <div>
      <DefaultLayout>
        <Modal
          title={`IPData Information for ${selectedIP}`}
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={1200}
        >
          {ipData ? (
            <Descriptions>
              <Descriptions.Item label="IP Address">
                {ipData.query}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {ipData.city}
              </Descriptions.Item>
              <Descriptions.Item label="Region">
                {ipData.regionName}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {ipData.country}
              </Descriptions.Item>
              <Descriptions.Item label="Lattitude">
                {ipData.lat}
              </Descriptions.Item>
              <Descriptions.Item label="Longitude">
                {ipData.lon}
              </Descriptions.Item>
              <Descriptions.Item label="Timezone">
                {ipData.timezone}
              </Descriptions.Item>
              <Descriptions.Item label="ISP">
                {ipData.isp}
              </Descriptions.Item>
              <Descriptions.Item label="Organization">
                {ipData.org}
              </Descriptions.Item>
              <Descriptions.Item label="AS">
                {ipData.as}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Spin />
          )}
        </Modal>
        <Typography.Title level={2}>Logs Statistics</Typography.Title>
        <div className="flex flex-col gap-4 md:gap-6 xl:gap-7.5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            <CardDataStats title="Total request" total={logsCount.total}>
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
                  fill=""
                />
                <path
                  d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                  fill=""
                />
              </svg>
            </CardDataStats>
            <CardDataStats title="Total successful request" total={logsCount.info}>
              <svg
                className="fill-primary dark:fill-white"
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.2375 19.8687 10.825 19.4562 10.825 18.9406C10.825 18.425 11.2375 18.0125 11.7531 18.0125C12.2687 18.0125 12.6812 18.425 12.6812 18.9406C12.6812 19.4219 12.2343 19.8687 11.7531 19.8687Z"
                  fill=""
                />
                <path
                  d="M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5656 6.56245 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.7062 19.8687 4.2937 19.4562 4.2937 18.9406C4.2937 18.425 4.7062 18.0125 5.22183 18.0125C5.73745 18.0125 6.14995 18.425 6.14995 18.9406C6.14995 19.4219 5.73745 19.8687 5.22183 19.8687Z"
                  fill=""
                />
                <path
                  d="M19.0062 0.618744H17.15C16.325 0.618744 15.6031 1.23749 15.5 2.06249L14.95 6.01562H1.37185C1.0281 6.01562 0.684353 6.18749 0.443728 6.46249C0.237478 6.73749 0.134353 7.11562 0.237478 7.45937C0.237478 7.49374 0.237478 7.49374 0.237478 7.52812L2.36873 13.9562C2.50623 14.4375 2.9531 14.7812 3.46873 14.7812H12.9562C14.2281 14.7812 15.3281 13.8187 15.5 12.5469L16.9437 2.26874C16.9437 2.19999 17.0125 2.16562 17.0812 2.16562H18.9375C19.35 2.16562 19.7281 1.82187 19.7281 1.37499C19.7281 0.928119 19.4187 0.618744 19.0062 0.618744ZM14.0219 12.3062C13.9531 12.8219 13.5062 13.2 12.9906 13.2H3.7781L1.92185 7.56249H14.7094L14.0219 12.3062Z"
                  fill=""
                />
              </svg>
            </CardDataStats>
            <CardDataStats title="Total error request" total={logsCount.error}>
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                  fill=""
                />
                <path
                  d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                  fill=""
                />
              </svg>
            </CardDataStats>
            <CardDataStats title="Fail request rate" total={`${logsCount.rate}%`}>
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="18"
                viewBox="0 0 22 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                  fill=""
                />
                <path
                  d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                  fill=""
                />
                <path
                  d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                  fill=""
                />
              </svg>
            </CardDataStats>
          </div>
          <div className="flex items-center gap-4">
            <DatePicker
              value={dayjs(timeStart)}
              onChange={handleTimeStartChange}
              format="YYYY-MM-DD"
              className="w-full"
              contentEditable="false"
            />
            <span>to</span>
            <DatePicker
              value={dayjs(timeEnd)}
              onChange={handleTimeEndChange}
              format="YYYY-MM-DD"
              className="w-full"
              contentEditable="false"
            />
          </div>
          <Spin spinning={isChartLoading}>
            <ReactApexChart
              options={{
                chart: {
                  fontFamily: "Satoshi, sans-serif",
                  height: 350,
                  toolbar: {
                    show: false,
                  },
                  zoom: {
                    enabled: false,
                  },
                },
                xaxis: { type: "category" as const },
                title: { text: "Logs count" },
                dataLabels: {
                  enabled: false,
                },
              }}
              series={[{ name: "Logs count", data: chartData }]}
              type="area"
              height={350}
              width={"100%"}
            />
          </Spin>
        </div>
        <div className="flex items-center gap-4">
          <Spin spinning={isTableLoading}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={18}>
                <Table
                  dataSource={logsData}
                  columns={columnsWithEvent}
                  pagination={false}
                  scroll={{ y: 600 }}
                  size="middle"
                  rowKey={(record: any) =>
                    `${record.timestamp}-${record.ip}-${record.url}-${record.responseTimeMs}`
                  }
                  onChange={handleTableChange}
                  className="h-full"
                />
              </Col>
              <Col xs={24} md={6}>
                <Form layout="vertical" onFinish={handleSearch}>
                  <Form.Item name="logLevel" label="Log Level">
                    <Select placeholder="Select Log Level" allowClear>
                      <Select.Option value="info">Info</Select.Option>
                      <Select.Option value="error">Error</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="ip" label="IP">
                    <Input placeholder="IP" allowClear />
                  </Form.Item>
                  <Form.Item name="url" label="URL">
                    <Input placeholder="URL" allowClear />
                  </Form.Item>
                  <Form.Item name="method" label="Method">
                    <Input placeholder="Method" allowClear />
                  </Form.Item>
                  <Form.Item name="statusCode" label="Status Code">
                    <Input placeholder="Status Code" type="number" allowClear />
                  </Form.Item>
                  <Form.Item name="message" label="Message">
                    <Input placeholder="Message" allowClear />
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" block>
                      Search
                    </Button>
                  </Form.Item>
                  <Pagination
                    total={10000}
                    current={filter.page}
                    pageSize={filter.itemsPerPage}
                    onChange={(page, pageSize) => {
                      setFilter({ ...filter, page, itemsPerPage: pageSize });
                      getLogsData();
                    }}
                    style={{ marginTop: 16, textAlign: 'right' }}
                  />
                </Form>
              </Col>
            </Row>
          </Spin>
        </div>
      </DefaultLayout>
    </div>
  );
}

export default LogsPage;