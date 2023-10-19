import React, { useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmBox from '../ConfirmBox';
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
const EmployeeInput = () => {
  const [code,setCode]=useState("")
  const [name,setName]=useState("")
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState()
  const [role,setRole]=useState({})
  const navigate=useNavigate()
  const [error,setError]=useState(true)
  const [form]=Form.useForm()
  const handleSubmit=()=>{
      const obj={
        code:code,
        name:name,
        username:username,
        password:password,
        role:role
      }
      form
      .validateFields()
      .then(() => {
        axios(
          {
            url:"http://localhost:8080/admin/create-account",
            method:"POST",
            headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            data:obj
          }
        ).then((res)=>{
          navigate("/employee-list")
        }
        ).catch((err)=>{
          alert("Tạo thất bại")
        }
        )
        
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  }
  return (
    <Form
      {...layout}
      form={form}
      style={{
        maxWidth: 600,
        margin:"10px"
      }}
    >
    {!error&& <ConfirmBox msg="Tạo không thành công" setConfirm={setError}/>}
      <Form.Item
        name="code"
        label="Mã"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input 
          onChange={(e)=>{
            setCode(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item
        name="name"
        label="Họ và tên"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input 
          onChange={(e)=>{
            setName(e.target.value);
          }}
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
      >
        <Input
          onChange={(e)=>{
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
            message:"Mật khẩu không hợp lệ"
          },
        ]}
      >
        <Input
          type='password'
          onChange={(e)=>{
            setPassword(e.target.value);
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
      >
        <Select
          placeholder="Select a option and change input text above"
          allowClear
          onSelect={(e)=>{
            setRole(e)
          }}
        >
          <Option value="ADMIN">ADMIN</Option>
          <Option value="USER">USER</Option>
        </Select>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" style={{margin:"10px"}} onClick={handleSubmit}>
          Tạo mới
        </Button>
      </Form.Item>
    </Form>
  );
}
export default EmployeeInput;