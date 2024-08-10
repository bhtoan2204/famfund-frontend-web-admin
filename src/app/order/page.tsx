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
  Statistic,
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
import {
  ArrowUpOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
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
      console.log(data);
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
                value={0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col flex="1 1 18%">
            <Card>
              <Statistic
                title="Total Families"
                value={0}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col flex="1 1 18%">
            <Card>
              <Statistic
                title="Total Orders Succeeded"
                value={0}
                prefix={<CheckCircleOutlined style={{ color: "green" }} />}
              />
            </Card>
          </Col>
          <Col flex="1 1 18%">
            <Card>
              <Statistic
                title="Total Orders Pending"
                value={0}
                prefix={<ClockCircleOutlined style={{ color: "orange" }} />}
              />
            </Card>
          </Col>
          <Col flex="1 1 18%">
            <Card>
              <Statistic
                title="Total Orders Failed"
                value={0}
                prefix={<CloseCircleOutlined style={{ color: "red" }} />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: "24px" }}>
          <Col span={6}>
            <Card>
              <Statistic title="Total Main Packages purchased" value={0} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Total Extra Packages purchased" value={0} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Total Combo Packages purchased" value={0} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Revenue"
                value={0}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
      <Card style={{ marginTop: "24px" }}>
        <h2>User Orders</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
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
              defaultValue="ALL"
            >
              <Option value="ALL">ALL</Option>
              <Option value="MAIN">MAIN</Option>
              <Option value="EXTRA">EXTRA</Option>
              <Option value="COMBO">COMBO</Option>
            </Select>
          </div>
          <Button
            style={{ width: 200, marginBottom: 16 }}
            onClick={() => {
              setIsDiscountModalVisible(true);
            }}
          >
            Show Discount
          </Button>
        </div>
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
      <OrderModal
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
        selectedOrder={selectedOrder}
      ></OrderModal>
      <DiscountModal
        visible={isDiscountModalVisible}
        onClose={function (): void {
          setIsDiscountModalVisible(false);
        }}
      ></DiscountModal>
    </DefaultLayout>
  );
};

export default OrderPage;
