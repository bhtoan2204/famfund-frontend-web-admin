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
import { Card, Col, Row, Statistic } from "antd";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
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

interface RevenueLast6Months {
  month: string;
  monthly_revenue: number;
}

interface UserOrderDTO {
  page: number;
  itemsPerPage: number;
  search: string | null;
  sort: string | null;
  sortOrder: "ascend" | "descend" | null;
  packageId: number | null;
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
  const [revenueLast6Months, setRevenueLast6Months] = useState<
    RevenueLast6Months[]
  >([]);

  const datafetcherUsecase = new DatafetcherUsecase(
    new DataFetcherRepository(),
  );

  const getRevenueLast6Months = async () => {
    try {
      const { data, status } = await datafetcherUsecase.getRevenueLast6Months();
      if (status === 200) {
        setRevenueLast6Months(data.data);
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  const chartData = {
    labels: revenueLast6Months.map(
      (item) =>
        `${new Date(item.month).getMonth() + 1}-${new Date(item.month).getFullYear()}`,
    ),
    datasets: [
      {
        label: "Monthly Revenue",
        data: revenueLast6Months.map((item) => item.monthly_revenue),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
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
    getRevenueLast6Months();
  }, []);

  return (
    <DefaultLayout>
      <div>
        <h1>Dashboard</h1>
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
                title="Main Packages"
                value={summary.totalMainPackageOrderSuccess}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Extra Packages"
                value={summary.totalExtraPackageOrderSuccess}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Combo Packages"
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

        <Card>
          <h2>Revenue Last 6 Months</h2>
          <Bar data={chartData} options={chartOptions} />
        </Card>
      </div>
    </DefaultLayout>
  );
}
