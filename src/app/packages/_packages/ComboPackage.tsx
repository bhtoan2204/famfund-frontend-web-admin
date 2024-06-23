"use client";

import {
  ComboPackage,
  CreateComboPackage,
  EditComboPackage,
  ExtraPackage,
  PackageComboRepository,
  PackageExtraRepository,
} from "@/repository/package.repository";
import { PackageUseCase } from "@/usecase/package.usecase";
import { SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Descriptions,
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

export function ComboPackageTab() {
  const [comboPackage, setComboPackage] = useState<ComboPackage[]>([]);
  const [extraPackages, setExtraPackages] = useState<ExtraPackage[]>([]);

  const [comboPage, setComboPage] = useState<number>(1);
  const [comboItemsPerPage, setComboItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<ComboPackage | null>(null);

  const comboPackageUsecase = new PackageUseCase(new PackageComboRepository());

  const extraPackageUsecase = new PackageUseCase(new PackageExtraRepository());
  useEffect(() => {
    const fetchExtraPackage = async () => {
      setLoading(true);
      try {
        const response = await extraPackageUsecase.getPackages({
          page: 1,
          itemsPerPage: 100,
          search: "",
          sortBy: "id_extra_package",
          sortDesc: false,
        });
        setExtraPackages(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExtraPackage();
  }, []);

  useEffect(() => {
    const fetchComboPackage = async () => {
      setLoading(true);
      try {
        const response = await comboPackageUsecase.getPackages({
          page: comboPage,
          itemsPerPage: comboItemsPerPage,
          search: searchText,
          sortBy: "id_combo_package", // Use the state variable for sorting
          sortDesc: true,
        });
        setComboPackage(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComboPackage();
  }, [comboPage, comboItemsPerPage, searchText]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setComboPage(1);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setComboPage(page);
    setComboItemsPerPage(pageSize);
  };

  const showModal = (combo: ComboPackage) => {
    setSelectedCombo(combo);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id_combo_package",
      key: "id_combo_package",
      sorter: {
        compare: (a: ComboPackage, b: ComboPackage) =>
          a.id_combo_package - b.id_combo_package,
        multiple: 6,
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: {
        compare: (a: ComboPackage, b: ComboPackage) => {
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
        compare: (a: ComboPackage, b: ComboPackage) =>
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
        compare: (a: ComboPackage, b: ComboPackage) =>
          a.is_active === b.is_active ? 0 : a.is_active ? 1 : -1,
        multiple: 3,
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: {
        compare: (a: ComboPackage, b: ComboPackage) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        multiple: 2,
      },
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: {
        compare: (a: ComboPackage, b: ComboPackage) =>
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
        multiple: 1,
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ComboPackage) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>
            Detail
          </Button>
          <Button type="default" onClick={() => handleEditButtonClick(record)}>
            Update
          </Button>
          <Button
            type="default"
            className="bg-rose-500"
            onClick={() => handleDeleteButtonClick(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleCreateButtonClick = () => {
    setIsCreateModalVisible(true);
  };

  const handleEditButtonClick = (record: ComboPackage) => {
    form.setFieldValue("name", record.name);
    form.setFieldValue("description", record.description);
    form.setFieldValue("price", parseInt(record.price.slice(1)));
    form.setFieldValue("id_package_extra", [
      ...record.id_package_extra.map(
        (extraPackage) => extraPackage.id_extra_package,
      ),
    ]);
    form.setFieldValue("is_active", record.is_active);
    setSelectedCombo(record);
    setIsEditModalVisible(true);
  };

  const handleDeleteButtonClick = (record: ComboPackage) => {
    setSelectedCombo(record);
    setIsDeleteModalVisible(true);
  };

  const onEditCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const onCreateCancel = () => {
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const onDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    form.resetFields();
  };

  const handleEditFormSubmit = (values: any) => {
    comboPackageUsecase
      .updatePackage({
        id_combo_package: selectedCombo?.id_combo_package!,
        name: values.name,
        description: values.description,
        price: parseInt(values.price),
        is_active: values.is_active,
        id_package_extra: values.id_package_extra,
      } as EditComboPackage)
      .then((res) => {
        setComboPackage((prev) =>
          prev.map((combo) =>
            combo.id_combo_package === res.data.data.id_combo_package
              ? {
                  ...res.data.data,
                  price: `$${res.data.data.price}.00`,
                  id_package_extra: res.data.data.id_package_extra,
                }
              : combo,
          ),
        );
        onEditCancel();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleCreateFormSubmit = (values: any) => {
    comboPackageUsecase
      .createPackage({
        name: values.name,
        description: values.description,
        price: parseInt(values.price),
        id_package_extra: values.id_package_extra,
      } as CreateComboPackage)
      .then((res) => {
        if (comboPackage.length === 0) {
          comboPackageUsecase
            .getPackages({
              page: comboPage,
              itemsPerPage: comboItemsPerPage,
              search: searchText,
              sortBy: "id_combo_package", // Use the state variable for sorting
              sortDesc: true,
            })
            .then((response) => {
              setComboPackage(response.data.data);
            });
        } else {
          setComboPackage((prev) => [
            ...prev,
            { ...res.data.data, price: `$${res.data.data.price}.00` },
          ]);
        }
        onCreateCancel();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleDeleteOk = () => {
    comboPackageUsecase
      .deletePackage(selectedCombo?.id_combo_package!)
      .then(() => {
        setComboPackage((prev) =>
          prev.filter(
            (combo) =>
              combo.id_combo_package !== selectedCombo?.id_combo_package,
          ),
        );
        onDeleteCancel();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <Input
          placeholder="Search combo packages..."
          prefix={<SearchOutlined />}
          onChange={handleSearch}
        />
        <Button
          type="default"
          className="ml-auto"
          onClick={handleCreateButtonClick}
        >
          Add
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={comboPackage}
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={comboPage}
        pageSize={comboItemsPerPage}
        total={comboPackage.length}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: "right" }}
      />

      <Modal
        title="Extra Packages Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {selectedCombo && (
          <Descriptions
            title={"Package Name: " + selectedCombo.name}
            bordered
            column={1}
          >
            {selectedCombo.id_package_extra.map((extraPackage) => (
              <Descriptions.Item
                label={extraPackage.name}
                key={extraPackage.id_extra_package}
              >
                <Badge.Ribbon text={`${extraPackage.price}`} color="blue">
                  <span>{extraPackage.description ?? "No description"}</span>
                </Badge.Ribbon>
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </Modal>
      <Modal
        title="Create Combo Package"
        onOk={form.submit}
        onCancel={onCreateCancel}
        open={isCreateModalVisible}
        okButtonProps={{
          type: "default",
        }}
      >
        <Form
          onFinish={handleCreateFormSubmit}
          form={form}
          labelCol={{ span: 15 }}
          layout="vertical"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name of the combo package!",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the desription of the combo package!",
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
            label="Extra Packages (Multi-chosen)"
            name="id_package_extra"
            rules={[
              {
                required: true,
                message: "Please select the extra package(s)!",
              },
            ]}
          >
            <Select mode="multiple">
              {extraPackages.map(
                (extraPackage) =>
                  extraPackage.is_active && (
                    <Select.Option
                      value={extraPackage.id_extra_package}
                      key={extraPackage.id_extra_package}
                    >
                      <div className="flex items-center justify-between">
                        <div>{extraPackage.name}</div>
                        <div className="text-red">{extraPackage.price}</div>
                      </div>
                    </Select.Option>
                  ),
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Do you want to delete this package?"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={onDeleteCancel}
        okButtonProps={{
          type: "default",
        }}
      />
      <Modal
        title="Edit Combo Package"
        onOk={form.submit}
        onCancel={onEditCancel}
        open={isEditModalVisible}
        okButtonProps={{
          type: "default",
        }}
      >
        <Form
          onFinish={handleEditFormSubmit}
          form={form}
          labelCol={{ span: 15 }}
          layout="vertical"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name of the combo package!",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the desription of the combo package!",
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
            label="Extra Packages (Multi-chosen)"
            name="id_package_extra"
            rules={[
              {
                required: true,
                message: "Please select the extra package(s)!",
              },
            ]}
          >
            <Select mode="multiple">
              {extraPackages.map(
                (extraPackage) =>
                  extraPackage.is_active && (
                    <Select.Option
                      value={extraPackage.id_extra_package}
                      key={extraPackage.id_extra_package}
                    >
                      <div className="flex items-center justify-between">
                        <div>{extraPackage.name}</div>
                        <div className="text-red">{extraPackage.price}</div>
                      </div>
                    </Select.Option>
                  ),
              )}
            </Select>
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
