import {
  Alert,
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import { Option } from "antd/es/mentions";
import "../Account";
import React, { useEffect, useState } from "react";
import Account from "../Account";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { useNavigate } from "react-router-dom";
import { CaretLeftOutlined } from "@ant-design/icons";
export default function CreatePayment(props) {
  document.title = "Tạo phiếu chi mới";
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [dataOfType, setDataOfType] = useState([]);
  const [paymentGroup, setPaymentGroup] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    props.setOpenKeys("cash");
    props.setSelectedKeys("payment-list");
    axios({
      url: baseURL + "/customer/create-payment",
      method: "post",
      headers: {
        Authorization: props.token,
      },
      data: {},
    })
      .then((res) => {
        setCustomer(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu từ khách hàng");
      });
    axios({
      url: baseURL + "/payment-type/list",
      method: "post",
      headers: {
        Authorization: props.token,
      },
      data: {
        value: null,
      },
    })
      .then((res) => {
        setDataOfType(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu từ hình thức thanh toán");
      });
    axios({
      url: baseURL + "/payment-group/list",
      method: "post",
      headers: {
        Authorization: props.token,
      },
      data: {
        value: value,
      },
    })
      .then((res) => {
        setPaymentGroup(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu nhóm phiếu chi");
      });
  }, [value]);
  const handleSubmit = () => {
    axios({
      method: "post",
      url: baseURL + "/payment/staff/create-one",
      headers: {
        Authorization: props.token,
      },
      data: data,
    })
      .then((res) => {
        navigate("/payment-table");
      })
      .catch((err) => {
        message.error("Tạo thất bại");
      });
  };
  const handleType = (e) => {
    const arr = e.split("-");
    axios({
      url: baseURL + "/customer/create-payment",
      method: "post",
      headers: {
        Authorization: props.token,
      },
      data: {
        id: arr[0],
      },
    })
      .then((res) => {
        setCustomer(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu từ khách hàng");
      });
  };
  return (
    <div className="content" style={{ paddingTop: "10px" }}>
      <div className="taskbar">
        {error && (
          <Alert
            message="Tạo thất bại"
            showIcon
            type="error"
            style={{
              position: "absolute",
              margin: "20%",
            }}
            closable
          />
        )}
        <ConfigProvider
          theme={{
            components: {
              Button: {
                textHoverBg: "none",
                colorBgTextActive: "none",
              },
            },
          }}
        >
          <Button
            type="text"
            onClick={(e) => {
              navigate("/payment-table");
            }}
            size="large"
            style={{ height: "fit-content" }}
          >
            <h2>
              <CaretLeftOutlined /> Danh sách phiếu chi
            </h2>
          </Button>
        </ConfigProvider>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div
        style={{
          backgroundColor: "white",
          display: "block",
          margin: "3% 5%",
          textAlign: "left",
          borderRadius: "10px",
          padding: "1% 2% 5vh",
        }}
      >
        <h2 style={{ paddingLeft: "10px" }}>Thông tin chung</h2>
        <hr style={{ borderTop: "1px solid whitesmoke" }} />

        <Form
          onFinish={handleSubmit}
          form={form}
          layout="vertical"
          style={{
            maxWidth: "100%",
            margin: "10px",
          }}
        >
          <Form.Item
            name="code"
            label="Mã phiếu chi"
            rules={[
              {
                pattern: "^(?!PMT).*",
                message: "Tiền tố PMT không hợp lệ",
              },
            ]}
            style={{
              width: "47%",
              float: "left",
            }}
          >
            <Input
              onChange={(e) => {
                setData({
                  ...data,
                  code: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="customer"
            label="Khách hàng nhận"
            rules={[
              {
                required: true,
                message: "Vùng này không được để trống",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Chọn khách hàng"
              style={{ paddingLeft: "10px" }}
              onSelect={(e) => {
                const arr = e.split("-");
                setData({
                  ...data,
                  customer: {
                    id: arr[0],
                    code: arr[2],
                  },
                });
              }}
            >
              {customer.map((i) => {
                return (
                  <Option value={i.id + "-" + i.name + "-" + i.code}>
                    {i.name + "-" + i.code}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="paymentGroup"
            label="Loại phiếu chi"
            rules={[
              {
                required: true,
                message: "Vùng này không được để trống",
              },
            ]}
            style={{ float: "left", width: "47%" }}
          >
            <Select
              showSearch
              placeholder="Chọn loại phiếu thu"
              onSelect={(e) => {
                const arr = e.split("-");
                setData({
                  ...data,
                  paymentGroup: {
                    id: arr[0],
                  },
                });
              }}
              style={{
                float: "left",
              }}
            >
              {paymentGroup.map((i) => {
                if (paymentGroup.length > 0)
                  return (
                    <Option value={i.id + "-" + i.code + "-" + i.name}>
                      {i.name + "-" + i.code}
                    </Option>
                  );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[
              {
                required: true,
                message: "Vùng này không được để trống",
              },
            ]}
          >
            <Select
              placeholder="Chọn trạng thái"
              onSelect={(e) => {
                setData({
                  ...data,
                  status: e,
                });
              }}
              style={{ paddingLeft: "10px" }}
            >
              <Option value="paid">Đã thanh toán</Option>
              <Option value="unpaid"> Chưa thanh toán</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="payment_type"
            label="Hình thức thanh toán"
            rules={[
              {
                required: true,
                message: "Vùng này không được để trống",
              },
            ]}
            style={{ width: "47%", float: "left" }}
          >
            <Select
              showSearch
              placeholder="Chọn hình thức thanh toán"
              onSelect={(e) => {
                const arr = e.split("-");
                setData({
                  ...data,
                  paymentType: {
                    id: arr[0],
                    name: arr[1],
                  },
                });
              }}
            >
              {dataOfType.map((i) => {
                console.log(i);
                if (dataOfType.length > 0)
                  return <Option value={i.id + "-" + i.name}>{i.name}</Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="paid"
            label="Giá trị"
            initialValue={0}
            rules={[
              {
                required: true,
                message: "Vùng này không được để trống",
              },
            ]}
          >
            <InputNumber
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{
                marginLeft: "10px",
                width: "98.5%",
              }}
              onChange={(e) => {
                setData({
                  ...data,
                  paid: e,
                });
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              style={{ margin: "10px" }}
              htmlType="submit"
              size="large"
            >
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
