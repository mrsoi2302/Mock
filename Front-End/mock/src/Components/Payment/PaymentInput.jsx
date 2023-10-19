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
const PaymentInput = () => {
  const navigate=useNavigate()
  const [paid,setPaid]=useState(0)
  const [customer,setCustomer]=useState()
  const [paymentType,setPaymentType]=useState()
  const [code,setCode]=useState("")
  const [error,setError]=useState(true)
  const [customerList,setCustomerList]=useState([])
  const [customerTypeList,setCustomerTypeList]=useState([])
  const [form]=Form.useForm()
  useEffect(()=>{
    axios(
      {
        url:"http://localhost:8080/customer/findall",
        method:"get",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt"),
        },
      }
    ).then(res=>{
      setCustomerList(res.data)
    }
    ).catch(err=>{
      console.log(err);
    })
    axios(
      {
        url:"http://localhost:8080/admin/payment-type",
        method:"get",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt"),
        },
      }
    ).then(res=>{
      setCustomerTypeList(res.data)
    }
    ).catch(err=>{
      console.log(err);
    })
  },[])
  const handleSubmit=(e)=>{
      e.preventDefault();
      form
      .validateFields()
      .then(() => {
        axios(
          {
            url:"http://localhost:8080/admin/payment",
            method:"POST",
            headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            data:{
              code:code,
              paid:paid,
              paymentType:{id:paymentType},
              customer:{id:customer}
            }
            
          }
        ).then((res)=>{
          navigate("/payment-list")
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
        name="paid"
        label="Giá trị"
        initialValue={0}
      >
        <InputNumber
        style={{width:"400px"}}
          onChange={(e)=>{
            setPaid(e);
          }}
        />
      </Form.Item>
      <Form.Item
      rules={[
          {
            required: true,
          },
        ]}
        name="customer"
        label="Người trả"
      >
        <Select
        style={{maxWidth:"400px"}}
          allowClear
          onSelect={(e)=>{
            setCustomer(e)
          }}
        >
        {customerList.map(item=>{
          return <Option key={item.id} >{item.name}</Option>
        })}
        </Select>
      </Form.Item>
      <Form.Item
      rules={[
          {
            required: true,
          },
        ]}
        name="paymentType"
        label="Hình thức thanh toán"
      >
        <Select
          allowClear
          onSelect={(e)=>{
            setPaymentType(e)
          }}
        >
        {customerTypeList.map(item=>{
          return <Option key={item.id} >{item.name}</Option>
        })}
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
export default PaymentInput;