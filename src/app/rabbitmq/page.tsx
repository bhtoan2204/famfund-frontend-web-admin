"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { RabbitmqRepository } from "@/repository/rabbitmq.repository";
import { RabbitmqUsecase } from "@/usecase/rabbitmq.use.case";
import {
  Card,
  Col,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
  InfoCircleOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

interface NodeStatistics {
  name: string;
  running: boolean;
  uptime: number;
  mem_used: number;
  mem_limit: number;
  mem_alarm: boolean;
  disk_free: number;
  disk_free_limit: number;
  disk_free_alarm: boolean;
  fd_used: number;
  fd_total: number;
  sockets_used: number;
  sockets_total: number;
  proc_used: number;
  proc_total: number;
  queue_declared: number;
  queue_created: number;
  queue_deleted: number;
  channel_created: number;
  channel_closed: number;
  connection_created: number;
  connection_closed: number;
  gc_num: number;
  gc_bytes_reclaimed: number;
  io_read_count: number;
  io_read_bytes: number;
  io_write_count: number;
  io_write_bytes: number;
  context_switches: number;
  run_queue: number;
  processors: number;
}

interface QueueStatistics {
  arguments: {};
  auto_delete: boolean;
  consumer_capacity: number;
  consumer_utilisation: number;
  consumers: number;
  durable: boolean;
  effective_policy_definition: {};
  exclusive: boolean;
  memory: number;
  message_bytes: number;
  message_bytes_paged_out: number;
  message_bytes_persistent: number;
  message_bytes_ram: number;
  message_bytes_ready: number;
  message_bytes_unacknowledged: number;
  message_stats: {
    ack: number;
    ack_details: {
      rate: number;
    };
    deliver: number;
    deliver_details: {
      rate: number;
    };
    deliver_get: number;
    deliver_get_details: {
      rate: number;
    };
    deliver_no_ack: number;
    deliver_no_ack_details: {
      rate: number;
    };
    get: number;
    get_details: {
      rate: number;
    };
    get_empty: number;
    get_empty_details: {
      rate: number;
    };
    get_no_ack: number;
    get_no_ack_details: {
      rate: number;
    };
    publish: number;
    publish_details: {
      rate: number;
    };
    redeliver: number;
    redeliver_details: {
      rate: number;
    };
  };
  messages: number;
  messages_details: {
    rate: number;
  };
  messages_paged_out: number;
  messages_persistent: number;
  messages_ram: number;
  messages_ready: number;
  messages_ready_details: {
    rate: number;
  };
  messages_ready_ram: number;
  messages_unacknowledged: number;
  messages_unacknowledged_details: {
    rate: number;
  };
  messages_unacknowledged_ram: number;
  name: string;
  node: string;
  reductions: number;
  reductions_details: {
    rate: number;
  };
  state: string;
  storage_version: number;
  type: string;
  vhost: string;
}

const QueueStatisticsCard: React.FC<QueueStatistics> = ({
  name,
  messages,
  messages_ready,
  messages_unacknowledged,
  consumers,
  message_bytes_ready,
  state,
  message_stats,
}) => {
  if (!message_stats) {
    return (
      <Card title={name} bordered={false} style={{ margin: "16px 0" }}>
        <div>This queue does not have data yet</div>
      </Card>
    );
  }
  const columns = [
    {
      title: "Operation",
      dataIndex: "operation",
      key: "operation",
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      render: (count: number) => (
        <Statistic value={count} prefix={<LineChartOutlined />} />
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (rate: number) => (
        <Statistic value={rate} prefix={<ClockCircleOutlined />} />
      ),
    },
  ];

  const messageStatsData = [
    {
      operation: "Publish",
      count: message_stats.publish,
      rate: message_stats.publish_details.rate,
    },
    {
      operation: "Deliver",
      count: message_stats.deliver,
      rate: message_stats.deliver_details.rate,
    },
    {
      operation: "Get",
      count: message_stats.get,
      rate: message_stats.get_details.rate,
    },
    {
      operation: "Acknowledge",
      count: message_stats.ack,
      rate: message_stats.ack_details.rate,
    },
  ];

  return (
    <Card title={name} bordered={false} style={{ margin: "16px 0" }}>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="Total Messages"
            value={messages}
            prefix={<DatabaseOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Ready Messages"
            value={messages_ready}
            prefix={<CloudDownloadOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Unacknowledged Messages"
            value={messages_unacknowledged}
            prefix={<CloudUploadOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Consumers"
            value={consumers}
            prefix={<InfoCircleOutlined />}
          />
        </Col>
      </Row>
      <Space style={{ marginBottom: "16px" }}>
        <Typography.Paragraph>
          Ready Message Bytes: {message_bytes_ready}
        </Typography.Paragraph>
        <Tag color={state === "running" ? "green" : "red"}>{state}</Tag>
      </Space>
      <Table
        columns={columns}
        dataSource={messageStatsData}
        pagination={false}
        size="small"
        rowKey={(record) => record.operation}
      />
    </Card>
  );
};

const RmqPage = () => {
  const rabbitmqUseCase = new RabbitmqUsecase(new RabbitmqRepository());
  const [queues, setQueues] = useState<QueueStatistics[]>([]);

  const [nodeStatistics, setNodeStatistics] = useState<NodeStatistics>({
    name: "‎",
    running: false,
    uptime: 0,
    mem_used: 0,
    mem_limit: 0,
    mem_alarm: false,
    disk_free: 0,
    disk_free_limit: 0,
    disk_free_alarm: false,
    fd_used: 0,
    fd_total: 0,
    sockets_used: 0,
    sockets_total: 0,
    proc_used: 0,
    proc_total: 0,
    queue_declared: 0,
    queue_created: 0,
    queue_deleted: 0,
    channel_created: 0,
    channel_closed: 0,
    connection_created: 0,
    connection_closed: 0,
    gc_num: 0,
    gc_bytes_reclaimed: 0,
    io_read_count: 0,
    io_read_bytes: 0,
    io_write_count: 0,
    io_write_bytes: 0,
    context_switches: 0,
    run_queue: 0,
    processors: 0,
  });

  const getQueues = async () => {
    try {
      const response = await rabbitmqUseCase.getQueues();
      if (response.status === 200) {
        setQueues(response.data);
      } else {
        throw new Error("Error fetching queues");
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsQueueLoading(false);
    }
  };

  const getNodeStatistics = async () => {
    try {
      const response = await rabbitmqUseCase.getNodeStatistics();
      if (response.status === 200) {
        setNodeStatistics(response.data);
      } else {
        throw new Error("Error fetching node statistics");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsNodeLoading(false);
    }
  };

  function formatMs(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      return `${ms} ms`;
    }

    const formattedDays = days > 0 ? `${days} days ` : "";
    const formattedHours =
      days > 0 || hours % 24 > 0 ? `${hours % 24} hours ` : "";
    const formattedMinutes =
      days > 0 || hours % 24 > 0 || minutes % 60 > 0
        ? `${minutes % 60} minutes `
        : "";
    const formattedSeconds =
      days > 0 || hours % 24 > 0 || minutes % 60 > 0 || seconds % 60 > 0
        ? `${seconds % 60} seconds`
        : "";

    return `${formattedDays}${formattedHours}${formattedMinutes}${formattedSeconds}`;
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }

  const [isNodeLoading, setIsNodeLoading] = useState(true);
  const [isQueueLoading, setIsQueueLoading] = useState(true);

  useEffect(() => {
    setIsNodeLoading(true);
    setIsQueueLoading(true);
    getQueues();
    getNodeStatistics();
  }, []);

  return (
    <DefaultLayout>
      <Typography.Title>RabbitMQ Statistics</Typography.Title>
      <div className="flex w-full flex-col gap-4 md:gap-6 xl:gap-7.5">
        <div className="flex-grow">
          <Spin spinning={isNodeLoading}>
            <div className="m-5">
              <Tabs
                defaultActiveKey="1"
                type="card"
                style={{ height: "300px" }}
                items={[
                  {
                    key: "1",
                    label: "Node",
                    children: (
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Card
                            title="Node Name"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.name}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card
                            title="Running"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.running ? "Yes" : "No"}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card
                            title="Uptime"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {formatMs(nodeStatistics.uptime)}
                            </Typography.Text>
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: "2",
                    label: "Memory",
                    children: (
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Card
                            title="Memory Used"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {formatBytes(nodeStatistics.mem_used)}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card
                            title="Memory Limit"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {formatBytes(nodeStatistics.mem_limit)}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card
                            title="Memory Alarm"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.mem_alarm ? "On" : "Off"}
                            </Typography.Text>
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: "3",
                    label: "Disk",
                    children: (
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Card
                            title="Disk Free"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {formatBytes(nodeStatistics.disk_free)}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card
                            title="Disk Free Limit"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {formatBytes(nodeStatistics.disk_free_limit)}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card
                            title="Disk Free Alarm"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.disk_free_alarm ? "On" : "Off"}
                            </Typography.Text>
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: "4",
                    label: "File Descriptors & Sockets",
                    children: (
                      <Row gutter={[16, 16]}>
                        <Col span={6}>
                          <Card
                            title="FD Used"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.fd_used}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card
                            title="FD Total"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.fd_total}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card
                            title="Sockets Used"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.sockets_used}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card
                            title="Sockets Total"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.sockets_total}
                            </Typography.Text>
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: "5",
                    label: "Processes",
                    children: (
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card
                            title="Processes Used"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.proc_used}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card
                            title="Processes Total"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.proc_total}
                            </Typography.Text>
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: "6",
                    label: "Queues & Channels",
                    children: (
                      <Row gutter={[16, 16]}>
                        <Col span={6}>
                          <Card
                            title="Queues Created"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.queue_created}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card
                            title="Queues Deleted"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.queue_deleted}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card
                            title="Channels Created"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.channel_created}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card
                            title="Channels Closed"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.channel_closed}
                            </Typography.Text>
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: "7",
                    label: "Connections",
                    children: (
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card
                            title="Connections Created"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.connection_created}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card
                            title="Connections Closed"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.connection_closed}
                            </Typography.Text>
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: "8",
                    label: "Garbage Collection",
                    children: (
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card
                            title="GC Runs"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.gc_num}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card
                            title="GC Bytes Reclaimed"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {formatBytes(nodeStatistics.gc_bytes_reclaimed)}
                            </Typography.Text>
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: "9",
                    label: "IO & Context Switches",
                    children: (
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Card
                            title="IO Read Count"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.io_read_count}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card
                            title="IO Read Bytes"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {formatBytes(nodeStatistics.io_read_bytes)}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card
                            title="IO Write Count"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.io_write_count}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card
                            title="IO Write Bytes"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {formatBytes(nodeStatistics.io_write_bytes)}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card
                            title="Context Switches"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.context_switches}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card
                            title="Run Queue"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.run_queue}
                            </Typography.Text>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card
                            title="Processors"
                            bordered={false}
                            style={{ textAlign: "center" }}
                          >
                            <Typography.Text
                              strong
                              style={{ fontSize: "1.2em" }}
                            >
                              {nodeStatistics.processors}
                            </Typography.Text>
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                ]}
              />
            </div>
          </Spin>
        </div>
        <div>
          <Spin spinning={isQueueLoading}>
            <Row gutter={16}>
              {queues
                .sort(
                  (a, b) =>
                    (b.message_stats ? 1 : 0) - (a.message_stats ? 1 : 0),
                )
                .map((queue) => (
                  <Col key={queue.name} span={6}>
                    <QueueStatisticsCard {...queue} />
                  </Col>
                ))}
            </Row>
          </Spin>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RmqPage;
