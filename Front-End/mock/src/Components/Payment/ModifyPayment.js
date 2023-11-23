import {
  Alert,
  Button,
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
import { useNavigate, useParams } from "react-router-dom";
import ExceptionBox from "../ExceptionBox";

export default function ModifyPayment() {
  document.title = "Tạo phiếu chi mới";
  const { code } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [dataOfType, setDataOfType] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [customer_type, setCusTomer_type] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [paymentGroup, setPaymentGroup] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    localStorage.setItem("open", "payment");
    localStorage.setItem("selected", "create-payment");
    axios({
      url: baseURL + "/payment-group/list",
      method: "post",
      headers: {
        Authorization: Token,
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
    axios({
      url: baseURL + "/employee/admin/list",
      method: "get",
      headers: {
        Authorization: Token,
      },
    })
      .then((res) => {
        setEmployee(res.data);
      })
      .catch((err) => {
        setError(true);
      });
    axios({
      url: baseURL + "/payment/information?code=" + code,
      method: "get",
      headers: {
        Authorization: Token,
      },
    })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(true);
      });
    axios({
      url: baseURL + "/customer/create-payment",
      method: "post",
      headers: {
        Authorization: Token,
      },
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
        Authorization: Token,
      },
      data: {
        value: null,
      },
    })
      .then((res) => {
        setDataOfType(res.data);
        console.log(dataOfType);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu từ hình thức thanh toán");
      });
    axios({
      url: baseURL + "/payment-group/list",
      method: "post",
      headers: {
        Authorization: Token,
      },
      data: {
        value: value,
      },
    })
      .then((res) => {
        setCusTomer_type(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu nhóm khách hàng");
      });
  }, [value]);
  const handleSubmit = () => {
    axios({
      method: "put",
      url: baseURL + "/payment/admin",
      headers: {
        Authorization: Token,
      },
      data: data,
    })
      .then((res) => {
        navigate("/payment-table");
      })
      .catch((err) => {
        message.error("Cập nhật thất bại");
      });
  };
  console.log(data.code);
  return (
    <div className="content" style={{ paddingTop: "10px" }}>
      <div className="taskbar">
        {error && <ExceptionBox msg="Sửa thất bại" url="/main" />}
        <h2>Tạo phiếu chi</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div
        className="inside"
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

        {data.code != null && (
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
              initialValue={data.code}
              label="Mã phiếu chi"
              rules={[
                {
                  message: "Tiền tố PMT không hợp lệ",
                },
              ]}
              style={{
                width: "40%",
              }}
            >
              <Input
                disabled
                onChange={(e) => {
                  setData({
                    ...data,
                    code: e.target.value,
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              name="paymentGroup"
              initialValue={data.paymentGroup.name}
              label="Nhóm khách hàng"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ float: "left", width: "40%" }}
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
                        {i.name}
                      </Option>
                    );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              initialValue={data.customer.name + "-" + data.customer.code}
              name="customer"
              label="Khách hàng nhận"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                showSearch
                disabled={data.customer.customer_type.name != null}
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
                  if (customer_type.length > 0)
                    return (
                      <Option value={i.id + "-" + i.name + "-" + i.code}>
                        {i.name + "-" + i.code}
                      </Option>
                    );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              initialValue={data.paymentType.name}
              name="payment_type"
              label="Hình thức thanh toán"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ width: "40%", float: "left" }}
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
                  if (dataOfType.length > 0)
                    return (
                      <Option value={i.id + "-" + i.name}>{i.name}</Option>
                    );
                })}
              </Select>
            </Form.Item>

            <Form.Item
              name="paid"
              label="Giá trị"
              initialValue={data.paid}
              rules={[
                {
                  required: true,
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
            <Form.Item
              name="status"
              initialValue={
                data.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"
              }
              label="Trạng thái"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ width: "40%", float: "left" }}
            >
              <Select
                placeholder="Chọn trạng thái"
                onSelect={(e) => {
                  setData({
                    ...data,
                    status: e,
                  });
                }}
              >
                <Option value="paid">Đã thanh toán</Option>
                <Option value="unpaid"> Chưa thanh toán</Option>
              </Select>
            </Form.Item>
            <Form.Item
              initialValue={data.manager_code + "-" + data.manager}
              name="manager"
              label="Người quản lý"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                style={{ paddingLeft: "10px" }}
                onSelect={(e) => {
                  const arr = e.split("-");
                  setData({
                    ...data,
                    manager: arr[1],
                    manager_code: arr[0],
                  });
                }}
              >
                {employee.map((e) => {
                  return (
                    <Option value={e.code + "-" + e.name}>
                      {e.code + "-" + e.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                style={{ margin: "10px" }}
                htmlType="submit"
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
}