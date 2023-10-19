import React, { useEffect, useState } from 'react';
import { Button, Calendar, DatePicker, Form, Input, InputNumber, Select } from 'antd';
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
const CustomerInput = () => {
  const [code,setCode]=useState("")
  const [name,setName]=useState("")
  const [contact,setContact]=useState("")
  const [status,setStatus]=useState({})
  const navigate=useNavigate()
  const [birthday,setBirthday]=useState()
  const [gender,setGender]=useState()
  const [target,setTarget]=useState()
  const [customerType,setCustomerType]=useState()
  const [error,setError]=useState(true)
  const [dataType,setDataType]=useState([])
  const [form]=Form.useForm()
  useEffect(()=>{
    axios(
      {
        url:"http://localhost:8080/customer-type/show-all",
        method:"get",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt"),
        },
      }
    ).then(res=>{
      setDataType(res.data)
    }
    ).catch(err=>{
      console.log(err);
    })
  },[])
  const handleType=()=>{
    
  }
  const handleSubmit=(e)=>{
    const reg = /^-?\d*(\.\d*)?$/;
    if(reg.test(contact)){
      const obj={
        code:code,
        name:name,
        contact:contact,
        gender:gender,
        status:status,
        target:target,
        birthday_day:birthday.substring(8,10),
        birthday_month:birthday.substring(5,7),
        birthday_year:birthday.substring(0,4),
        customerType:{
        id:customerType
        }
      }
      e.preventDefault();

      form
      .validateFields()
      .then(() => {
        axios(
          {
            url:"http://localhost:8080/admin/customer",
            method:"POST",
            headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            data:obj
          }
        ).then((res)=>{
          navigate("/customer-list")
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
  }
  const onChange = (date, dateString) => {
    console.log(dateString);
    setBirthday(dateString)
};
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
        name="gender"
        label="Giới tính"
        rules={[
          {
            required: true,
          },
        ]}
      >
<Select
          allowClear
          onSelect={(e)=>{
            setGender(e)
          }}
        >
          <Option value="Nam">Nam</Option>
          <Option value="Nữ">Nữ</Option>
          <Option value="LGBT">LGBT</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="birthday"
        label="Ngày sinh"
        rules={[
          {
            required: true,
          },
        ]}
      >
      <DatePicker style={{float:"left"}} onChange={onChange} />
      </Form.Item>
      <Form.Item
        name="target"
        label="Mục tiêu"
      >
        <InputNumber
        style={{width:"400px"}}
          onChange={(e)=>{
            setTarget(e);
          }}
        />
      </Form.Item>
      <Form.Item
        name="customerType"
        label="Nhóm khách hàng"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          allowClear
          onSelect={(e)=>{
            setCustomerType(e)
          }}
        >
        {dataType.map(item=>{
          return <Option key={item.id} >{item.name}</Option>
        })}
        </Select>
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
};
export default CustomerInput;