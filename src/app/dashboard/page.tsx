"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { DataFetcherRepository } from "@/repository/data-fetcher.repository";
import { DatafetcherUsecase } from "@/usecase/data-fetcher.usecase";
import { Card, Col, Row, Statistic, Table, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { Search } = Input;
const { Option } = Select;

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

interface User {
  id_user: string;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  avatar: string;
}

interface Order {
  id_order: number;
  id_package: number;
  status: string;
  created_at: string;
  updated_at: string;
  method: string;
  package_expired_at: string;
  package_name: string;
  package_price: number;
}

interface UserOrder extends User, Order {}

interface UserOrderDTO {
  page: number;
  itemsPerPage: number;
  search: string | null;
  sort: string | null;
  sortOrder: 'ascend' | 'descend' | null;
  packageId: number | null;
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
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [userOrderDTO, setUserOrderDTO] = useState<UserOrderDTO>({
    page: 1,
    itemsPerPage: 10,
    search: null,
    sort: null,
    sortOrder: null,
    packageId: null,
  });
  const [totalOrders, setTotalOrders] = useState<number>(0);

  const getListUserOrders = async () => {
    try {
      const { data, status } = await datafetcherUsecase.getUserOrders(userOrderDTO);
      if (status === 200) {
        setUserOrders(data.data);
        setTotalOrders(data.total); // Assuming total comes from the API
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        setSummary(data.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (value: string) => {
    setUserOrderDTO((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setUserOrderDTO((prev) => ({
      ...prev,
      page: pagination.current,
      itemsPerPage: pagination.pageSize,
      sort: sorter.order ? sorter.field : null,
      sortOrder: sorter.order || null,
    }));
  };

  const handlePackageChange = (value: number) => {
    setUserOrderDTO((prev) => ({
      ...prev,
      packageId: value,
      page: 1,
    }));
  };

  const chartData = {
    labels: revenueLast6Months.map(
      (item) =>
        `${new Date(item.month).getMonth() + 1}-${new Date(item.month).getFullYear()}`
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

  useEffect(() => {
    getListUserOrders();
  }, [userOrderDTO]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id_order",
      key: "id_order",
      sorter: true,
    },
    {
      title: "Package Name",
      dataIndex: "package_name",
      key: "package_name",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: true,
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Package Expiry Date",
      dataIndex: "package_expired_at",
      key: "package_expired_at",
    },
    {
      title: "Package Price",
      dataIndex: "package_price",
      key: "package_price",
    },
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
      sorter: true,
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: true,
    },
  ];

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

          <Card style={{ marginTop: "24px" }}>
            <h2>User Orders</h2>
            <Search
              placeholder="Search by keyword"
              onSearch={handleSearch}
              style={{ width: 200, marginBottom: 16 }}
            />
            <Select
              placeholder="Filter by Package"
              onChange={handlePackageChange}
              allowClear
              style={{ width: 200, marginLeft: 16, marginBottom: 16 }}
            >
              <Option value={1}>Basic</Option>
              <Option value={2}>Premium</Option>
            </Select>
            <Table
              dataSource={userOrders}
              columns={columns}
              rowKey="id_order"
              pagination={{
                current: userOrderDTO.page,
                pageSize: userOrderDTO.itemsPerPage,
                total: totalOrders,
              }}
              onChange={handleTableChange}
            />
          </Card>
        </div>
      </DefaultLayout>
    </>
  );
}
