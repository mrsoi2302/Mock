import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate } from "react-router-dom";
import { Alert, Button, ConfigProvider, Form, Input, Select } from "antd";
import { Option } from "antd/es/mentions";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import {CaretLeftOutlined } from "@ant-design/icons";

export default function CreateEmployee(props) {
  document.title = "Tạo mới nhân viên";
  const [code, setCode] = useState();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState();
  const [role, setRole] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    props.setOpenKeys("employee")
    props.setSelectedKeys("create-employee")
  }, []);
  const handleSubmit = (e) => {
    form
    .validateFields()
    axios({
      url: baseURL + "/employee/admin/create-one",
      method: "post",
      headers: {
        Authorization: Token(),
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
    <div className="content" style={{paddingTop:"10px"}}>
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
        <ConfigProvider
        theme={
          {
            components:{
              Button:{
                textHoverBg:"none",
                colorBgTextActive:"none"

              }
            }
          }
        }>
          <Button type="text" onClick={e=>{navigate("/employee-table")}} size="large" style={{height:"fit-content"}}><h2><CaretLeftOutlined/> Danh sách nhân viên</h2></Button>
          
        </ConfigProvider>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div
        style={{ backgroundColor: "white", display: "block",margin:"3% 5%",textAlign:"left",borderRadius:"10px",padding:"1% 2% 5vh"
 }}
      >
        <h2 style={{ paddingLeft: "10px" }}>Thông tin chung</h2>
        <hr style={{ borderTop: "1px solid whitesmoke" }} />

        <Form
          form={form}
          onFinish={handleSubmit}
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
                message:"Vùng này không được để trống"

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
                message:"Vùng này không được để trống"

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
