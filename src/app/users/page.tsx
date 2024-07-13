"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { AuthRepository } from "@/repository/user.repository";
import { AuthUseCase } from "@/usecase/auth.usecase";
import {
  Spin,
  Table,
  Input,
  Space,
  Typography,
  Image,
  Button,
  Row,
  Col,
  Card,
  Modal,
} from "antd";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig,
} from "antd/es/table/interface";
import { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { WomanOutlined, ManOutlined, RestOutlined } from "@ant-design/icons";

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
  is_banned: boolean;
}

interface UserLoginInfo {
  id_user: string;
  loginCount: number;
  email: string;
  firstname: string;
  lastname: string;
  lastLogin: string;
  avatar: string;
}

const UsersPage = () => {
  const authUseCase = new AuthUseCase(new AuthRepository());

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id_user");
  const [sortDesc, setSortDesc] = useState(true);

  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [topUsersLogin, setTopUsersLogin] = useState<UserLoginInfo[]>([]);
  const [limit, setLimit] = useState(5);

  const [isBanModalVisible, setIsBanModalVisible] = useState(false);
  const [isUnbanModalVisible, setIsUnbanModalVisible] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");

  const [isUserDetailModalVisible, setIsUserDetailModalVisible] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const showUserDetailModal = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailModalVisible(true);
  };

  const fetchUsers = async () => {
    setLoading(true);
    console.log("fetching users");
    try {
      const response = await authUseCase.getUserList({
        page,
        itemsPerPage,
        search,
        sortBy,
        sortDesc,
      });
      setUsers(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopUsersLogin = async () => {
    setLoading(true);
    try {
      const response = await authUseCase.getTopUsersLogin(limit);
      setTopUsersLogin(response.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[],
    extra: TableCurrentDataSource<User>,
  ) => {
    console.log(sorter);
    const sort = Array.isArray(sorter) ? sorter[0] : sorter;
    setPage(pagination.current || 1);
    setItemsPerPage(pagination.pageSize || 20);
    setSortBy((sort?.field as string) ?? "");
    setSortDesc(sort?.order === "ascend" ? true : false);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const banAccount = async (id: string) => {
    setTargetUserId(id);
    setIsBanModalVisible(true);
  };

  const unbanAccount = async (id: string) => {
    setTargetUserId(id);
    setIsUnbanModalVisible(true);
  };

  const handleBan = async () => {
    try {
      await authUseCase.banUser(targetUserId);
      setIsBanModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnban = async () => {
    try {
      await authUseCase.unbanUser(targetUserId);
      setIsUnbanModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy === field) {
      return sortDesc ? "↓" : "↑";
    }
    return null;
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page, itemsPerPage, sortBy, sortDesc]);

  useEffect(() => {
    fetchTopUsersLogin();
  }, [limit]);

  const columns = [
    {
      title: <StyledTitle>Avatar</StyledTitle>,
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) => (
        <Image
          src={avatar}
          alt="Avatar"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: (
        <StyledTitle onClick={() => handleSort("id_user")}>
          ID {getSortIcon("id_user")}
        </StyledTitle>
      ),
      dataIndex: "id_user",
      key: "id_user",
      render: (id_user: string, record: User) => (
        <Typography.Link onClick={() => showUserDetailModal(record)}>
          {id_user}
        </Typography.Link>
      ),
    },
    {
      title: (
        <StyledTitle onClick={() => handleSort("email")}>
          Email {getSortIcon("email")}
        </StyledTitle>
      ),
      dataIndex: "email",
      key: "email",
    },
    {
      title: (
        <StyledTitle onClick={() => handleSort("phone")}>
          Phone {getSortIcon("phone")}
        </StyledTitle>
      ),
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => <Typography>{phone || "N/A"}</Typography>,
    },
    {
      title: (
        <StyledTitle onClick={() => handleSort("firstname")}>
          First Name {getSortIcon("firstname")}
        </StyledTitle>
      ),
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: (
        <StyledTitle onClick={() => handleSort("lastname")}>
          Last Name {getSortIcon("lastname")}
        </StyledTitle>
      ),
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: (
        <StyledTitle onClick={() => handleSort("created_at")}>
          Joined At {getSortIcon("created_at")}
        </StyledTitle>
      ),
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => (
        <span>{moment(created_at).format("D MMM, YYYY")}</span>
      ),
    },
    {
      title: (
        <StyledTitle onClick={() => handleSort("login_type")}>
          Login Type {getSortIcon("login_type")}
        </StyledTitle>
      ),
      dataIndex: "login_type",
      key: "login_type",
    },
    {
      title: (
        <StyledTitle onClick={() => handleSort("genre")}>
          Gender {getSortIcon("genre")}
        </StyledTitle>
      ),
      dataIndex: "genre",
      key: "genre",
      render: (text: string) => (
        <Space>
          {text === "male" && <ManOutlined style={{ color: "#1890ff" }} />}
          {text === "female" && <WomanOutlined style={{ color: "#ff4d4f" }} />}
          {text === "unknown" && <RestOutlined style={{ color: "#000000" }} />}
          <Typography>{text}</Typography>
        </Space>
      ),
    },
    {
      title: (
        <StyledTitle onClick={() => handleSort("birthdate")}>
          Birthdate {getSortIcon("birthdate")}
        </StyledTitle>
      ),
      dataIndex: "birthdate",
      key: "birthdate",
      render: (birthdate: string) => (
        <span>{moment(birthdate).format("D MMM, YYYY")}</span>
      ),
    },
    {
      title: <StyledTitle>Action</StyledTitle>,
      dataIndex: "action",
      key: "action",
      render: (text: string, record: User) => (
        <>
          {record.is_banned ? (
            <Button
              type="primary"
              ghost
              onClick={() => unbanAccount(record.id_user)}
            >
              Unban account
            </Button>
          ) : (
            <Button
              type="primary"
              danger
              onClick={() => banAccount(record.id_user)}
            >
              Ban account
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <Typography.Title>Users</Typography.Title>
      <StyledContainer>
        <StyledSpace>
          <Input.Search
            placeholder="Search by email, phone, name..."
            onSearch={handleSearch}
            enterButton
            size="large"
          />
        </StyledSpace>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Spin spinning={loading} tip="Loading users...">
              <Table
                dataSource={users}
                columns={columns}
                rowKey="id_user"
                pagination={{
                  current: page,
                  pageSize: itemsPerPage,
                  total: total,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                }}
                onChange={handleTableChange}
                scroll={{ x: "max-content" }}
              />
            </Spin>
          </Col>
          <Col span={8}>
            <CompactCard title="Top Users Login this Week">
              <CompactList>
                {topUsersLogin.map((user) => (
                  <CompactListItem key={user.id_user}>
                    <Image
                      src={user.avatar}
                      alt={user.firstname + "" + user.lastname}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        marginRight: 16,
                      }}
                    />
                    <CompactUserInfo>
                      <Typography.Text strong>
                        {user.firstname} {user.lastname}
                      </Typography.Text>
                      <Typography.Text>ID: {user.id_user}</Typography.Text>
                      <Typography.Text>Email: {user.email}</Typography.Text>
                      <Typography.Text>
                        Login Count: {user.loginCount}
                      </Typography.Text>
                      <Typography.Text>
                        Last Login:{" "}
                        {moment(user.lastLogin).format("D MMM, YYYY HH:mm")}
                      </Typography.Text>
                    </CompactUserInfo>
                  </CompactListItem>
                ))}
              </CompactList>
            </CompactCard>
          </Col>
        </Row>
        <Modal
          title="Ban User"
          open={isBanModalVisible}
          onOk={handleBan}
          onCancel={() => setIsBanModalVisible(false)}
        >
          <p>Are you sure you want to ban this user?</p>
        </Modal>
        <Modal
          title="Unban User"
          open={isUnbanModalVisible}
          onOk={handleUnban}
          onCancel={() => setIsUnbanModalVisible(false)}
        >
          <p>Are you sure you want to unban this user?</p>
        </Modal>
        <Modal
          title="User Details"
          open={isUserDetailModalVisible}
          onOk={() => setIsUserDetailModalVisible(false)}
          onCancel={() => setIsUserDetailModalVisible(false)}
          width={500}
          style={{ top: 20 }}
        >
          {selectedUser && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Image
                src={selectedUser.avatar}
                alt="Avatar"
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  marginBottom: 20,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h3 style={{ marginBottom: 10 }}>
                  {selectedUser.firstname} {selectedUser.lastname}
                </h3>
                <p style={{ marginBottom: 5 }}>{selectedUser.email}</p>
                <p style={{ marginBottom: 5 }}>
                  Joined:{" "}
                  {moment(selectedUser.created_at).format("D MMM, YYYY")}
                </p>
              </div>

              <div
                style={{
                  marginTop: 20,
                  width: "100%",
                  borderTop: "1px solid #ccc",
                  paddingTop: 20,
                }}
              >
                <p style={{ marginBottom: 5 }}>
                  <strong>Phone:</strong> {selectedUser.phone}
                </p>
                <p style={{ marginBottom: 5 }}>
                  <strong>Login Type:</strong> {selectedUser.login_type}
                </p>
                <p style={{ marginBottom: 5 }}>
                  <strong>Gender:</strong> {selectedUser.genre}
                </p>
                <p style={{ marginBottom: 5 }}>
                  <strong>Birthdate:</strong>{" "}
                  {moment(selectedUser.birthdate).format("D MMM, YYYY")}
                </p>
                <p style={{ marginBottom: 5 }}>
                  <strong>Banned:</strong>{" "}
                  {selectedUser.is_banned ? "Yes" : "No"}
                </p>
                <p style={{ marginBottom: 5 }}>
                  <strong>Phone Verified:</strong>{" "}
                  {selectedUser.isphoneverified ? "Yes" : "No"}
                </p>
                <p style={{ marginBottom: 5 }}>
                  <strong>Admin:</strong> {selectedUser.isadmin ? "Yes" : "No"}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </StyledContainer>
    </DefaultLayout>
  );
};

export default UsersPage;

// ... (Styled Components remain the same)
const CompactCard = styled(Card)`
  .ant-card-head {
    background-color: #fafafa;
    font-weight: bold;
    text-align: center;
  }
`;

const CompactList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

const CompactListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CompactUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;

  & > .ant-typography {
    margin-bottom: 4px;
  }
`;

// Styled Components
const StyledContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
`;

const StyledSpace = styled(Space)`
  margin-bottom: 16px;
  width: 100%;
  justify-content: left;
`;

const StyledTitle = styled(Typography.Text)`
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;
