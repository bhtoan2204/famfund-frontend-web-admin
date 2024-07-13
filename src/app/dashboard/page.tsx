"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { DataFetcherRepository } from "@/repository/data-fetcher.repository";
import { DatafetcherUsecase } from "@/usecase/data-fetcher.usecase";
import {
  ArrowUpOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Statistic,
  Spin,
  Form,
  DatePicker,
  InputNumber,
  Button,
  InputNumberProps,
  Typography,
} from "antd";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs"; // Import dayjs
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface Summary {
  totalUsers: number;
  totalFamilies: number;
  totalOrderSuccess: number;
  totalOrderPending: number;
  totalOrderFailed: number;
  totalRevenue: number;
  totalMainPackageOrderSuccess: number;
  totalExtraPackageOrderSuccess: number;
  totalComboPackageOrderSuccess: number;
}

interface UserOrderDTO {
  page: number;
  itemsPerPage: number;
  search: string | null;
  sort: string | null;
  sortOrder: "ascend" | "descend" | null;
  packageId: number | null;
}

interface OrderStatsResult {
  startDate: string;
  endDate: string;
  total_orders: number;
  total_revenue: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary>({
    totalUsers: 0,
    totalFamilies: 0,
    totalOrderSuccess: 0,
    totalOrderPending: 0,
    totalOrderFailed: 0,
    totalRevenue: 0,
    totalMainPackageOrderSuccess: 0,
    totalExtraPackageOrderSuccess: 0,
    totalComboPackageOrderSuccess: 0,
  });

  const [loading, setLoading] = useState(true);

  const [endDate, setEndDate] = useState<string>(dayjs().toISOString()); // Use dayjs for current date
  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(6, "months").toISOString(), // Use dayjs for subtracting 6 months
  );

  const [interval, setInterval] = useState<number>(6);
  const [orderStatsResult, setOrderStatsResult] = useState<OrderStatsResult[]>(
    [],
  );

  const datafetcherUsecase = new DatafetcherUsecase(
    new DataFetcherRepository(),
  );

  const getOrdersStats = async () => {
    try {
      const { data, status } = await datafetcherUsecase.getOrsersStats({
        startDate,
        endDate,
        interval,
      });
      if (status === 200) {
        setOrderStatsResult(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSummary = async () => {
    try {
      const { data, status } = await datafetcherUsecase.getSummary();
      if (status === 200) {
        setSummary(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOrdersStats();
  }, [startDate, endDate, interval]);

  const ordersChartData = {
    labels: orderStatsResult.map((item) => item.startDate),
    datasets: [
      {
        label: "Total Orders",
        data: orderStatsResult.map((item) => item.total_orders),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const revenueChartData = {
    labels: orderStatsResult.map((item) => item.startDate),
    datasets: [
      {
        label: "Total Revenue",
        data: orderStatsResult.map((item) => item.total_revenue),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        display: false,
      },
    },
  };

  useEffect(() => {
    getSummary();
  }, []);

  const handleDateChange: any = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    // Adjusted to use dayjs.Dayjs
    if (dates) {
      setStartDate(dates[0].toISOString());
      setEndDate(dates[1].toISOString());
    }
  };

  const handleIntervalChange: InputNumberProps["onChange"] = (value: any) => {
    setInterval(value);
  };

  return (
    <DefaultLayout>
      <div>
        <Typography.Title>Dashboard</Typography.Title>
        <Spin spinning={loading}>
          <Row
            gutter={20}
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Col flex="1 1 18%">
              <Card>
                <Statistic
                  title="Total Users"
                  value={summary.totalUsers}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col flex="1 1 18%">
              <Card>
                <Statistic
                  title="Total Families"
                  value={summary.totalFamilies}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col flex="1 1 18%">
              <Card>
                <Statistic
                  title="Total Orders Succeeded"
                  value={summary.totalOrderSuccess}
                  prefix={<CheckCircleOutlined style={{ color: "green" }} />}
                />
              </Card>
            </Col>
            <Col flex="1 1 18%">
              <Card>
                <Statistic
                  title="Total Orders Pending"
                  value={summary.totalOrderPending}
                  prefix={<ClockCircleOutlined style={{ color: "orange" }} />}
                />
              </Card>
            </Col>
            <Col flex="1 1 18%">
              <Card>
                <Statistic
                  title="Total Orders Failed"
                  value={summary.totalOrderFailed}
                  prefix={<CloseCircleOutlined style={{ color: "red" }} />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: "24px" }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Main Packages purchased"
                  value={summary.totalMainPackageOrderSuccess}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Extra Packages purchased"
                  value={summary.totalExtraPackageOrderSuccess}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Combo Packages purchased"
                  value={summary.totalComboPackageOrderSuccess}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Revenue"
                  value={summary.totalRevenue}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </Spin>

        <Card>
          <h2>Revenue Last 6 Months</h2>
          <Form layout="inline" style={{ marginBottom: "24px" }}>
            <Form.Item label="Date Range">
              <DatePicker.RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onChange={handleDateChange}
                defaultValue={[dayjs(startDate), dayjs(endDate)]}
              />
            </Form.Item>
            <Form.Item label="Interval">
              <InputNumber
                min={1}
                value={interval}
                onChange={handleIntervalChange}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={getOrdersStats}>
                Fetch Data
              </Button>
            </Form.Item>
          </Form>
          <Row gutter={16}>
            <Col span={12}>
              <h3>Total Orders</h3>
              <Bar data={ordersChartData} options={chartOptions} />
            </Col>
            <Col span={12}>
              <h3>Total Revenue</h3>
              <Bar data={revenueChartData} options={chartOptions} />
            </Col>
          </Row>
        </Card>
      </div>
    </DefaultLayout>
  );
}
