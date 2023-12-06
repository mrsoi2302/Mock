import { Space, Table, Tag } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentList(props) {
  const navigate = useNavigate();
  const columns = [
    {
      title: "Mã phiếu thu",
      dataIndex: "code",
      key: "code",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={(e) => navigate("/payment/information/" + record.code)}>
            {record.code}
          </a>
        </Space>
      ),
      width: "15%",
    },
    {
      title: "Giá trị",
      dataIndex: "paid",
      key: "paid",
      sorter: (a, b) => a.paid - b.paid,
    },
    {
      title: "Người quản lý",
      dataIndex: "manager",
      key: "manager",
      width: "25%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.status === "paid" ? "green" : "red"}>
          {record.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
        </Tag>
      ),
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
      width: "17%",
      render: (_, record) => <p>{record.paymentType.name}</p>,
    },
  ];
  return (
    <Table
      columns={columns}
      style={{
        margin: "20px auto 10%",
        width: "82.5%",
      }}
      scroll={{ y: 500 }}
      dataSource={props.data}
      loading={props.data === null}
      pagination={false}
    />
  );
}
