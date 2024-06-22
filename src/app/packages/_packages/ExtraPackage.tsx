"use client";

import {
  ExtraPackage,
  PackageExtraRepository,
} from "@/repository/package.repository";
import { PackageUseCase } from "@/usecase/package.usecase";
import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Pagination,
  Space,
  Tag,
  Dropdown,
  Menu,
} from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";

export function ExtraPackageTab() {
  const [extraPackage, setExtraPackage] = useState<ExtraPackage[]>([]);
  const [extraPage, setExtraPage] = useState<number>(1);
  const [extraItemsPerPage, setExtraItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  // State for sorting
  const [currentSortColumn, setCurrentSortColumn] = useState<string | null>(
    "id_extra_package",
  );
  const [sortBy, setSortBy] = useState<string>("id_extra_package");
  const [sortDesc, setSortDesc] = useState<boolean>(false);

  const extraPackageUsecase = new PackageUseCase(new PackageExtraRepository());

  const fetchExtraPackage = async () => {
    setLoading(true);
    try {
      const response = await extraPackageUsecase.getPackages({
        page: extraPage,
        itemsPerPage: extraItemsPerPage,
        search: searchText,
        sortBy: sortBy,
        sortDesc: sortDesc,
      });
      setExtraPackage(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setExtraPage(page);
    setExtraItemsPerPage(pageSize);
  };

  useEffect(() => {
    fetchExtraPackage();
  }, [extraPage, extraItemsPerPage, searchText, sortBy, sortDesc]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setExtraPage(1); // Reset to the first page when searching
  };

  // Function to handle sorting changes
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
          onClick={() => handleSortChange("id_extra_package", false, true)}
          style={{ cursor: "pointer" }} // Make it look clickable
        >
          ID
        </div>
      ),
      dataIndex: "id_extra_package",
      key: "id_extra_package",
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
      sorter: true,
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
      render: (_: any, record: ExtraPackage) => (
        <Space size="middle">
          <Button type="default">Update</Button>
          <Button type="dashed">Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Input
          placeholder="Search extra packages..."
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          style={{ marginRight: 16, flex: 1 }}
        />
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                onClick={() => handleSortChange("id_extra_package", false)}
              >
                Ascending
              </Menu.Item>
              <Menu.Item
                onClick={() => handleSortChange("id_extra_package", true)}
              >
                Descending
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <a
            onClick={(e) => e.preventDefault()}
            style={{ display: "flex", alignItems: "center" }}
          >
            Order by <DownOutlined />
          </a>
        </Dropdown>
      </div>
      <Table
        columns={columns}
        dataSource={extraPackage}
        loading={loading}
        pagination={false}
        rowKey={(record) => record.id_extra_package}
        onChange={(_, __, sorter) => {
          const { field, order } = sorter as any;
          handleSortChange(field, order === "descend");
        }}
      />
      <Pagination
        current={extraPage}
        pageSize={extraItemsPerPage}
        total={extraPackage.length}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: "right" }}
      />
    </div>
  );
}
