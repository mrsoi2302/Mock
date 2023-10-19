import React, { useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
const CustomerTypeInput = () => {
  const [code,setCode]=useState("")
  const [name,setName]=useState("")
  const navigate=useNavigate()
  const handleSubmit=()=>{
        let obj={
            code:code,
            name:name
        }
      axios(
        {
          url:"http://localhost:8080/admin/create-type",
          method:"POST",
          headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
          },
          data:obj
        }
      ).then((res)=>{
        navigate("/customer-type")
      }
      ).catch((err)=>{
        alert("Tạo thất bại")
      }
      )
  }
  return (
    <Form
      {...layout}

      style={{
        maxWidth: 600,
        margin:"10px"
      }}
    >
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
        label="Tên"
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
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" style={{margin:"10px"}} onClick={handleSubmit}>
          Tạo mới
        </Button>
      </Form.Item>
    </Form>
  );
};
export default CustomerTypeInput;