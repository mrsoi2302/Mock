import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Space } from 'antd';
import dayjs from 'dayjs';
import Account from '../Account';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmBox from '../ConfirmBox';
import * as XLSX from "xlsx"; // Thay đổi import này
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDF from './PDF';
const { Option }= Select;
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
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
};
/* eslint-enable no-template-curly-in-string */
function PaymentInformation() {
  document.title="Thông tin phiếu chi"
  const navigate=useNavigate()
  const [data,setData]=useState()
  const [paid,setPaid]=useState(0)
  const [customer,setCustomer]=useState()
  const [paymentType,setPaymentType]=useState()
  const [code,setCode]=useState(window.location.pathname.substring(21))
  const [error,setError]=useState(true)
  const [customerList,setCustomerList]=useState([])
  const [customerTypeList,setCustomerTypeList]=useState([])
  const [adjust,setAdjust]=useState(false)
  const [form]=Form.useForm()
  const handleSubmit=(e)=>{    
    const obj={
      code:code,
      paid:paid,
      paymentType:paymentType,
      customer:customer,
    }
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        axios(
          {
            url:"http://localhost:8080/admin/payment",
            method:"PUT",
            headers:{
              "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            data:obj
          }
        ).then(()=>{
          alert("Thanh cong")
          window.location.reload()
        }).catch(
          ()=>
          {alert("Chỉnh sửa thất bại")}
        ) 
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  }
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
        axios(
            {
                url:"http://localhost:8080/payment/information?code="+code,
                method:"get",
                headers:{
                    'Authorization':"Bearer "+localStorage.getItem("jwt")
                }
            }
        ).then(
            res=>{
                setData(res.data)
                setCode(res.data.code)
                setCustomer(res.data.customer)
                setPaid(res.data.paid)
                setPaymentType(res.data.paymentType)
            }
        ).catch(err=>{alert(err);})
  
          
    },[])
    console.log(data);
    return (
      <div className='content'>
        <div className="taskbar">
                <h2>Thông tin phiếu chi</h2>
                <Account
                    name={localStorage.getItem("name")}
                />
            </div>
            <div className='inside'>
            {data !=null && <Form
            {...layout}
            form={form}
            style={{
              maxWidth: 600,
              margin:"10px"
            }}
            validateMessages={validateMessages}
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
              initialValue={data.code}
            >
              <Input 
                disabled={true}
                onChange={(e)=>{
                  setCode(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="paid"
              label="Giá trị"
              initialValue={data.paid}
            >
              <InputNumber
              disabled={!adjust}
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
              initialValue={data.customer.name}
            >
              <Select
                disabled={!adjust}
                onSelect={(e)=>{
                  setCustomer(e)
                }}
              >
              {customerList.map(item=>{
                return <Option key={item.code} >{item.name}</Option>
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
              initialValue={data.paymentType.name}
            >
              <Select
                disabled={!adjust}
                onSelect={(e)=>{
                  setPaymentType(e)
                }}
              >
              {customerTypeList.map(item=>{
                return <Option key={item.id} >{item.name}</Option>
              })}
              </Select>
            </Form.Item>
            <Form.Item
            wrapperCol={{
                ...layout.wrapperCol,
                offset: 8,
            }}
            >
            {!adjust && 
            <>
            <Button type="primary" onClick={()=>{setAdjust(!adjust)}}>
                Chỉnh sửa
            </Button>
            {data!=null && <PDFDownloadLink document={<PDF data={data}/>} fileName='receipt'>
                {({loading})=>(loading ? <p>loading...</p> : <Button type='primary' style={{ margin: "10px" }}>
                      In
                    </Button>)}
            </PDFDownloadLink>}
            </>
            
            }
            {adjust && (
              <>
                <Button
                type='primary'
                  style={{ margin: "10px" }}
                  onClick={handleSubmit}
                  htmlType="submit"
                >
                  Xác nhận
                </Button>
                <Button onClick={() => window.location.reload()} type='primary' style={{ margin: "10px" }}>
                  Hủy
                </Button>
              </>
            )}
            
            </Form.Item>
          </Form>}
        </div>
      </div>
    );
}
export default PaymentInformation;