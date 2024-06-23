"use client";

import {
  CreatePackage,
  MainPackage,
  PackageMainRepository,
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

export function MainPackageTab() {
  const [mainPackage, setMainPackage] = useState<MainPackage[]>([]);

  const [mainPage, setMainPage] = useState<number>(1);
  const [mainItemsPerPage, setMainItemsPerPage] = useState<number>(10);

  const [loading, setLoading] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>("");

  const [selectedMainPackage, setSelectedMainPackage] =
    useState<MainPackage | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);

  const mainPackageUsecase = new PackageUseCase(new PackageMainRepository());

  useEffect(() => {
    const fetchMainPackage = async () => {
      setLoading(true);
      try {
        const response = await mainPackageUsecase.getPackages({
          page: mainPage,
          itemsPerPage: mainItemsPerPage,
          search: searchText,
          sortBy: "id_main_package",
          sortDesc: true,
        });
        setMainPackage(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMainPackage();
  }, [mainPage, mainItemsPerPage, searchText]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setMainPage(1);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setMainPage(page);
    setMainItemsPerPage(pageSize);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id_main_package",
      key: "id_main_package",
      sorter: {
        compare: (a: MainPackage, b: MainPackage) =>
          a.id_main_package - b.id_main_package,
        multiple: 7,
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: {
        compare: (a: MainPackage, b: MainPackage) =>
          a.name.localeCompare(b.name),
        multiple: 6,
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: {
        compare: (a: MainPackage, b: MainPackage) =>
          parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1)),
        multiple: 5,
      },
    },
    {
      title: "Duration (Months)",
      dataIndex: "duration_months",
      key: "duration_months",
      sorter: {
        compare: (a: MainPackage, b: MainPackage) =>
          a.duration_months - b.duration_months,
        multiple: 4,
      },
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
        compare: (a: MainPackage, b: MainPackage) =>
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
        compare: (a: MainPackage, b: MainPackage) =>
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
        compare: (a: MainPackage, b: MainPackage) =>
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
        multiple: 1,
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: MainPackage) => (
        <Space size="middle">
          <Button type="default" onClick={() => handleEditButtonClick(record)}>
            Update
          </Button>
          <Button
            type="default"
            className="bg-rose-500 text-white"
            onClick={() => handleDeleteButtonClick(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleEditButtonClick = (record: MainPackage) => {
    form.setFieldValue("name", record.name);
    form.setFieldValue("description", record.description);
    form.setFieldValue("price", parseInt(record.price.slice(1)));
    form.setFieldValue("duration_months", record.duration_months);
    form.setFieldValue("is_active", record.is_active);
    setSelectedMainPackage(record);
    setIsEditModalVisible(true);
  };

  const handleDeleteButtonClick = (record: MainPackage) => {
    setIsDeleteModalVisible(true);
    setSelectedMainPackage(record);
  };

  const handleCreateButtonClick = () => {
    setIsCreateModalVisible(true);
  };

  const handleDeleteOk = () => {
    mainPackageUsecase
      .deletePackage(selectedMainPackage?.id_main_package!)
      .then(() => {
        setMainPackage((prev) =>
          prev.filter(
            (mainPackage) =>
              mainPackage.id_main_package !==
              selectedMainPackage?.id_main_package,
          ),
        );
        setIsDeleteModalVisible(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        mainPackageUsecase
          .updatePackage({
            id_main_package: selectedMainPackage?.id_main_package!,
            name: values.name,
            description: values.description,
            price: values.price,
            duration_months: parseInt(values.duration_months),
            is_active: values.is_active,
          })
          .then((response) => {
            setMainPackage((prev) =>
              prev.map((mainPackage) =>
                mainPackage.id_main_package ===
                response.data.data?.id_main_package
                  ? {
                      ...response.data.data,
                      price: `$${response.data.data.price}.00`,
                    }
                  : mainPackage,
              ),
            );
            setIsEditModalVisible(false);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCreateFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        mainPackageUsecase
          .createPackage({
            name: values.name,
            description: values.description,
            price: values.price,
            duration_months: parseInt(values.duration_months),
          } as CreatePackage)
          .then((response) => {
            setMainPackage((prev) =>
              prev.concat({
                ...response.data.data,
                price: `$${response.data.data.price}.00`,
              }),
            );
            setIsCreateModalVisible(false);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className="mb-4 flex flex-row items-center gap-4">
        <Input
          placeholder="Search main packages..."
          prefix={<SearchOutlined />}
          onChange={handleSearch}
        />
        <Button type="default" onClick={handleCreateButtonClick}>
          Add
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={mainPackage}
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={mainPage}
        pageSize={mainItemsPerPage}
        total={mainPackage ? mainPackage.length : 0}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: "right" }}
      />
      <Modal
        title="Edit Main Package"
        open={isEditModalVisible}
        onOk={form.submit}
        onCancel={handleCancel}
        okButtonProps={{
          type: "default",
        }}
      >
        <Form
          onFinish={handleFormSubmit}
          form={form}
          labelCol={{ span: 8 }}
          layout="vertical"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name of the main package!",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please input the description of the main package!",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
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
          <Form.Item
            name="duration_months"
            label="Duration (Month(s))"
            rules={[
              {
                required: true,
                message: "Please input duration of the main package!",
                pattern: new RegExp(/^\d+$/),
              },
            ]}
          >
            <Input type="number" />
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
      <Modal
        title="Do you want to delete this package?"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
      />
      <Modal
        title="Add Main Package"
        open={isCreateModalVisible}
        onOk={form.submit}
        onCancel={handleCreateCancel}
        okButtonProps={{
          type: "default",
        }}
      >
        <Form
          onFinish={handleCreateFormSubmit}
          form={form}
          labelCol={{ span: 8 }}
          layout="vertical"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name of the main package!",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please input the description of the main package!",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
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
          <Form.Item
            name="duration_months"
            label="Duration (Month(s))"
            rules={[
              {
                required: true,
                message: "Please input duration of the main package!",
                pattern: new RegExp(/^\d+$/),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
