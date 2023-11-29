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
import { useNavigate, useParams } from "react-router-dom";
import ExceptionBox from "../ExceptionBox";
import { CaretLeftOutlined } from "@ant-design/icons";

export default function ModifyReceipt(props) {
  document.title = "Chỉnh sửa phiếu thu";
  const { code } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [value, setValue] = useState();
  const [error, setError] = useState(false);
  const [dataOfType, setDataOfType] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [provider, setProvider] = useState([]);
  const [receiptGroup, setReceiptGroup] = useState([]);

  const [form] = Form.useForm();
  useEffect(() => {
    props.setOpenKeys("cash");
    props.setSelectedKeys("receipt-list");
    axios({
      url: baseURL + "/receipt-group/list",
      method: "post",
      headers: {
        Authorization: props.token,
      },
      data: {
        value: value,
      },
    })
      .then((res) => {
        setReceiptGroup(res.data);
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
      url: baseURL + "/receipt/information?code=" + code,
      method: "get",
      headers: {
        Authorization: props.token,
      },
    }).then((res) => {
      setData(res.data);
      axios({
        url: baseURL + "/provider/create-receipt",
        method: "post",
        headers: {
          Authorization: props.token,
        },
        data: {},
      })
        .then((ress) => {
          setProvider(ress.data);
        })
        .catch((err) => {
          message.error("Có lỗi khi lấy dữ liệu từ khách hàng");
        });
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
        console.log(dataOfType);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu từ hình thức thanh toán");
      });
  }, [value]);
  const handleSubmit = () => {
    axios({
      method: "put",
      url: baseURL + "/receipt/admin",
      headers: {
        Authorization: props.token,
      },
      data: data,
    })
      .then((res) => {
        navigate("/receipt-table");
      })
      .catch((err) => {
        message.error("Cập nhật thất bại");
      });
  };
  const handleType = (e) => {
    const arr = e.split("-");
    axios({
      url: baseURL + "/provider/create-payment",
      method: "post",
      headers: {
        Authorization: props.token,
      },
      data: {
        id: arr[0],
      },
    })
      .then((res) => {
        setProvider(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu từ khách hàng");
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
              navigate("/receipt/information/" + code);
            }}
            size="large"
            style={{ height: "fit-content" }}
          >
            <h2>
              <CaretLeftOutlined /> Thông tin phiếu thu
            </h2>
          </Button>
        </ConfigProvider>
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
              label="Mã phiếu thu"
              rules={[
                {
                  message: "Tiền tố RCV không hợp lệ",
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
              name="receiptGroup"
              initialValue={
                data.receiptGroup === null ? null : data.receiptGroup.name
              }
              label="Loại phiếu chi"
              style={{ float: "left", width: "47%" }}
            >
              <Select
                showSearch
                allowClear
                onClear={(e) => {
                  setData({
                    ...data,
                    receiptGroup: null,
                  });
                }}
                placeholder="Chọn loại phiếu chi"
                onSelect={(e) => {
                  const arr = e.split("-");
                  setData({
                    ...data,
                    receiptGroup: {
                      id: arr[0],
                    },
                  });
                }}
                style={{
                  float: "left",
                }}
              >
                {receiptGroup.map((i) => {
                  if (receiptGroup.length > 0)
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
                data.provider === null
                  ? null
                  : data.provider.name + "-" + data.provider.code
              }
              name="provider"
              label="Nhà cung cập thanh toán"
            >
              <Select
                showSearch
                placeholder="Chọn nhà cung cấp"
                style={{ paddingLeft: "10px" }}
                onSelect={(e) => {
                  const arr = e.split("-");
                  setData({
                    ...data,
                    provider: {
                      id: arr[0],
                      code: arr[2],
                    },
                  });
                }}
              >
                {provider.map((i) => {
                  return (
                    <Option value={i.id + "-" + i.name + "-" + i.code}>
                      {i.name + "-" + i.code}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              initialValue={data.payment_type.name}
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
                    payment_type: {
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
              name="revenue"
              label="Giá trị"
              initialValue={data.revenue}
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
                    revenue: e,
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
                style={{
                  marginLeft: "10px",
                  width: "98.5%",
                }}
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
