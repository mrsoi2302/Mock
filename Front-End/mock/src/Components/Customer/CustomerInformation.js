import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Space } from 'antd';
import dayjs from 'dayjs';
import Account from '../Account';
import axios from 'axios';
import { Option } from 'antd/es/mentions';
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
};
/* eslint-enable no-template-curly-in-string */

const onFinish = (values) => {
  console.log(values);
};
function CustomerInformation() {
    document.title="Thông tin khách hàng"
    const dateFormat = 'YYYY-MM-DD';
    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [adjust, setAdjust] = useState(false);
    const [code, setCode] = useState(window.location.pathname.substring(22));
    const [name, setName] = useState();
    const [gender,setGender]=useState()
    const [contact, setContact] = useState();
    const [status, setStatus] = useState();
    const [birthday,setBirthday]=useState();
    const [customerType,setCustomerType]=useState();
    const [dataType,setDataType]=useState();
    const onChange = (date, dateString) => {
      setBirthday(dateString)
      console.log(birthday);
  };
  const handleSubmit=(e)=>{
    console.log(birthday);
    
    if(birthday!=null){const obj={
      code:code,
      name:name,
      contact:contact,
      gender:gender,
      customerType:customerType,
      status:status,
      birthday_year:birthday.substring(0,4),
      birthday_month:birthday.substring(5,7),
      birthday_day:birthday.substring(8,10)
    }
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        axios(
          {
            url:"http://localhost:8080/admin/customer",
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
  }
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
        axios(
            {
                url:"http://localhost:8080/customer/information?code="+code,
                method:"get",
                headers:{
                    'Authorization':"Bearer "+localStorage.getItem("jwt")
                }
            }
        ).then(
            res=>{
                setData(res.data)
                setName(res.data.name)
                setContact(res.data.contact)
                setGender(res.data.gender)
                setCustomerType(res.data.customerType)
                setStatus(res.data.status) 
                if(res.data.birthday_day<10 && res.data.birthday_month>=10){setBirthday(res.data.birthday_year+"-"+res.data.birthday_month+"-0"+res.data.birthday_day);}
                else if(res.data.birthday_day>=10 && res.data.birthday_month<10){setBirthday(res.data.birthday_year+"-0"+res.data.birthday_month+"-"+res.data.birthday_day)}
                else if(res.data.birthday_day<10 && res.data.birthday_month<10){setBirthday(res.data.birthday_year+"-0"+res.data.birthday_month+"-0"+res.data.birthday_day)}
                else{setBirthday(res.data.birthday_year+"-"+res.data.birthday_month+"-"+res.data.birthday_day)}
                
            }
        ).catch(err=>{console.log(err);})
  
          
    },[])
    console.log(data);
    return(
    <div className="content">
      <div className="taskbar">
        <h2>Thông tin khách hàng</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div className="inside">
      {data!=null && <Form
            {...layout}
            form={form}
            name="nest-messages"
            onFinish={onFinish}
            style={{
            maxWidth: 600,
            }}
            validateMessages={validateMessages}
        >
            <Form.Item
            name={['user', 'code']}
            label="Mã khách hàng"
            rules={[
                {
                required: true,
                },
            ]}
            initialValue={data.code}
            >
            <Input 
                disabled={true}
            />
            </Form.Item>
            <Form.Item
            name={['user', 'name']}
            label="Họ tên"
            rules={[
                {
                required:true   
                },
            ]}
            initialValue={data.name}
            >

            <Input
                name="name"
                disabled={!adjust}
                onChange={e=>{setName(e.target.value)}}
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
        initialValue={data.gender}
        
      >
        <Select
        disabled={!adjust}
        
        style={{width:"100px",float:'left'}}
          allowClear
          onSelect={(e)=>{
            setGender(e)
          }}
        >
          <Option value="male">Nam</Option>
          <Option value="female">Nữ</Option>
          <Option value="LGBT">LGBT</Option>
        </Select>
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
              
              initialValue={data.contact}
            >
              <Input
              disabled={!adjust}  
                onChange={(e)=>{
                  setContact(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="birthday"
              label="Sinh nhật"
              rules={[
                {
                  required: true,
                },
              ]}
              initialValue={dayjs(data.birthday_year+"-"+data.birthday_month+"-0"+data.birthday_day,dateFormat)}
            >
              {data.birthday_day<10 && data.birthday_month>=10 && <Space direction="vertical" style={{float:"left"}} >
    
                    <DatePicker disabled={!adjust} onChange={onChange} defaultValue={dayjs(data.birthday_year+"-"+data.birthday_month+"-0"+data.birthday_day,dateFormat)} />
              </Space>}
              {data.birthday_day<10 && data.birthday_month<10 && <Space direction="vertical" style={{float:"left"}}>
                    <DatePicker disabled={!adjust} onChange={onChange} defaultValue={dayjs(data.birthday_year+"-0"+data.birthday_month+"-0"+data.birthday_day,dateFormat)} />
              </Space>}
              {data.birthday_month<10 && data.birthday_day>10 && <Space direction="vertical" style={{float:"left"}}>
                    <DatePicker disabled={!adjust} onChange={onChange} defaultValue={dayjs(data.birthday_year+"-0"+data.birthday_month+"-"+data.birthday_day,dateFormat)} />
              </Space>}
              {data.birthday_day>=10 && data.birthday_month>=10 && <Space direction="vertical" style={{float:"left"}}>
                    <DatePicker disabled={!adjust} onChange={onChange} defaultValue={dayjs(data.birthday_year+"-"+data.birthday_month+"-"+data.birthday_day,dateFormat)} />
              </Space>}
            </Form.Item>
            <Form.Item name={['user', 'debt']} label="Công nợ" initialValue={data.debt}>
            <InputNumber disabled={true} style={{width:"400px"}}/>
            </Form.Item>
            {dataType!=null && <Form.Item initialValue={data.customerType.name} name={['user', 'customerType']} label="Nhóm khách hàng">
              <Select
              disabled={!adjust}
                onSelect={(e)=>{
                  setCustomerType(e)
                }}
              >
              {dataType.map(item=>{
                return <Option key={item.id} >{item.name}</Option>
              })}
              </Select>
            </Form.Item>}
            <Form.Item label="Trạng thái">
              <Select
              defaultValue={data.status.name}
              disabled={!adjust}
              style={{width:"100px",float:"left"}}
                allowClear
                onSelect={(e)=>{
                  if(e==='active') {setStatus({
                    id:1,
                    name:e
                  })}else if(e==='non-active'){
                    setStatus({
                      id:2,
                      name:e
                    })
                  }else setStatus(null)
                }}
              
              > 
                <Option value='null'>Null</Option>
                <Option value="active">active</Option>
                <Option value="non-active">non-active</Option>
              </Select>
            </Form.Item>
            <Form.Item
            wrapperCol={{
                ...layout.wrapperCol,
                offset: 8,
            }}
            >
            {!adjust && <Button type="primary" onClick={()=>{setAdjust(!adjust)}}>
                Chỉnh sửa
            </Button>}
            {adjust && (
              <>
                <Button
                  style={{ margin: "10px" }}
                  onClick={handleSubmit}
                  htmlType="submit"
                >
                  Xác nhận
                </Button>
                <Button onClick={() => window.location.reload()} style={{ margin: "10px" }}>
                  Hủy
                </Button>
              </>
            )}
            </Form.Item>
        </Form>}
      </div>
    </div>
    )
}
export default CustomerInformation;