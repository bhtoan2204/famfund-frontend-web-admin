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
import {
  DashboardOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";


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
    finally{
      setIsTableLoading(false);
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
              <DashboardOutlined className="text-2xl fill-primary dark:fill-white" />
            </CardDataStats>
            <CardDataStats
              title="Total successful request"
              total={logsCount.info}
            >
              <CheckCircleOutlined className="text-2xl fill-primary dark:fill-white" />
            </CardDataStats>
            <CardDataStats title="Total error request" total={logsCount.error}>
              <WarningOutlined className="text-2xl fill-primary dark:fill-white" />
            </CardDataStats>
            <CardDataStats title="Fail request rate" total={`${logsCount.rate}%`}>
              <CloseCircleOutlined className="text-2xl fill-primary dark:fill-white" />
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