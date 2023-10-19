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
const ProviderInput = () => {
  const [code,setCode]=useState("")
  const [name,setName]=useState("")
  const [contact,setContact]=useState("")
  const [debt,setDebt]=useState(0)
  const [status,setStatus]=useState({})
  const navigate=useNavigate()
  const [error,setError]=useState(true)
  const [form]=Form.useForm()
  const handleSubmit=()=>{
    const reg = /^-?\d*(\.\d*)?$/;
    if(reg.test(contact)&&reg.test(debt)){
      const obj={
        code:code,
        name:name,
        contact:contact,
        debt:debt,
        status:status
      }
      form
      .validateFields()
      .then(() => {
        axios(
          {
            url:"http://localhost:8080/admin/provider",
            method:"POST",
            headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            data:obj
          }
        ).then((res)=>{
          navigate("/provider-list")
        }
        ).catch((err)=>{
          alert("Tạo thất bại")
        }
        )
        
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  }}
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
        name="contact"
        label="Số điện thoại"
        rules={[
          {
            pattern:"^\\d+$",
            required: true,
            message:"Số điện thoại không hợp lệ"
          },
        ]}
      >
        <Input
          onChange={(e)=>{
            setContact(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item
        name="status"
        label="Trạng thái"
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
            if(e==='active') {setStatus({
              id:1,
              name:e
            })}else{
              setStatus({
                id:2,
                name:e
              })
            }
          }}
        >
          <Option value="active">active</Option>
          <Option value="non-active">non-active</Option>
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
export default ProviderInput;