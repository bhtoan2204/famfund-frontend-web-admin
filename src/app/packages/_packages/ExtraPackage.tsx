"use client";

import {
  ExtraPackage,
  PackageExtraRepository,
} from "@/repository/package.repository";
import { PackageUseCase } from "@/usecase/package.usecase";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  Menu,
  Pagination,
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
  // State for sorting
  const [currentSortColumn, setCurrentSortColumn] = useState<string | null>(
    "id_extra_package",
  );
  const [sortBy, setSortBy] = useState<string>("id_extra_package");
  const [sortDesc, setSortDesc] = useState<boolean>(false);

  const handlePageChange = (page: number, pageSize: number) => {
    setExtraPage(page);
    setExtraItemsPerPage(pageSize);
  };

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
        <button
          onClick={() => handleSortChange("id_extra_package", false, true)}
          style={{ cursor: "pointer" }} // Make it look clickable
        >
          ID
        </button>
      ),
      dataIndex: "id_extra_package",
      key: "id_extra_package",
      sorter: true,
    },
    {
      title: (
        <button
          onClick={() => handleSortChange("name", false, true)}
          style={{ cursor: "pointer" }}
        >
          Name
        </button>
      ),
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: (
        <button
          onClick={() => handleSortChange("price", false, true)}
          style={{ cursor: "pointer" }}
        >
          Price
        </button>
      ),
      dataIndex: "price",
      key: "price",
      sorter: true,
    },
    {
      title: (
        <button
          onClick={() => handleSortChange("description", false, true)}
          style={{ cursor: "pointer" }}
        >
          Description
        </button>
      ),
      dataIndex: "description",
      key: "description",
      sorter: true,
    },
    {
      title: (
        <button
          onClick={() => handleSortChange("is_active", false, true)}
          style={{ cursor: "pointer" }}
        >
          Active
        </button>
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
        <button
          onClick={() => handleSortChange("created_at", false, true)}
          style={{ cursor: "pointer" }}
        >
          Created At
        </button>
      ),
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
    },
    {
      title: (
        <button
          onClick={() => handleSortChange("updated_at", false, true)}
          style={{ cursor: "pointer" }}
        >
          Updated At
        </button>
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
          <button
            onClick={(e) => e.preventDefault()}
            style={{ display: "flex", alignItems: "center" }}
          >
            Order by <DownOutlined />
          </button>
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
