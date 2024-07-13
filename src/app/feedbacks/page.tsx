"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  FeedBack,
  FeedbackRepository,
  FeedbackStats,
} from "@/repository/feedback.repository";
import { FeedbackUseCase } from "@/usecase/feedback.usecase";
import { LikeOutlined, StarOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Pagination,
  Row,
  Spin,
  Statistic,
  Table,
  Typography,
} from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<FeedBack[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [totalFeedbacks, setTotalFeedbacks] = useState<number>(0);
  const [sortBy, setSortBy] = useState("id_feedback");
  const [sortDesc, setSortDesc] = useState(false);

  const feedbackUsecase = new FeedbackUseCase(new FeedbackRepository());

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      console.log({
        page,
        itemsPerPage: 10,
        search,
        sortBy,
        sortDesc,
      });
      try {
        const response = await feedbackUsecase.getFeedbacks({
          page,
          itemsPerPage: 10,
          search,
          sortBy,
          sortDesc,
        });
        setTotalFeedbacks(response.total);
        setFeedbacks(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    const fetchStats = async () => {
      setIsStatsLoading(true);
      try {
        const response = await feedbackUsecase.getFeedbackStats();
        setFeedbackStats(response.data);
        setIsStatsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
    fetchStats();
  }, [page, search, sortBy, sortDesc]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(false);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy === field) {
      return sortDesc ? "↓" : "↑";
    }
    return null;
  };

  const columns = [
    {
      title: (
        <StyledTitle
          onClick={() => handleSort("id_feedback")}
          isActive={sortBy === "id_feedback"}
        >
          ID {getSortIcon("id_feedback")}
        </StyledTitle>
      ),
      dataIndex: "id_feedback",
      key: "id_feedback",
      sorter: true,
    },
    {
      title: (
        <StyledTitle
          onClick={() => handleSort("user")}
          isActive={sortBy === "user"}
        >
          User {getSortIcon("user")}
        </StyledTitle>
      ),
      dataIndex: "user",
      key: "user",
      render: (user: any) => (
        <div className="flex items-center gap-2">
          <Image
            src={user.avatar}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="ml-2">
            {user.firstname} {user.lastname}
          </span>
        </div>
      ),
    },
    {
      title: <StyledTitle>Comment</StyledTitle>,
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
    },
    {
      title: (
        <StyledTitle
          onClick={() => handleSort("rating")}
          isActive={sortBy === "rating"}
        >
          Rating {getSortIcon("rating")}
        </StyledTitle>
      ),
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`mr-1 ${rating > i ? "text-yellow-400" : "text-gray-400"}`}
            >
              ★
            </span>
          ))}
        </div>
      ),
    },
    {
      title: (
        <StyledTitle
          onClick={() => handleSort("created_at")}
          isActive={sortBy === "created_at"}
        >
          Created At {getSortIcon("created_at")}
        </StyledTitle>
      ),
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => new Date(created_at).toLocaleString(),
    },
  ];

  return (
    <DefaultLayout>
      <Typography.Title>Feedback</Typography.Title>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Spin spinning={isStatsLoading}>
            <div className="flex justify-center">
              <Row gutter={16} className="w-full">
                <Col span={12}>
                  <Card className="bg-gray-100">
                    <Statistic
                      title="Total Feedbacks"
                      value={feedbackStats?.totalFeedbacks || 0}
                      prefix={<LikeOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="bg-gray-100">
                    <Statistic
                      title="Average Rating"
                      value={
                        Math.round((feedbackStats?.averageRating || 0) * 100) /
                          100 || 0
                      }
                      suffix="/5"
                      prefix={<StarOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Spin>
          <Card className="rounded-lg bg-white shadow-md">
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={feedbacks}
                pagination={false}
                className="mb-4"
                onChange={(pagination, filters, sorter) => {
                  const sort = Array.isArray(sorter) ? sorter[0] : sorter;
                  handleSort(sort.field as string);
                }}
              />
            </Spin>
            <Pagination
              showQuickJumper
              defaultCurrent={1}
              total={totalFeedbacks}
              current={page}
              pageSize={20}
              onChange={(page) => setPage(page)}
            />
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
};

const StyledTitle = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? "#1890ff" : "inherit")};
  font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};

  &:hover {
    color: #1890ff;
  }
`;

export default FeedbackPage;
