"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  FeedBack,
  FeedbackRepository,
  FeedbackStats,
} from "@/repository/feedback.repository";
import { FeedbackUseCase } from "@/usecase/feedback.usecase";
import { LikeOutlined, SearchOutlined } from "@ant-design/icons";
import { Card, Col, Input, Pagination, Row, Statistic, Table } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<FeedBack[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalFeedbacks, setTotalFeedbacks] = useState<number>(0);

  const feedbackUsecase = new FeedbackUseCase(new FeedbackRepository());

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const response = await feedbackUsecase.getFeedbacks({
          page,
          itemsPerPage,
          search,
          sortBy: "id_feedback",
          sortDesc: false,
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
      try {
        const response = await feedbackUsecase.getFeedbackStats();
        setFeedbackStats(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
    fetchStats();
  }, [itemsPerPage, page, search]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_feedback",
      key: "id_feedback",
      sorter: {
        compare: (a: FeedBack, b: FeedBack) => a.id_feedback - b.id_feedback,
        multiple: 6,
      },
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: any) => (
        <div className="flex flex-row gap-2">
          <Image
            src={user.avatar}
            alt="avatar"
            width={30}
            height={30}
            style={{ width: 30, height: 30, borderRadius: "50%" }}
          />
          <span className="ml-2">
            {user.firstname} {user.lastname}
          </span>
        </div>
      ),
      sorter: {
        compare: (a: FeedBack, b: FeedBack) =>
          a.user.firstname.localeCompare(b.user.firstname),
        multiple: 5,
      },
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      sorter: {
        compare: (a: FeedBack, b: FeedBack) => a.rating - b.rating,
        multiple: 4,
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => new Date(created_at).toLocaleString(),
      sorter: {
        compare: (a: FeedBack, b: FeedBack) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        multiple: 3,
      },
    },
    {
      title: "Updated At",
      dataIndex: "created_at",
      key: "updated_at",
      render: (updated_at: string) => new Date(updated_at).toLocaleString(),
      sorter: {
        compare: (a: FeedBack, b: FeedBack) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        multiple: 3,
      },
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <DefaultLayout>
      <h1>Feedback</h1>
      <div>
        <Row gutter={16} className="mb-4">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Feedbacks"
                value={feedbackStats?.totalFeedbacks}
                prefix={<LikeOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Average Rating"
                value={feedbackStats?.averageRating}
                suffix="/5"
              />
            </Card>
          </Col>
          <Col span={12}></Col>
        </Row>
        <Card title="Feedback">
          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              onChange={handleSearch}
            />
          </div>
          <Table
            columns={columns}
            dataSource={feedbacks}
            loading={loading}
            pagination={false}
            className="mb-4"
          />
          <Pagination
            showQuickJumper
            defaultCurrent={1}
            total={totalFeedbacks}
            current={page}
            pageSize={itemsPerPage}
          />
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default FeedbackPage;
