"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { DataFetcherRepository } from "@/repository/data-fetcher.repository";
import { DatabaseStatRepository } from "@/repository/database-stat.repository";
import { DatafetcherUsecase } from "@/usecase/data-fetcher.usecase";
import { DatabaseStatUsecase } from "@/usecase/database-stat.usecase";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  Modal,
  Row,
  Spin,
  Table,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

interface TableSize {
  Table: string;
  "Total Size (KB)": string;
  "Table Size (KB)": string;
  "Index Size (KB)": string;
  "Live Tuples": string;
  "Dead Tuples": string;
}

interface ActiveSession {
  pid: number;
  usename: string;
  datname: string;
  client_addr: string;
  client_port: number;
  backend_start: string;
  state: string;
  query_start: string;
  state_change: string;
}

interface MongoStat {
  ns: string;
  size: number;
  count: number;
  avgObjSize: number;
  numOrphanDocs: number;
  storageSize: number;
  freeStorageSize: number;
  capped: boolean;
  nindexes: number;
  indexBuilds: any[];
  totalIndexSize: number;
  indexSizes: {
    [key: string]: number;
  };
  totalSize: number;
  scaleFactor: number;
  ok: number;
  $clusterTime: {
    clusterTime: {
      $timestamp: string;
    };
    signature: {
      hash: string;
      keyId: {
        low: number;
        high: number;
        unsigned: boolean;
      };
    };
  };
  operationTime: {
    $timestamp: string;
  };
}

