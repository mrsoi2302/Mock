import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input, Select } from "antd";
import { Option } from "antd/es/mentions";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";

export default function CreateEmployee() {
  document.title = "Danh sách nhân viên";
  const [code, setCode] = useState();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState();
  const [role, setRole] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    localStorage.setItem("open", "employee");
    localStorage.setItem("selected", "create-employee");
  }, []);
  const handleSubmit = (e) => {
    console.log(e);
    axios({
      url: baseURL + "/employee/admin/create-one",
      method: "post",
      headers: {
        Authorization: Token,
      },
      data: e,
    })
      .then((res) => {
        navigate("/employee-table");
      })
      .catch((err) => {
        setError(true);
      });
  };
  return (
    <div className="content">
      <div className="taskbar">
        {error && (
          <Alert
            message="Tạo thất bại"
            showIcon
            description="Chỉ quản trị viên mới có thể tạo được nhân viên mới"
            type="error"
            style={{
              position: "absolute",
              margin: "20%",
            }}
            closable
          />
        )}
        <h2>Tạo nhân viên</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div
        className="inside"
        style={{ backgroundColor: "white", display: "block" }}
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
            name="name"
            label="Họ và tên nhân viên"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="code"
            label="Mã nhân viên"
            initialValue=""
            rules={[
              {
                pattern: "^(?!EPL).*",
                message: "Tiền tố EPL không hợp lệ",
              },
            ]}
            style={{
              float: "left",
              width: "45%",
            }}
          >
            <Input
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[
              {
                required: true,
              },
            ]}
            style={{}}
          >
            <Select
              placeholder="Chọn vai trò"
              allowClear
              onSelect={(e) => {
                setRole(e);
              }}
              style={{ paddingLeft: "10px" }}
            >
              <Option value="STAFF">Nhân viên</Option>
              <Option value="USER">Người dùng</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              {
                required: true,
                message: "Tên đăng nhập không hợp lệ",
              },
            ]}
          >
            <Input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: "Mật khẩu không hợp lệ",
              },
            ]}
          >
            <Input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ margin: "10px" }}
              onClick={handleSubmit}
            >
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
