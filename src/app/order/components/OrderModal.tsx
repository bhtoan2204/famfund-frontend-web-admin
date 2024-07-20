import { Button, Modal, Descriptions, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import Image from "next/image";

export interface MainPackage {
  id_main_package: number;
  name: string;
  description?: string;
  is_active: boolean;
  price: string;
  duration_months: number;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ExtraPackage {
  id_extra_package: number;
  name: string;
  price: string;
  description?: string;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ComboPackage {
  id_combo_package: number;
  name: string;
  price: string;
  description?: string;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  packageExtras: ExtraPackage[];
}

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
}

interface Family {
  id_family: number;
  quantity: number;
  name: string;
  description: string;
  owner_id: string;
  expired_at: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

interface Order {
  id_order: string;
  id_user: string;
  id_family: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  id_package_main: number | null;
  id_package_extra: number | null;
  id_package_combo: number | null;
  method: string;
  bank_code: string | null;
  price: string;
  created_at: string;
  updated_at: string;
  users: User;
  family: Family | null;
  packageMain: MainPackage | null;
  packageExtra: ExtraPackage | null;
  packageCombo: ComboPackage | null;
}

interface OrderModalProps {
  isModalVisible: boolean;
  handleModalClose: () => void;
  selectedOrder: Order | null;
}

export default function OrderModal({
  isModalVisible,
  handleModalClose,
  selectedOrder,
}: OrderModalProps) {
  return (
    <Modal
      title="Order Details"
      width={800}
      open={isModalVisible}
      onCancel={handleModalClose}
      footer={[
        <Button key="close" onClick={handleModalClose}>
          Close
        </Button>,
      ]}
    >
      {selectedOrder && (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Order" key="1">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Order ID">
                {selectedOrder.id_order}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {selectedOrder.status}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                {selectedOrder.price}
              </Descriptions.Item>
              <Descriptions.Item label="Method">
                {selectedOrder.method}
              </Descriptions.Item>
              <Descriptions.Item label="Bank Code">
                {selectedOrder.bank_code}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {selectedOrder.created_at}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {selectedOrder.updated_at}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="Package" key="2">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Package Type">
                {selectedOrder.packageMain
                  ? "Main Package"
                  : selectedOrder.packageExtra
                    ? "Extra Package"
                    : "Combo Package"}
              </Descriptions.Item>
              <Descriptions.Item label="Package Name">
                {selectedOrder.packageMain
                  ? selectedOrder.packageMain.name
                  : selectedOrder.packageExtra
                    ? selectedOrder.packageExtra.name
                    : selectedOrder.packageCombo
                      ? selectedOrder.packageCombo.name
                      : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Package Description">
                {selectedOrder.packageMain
                  ? selectedOrder.packageMain.description
                  : selectedOrder.packageExtra
                    ? selectedOrder.packageExtra.description
                    : selectedOrder.packageCombo
                      ? selectedOrder.packageCombo.description
                      : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Package Price">
                {selectedOrder.packageMain
                  ? selectedOrder.packageMain.price
                  : selectedOrder.packageExtra
                    ? selectedOrder.packageExtra.price
                    : selectedOrder.packageCombo
                      ? selectedOrder.packageCombo.price
                      : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Package Duration (Months)">
                {selectedOrder.packageMain
                  ? selectedOrder.packageMain.duration_months
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Package Created At">
                {selectedOrder.packageMain
                  ? selectedOrder.packageMain.created_at.toString()
                  : selectedOrder.packageExtra
                    ? selectedOrder.packageExtra.created_at.toString()
                    : selectedOrder.packageCombo
                      ? selectedOrder.packageCombo.created_at.toString()
                      : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Package Updated At">
                {selectedOrder.packageMain
                  ? selectedOrder.packageMain.updated_at.toString()
                  : selectedOrder.packageExtra
                    ? selectedOrder.packageExtra.updated_at.toString()
                    : selectedOrder.packageCombo
                      ? selectedOrder.packageCombo.updated_at.toString()
                      : ""}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="Family" key="3">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Family Name">
                {selectedOrder.family
                  ? selectedOrder.family.name
                  : "Not assigned to any family"}
              </Descriptions.Item>
              <Descriptions.Item label="Family Description">
                {selectedOrder.family
                  ? selectedOrder.family.description
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Family Quantity">
                {selectedOrder.family ? selectedOrder.family.quantity : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Family Owner ID">
                {selectedOrder.family ? selectedOrder.family.owner_id : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Family Expired At">
                {selectedOrder.family ? selectedOrder.family.expired_at : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Family Created At">
                {selectedOrder.family ? selectedOrder.family.created_at : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Family Updated At">
                {selectedOrder.family ? selectedOrder.family.updated_at : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="User" key="4">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="User ID">
                {selectedOrder.users.id_user}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedOrder.users.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedOrder.users.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Name">
                {`${selectedOrder.users.firstname} ${selectedOrder.users.lastname}`}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Verified">
                {selectedOrder.users.isphoneverified ? "Yes" : "No"}
              </Descriptions.Item>
              <Descriptions.Item label="Admin">
                {selectedOrder.users.isadmin ? "Yes" : "No"}
              </Descriptions.Item>
              <Descriptions.Item label="Login Type">
                {selectedOrder.users.login_type}
              </Descriptions.Item>
              <Descriptions.Item label="Genre">
                {selectedOrder.users.genre}
              </Descriptions.Item>
              <Descriptions.Item label="Birthdate">
                {selectedOrder.users.birthdate}
              </Descriptions.Item>
              <Descriptions.Item label="Avatar">
                <Image
                  src={selectedOrder.users.avatar}
                  alt="Avatar"
                  width={50}
                  height={50}
                />
              </Descriptions.Item>
              <Descriptions.Item label="User Created At">
                {selectedOrder.users.created_at}
              </Descriptions.Item>
              <Descriptions.Item label="User Updated At">
                {selectedOrder.users.updated_at}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );
}
