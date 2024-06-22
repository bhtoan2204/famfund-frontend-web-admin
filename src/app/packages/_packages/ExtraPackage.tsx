"use client";

import {
  ExtraPackage,
  PackageExtraRepository,
} from "@/repository/package.repository";
import { PackageUseCase } from "@/usecase/package.usecase";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useEffect, useState } from "react";

export function ExtraPackageTab() {
  const [extraPackage, setExtraPackage] = useState<ExtraPackage[]>([]);
  const [extraPage, setExtraPage] = useState<number>(1);
  const [extraItemsPerPage, setExtraItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const handlePageChange = (page: number, pageSize: number) => {
    setExtraPage(page);
    setExtraItemsPerPage(pageSize);
  };

  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  const [selectedExtraPackage, setSelectedExtraPackage] =
    useState<ExtraPackage | null>(null);

  useEffect(() => {
    const extraPackageUsecase = new PackageUseCase(
      new PackageExtraRepository(),
    );
    const fetchExtraPackage = async () => {
      setLoading(true);
      try {
        const response = await extraPackageUsecase.getPackages({
          page: extraPage,
          itemsPerPage: extraItemsPerPage,
          search: searchText,
          sortBy: "id_extra_package",
          sortDesc: true,
        });
        setExtraPackage(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExtraPackage();
  }, [extraPage, extraItemsPerPage, searchText]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setExtraPage(1); // Reset to the first page when searching
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id_extra_package",
      key: "id_extra_package",
      sorter: {
        compare: (a: ExtraPackage, b: ExtraPackage) =>
          a.id_extra_package - b.id_extra_package,
        multiple: 6,
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: {
        compare: (a: ExtraPackage, b: ExtraPackage) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        },
        multiple: 5,
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: {
        compare: (a: ExtraPackage, b: ExtraPackage) =>
          parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1)),
        multiple: 4,
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active: boolean) => (
        <Tag color={is_active ? "green" : "red"}>
          {is_active ? "Active" : "Inactive"}
        </Tag>
      ),
      sorter: {
        compare: (a: ExtraPackage, b: ExtraPackage) =>
          a.is_active === b.is_active ? 0 : a.is_active ? 1 : -1,
        multiple: 3,
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => new Date(created_at).toLocaleString(),
      sorter: {
        compare: (a: ExtraPackage, b: ExtraPackage) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        multiple: 2,
      },
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (updated_at: string) => new Date(updated_at).toLocaleString(),
      sorter: {
        compare: (a: ExtraPackage, b: ExtraPackage) =>
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
        multiple: 1,
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ExtraPackage) => (
        <Space size="middle">
          <Button type="default" onClick={() => handleEditButtonClick(record)}>
            Update
          </Button>
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const handleEditButtonClick = (record: ExtraPackage) => {
    setSelectedExtraPackage(record);
    setIsEditModalVisible(true);
    form.setFieldValue("price", parseInt(record.price.slice(1)));
    form.setFieldValue("description", record.description);
    form.setFieldValue("is_active", record.is_active);
  };

  const handleEditFormSubmit = async (values: any) => {
    form.validateFields().then(async () => {
      const extraPackageUsecase = new PackageUseCase(
        new PackageExtraRepository(),
      );
      try {
        await extraPackageUsecase
          .updateExtraPackage({
            id_extra_package: selectedExtraPackage?.id_extra_package!,
            price: parseInt(values.price),
            description: values.description,
            is_active: values.is_active,
          })
          .then((response) => {
            console.log(response.data);
            setExtraPackage((prev) =>
              prev.map((extraPackage) =>
                extraPackage.id_extra_package ===
                response.data?.id_extra_package
                  ? {
                      ...response.data,
                      price: `$${response.data.price}.00`,
                    }
                  : extraPackage,
              ),
            );
            setIsEditModalVisible(false);
          });
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Input
          placeholder="Search extra packages..."
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          style={{ marginRight: 16, flex: 1 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={extraPackage}
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={extraPage}
        pageSize={extraItemsPerPage}
        total={extraPackage.length}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: "right" }}
      />
      <Modal
        title="Edit Extra Package"
        open={isEditModalVisible}
        onOk={form.submit}
        onCancel={handleEditCancel}
        okButtonProps={{
          type: "default",
        }}
      >
        <Form
          onFinish={handleEditFormSubmit}
          form={form}
          labelCol={{ span: 8 }}
          layout="vertical"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: "Please input the price of the main package!",
                pattern: new RegExp(/^\d+$/),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="Status"
            rules={[
              {
                required: true,
                message: "Please choose the status of the main package!",
              },
            ]}
          >
            <Select value={true}>
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
