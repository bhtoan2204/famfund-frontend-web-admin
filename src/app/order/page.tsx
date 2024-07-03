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
  Modal,
  Divider,
  Descriptions,
  Tabs,
} from "antd";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import TabPane from "antd/es/tabs/TabPane";
import { useEffect, useState } from "react";
import Image from "next/image";

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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getListUserOrders = async () => {
    try {
      const { data, status } =
        await datafetcherUsecase.getUserOrders(userOrderDTO);
      if (status === 200) {
        setUserOrders(data.data);
        setTotalOrders(data.total);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      <h1>Order Page</h1>
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
          defaultValue="ALL"
        >
          <Option value="ALL">ALL</Option>
          <Option value="MAIN">MAIN</Option>
          <Option value="EXTRA">EXTRA</Option>
          <Option value="COMBO">COMBO</Option>
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
          scroll={{ x: "max-content" }}
        />
      </Card>
      <Modal
        title="Order Details"
        width={800}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {selectedOrder && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Order" key="1">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Order ID">
                  {selectedOrder.id_order}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {selectedOrder.status}
                </Descriptions.Item>
                <Descriptions.Item label="Price">
                  {selectedOrder.price}
                </Descriptions.Item>
                <Descriptions.Item label="Method">
                  {selectedOrder.method}
                </Descriptions.Item>
                <Descriptions.Item label="Bank Code">
                  {selectedOrder.bank_code}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {selectedOrder.created_at}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                  {selectedOrder.updated_at}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Package" key="2">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Package Type">
                  {selectedOrder.packageMain
                    ? "Main Package"
                    : selectedOrder.packageExtra
                      ? "Extra Package"
                      : "Combo Package"}
                </Descriptions.Item>
                <Descriptions.Item label="Package Name">
                  {selectedOrder.packageMain
                    ? selectedOrder.packageMain.name
                    : selectedOrder.packageExtra
                      ? selectedOrder.packageExtra.name
                      : selectedOrder.packageCombo
                        ? selectedOrder.packageCombo.name
                        : ""}
                </Descriptions.Item>
                <Descriptions.Item label="Package Description">
                  {selectedOrder.packageMain
                    ? selectedOrder.packageMain.description
                    : selectedOrder.packageExtra
                      ? selectedOrder.packageExtra.description
                      : selectedOrder.packageCombo
                        ? selectedOrder.packageCombo.description
                        : ""}
                </Descriptions.Item>
                <Descriptions.Item label="Package Price">
                  {selectedOrder.packageMain
                    ? selectedOrder.packageMain.price
                    : selectedOrder.packageExtra
                      ? selectedOrder.packageExtra.price
                      : selectedOrder.packageCombo
                        ? selectedOrder.packageCombo.price
                        : ""}
                </Descriptions.Item>
                <Descriptions.Item label="Package Duration (Months)">
                  {selectedOrder.packageMain
                    ? selectedOrder.packageMain.duration_months
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Package Created At">
                  {selectedOrder.packageMain
                    ? selectedOrder.packageMain.created_at.toString()
                    : selectedOrder.packageExtra
                      ? selectedOrder.packageExtra.created_at.toString()
                      : selectedOrder.packageCombo
                        ? selectedOrder.packageCombo.created_at.toString()
                        : ""}
                </Descriptions.Item>
                <Descriptions.Item label="Package Updated At">
                  {selectedOrder.packageMain
                    ? selectedOrder.packageMain.updated_at.toString()
                    : selectedOrder.packageExtra
                      ? selectedOrder.packageExtra.updated_at.toString()
                      : selectedOrder.packageCombo
                        ? selectedOrder.packageCombo.updated_at.toString()
                        : ""}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Family" key="3">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Family Name">
                  {selectedOrder.family
                    ? selectedOrder.family.name
                    : "Not assigned to any family"}
                </Descriptions.Item>
                <Descriptions.Item label="Family Description">
                  {selectedOrder.family
                    ? selectedOrder.family.description
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Family Quantity">
                  {selectedOrder.family ? selectedOrder.family.quantity : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Family Owner ID">
                  {selectedOrder.family ? selectedOrder.family.owner_id : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Family Expired At">
                  {selectedOrder.family
                    ? selectedOrder.family.expired_at
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Family Created At">
                  {selectedOrder.family
                    ? selectedOrder.family.created_at
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Family Updated At">
                  {selectedOrder.family
                    ? selectedOrder.family.updated_at
                    : "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="User" key="4">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="User ID">
                  {selectedOrder.users.id_user}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedOrder.users.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {selectedOrder.users.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Name">
                  {`${selectedOrder.users.firstname} ${selectedOrder.users.lastname}`}
                </Descriptions.Item>
                <Descriptions.Item label="Phone Verified">
                  {selectedOrder.users.isphoneverified ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Admin">
                  {selectedOrder.users.isadmin ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Login Type">
                  {selectedOrder.users.login_type}
                </Descriptions.Item>
                <Descriptions.Item label="Genre">
                  {selectedOrder.users.genre}
                </Descriptions.Item>
                <Descriptions.Item label="Birthdate">
                  {selectedOrder.users.birthdate}
                </Descriptions.Item>
                <Descriptions.Item label="Avatar">
                  <Image
                    src={selectedOrder.users.avatar}
                    alt="Avatar"
                    width={50}
                    height={50}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="User Created At">
                  {selectedOrder.users.created_at}
                </Descriptions.Item>
                <Descriptions.Item label="User Updated At">
                  {selectedOrder.users.updated_at}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </DefaultLayout>
  );
};

export default OrderPage;
