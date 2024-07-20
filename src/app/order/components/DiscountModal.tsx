import { DiscountRepository } from "@/repository/discount.repository";
import { DiscountUseCase } from "@/usecase/discount.usecase";
import {
  Modal,
  Table,
  Button,
  Form,
  Input,
  Popconfirm,
  notification,
  Tabs,
  DatePicker,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";

interface Discount {
  code: string;
  percentage?: number;
  expired_at?: string;
}

interface DiscountModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function DiscountModal({
  visible,
  onClose,
}: DiscountModalProps) {
  const discountUsecase = new DiscountUseCase(new DiscountRepository());
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editForm] = useForm();
  const [addForm] = useForm();

  useEffect(() => {
    if (visible) {
      discountUsecase.getDiscounts().then((response) => {
        if (response.status === 200) {
          setDiscounts(response.data);
        } else {
          notification.error({ message: "Failed to load discounts" });
        }
      });
    }
  }, [visible]);

  const isEditing = (record: Discount) => record.code === editingKey;

  const edit = (record: Discount) => {
    editForm.setFieldsValue({
      ...record,
      expired_at: record.expired_at ? dayjs(record.expired_at) : null,
    });
    setEditingKey(record.code);
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const save = async (key: string) => {
    try {
      const row = await editForm.validateFields();
      const newData = [...discounts];
      const index = newData.findIndex((item) => key === item.code);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          expired_at: row.expired_at
            ? dayjs(row.expired_at).format("YYYY-MM-DD")
            : undefined,
        });
        setDiscounts(newData);
        setEditingKey(null);

        const response = await discountUsecase.updateDiscount(newData[index]);
        if (response.status === 200) {
          notification.success({ message: "Discount updated successfully" });
        } else {
          notification.error({ message: "Failed to update discount" });
        }
      } else {
        newData.push(row);
        setDiscounts(newData);
        setEditingKey(null);
      }
    } catch (errInfo) {
      notification.error({
        message: "Failed to save changes",
        description: "Please check the form fields and try again.",
      });
    }
  };

  const handleDelete = async (code: string) => {
    try {
      const response = await discountUsecase.deleteDiscount(code);
      if (response.status === 200) {
        setDiscounts((prevDiscounts) =>
          prevDiscounts.filter((discount) => discount.code !== code),
        );
        notification.success({ message: "Discount deleted successfully" });
      } else {
        notification.error({ message: "Failed to delete discount" });
      }
    } catch (error) {
      notification.error({
        message: "Failed to delete discount",
        description:
          "An error occurred while deleting the discount. Please try again later.",
      });
    }
  };

  const validateNumber = (rule: any, value: any) => {
    if (value && !Number.isNaN(Number(value))) {
      return Promise.resolve();
    }
    return Promise.reject("Please enter a valid number");
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }: any) => {
    const inputNode =
      dataIndex === "expired_at" ? (
        <DatePicker format="YYYY-MM-DD" />
      ) : inputType === "number" ? (
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          placeholder={`Enter ${title.toLowerCase()}`}
        />
      ) : (
        <Input />
      );

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please enter ${title.toLowerCase()}`,
              },
              ...(inputType === "number"
                ? [
                    {
                      validator: validateNumber,
                      message: `Please enter a valid ${title.toLowerCase()}`,
                    },
                  ]
                : []),
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      editable: true,
    },
    {
      title: "Expired At",
      dataIndex: "expired_at",
      key: "expired_at",
      editable: true,
      render: (text: string) => (text ? dayjs(text).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Discount) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.code)}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button>Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Button
              disabled={editingKey !== null}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this discount?"
              onConfirm={() => handleDelete(record.code)}
            >
              <Button danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: Discount) => ({
        record,
        inputType: col.dataIndex === "percentage" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Modal
      open={visible}
      onCancel={() => {
        setEditingKey(null);
        editForm.resetFields();
        addForm.resetFields();
        onClose();
      }}
      footer={null}
      closable={false}
      width={800}
    >
      <Tabs
        defaultActiveKey="1"
        onChange={(key) => {
          if (key === "1") {
            editForm.resetFields();
          } else if (key === "2") {
            addForm.resetFields();
          }
        }}
      >
        <Tabs.TabPane tab="View Discounts" key="1">
          <Form form={editForm} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={discounts}
              columns={mergedColumns}
              rowClassName="editable-row"
              rowKey="code"
              pagination={{ pageSize: 5 }}
            />
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Add Discount" key="2">
          <Form
            form={addForm}
            layout="vertical"
            onFinish={async (values) => {
              try {
                const formattedValues = {
                  ...values,
                  expired_at: values.expired_at
                    ? dayjs(values.expired_at).format("YYYY-MM-DD")
                    : undefined,
                };

                const response =
                  await discountUsecase.createDiscount(formattedValues);
                console.log(response);
                if (response.status === 201) {
                  setDiscounts((prevDiscounts) => [
                    ...prevDiscounts,
                    formattedValues,
                  ]);
                  notification.success({
                    message: "Discount added successfully",
                  });
                } else {
                  notification.error({ message: "Failed to add discount" });
                }
              } catch (error) {
                notification.error({
                  message: "Failed to add discount",
                  description:
                    "An error occurred while adding the discount. Please try again later.",
                });
              }
              addForm.resetFields();
            }}
            style={{ marginTop: 16 }}
          >
            <Form.Item
              name="code"
              label="Code"
              rules={[
                { required: true, message: "Please enter the discount code" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="percentage"
              label="Percentage"
              rules={[
                {
                  required: true,
                  validator: validateNumber,
                  message: "Please enter a valid discount percentage",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="expired_at"
              label="Expired At"
              rules={[
                {
                  required: true,
                  message: "Please enter the expiry date",
                },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Discount
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}
