import { Alert, Button, Card, ConfigProvider, Form, Input, Select, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import ExceptionBox from "../ExceptionBox";
import { Option } from "antd/es/mentions";
import {CaretLeftOutlined } from "@ant-design/icons";

export default function ModifyEmployee(props) {
  document.title = "Chỉnh sửa nhân viên";
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { code } = useParams();
  localStorage.setItem("open", "employee");
  localStorage.setItem("selected", "employee-list");
  const [data, setData] = useState({
    data: {},
    loading: true,
  });
  const [err, setErr] = useState(false);
  useEffect(() => {
    props.setOpenKeys("employee")
    props.setSelectedKeys("employee-list")
    axios({
      url: baseURL + "/employee/admin/information?code=" + code,
      method: "get",
      headers: {
        Authorization: Token(),
      },
    })
      .then((res) => {
        setData({
          data: res.data,
          loading: false,
        });
      })
      .catch((err) => {
        setErr(true);
      });
  }, []);

  const handleSubmit = (e) => {
    axios({
      method: "put",
      url: baseURL + "/employee/admin",
      headers: {
        Authorization: Token(),
      },
      data: e,
    })
      .then((res) => {
        navigate("/employee/information/" + code);
      })
      .catch((error) => {
        setErr(true);
      });
  };
  return (
    <div className="content" style={{paddingTop:"10px"}}>
      <div className="taskbar">
        {err && (
          <Alert
            message="Sửa thất bại"
            showIcon
            description="Chỉ quản trị viên mới có thể sử dụng quyền này"
            type="error"
            onClick={(e) => {
              setErr(false);
            }}
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
          <Button type="text" onClick={e=>{navigate("/employee/information/"+code)}} size="large" style={{height:"fit-content"}}><h2><CaretLeftOutlined/> Thông tin nhân viên</h2></Button>
          
        </ConfigProvider>
        <Account name={localStorage.getItem("name")} />
      </div>
      {data.loading ? (
        <Spin />
      ) : (
        <div
          className="inside"
          style={{ backgroundColor: "white", display: "block",margin:"3% 5%",textAlign:"left",borderRadius:"10px",padding:"1% 2% 5vh"
 }}        >
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
              initialValue={data.data.name}
              rules={[
                {
                  required: true,
                  message:"Vùng này không được để trống"

                },
              ]}
            >
              <Input
                onChange={(e) => {
                  setData({
                    ...data,
                    data: {
                      ...data.data,
                      name: e.target.value,
                    },
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              name="code"
              label="Mã nhân viên"
              initialValue={data.data.code}
              rules={[
                {
                  message: "Tiền tố EPL không hợp lệ",
                },
              ]}
              style={{
                float: "left",
                width: "45%",
              }}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="role"
              label="Vai trò"
              initialValue={data.data.role}
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
                  setData({
                    ...data.data,
                    data: {
                      ...data.data,
                      role: e,
                    },
                  });
                }}
                style={{ paddingLeft: "10px" }}
              >
                <Option value="STAFF">Nhân viên</Option>
                <Option value="USER">Người dùng</Option>
              </Select>
            </Form.Item>
            <Form.Item
              initialValue={data.data.username}
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
              onChange={e=>{
                setData({
                    ...data.data,
                    data: {
                      ...data.data,
                      username: e.target.value,
                    },
                  });
              }} />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
            >
              <Input type="password" onChange={e=>{
                setData({
                    ...data.data,
                    data: {
                      ...data.data,
                      password: e.target.value,
                    },
                  });
              }} />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                style={{ margin: "10px" }}
                onClick={handleSubmit}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
