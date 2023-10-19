import { Button, Form, Input, Select } from "antd";
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

export default function PasswordChange(){
    document.title = "Đổi mật khẩu";
    localStorage.removeItem("selected")
    localStorage.removeItem("open")
  const [form] = Form.useForm();
    const [oldPassword,setOldPassword]=useState("")
    const [newPassword,setNewPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const navigate=useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        axios({
          url: "http://localhost:8080/change-password",
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          data:{
            t:oldPassword,
            value:newPassword
          }
        })
          .then((res) => {
            navigate("/information")
          })
          .catch((err) => alert("sai mật khẩu hiện tại"));
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };
  useEffect(()=>{
    localStorage.removeItem("selected")
    localStorage.removeItem("open")
  },[])
  

  return (
    <div className="content">
      <div className="taskbar">
        <h2>Thông tin tài khoản</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div className="inside">
        <Form
          {...layout}
          form={form}
          style={{
            maxWidth: 600,
            margin: "10px",
          }}
        >
          <Form.Item name="oldPassword" label="Mật khẩu hiện tại" rules={[{ required: true }]}>
            <Input
                type="password"
                onChange={e=>{
                setOldPassword(e.target.value)
                }}
              name="oldPassword"              
            />
          </Form.Item>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true }]}>
            <Input
                type="password"
                onChange={e=>{
                setNewPassword(e.target.value)
                }}
              name="newPassword"              
            />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Nhập lại mật khẩu" rules={[{pattern:newPassword, required: true ,message:"Mật khẩu không giống"}]}>
            <Input
                type="password"
                onChange={e=>{
                setConfirmPassword(e.target.value)
                }}
              name="confirmPassword"              
            />
          </Form.Item>
          <Button type="primary" onClick={handleSubmit}>Đổi lại</Button>
        </Form>
      </div>
    </div>
  );
}