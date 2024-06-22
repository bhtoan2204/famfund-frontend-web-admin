"use client";

import {
  MainPackage,
  PackageMainRepository,
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

export function MainPackageTab() {
  const [mainPackage, setMainPackage] = useState<MainPackage[]>([]);

  const [mainPage, setMainPage] = useState<number>(1);
  const [mainItemsPerPage, setMainItemsPerPage] = useState<number>(10);

  const [loading, setLoading] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>("");

  const [currentSortColumn, setCurrentSortColumn] = useState<string | null>(
    "id_main_package",
  );
  const [sortBy, setSortBy] = useState<string>("id_main_package");
  const [sortDesc, setSortDesc] = useState<boolean>(false);

  const mainPackageUsecase = new PackageUseCase(new PackageMainRepository());

  const fetchMainPackage = async () => {
    setLoading(true);
    try {
      const response = await mainPackageUsecase.getPackages({
        page: mainPage,
        itemsPerPage: mainItemsPerPage,
        search: searchText,
        sortBy: sortBy,
        sortDesc: sortDesc,
      });
      console.log(response.data);
      setMainPackage(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMainPackage();
  }, [mainPage, mainItemsPerPage, searchText, sortBy, sortDesc]);

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
      title: (
        <div
          onClick={() => handleSortChange("id_main_package", false, true)}
          style={{ cursor: "pointer" }} // Make it look clickable
        >
          ID
        </div>
      ),
      dataIndex: "id_main_package",
      key: "id_main_package",
      sorter: true,
    },
    {
      title: (
        <div
          onClick={() => handleSortChange("name", false, true)}
          style={{ cursor: "pointer" }} // Make it look clickable
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
          onClick={() => handleSortChange("description", false, true)}
          style={{ cursor: "pointer" }} // Make it look clickable
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
          onClick={() => handleSortChange("price", false, true)}
          style={{ cursor: "pointer" }} // Make it look clickable
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
          onClick={() => handleSortChange("duration_months", false, true)}
          style={{ cursor: "pointer" }} // Make it look clickable
        >
          Duration (Months)
        </div>
      ),
      dataIndex: "duration",
      key: "duration_months",
      sorter: true,
    },
    {
      title: (
        <div
          onClick={() => handleSortChange("is_active", false, true)}
          style={{ cursor: "pointer" }} // Make it look clickable
        >
          Status
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
          style={{ cursor: "pointer" }} // Make it look clickable
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
          style={{ cursor: "pointer" }} // Make it look clickable
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
      render: (_: any, record: MainPackage) => (
        <Space size="middle">
          <Button type="default">Update</Button>
          <Button type="dashed">Delete</Button>
        </Space>
      ),
      sorter: true,
    },
  ];

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

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Input
          placeholder="Search main packages..."
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          style={{ marginBottom: 16 }}
        />
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                onClick={() => handleSortChange("id_main_package", false)}
              >
                Ascending
              </Menu.Item>
              <Menu.Item
                onClick={() => handleSortChange("id_main_package", true)}
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
        dataSource={mainPackage}
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={mainPage}
        pageSize={mainItemsPerPage}
        total={mainPackage.length ? mainPackage.length : 0}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: "right" }}
      />
    </div>
  );
}
