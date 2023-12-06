import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Select,
} from "antd";
import { Option } from "antd/es/mentions";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import dayjs from "dayjs";
import { CaretLeftOutlined } from "@ant-design/icons";

const dateFormat = "YYYY/MM/DD";
export default function ModifyCustomer(props) {
  document.title = "Chỉnh sửa thông tin khách hàng";
  const { code } = useParams();
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [form] = Form.useForm();
  const [dataOfType, setDataOfType] = useState([]);
  const [dataOfEmployee, setDataOfEmployee] = useState([]);
  const [value, setValue] = useState();
  useEffect(() => {
    props.setOpenKeys("customer");
    props.setSelectedKeys("customer-list");
    axios({
      url: baseURL + "/customer/information?code=" + code,
      method: "post",
      headers: {
        Authorization: props.token,
      },
    })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(true);
      });
    axios({
      url: baseURL + "/employee/admin/list",
      method: "get",
      headers: {
        Authorization: props.token,
      },
    })
      .then((res) => {
        setDataOfEmployee(res.data);
      })
      .catch((err) => {});
    axios({
      method: "post",
      url: baseURL + "/customer-type/list",
      headers: {
        Authorization: props.token,
      },
      data: {
        value: value,
      },
    })
      .then((res) => {
        setDataOfType(res.data);
      })
      .catch((err) => {});
  }, [value]);
  const handleSubmit = () => {
    axios({
      url: baseURL + "/customer/admin",
      method: "put",
      headers: {
        Authorization: props.token,
      },
      data: data,
    })
      .then((res) => {
        navigate("/customer-table");
      })
      .catch((err) => {
        setError(true);
      });
  };
  return (
    <div className="content" style={{ paddingTop: "10px" }}>
      <div className="taskbar">
        {error && (
          <Alert
            message="Tạo thất bại"
            showIcon
            description="Chỉ quản trị viên mới có thể tạo được nhà cung cấp mới"
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
              navigate("/customer/information/" + code);
            }}
            size="large"
            style={{ height: "fit-content" }}
          >
            <h3>
              <CaretLeftOutlined /> Thông tin khách hàng
            </h3>
          </Button>
        </ConfigProvider>
        <Account name={localStorage.getItem("name")} />
      </div>
      {data.t != null && (
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

          {data.t.code != null && (
            <Form
              onFinish={handleSubmit}
              form={form}
              layout="vertical"
              style={{
                maxWidth: "100%",
                margin: "3% 5%",
              }}
            >
              <Form.Item
                name="name"
                label="Tên khách hàng"
                initialValue={data.t.name}
                rules={[
                  {
                    required: true,
                    message: "Vùng này không được để trống",
                  },
                ]}
                style={{ width: "50%", float: "left", marginRight: "10px" }}
              >
                <Input
                  onChange={(e) => {
                    setData({
                      ...data,
                      name: e.target.value,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                name="birthday"
                label="Ngày sinh"
                initialValue={dayjs(
                  data.t.birthday.substring(0, 10),
                  dateFormat
                )}
                rules={[
                  {
                    required: true,
                    message: "Vùng này không được để trống",
                  },
                ]}
                style={{ float: "left", marginRight: "10px" }}
              >
                <DatePicker
                  onChange={(e, s) => {
                    setData({ ...data, birthday: s });
                  }}
                />
              </Form.Item>
              <Form.Item
                name="gender"
                label="Giới tính"
                initialValue={data.t.gender}
                rules={[
                  {
                    required: true,
                    message: "Vùng này không được để trống",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn giới tính"
                  onSearch={(e) => {
                    setValue(e);
                  }}
                  onSelect={(e) => {
                    setData({
                      ...data,
                      gender: e,
                    });
                  }}
                >
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ"> Nữ</Option>
                  <Option value="Giới tính thứ 3">Giới tính thứ 3</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="code"
                label="Mã khách hàng"
                rules={[
                  {
                    message: "Tiền tố CTM không hợp lệ",
                  },
                ]}
                initialValue={data.t.code}
                style={{
                  float: "left",
                  width: "45%",
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
                initialValue={
                  data.t.customer_type === null
                    ? null
                    : data.t.customer_type.content
                }
                name="customer_type"
                label="Nhóm khách hàng"
                rules={[
                  {
                    required: true,
                    message: "Vùng này không được để trống",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn nhóm khách hàng"
                  filterOption={false}
                  onSearch={(e) => {
                    setValue(e);
                  }}
                  onSelect={(e) => {
                    setData({
                      ...data,
                      customer_type: {
                        id: e,
                      },
                    });
                  }}
                  style={{ paddingLeft: "10px" }}
                >
                  {dataOfType.map((i) => {
                    if (dataOfType.length > 0)
                      return <Option value={i.id}>{i.content}</Option>;
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                initialValue={data.t.email}
                name="email"
                label="Email"
                rules={[
                  {
                    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    required: true,
                    message: "Email không hợp lệ",
                  },
                ]}
                style={{
                  width: "60%",
                  float: "left",
                }}
              >
                <Input
                  onChange={(e) => {
                    setData({
                      ...data,
                      email: e.target.value,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                name="manager"
                label="Người quản lý"
                initialValue={data.t.manager + "-" + data.t.manager_code}
                rules={[
                  {
                    required: true,
                    message: "Vùng này không được để trống",
                  },
                ]}
              >
                <Select
                  showSearch
                  disabled={data.value !== "ADMIN"}
                  onSelect={(e) => {
                    const arr = e.split("-");
                    setData({
                      ...data,
                      manager: arr[1],
                      manager_code: arr[0],
                    });
                  }}
                  style={{ paddingLeft: "10px" }}
                >
                  {dataOfEmployee.map((i) => {
                    return (
                      <Option value={i.code + "-" + i.username}>
                        {i.username}-{i.code}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                initialValue={data.t.contact}
                name="contact"
                label="Số điện thoại"
                rules={[
                  {
                    pattern: /^\d+$/,
                    required: true,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
                style={{
                  float: "left",
                  width: "45%",
                }}
              >
                <Input
                  onChange={(e) => {
                    setData({
                      ...data,
                      contact: e.target.value,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                initialValue={data.t.status}
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
                  onSearch={(e) => {
                    setValue(e);
                  }}
                  onSelect={(e) => {
                    setData({
                      ...data,
                      status: e,
                    });
                  }}
                  style={{ paddingLeft: "10px" }}
                >
                  <Option value="active">Đã kích hoạt</Option>
                  <Option value="non-active"> Chưa kích hoạt</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  style={{ margin: "10px" }}
                  htmlType="submit"
                >
                  Chỉnh sửa
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      )}
    </div>
  );
}
