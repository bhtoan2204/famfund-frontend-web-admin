"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { DataFetcherRepository } from "@/repository/data-fetcher.repository";
import { DatafetcherUsecase } from "@/usecase/data-fetcher.usecase";
import {
  Card,
  Select,
  Input,
  Table,
  TablePaginationConfig,
  Button,
  Spin,
  Typography,
  Col,
  Row,
} from "antd";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import { useEffect, useState } from "react";
import OrderModal from "./components/OrderModal";
import DiscountModal from "./components/DiscountModal";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { Search } = Input;
const { Option } = Select;

export interface MainPackage {
  id_main_package: number;
  name: string;
  description?: string;
  is_active: boolean;
  price: string;
  duration_months: number;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ExtraPackage {
  id_extra_package: number;
  name: string;
  price: string;
  description?: string;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ComboPackage {
  id_combo_package: number;
  name: string;
  price: string;
  description?: string;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  packageExtras: ExtraPackage[];
}

interface User {
  id_user: string;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  created_at: string;
  updated_at: string;
  isphoneverified: boolean;
  isadmin: boolean;
  login_type: string;
  avatar: string;
  genre: string;
  birthdate: string;
}

interface Family {
  id_family: number;
  quantity: number;
  name: string;
  description: string;
  owner_id: string;
  expired_at: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

interface Order {
  id_order: string;
  id_user: string;
  id_family: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  id_package_main: number | null;
  id_package_extra: number | null;
  id_package_combo: number | null;
  method: string;
  bank_code: string | null;
  price: string;
  created_at: string;
  updated_at: string;
  users: User;
  family: Family | null;
  packageMain: MainPackage | null;
  packageExtra: ExtraPackage | null;
  packageCombo: ComboPackage | null;
}

interface UserOrderDTO {
  page: number;
  itemsPerPage: number;
  search: string | null;
  sortBy: string | null;
  sortDirection: "ASC" | "DESC" | null;
  type: "ALL" | "MAIN" | "EXTRA" | "COMBO";
}

interface PackagesExtrasCount {
  name: string;
  count: number;
}

const OrderPage = () => {
  const datafetcherUsecase = new DatafetcherUsecase(
    new DataFetcherRepository(),
  );
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [userOrderDTO, setUserOrderDTO] = useState<UserOrderDTO>({
    page: 1,
    itemsPerPage: 10,
    search: null,
    sortBy: null,
    sortDirection: null,
    type: "ALL",
  });

  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);

  const [packagesExtrasCount, setPackagesExtrasCount] = useState<
    PackagesExtrasCount[]
  >([]);

  const getListUserOrders = async () => {
    try {
      setLoading(true);
      const { data, status } =
        await datafetcherUsecase.getUserOrders(userOrderDTO);
      if (status === 200) {
        setUserOrders(data.data);
        setTotalOrders(data.total);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getExtrasCount = async () => {
    try {
      const { data, status } =
        await datafetcherUsecase.getExtraPackageStatistics();
      if (status === 200) {
        setPackagesExtrasCount(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getExtrasCount();
    console.log(packagesExtrasCount);
  }, []);

  useEffect(() => {
    getListUserOrders();
  }, [userOrderDTO]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id_order",
      key: "id_order",
    },
    {
      title: "User",
      dataIndex: "users",
      key: "users",
      render: (user: User) => `${user.firstname} ${user.lastname}`,
    },
    {
      title: "Family",
      dataIndex: "family",
      key: "family",
      render: (family: Family) => {
        if (family) {
          return family.name;
        }
        return <span style={{ color: "red" }}>Not assigned to any family</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Package type",
      render: (record: Order) => {
        if (record.packageMain) {
          return "Main Package";
        } else if (record.packageExtra) {
          return "Extra Package";
        } else if (record.packageCombo) {
          return "Combo Package";
        } else {
          return "";
        }
      },
    },
    {
      title: "Package",
      render: (record: Order) => {
        if (record.packageMain) {
          return record.packageMain.name;
        } else if (record.packageExtra) {
          return record.packageExtra.name;
        } else if (record.packageCombo) {
          return record.packageCombo.name;
        } else {
          return "";
        }
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: Order) => (
        <Button onClick={() => showOrderDetails(record)}>Detail</Button>
      ),
    },
  ];

  const data = {
    labels: packagesExtrasCount.map((pkg) => pkg.name),
    datasets: [
      {
        label: "Package Extras Count",
        data: packagesExtrasCount.map((pkg) => pkg.count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleSearch = (value: string) => {
    setUserOrderDTO((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handlePackageChange = (value: "ALL" | "MAIN" | "EXTRA" | "COMBO") => {
    setUserOrderDTO((prev) => ({
      ...prev,
      type: value,
      page: 1,
    }));
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Order> | SorterResult<Order>[],
    extra: TableCurrentDataSource<Order>,
  ) => {
    const { current, pageSize } = pagination;
    const sort = Array.isArray(sorter) ? sorter[0] : sorter;
    setUserOrderDTO((prev) => ({
      ...prev,
      page: current || 1,
      itemsPerPage: pageSize || 10,
      sortBy: (sort?.field as string) || null,
      sortDirection:
        sort?.order === "ascend"
          ? "ASC"
          : sort?.order === "descend"
            ? "DESC"
            : null,
    }));
  };

  return (
    <DefaultLayout>
      <Typography.Title>Order Page</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Package Extras Statistics">
            <div style={{ height: 300 }}>
              <Bar data={data} options={options} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Actions">
            <Button
              style={{ width: "100%", marginBottom: 16 }}
              onClick={() => {
                setIsDiscountModalVisible(true);
              }}
            >
              Show Discount
            </Button>
            <Search
              placeholder="Search by keyword"
              onSearch={handleSearch}
              style={{ width: "100%", marginBottom: 16 }}
            />
            <Select
              placeholder="Filter by Package"
              onChange={handlePackageChange}
              allowClear
              style={{ width: "100%" }}
              defaultValue="ALL"
            >
              <Option value="ALL">ALL</Option>
              <Option value="MAIN">MAIN</Option>
              <Option value="EXTRA">EXTRA</Option>
              <Option value="COMBO">COMBO</Option>
            </Select>
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="User Orders">
            <Spin spinning={loading}>
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
                scroll={{ x: "max-content" }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
      <OrderModal
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
        selectedOrder={selectedOrder}
      />
      <DiscountModal
        visible={isDiscountModalVisible}
        onClose={() => setIsDiscountModalVisible(false)}
      />
    </DefaultLayout>
  );
};

export default OrderPage;
