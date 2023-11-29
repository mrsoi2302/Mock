
import { Alert, Button, ConfigProvider, DatePicker, Form, Input, Select, message } from "antd";
import { Option } from "antd/es/mentions";
import "../Account"
import React, { useEffect, useState } from "react";
import Account from "../Account";
import {CaretLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { useNavigate } from "react-router-dom";

export default function CreateCustomer(props){
    document.title="Tạo khách hàng mới"
    const navigate=useNavigate()
    const [data,setData]=useState({});
    const [value,setValue]=useState()
    const [error,setError]=useState(false)
    const [dataOfType,setDataOfType]=useState([]);
    const [form] = Form.useForm();
    useEffect(()=>{
      props.setOpenKeys("customer")
      props.setSelectedKeys("customer-list")
        axios(
            {
                url:baseURL+"/customer-type/list",
                method:"post",
                headers:{
                    "Authorization":Token()
                },
                data:{
                    value:value
                }
            }
        ).then(res=>{setDataOfType(res.data)})
        .catch(err=>{message.error("Có lỗi")})
    },[value])
    const handleSubmit=()=>{
        axios(
            {
                method:"post",
                url:baseURL+"/customer/staff/create-one",
                headers:{
                    "Authorization":Token()
                },
                data:data
            }
        ).then(res=>{navigate("/customer-table")})
        .catch(err=>{message.error("Tạo thất bại")})
    }
    return(
<div className="content" style={{paddingTop:"10px"}}>      <div className="taskbar">
        {error && (
          <Alert
            message="Tạo thất bại"
            showIcon
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
          <Button type="text" onClick={e=>{navigate("/payment-table")}} size="large" style={{height:"fit-content"}}><h2><CaretLeftOutlined/> Danh sách khách hàng</h2></Button>
          
        </ConfigProvider>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div
        style={{ backgroundColor: "white", display: "block",margin:"3% 5%",textAlign:"left",borderRadius:"10px",padding:"1% 2% 5vh"
 }}
      >
        <h2 style={{ paddingLeft: "10px",textAlign:"left" }}>Thông tin chung</h2>
        <hr style={{ borderTop: "1px solid whitesmoke" }} />

        <Form
          onFinish={handleSubmit}
          form={form}
          layout="vertical"
          style={{
            maxWidth: "100%",
            margin: "10px",
            textAlign:"left"
          }}
        >
          <Form.Item
            name="name"
            label="Tên khách hàng"
            rules={[
              {
                required: true,
                message:"Vùng này không được để trống"

              },
            ]}
            style={
                {width:"50%",
                float:"left",
                marginRight:"10px"}
            }
          >
            <Input
              onChange={(e) => {
                setData(
                  {
                    ...data,
                    name:e.target.value
                  }
                )
              }}
            />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Ngày sinh"
            rules={[
              {
                required: true,
                message:"Vùng này không được để trống"

              },
            ]}
            style={
                {float:"left",
                marginRight:"10px"}
            }
          >
            <DatePicker onChange={(e,s)=>{
                setData({...data,birthday:s})
                }}/>
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[
              {
                required: true,
                message:"Vùng này không được để trống"

              },
            ]}
          >
            <Select
              placeholder="Chọn giới tính"
              onSearch={e=>{
                setValue(e)
              }}
              onSelect={(e) => {
                setData(
                  {
                    ...data,
                    gender:e
                  }
                )
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
                pattern: "^(?!CTM).*",
                message: "Tiền tố CTM không hợp lệ",
              },
            ]}
            style={{
              float: "left",
              width: "45%",
            }}
          >
            <Input
              onChange={(e) => {
                setData(
                  {
                    ...data,
                    code:e.target.value
                  }
                )
              }}
            />
          </Form.Item>
          <Form.Item
            name="customer_type"
            label="Nhóm khách hàng"
            rules={[
              {
                required:true,
                message:"Vùng này không được để trống"

              },
            ]}
          >
            <Select
              showSearch
              placeholder="Chọn nhóm khách hàng"
              filterOption={false}
              onSearch={e=>{
                setValue(e)
                console.log(value)
              }}
              onSelect={(e) => {
                setData(
                  {
                    ...data,
                    customer_type:{
                      id:e
                    }
                  }
                )
              }}
              style={{ paddingLeft: "10px" }}
            >
              {dataOfType.map(i=>{
                if(dataOfType.length>0) return <Option value={i.id}>{i.content}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                pattern:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                required: true,
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input
              onChange={(e) => {
                setData({
                  ...data,
                  email:e.target.value
                })
              }}
            />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^\d+$/,
                required:true,
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
                  contact:e.target.value
                })
              }}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[
              {
                required: true,
                message:"Vùng này không được để trống"

              },
            ]}
          >
            <Select
              placeholder="Chọn trạng thái"
              onSearch={e=>{
                setValue(e)
              }}
              onSelect={(e) => {
                setData(
                  {
                    ...data,
                    status:e
                  }
                )
              }}
              style={{ paddingLeft: "10px" }}
            >
              <Option value="active">Đã kích hoạt</Option>
              <Option value="non-active"> Chưa kích hoạt</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              style={{ margin: "10px" }}
              htmlType="submit"
              size="large"
            >
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    )
}