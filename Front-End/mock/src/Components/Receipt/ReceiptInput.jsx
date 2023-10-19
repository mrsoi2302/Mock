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
const ReceiptInput = () => {
  const navigate=useNavigate()
  const [revenue,setRevenue]=useState(0)
  const [provider,setProvider]=useState()
  const [paymentType,setPaymentType]=useState()
  const [code,setCode]=useState("")
  const [error,setError]=useState(true)
  const [providerList,setProviderList]=useState([])
  const [providerTypeList,setProviderTypeList]=useState([])
  const [form]=Form.useForm()
  useEffect(()=>{
    axios(
      {
        url:"http://localhost:8080/provider/findall",
        method:"get",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt"),
        },
      }
    ).then(res=>{
      setProviderList(res.data)
    }
    ).catch(err=>{
      console.log(err);
    })
    axios(
      {
        url:"http://localhost:8080/admin/receipt-type",
        method:"get",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt"),
        },
      }
    ).then(res=>{
      setProviderTypeList(res.data)
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
            url:"http://localhost:8080/admin/receipt",
            method:"POST",
            headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            data:{
              code:code,
              revenue:revenue,
              provider:{id:provider},
              receiptType:{id:paymentType},
            }
            
          }
        ).then((res)=>{
          navigate("/receipt-list")
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
        name="revenue"
        label="Giá trị"
        initialValue={0}
      >
        <InputNumber
        style={{width:"400px"}}
          onChange={(e)=>{
            setRevenue(e);
          }}
        />
      </Form.Item>
      <Form.Item
      rules={[
          {
            required: true,
          },
        ]}
        name="provider"
        label="Người trả"
      >
        <Select
          allowClear
          onSelect={(e)=>{
            setProvider(e)
          }}
        >
        {providerList.map(item=>{
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
        {providerTypeList.map(item=>{
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
export default ReceiptInput;