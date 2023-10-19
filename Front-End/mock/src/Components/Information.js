import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Account from "./Account";

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

export default function Information() {
  document.title = "Thông tin nhân viên";
  localStorage.removeItem("selected")
    localStorage.removeItem("open")
  const [form] = Form.useForm();

  const [data, setData] = useState(null); // Khởi tạo data ban đầu là null
  const [adjust, setAdjust] = useState(false);
  const [err, setErr] = useState(false);
  const [code, setCode] = useState(window.location.pathname.substring(22));
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    form
      .validateFields()
      .then(() => {
        axios({
          url: "http://localhost:8080/admin/employee",
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          data: {
            code: code,
            name: name,
            username: username,
          },
        })
          .then((res) => {
            window.location.reload();
          })
          .catch((err) => alert("failed"));
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  useEffect(() => {
    
    axios({
      url: "http://localhost:8080/information",
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        setData(res.data); // Cập nhật data từ dữ liệu API
      })
      .catch((err) => {
        setErr(true);
      });
  }, [code]);

  useEffect(() => {
    if (data != null) {
      setUsername(data.username);
      setRole(data.role);
      setName(data.name);
    }
  }, [data]);

  return (
    <div className="content">
      <div className="taskbar">
        <h2>Thông tin tài khoản</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div className="inside">
        {data!= null && <Form
          {...layout}
          form={form}
          style={{
            maxWidth: 600,
            margin: "10px",
          }}
        >
          <Form.Item name="code" label="Mã" rules={[{ required: true }]} initialValue={data.code}>
            <Input  disabled={true} readOnly />
          </Form.Item>
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]} initialValue={data.name}>
            <Input
                onChange={e=>{
                setName(e.target.value)
                }}
              name="name"
              disabled={!adjust}
              
            />
          </Form.Item>
          <Form.Item
        name="username"
        label="Tên đăng nhập"
        rules={[
          {
            required: true,
            message:"Tên đăng nhập không hợp lệ"
          },
        ]}
        initialValue={data.username}
      >
        <Input
        disabled={true}
          onChange={(e)=>{
            setUsername(e.target.value);
          }}
        />
      </Form.Item>
          <Form.Item name="role" label="Công nợ" required rules={[{ required: true }]} initialValue={data.role}>
            <Input value={role} disabled={true} readOnly />
          </Form.Item>
          <Form.Item {...tailLayout}>
            {!adjust && (
              <Button onClick={() => setAdjust(!adjust)} style={{ margin: "10px" }}>
                Chỉnh sửa
              </Button>
            )}
            {adjust && (
              <>
                <Button
                  style={{ margin: "10px" }}
                  onClick={handleSubmit}
                  htmlType="submit"
                >
                  Xác nhận
                </Button>
                <Button onClick={() => setAdjust(!adjust)} style={{ margin: "10px" }}>
                  Hủy
                </Button>
              </>
            )}
          </Form.Item>
        </Form>}
      </div>
    </div>
  );
}
