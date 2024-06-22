"use client";

import {
  ComboPackage,
  ExtraPackage,
  PackageComboRepository,
} from "@/repository/package.repository";
import { PackageUseCase } from "@/usecase/package.usecase";
import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Pagination,
  Modal,
  Space,
  Tag,
  Dropdown,
  Menu,
  Descriptions,
  Badge,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

export function ComboPackageTab() {
  const [comboPackage, setComboPackage] = useState<ComboPackage[]>([]);
  const [extraPackages, setExtraPackages] = useState<ExtraPackage[]>([]);

  const [comboPage, setComboPage] = useState<number>(1);
  const [comboItemsPerPage, setComboItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<ComboPackage | null>(null);
  // State for sorting
  const [currentSortColumn, setCurrentSortColumn] = useState<string | null>(
    "id_combo_package",
  );
  const [sortBy, setSortBy] = useState<string>("id_combo_package");
  const [sortDesc, setSortDesc] = useState<boolean>(false);

  const comboPackageUsecase = new PackageUseCase(new PackageComboRepository());

  const fetchComboPackage = async () => {
    setLoading(true);
    try {
      const response = await comboPackageUsecase.getPackages({
        page: comboPage,
        itemsPerPage: comboItemsPerPage,
        search: searchText,
        sortBy: sortBy, // Use the state variable for sorting
        sortDesc: sortDesc,
      });
      console.log(response.data);
      setComboPackage(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComboPackage();
  }, [comboPage, comboItemsPerPage, searchText, sortBy, sortDesc]);

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

  const handleSortChange = (
    newSortBy: string,
    newSortDesc: boolean,
    fromColumn: boolean = false,
  ) => {
    if (fromColumn && newSortBy === currentSortColumn) {
      setSortDesc(!sortDesc);
    } else {
      setSortDesc(newSortDesc);
    }

    setSortBy(newSortBy);
    setCurrentSortColumn(newSortBy);
  };

  const columns = [
    {
      title: (
        <div
          onClick={() => handleSortChange("id_combo_package", false, true)}
          style={{ cursor: "pointer" }} // Make it look clickable
        >
          ID
        </div>
      ),
      dataIndex: "id_combo_package",
      key: "id_combo_package",
      sorter: true,
    },
    {
      title: (
        <div
          onClick={() => handleSortChange("name", false, true)}
          style={{ cursor: "pointer" }}
        >
          Name
        </div>
      ),
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: (
        <div
          onClick={() => handleSortChange("price", false, true)}
          style={{ cursor: "pointer" }}
        >
          Price
        </div>
      ),
      dataIndex: "price",
      key: "price",
      sorter: true,
    },
    {
      title: (
        <div
          onClick={() => handleSortChange("description", false, true)}
          style={{ cursor: "pointer" }}
        >
          Description
        </div>
      ),
      dataIndex: "description",
      key: "description",
    },
    {
      title: (
        <div
          onClick={() => handleSortChange("is_active", false, true)}
          style={{ cursor: "pointer" }}
        >
          Active
        </div>
      ),
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active: boolean) => (
        <Tag color={is_active ? "green" : "red"}>
          {is_active ? "Active" : "Inactive"}
        </Tag>
      ),
      sorter: true,
    },
    {
      title: (
        <div
          onClick={() => handleSortChange("created_at", false, true)}
          style={{ cursor: "pointer" }}
        >
          Created At
        </div>
      ),
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
    },
    {
      title: (
        <div
          onClick={() => handleSortChange("updated_at", false, true)}
          style={{ cursor: "pointer" }}
        >
          Updated At
        </div>
      ),
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ComboPackage) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>
            Detail
          </Button>
          <Button type="default">Update</Button>
          <Button type="dashed">Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Input
        placeholder="Search combo packages..."
        prefix={<SearchOutlined />}
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={comboPackage}
        loading={loading}
        pagination={false}
        rowKey={(record) => record.id_combo_package}
        onChange={(_, __, sorter) => {
          const { field, order } = sorter as any; // Type assertion for sorter object
          handleSortChange(field, order === "descend");
        }}
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
                  <span>{extraPackage.description || "No description"}</span>
                </Badge.Ribbon>
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