interface IPData {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

const DatabasePage = () => {
  const databaseStatUsecase = new DatabaseStatUsecase(
    new DatabaseStatRepository(),
  );
  const datafetcherUsecase = new DatafetcherUsecase(
    new DataFetcherRepository(),
  );
  const [postgreTableSize, setPostgreTableSize] = useState<TableSize[]>([]);
  const [postgreActiveSession, setPostgreActiveSession] = useState<
    ActiveSession[]
  >([]);
  const [mongoStat, setMongoStat] = useState<MongoStat[]>([]);
  const [isPostgreLoading, setIsPostgreLoading] = useState<boolean>(false);
  const [isMongoLoading, setIsMongoLoading] = useState<boolean>(false);

  const getPostgresqlData = async () => {
    try {
      const response = await databaseStatUsecase.getPostgresql();
      if (response.status === 200) {
        setPostgreTableSize(response.data.table_size);
        setPostgreActiveSession(response.data.active_sessions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPostgreLoading(false);
    }
  };

  const getMongoStat = async () => {
    try {
      const response = await databaseStatUsecase.getMongoDB();
      setMongoStat(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsMongoLoading(false);
    }
  };

  useEffect(() => {
    setIsPostgreLoading(true);
    setIsMongoLoading(true);
    getPostgresqlData();
    getMongoStat();
  }, []);

  const tableSizeColumns = [
    { title: "Table", dataIndex: "Table", key: "Table" },
    {
      title: "Total Size (KB)",
      dataIndex: "Total Size (KB)",
      key: "Total Size (KB)",
    },
    {
      title: "Table Size (KB)",
      dataIndex: "Table Size (KB)",
      key: "Table Size (KB)",
    },
    {
      title: "Index Size (KB)",
      dataIndex: "Index Size (KB)",
      key: "Index Size (KB)",
    },
    { title: "Live Tuples", dataIndex: "Live Tuples", key: "Live Tuples" },
    { title: "Dead Tuples", dataIndex: "Dead Tuples", key: "Dead Tuples" },
  ];

  const activeSessionColumns = [
    { title: "PID", dataIndex: "pid", key: "pid" },
    { title: "Username", dataIndex: "usename", key: "usename" },
    { title: "Database", dataIndex: "datname", key: "datname" },
    { title: "Client Address", dataIndex: "client_addr", key: "client_addr" },
    { title: "Client Port", dataIndex: "client_port", key: "client_port" },
    {
      title: "Backend Start",
      dataIndex: "backend_start",
      key: "backend_start",
    },
    { title: "State", dataIndex: "state", key: "state" },
    { title: "Query Start", dataIndex: "query_start", key: "query_start" },
    { title: "State Change", dataIndex: "state_change", key: "state_change" },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: ActiveSession) => (
        <Button onClick={() => handleShowIPData(record.client_addr)}>
          IP Data
        </Button>
      ),
    },
  ];

  const [searchText, setSearchText] = useState("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredData = postgreTableSize.filter((record) =>
    record["Table"].toLowerCase().includes(searchText.toLowerCase()),
  );

  const [ipData, setIPData] = useState<IPData>({
    status: "",
    country: "",
    countryCode: "",
    region: "",
    regionName: "",
    city: "",
    zip: "",
    lat: 0,
    lon: 0,
    timezone: "",
    isp: "",
    org: "",
    as: "",
    query: "",
  });

  const [selectedIP, setSelectedIP] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchipData = async (ipAddress: string) => {
    try {
      const response = await datafetcherUsecase.getIpData(ipAddress);

      if (response.status === 200) {
        console.error("Error IPData API:");
      }
      setIPData(response.data);
    } catch (error) {
      console.error("Error IPData API:", error);
    }
  };

  const handleShowIPData = (ipAddress: string) => {
    setSelectedIP(ipAddress);
    setIsModalVisible(true);
    fetchipData(ipAddress);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  if (isMongoLoading) {
    return (
      <DefaultLayout>
        <Spin />
      </DefaultLayout>
    );
  } else if (isPostgreLoading) {
    return (
      <DefaultLayout>
        <Spin />
      </DefaultLayout>
    );
  } else {
    return (
      <DefaultLayout>
        <Typography.Title>Database</Typography.Title>
        <Modal
          title={`IPData Information for ${selectedIP}`}
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={1200}
        >
          {ipData ? (
            <Descriptions>
              <Descriptions.Item label="IP Address">
                {ipData.query}
              </Descriptions.Item>
              <Descriptions.Item label="City">{ipData.city}</Descriptions.Item>
              <Descriptions.Item label="Region">
                {ipData.regionName}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {ipData.country}
              </Descriptions.Item>
              <Descriptions.Item label="Lattitude">
                {ipData.lat}
              </Descriptions.Item>
              <Descriptions.Item label="Longitude">
                {ipData.lon}
              </Descriptions.Item>
              <Descriptions.Item label="Timezone">
                {ipData.timezone}
              </Descriptions.Item>
              <Descriptions.Item label="ISP">{ipData.isp}</Descriptions.Item>
              <Descriptions.Item label="Organization">
                {ipData.org}
              </Descriptions.Item>
              <Descriptions.Item label="AS">{ipData.as}</Descriptions.Item>
            </Descriptions>
          ) : (
            <Spin />
          )}
        </Modal>
        <div>
          <Typography.Title level={3}>MongoDB Stats</Typography.Title>
          {isMongoLoading ? (
            <Spin />
          ) : (
            <div>
              <Row gutter={[16, 16]}>
                {mongoStat.map((stat, index) => (
                  <Col span={8} key={index}>
                    <Card>
                      <Typography.Title level={5}>{stat.ns}</Typography.Title>
                      <Descriptions>
                        <Descriptions.Item label="Size">
                          {stat.size} bytes
                        </Descriptions.Item>
                        <Descriptions.Item label="Count">
                          {stat.count}
                        </Descriptions.Item>
                        <Descriptions.Item label="Avg.Object Size">
                          {stat.avgObjSize} bytes
                        </Descriptions.Item>
                        <Descriptions.Item label="Storage Size">
                          {stat.storageSize} bytes
                        </Descriptions.Item>
                        <Descriptions.Item label="Index Size">
                          {stat.totalIndexSize} bytes
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
          <Typography.Title className="mt-10" level={3}>
            PostgreSQL Table Size
          </Typography.Title>
          {isPostgreLoading ? (
            <Spin />
          ) : (
            <div>
              <Input.Search
                placeholder="Search by table name"
                onSearch={handleSearch}
                style={{ width: 300, marginBottom: 16 }}
              />
              <Table
                dataSource={filteredData}
                columns={tableSizeColumns}
                rowKey={(record: any) => {
                  return record["Table"];
                }}
              />
            </div>
          )}
          <Typography.Title level={3}>
            PostgreSQL Active Sessions
          </Typography.Title>
          {isPostgreLoading ? (
            <Spin />
          ) : (
            <Table
              dataSource={postgreActiveSession}
              columns={activeSessionColumns}
              rowKey={(record: ActiveSession) => {
                return `${record.pid + record.client_addr + record.client_port}`;
              }}
            />
          )}
        </div>
      </DefaultLayout>
    );
  }
};

export default DatabasePage;
