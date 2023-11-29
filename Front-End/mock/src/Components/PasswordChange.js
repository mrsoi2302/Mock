import { Alert, Button, Form, Input, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import Account from "./Account";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function PasswordChange(props) {
  document.title = "Đổi mật khẩu";
  const [form] = Form.useForm();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    form
      .validateFields()
      .then(() => {
        axios({
          url: "http://localhost:8080/change-password",
          method: "POST",
          headers: {
            Authorization: props.token,
          },
          data: {
            value: oldPassword,
            t: newPassword,
          },
        })
          .then((res) => {
            message.success("Đổi mật khẩu thành công");
            navigate("/main");
          })
          .catch((err) => message.error("Sai mật khẩu hiện tại"));
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };
  useEffect(() => {
    props.setOpenKeys("")
    props.setSelectedKeys("")
  }, []);

  return (
    <div className="content">
      <div className="taskbar">
        <h2>Đổi mật khẩu</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div
        className="inside"
        style={{ backgroundColor: "white", display: "block" }}
      >
        <h2 style={{ paddingLeft: "10px" }}>Đổi mật khẩu</h2>
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
            name="password"
            label="Mật khẩu hiện tại"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ width: "50%" }}
          >
            <Input
              type="password"
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ width: "50%" }}
          >
            <Input
              type="password"
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Nhập lại"
            rules={[
              {
                pattern: newPassword,
                required: true,
                message: "Mật khẩu chưa giống",
              },
            ]}
            style={{ width: "50%" }}
          >
            <Input
              type="password"
              onChange={(e) => {
                console.log(confirmPassword != newPassword);

                setConfirmPassword(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ margin: "10px" }}>
              Tiếp tục
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
