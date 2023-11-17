
import { Alert, Button, DatePicker, Form, Input, InputNumber, Select, message } from "antd";
import { Option } from "antd/es/mentions";
import "../Account"
import React, { useEffect, useState } from "react";
import Account from "../Account";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { useNavigate } from "react-router-dom";

export default function CreatePayment(){
    document.title="Tạo phiếu chi mới"
    const navigate=useNavigate()
    const [data,setData]=useState({});
    const [value,setValue]=useState()
    const [error,setError]=useState(false)
    const [dataOfType,setDataOfType]=useState([]);
    const [employee,setEmployee]=useState([])
    const [customer_type,setCusTomer_type]=useState([])
    const [customer,setCustomer]=useState([]);
    const [form] = Form.useForm();
    useEffect(()=>{
        localStorage.setItem("open","payment")
        localStorage.setItem("selected","create-payment")
        axios(
            {
                url:baseURL+"/payment-type/list",
                method:"post",
                headers:{
                    "Authorization":Token
                },
                data:{
                    value:null
                }
            }
        ).then(res=>{
            setDataOfType(res.data)
            console.log(dataOfType);
        })
        .catch(err=>{message.error("Có lỗi khi lấy dữ liệu từ hình thức thanh toán")})
        axios(
            {
                url:baseURL+"/customer-type/list",
                method:"post",
                headers:{
                    "Authorization":Token
                },
                data:{
                    value:value
                }
            }
        ).then(res=>{setCusTomer_type(res.data)})
        .catch(err=>{message.error("Có lỗi khi lấy dữ liệu nhóm khách hàng")})
    },[value])
    const handleSubmit=()=>{
        axios(
            {
                method:"post",
                url:baseURL+"/payment/staff/create-one",
                headers:{
                    "Authorization":Token
                },
                data:data
            }
        ).then(res=>{navigate("/payment-table")})
        .catch(err=>{message.error("Tạo thất bại")})
    }
    const handleType=(e)=>{
        const arr=e.split("-")
        axios(
            {
                url:baseURL+"/customer/create-payment",
                method:"post",
                headers:{
                    "Authorization":Token
                },
                data:{
                    id:arr[0]
                }
            }
        ).then(res=>{
            setCustomer(res.data);
        }).catch(err=>{message.error("Có lỗi khi lấy dữ liệu từ khách hàng")})
    }
    return(
        <div className="content">
      <div className="taskbar">
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
        <h2>Tạo phiếu chi</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div
        className="inside"
        style={{ backgroundColor: "white", display: "block" }}
      >
        <h2 style={{ paddingLeft: "10px" }}>Thông tin chung</h2>
        <hr style={{ borderTop: "1px solid whitesmoke" }} />

        <Form
          onFinish={handleSubmit}
          form={form}
          layout="vertical"
          style={{
            maxWidth: "100%",
            margin: "10px",
          }}
        >
          <Form.Item
            name="code"
            label="Mã phiếu chi"
            rules={[
              {
                pattern: "^(?!PMT).*",
                message: "Tiền tố PMT không hợp lệ",
              },
            ]}
            style={{
              width: "40%",
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
                required:true
              },
            ]}
            style={{float:"left",width:"40%"}}
          >
            <Select
              showSearch
              placeholder="Chọn nhóm khách hàng"              
              onSelect={handleType}
              style={{ 
                float:"left"
                }}
            >
              {customer_type.map(i=>{
                if(customer_type.length>0) return <Option value={i.id+"-"+i.content}>{i.content}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="customer"
            label="Khách hàng nhận"
            rules={[
              {
                required:true
              },
            ]}
          >
            <Select
              showSearch
              disabled={customer.length===0}
              placeholder="Chọn khách hàng"
              style={{ paddingLeft: "10px" }}
              onSelect={e=>{
                const arr=e.split("-")
                setData({
                    ...data,
                    customer:{
                        id:arr[0],
                        code:arr[2]
                    }
                })
              }}
            >
              {customer.map(i=>{
                if(customer_type.length>0) return <Option value={i.id+"-"+i.name+"-"+i.code}>{i.name+"-"+i.code}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="payment_type"
            label="Hình thức thanh toán"
            rules={[
              {
                required:true
              },
            ]}
            style={{width:"40%",float:"left"}}
          >
            <Select
              showSearch
              placeholder="Chọn hình thức thanh toán"
              onSelect={(e) => {
                const arr=e.split("-")
                setData(
                  {
                    ...data,
                    paymentType:{
                        id:arr[0],  
                      name:arr[1]
                    }
                  }
                )
              }}
            >
              {dataOfType.map(i=>{
                console.log(i)
                if(dataOfType.length>0) return <Option value={i.id+"-"+i.name}>{i.name}</Option>
              })}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="paid"
            label="Giá trị"
            initialValue={0}
            rules={[
              {
                required:true,
              },
            ]}
          >
            <InputNumber 
            min={0}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            style={{
                marginLeft:"10px",
                width:"98.5%"
            }}
            onChange={e=>{setData(
                {
                    ...data,
                    paid:e
                }
            )}}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Chọn trạng thái"
              onSelect={(e) => {
                setData(
                  {
                    ...data,
                    status:e
                  }
                )
              }}
              style={{ width:"40%" }}
            >
              <Option value="paid">Đã thanh toán</Option>
              <Option value="unpaid"> Chưa thanh toán</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              style={{ margin: "10px" }}
              htmlType="submit"
            >
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    )
}