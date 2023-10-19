import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import Account from '../Account';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmBox from '../ConfirmBox';
import html2pdf from 'html2pdf.js';
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
export default function ReceiptInformation() {
  const contentRef=useRef(null);
  document.title="Thông tin phiếu thu"
  const navigate=useNavigate()
  const [data,setData]=useState()
  const [revenue,setRevenue]=useState(0)
  const [provider,setProvider]=useState()
  const [receiptType,setReceiptType]=useState()
  const [code,setCode]=useState(window.location.pathname.substring(21))
  const [error,setError]=useState(true)
  const [providerList,setProviderList]=useState([])
  const [providerTypeList,setProviderTypeList]=useState([])
  const [adjust,setAdjust]=useState(false)
  const [form]=Form.useForm()
  const [contentHtml,setContentHtml]=useState()
  const handlePrintPDF = () => {
    // const contentHtml =
    //   <div>
    //     <h1>Your Invoice</h1>
    //     <p>Mã phiếu chi: ${code}</p>
    //     <p>Giá trị: ${revenue}</p>
    //     <p>Người trả: ${provider ? provider.name : ""}</p>
    //     <p>Hình thức thanh toán: ${receiptType ? receiptType.name : ""}</p>
    //   </div>
    // ;

    const options = {
      margin: 10,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
    .from(contentHtml)
    .set(options)
    .outputPdf((pdf) => {
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);

      // Tạo một thẻ a để tạo liên kết tải về
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf"; // Tên tệp mặc định
      a.click();
    });
  };
  const handleSubmit=(e)=>{    
    const obj={
      code:code,
      submitter:'s',
      revenue:revenue,
      receiptType:{id:receiptType.id},
      provider:{id:provider.id},
    }
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        axios(
          {
            url:"http://localhost:8080/admin/receipt",
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
        axios(
            {
                url:"http://localhost:8080/receipt/information?code="+code,
                method:"get",
                headers:{
                    'Authorization':"Bearer "+localStorage.getItem("jwt")
                }
            }
        ).then(
            res=>{
                setData(res.data)
                setCode(res.data.code)
                setProvider(res.data.provider)
                setRevenue(res.data.revenue)
                setReceiptType(res.data.receiptType)
        
            }
        ).catch(err=>{alert(err);})
  
          
    },[])
    console.log(data);
    return (
      <div className='content'>
        <div className="taskbar">
                <h2>Thông tin phiếu thu</h2>
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
              name="revenue"
              label="Giá trị"
              initialValue={data.revenue}
            >
              <InputNumber
              disabled={!adjust}
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
              initialValue={data.provider.name}
            >
              <Select
                disabled={!adjust}
                onSelect={(e)=>{
                  setProvider(e)
                }}
              >
              {providerList.map(item=>{
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
              name="receiptType"
              label="Hình thức thanh toán"
              initialValue={data.receiptType.name}
            >
              <Select
                disabled={!adjust}
                onSelect={(e)=>{
                  setReceiptType(e)
                }}
              >
              {providerTypeList.map(item=>{
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
