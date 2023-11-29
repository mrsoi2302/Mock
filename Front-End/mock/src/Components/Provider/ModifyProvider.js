import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, ConfigProvider, Form, Input, Select } from "antd";
import { Option } from "antd/es/mentions";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { CaretLeftOutlined } from "@ant-design/icons";

export default function ModifyProvider(props) {
  document.title = "Chỉnh sửa nhà cung cấp";
  const { code } = useParams();
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [form] = Form.useForm();
  const [dataOfType, setDataOfType] = useState([]);
  const [dataOfEmployee, setDataOfEmployee] = useState([]);
  const [value, setValue] = useState("");
  useEffect(() => {
    props.setOpenKeys("provider");
    props.setSelectedKeys("provider-list");
    axios({
      url: baseURL + "/provider/information?code=" + code,
      method: "get",
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
      .catch((err) => {
        setError(true);
      });
    axios({
      method: "post",
      url: baseURL + "/provider-type/list",
      headers: {
        Authorization: props.token,
      },
      data: {
        value: value,
      },
    })
      .then((res) => {
        setDataOfType(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [value]);
  const handleSubmit = () => {
    axios({
      url: baseURL + "/provider/admin",
      method: "put",
      headers: {
        Authorization: props.token,
      },
      data: data,
    })
      .then((res) => {
        navigate("/provider-table");
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
              navigate("/provider/information/" + code);
            }}
            size="large"
            style={{ height: "fit-content" }}
          >
            <h2>
              <CaretLeftOutlined /> Thông tin nhà cung cấp
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
          margin: "3% 5% 3%",
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
              margin: "3% 5%",
            }}
          >
            <Form.Item
              name="name"
              initialValue={data.name}
              label="Tên nhà cung cấp"
              rules={[
                {
                  required: true,
                },
              ]}
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
              name="code"
              label="Mã nhà cung cấp"
              initialValue={data.code}
              rules={[
                {
                  message: "Tiền tố PRV không hợp lệ",
                },
              ]}
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
                data.provider_type === null ? null : data.provider_type.content
              }
              name="provider_type"
              label="Nhóm khách hàng"
            >
              <Select
                showSearch
                allowClear
                placeholder="Chọn nhóm khách hàng"
                filterOption={false}
                onSearch={(e) => {
                  setValue(e);
                  console.log(value);
                }}
                onSelect={(e) => {
                  setData({
                    ...data,
                    provider_type: {
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
              initialValue={data.email}
              name="email"
              label="Email"
              rules={[
                {
                  pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  required: true,
                  message: "Email không hợp lệ",
                },
              ]}
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
              initialValue={data.contact}
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
              initialValue={data.status}
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
            <Form.Item
              name="manager"
              label="Người quản lý"
              initialValue={data.manager}
              rules={[
                {
                  required: true,
                  message: "Vùng này không được để trống",
                },
              ]}
            >
              <Select
                showSearch
                onSelect={(e) => {
                  const arr = e.split("-");
                  setData({
                    ...data,
                    manager: arr[1],
                    manager_code: arr[0],
                  });
                }}
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
    </div>
  );
}
