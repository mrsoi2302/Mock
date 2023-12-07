import {
  Alert,
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
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
import { CaretLeftOutlined } from "@ant-design/icons";

export default function ModifyPayment(props) {
  document.title = "Chỉnh sửa phiếu thu";
  const { code } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [dataOfType, setDataOfType] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [customer_type, setCusTomer_type] = useState([]);
  const [role,setRole]=useState("");
  const [customer, setCustomer] = useState([]);
  const [paymentGroup, setPaymentGroup] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    props.setOpenKeys("cash");
    props.setSelectedKeys("payment-list");
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
        message.error("Có lỗi khi lấy dữ liệu nhóm phiếu thu");
      });
    axios({
      url: baseURL + "/employee/admin/list",
      method: "get",
      headers: {
        Authorization: props.token,
      },
    })
      .then((res) => {
        setEmployee(res.data);
      })
      .catch((err) => {});
    axios({
      url: baseURL + "/payment/information?code=" + code,
      method: "post",
      headers: {
        Authorization: props.token,
      },
    })
      .then((res) => {
        setRole(res.data.value)
        setData(res.data.t);
      })
      .catch((err) => {
        if(err.response.status===404) Modal.error({
          title:"Không tìm thấy",
          onOk:()=>{
            navigate("/payment-table")
            Modal.destroyAll()
          },
          onCancel:()=>{
            navigate("/payment-table")
            Modal.destroyAll()
          }
        })
        else if(err.response.status===406)
        Modal.error({
          title:"Phiên đăng nhập hết hạn",
          onOk:()=>{
            localStorage.clear()
            document.cookie=""
            navigate("")
            Modal.destroyAll()
          },
          onCancel:()=>{
            localStorage.clear()
            document.cookie=""
            navigate("")
            Modal.destroyAll()
          },
          cancelText:"Quay lại"
        })
      });
    axios({
      url: baseURL + "/customer/create-payment",
      method: "post",
      headers: {
        Authorization: props.token,
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
        setCusTomer_type(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu nhóm khách hàng");
      });
  }, [value]);
  const handleSubmit = () => {
    axios({
      method: "put",
      url: baseURL + "/payment/staff",
      headers: {
        Authorization: props.token,
      },
      data:{
        t:data
      }
    })
      .then((res) => {
        navigate("/payment/information/"+code);
      })
      .catch((err) => {
        message.error("Cập nhật thất bại");
      });
  };
  return (
    <div className="content" style={{ paddingTop: "10px" }}>
      <div className="taskbar">
        {error && <ExceptionBox msg="Sửa thất bại" url="/main" />}
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
              navigate("/payment/information/" + code);
            }}
            size="large"
            style={{ height: "fit-content" }}
          >
            <h3>
              <CaretLeftOutlined /> Thông tin phiếu thu
            </h3>
          </Button>
        </ConfigProvider>{" "}
        <Account name={localStorage.getItem("name")} />
      </div>
      {data != null && (
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
                label="Mã phiếu thu"
                rules={[
                  {
                    message: "Tiền tố PMT không hợp lệ",
                  },
                ]}
                style={{
                  width: "47%",
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
                initialValue={
                  data.paymentGroup === null ? null : data.paymentGroup.name
                }
                label="Nhóm phiếu thu"
                style={{ float: "left", width: "47%" }}
              >
                <Select
                  showSearch
                  allowClear
                  onClear={(e) => {
                    setData({
                      ...data,
                      paymentGroup: null,
                    });
                  }}
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
                initialValue={
                  data.customer === null
                    ? null
                    : data.customer.name + "-" + data.customer.code
                }
                name="customer"
                label="Khách hàng thanh toán"
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
                initialValue={
                  data.paymentType === null ? null : data.paymentType.name
                }
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
              <Form.Item
                name="status"
                initialValue={
                  data.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"
                }
                label="Trạng thái"
                rules={[
                  {
                    required: true,
                    message: "Vùng này không được để trống",
                  },
                ]}
                style={{ width: "47%", float: "left" }}
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
                    message: "Vùng này không được để trống",
                  },
                ]}
              >
                <Select
                  disabled={role != "ADMIN"}
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
                  size="large"
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
      )}
    </div>
  );
}
