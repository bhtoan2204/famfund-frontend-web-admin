"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { DataFetcherRepository } from "@/repository/data-fetcher.repository";
import { DatafetcherUsecase } from "@/usecase/data-fetcher.usecase";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Summary {
  total_users: number;
  total_families: number;
  total_orders_succeeded: number;
  total_orders_pending: number;
  revenue_last_6_months: number;
  total_revenue: number;
}

interface RevenueLast6Months {
  month: string;
  monthly_revenue: number;
}

export default function Dashboard() {
  const datafetcherUsecase = new DatafetcherUsecase(new DataFetcherRepository());
  const [summary, setSummary] = useState<Summary>({
    total_users: 0,
    total_families: 0,
    total_orders_succeeded: 0,
    total_orders_pending: 0,
    revenue_last_6_months: 0,
    total_revenue: 0,
  });
  const [revenueLast6Months, setRevenueLast6Months] = useState<RevenueLast6Months[]>([]);

  const getRevenueLast6Months = async () => {
    try {
      const { data, status } = await datafetcherUsecase.getRevenueLast6Months();
      if (status === 200) {
        setRevenueLast6Months(data.data);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  const getSummary = async () => {
    try {
      const { data, status } = await datafetcherUsecase.getSummary();
      if (status === 200) {
        setSummary(data.data[0]);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  const chartData = {
    labels: revenueLast6Months.map((item) => `${new Date(item.month).getMonth() + 1}-${new Date(item.month).getFullYear()}`),
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
        display: false
      }
    },
  };

  useEffect(() => {
    getSummary();
    getRevenueLast6Months();
  }, []);

  return (
    <>
      <DefaultLayout>
        <div>
          <h1>Dashboard</h1>
          <Row gutter={16} style={{ marginBottom: "24px" }}>
            <Col span={6}>
              <Card>
                <Statistic title="Total Users" value={summary.total_users} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Total Families" value={summary.total_families} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Orders Succeeded"
                  value={summary.total_orders_succeeded}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Orders Pending"
                  value={summary.total_orders_pending}
                  prefix={<ArrowDownOutlined />}
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
    </>
  );
}
