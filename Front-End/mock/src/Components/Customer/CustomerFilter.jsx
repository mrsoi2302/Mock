import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, DatePicker, Dropdown, Form, InputNumber, Select, Space } from 'antd';
import { Option } from 'antd/es/mentions';
import axios from 'axios';
const CustomerFilter = (props) => {
    const currentTime=new Date();
    const[status,setStatus]=useState(null);
    const[createdDate,setCreatedDate]=useState(null)
    const [open, setOpen] = useState(false);
    const[birthdayDay,setBirthdayDay]=useState()
    const[birthdayMonth,setBirthdayMonth]=useState()
    const[birthdayYear,setBirthdayYear]=useState()
    const[gender,setGender]=useState()
    const [customerType,setCustomerType]=useState()
    const [dataType,setDataType]=useState([])
    const handleMenuClick = (e) => {
    setOpen(!open)
    };
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
    const onChange = (date, dateString) => {
        setCreatedDate(dateString)
    };
  const handleSubmit=(e)=>{
    props.setCreatedDate(createdDate)
    props.setStatus(status)
    props.setBirthdayDay(birthdayDay)
    props.setBirthdayMonth(birthdayMonth)
    props.setBirthdayYear(birthdayYear)
    props.setGender(gender)
    setOpen(false)
    e.preventDefault()
  }
  const items = [
    {  
        label:  <Space direction="vertical">
      <label>Giới tính</label>
      <Select
      style={{marginTop:"10px",width:"20vw"}}
        allowClear
        onSelect={(e)=>{
            if(e==='null'){
                setGender(null)
            }else setGender(e)
        }}
      > 
        <Option value="Nam">Nam</Option>
        <Option value="Nữ">Nữ</Option>
        <Option value="LGBT">Giới tính thứ 3</Option>
      </Select>
    </Space>,
      key: '1',
    },
    {
        label:
        <>
        <label>Ngày tháng năm sinh</label>
        <br></br>
        <Space >
            <InputNumber placeholder='Ngày' min={1} max={31} style={{marginRight:"10px",marginTop:"10px",width:"100px"}} onChange={(e)=>{setBirthdayDay(e)}}/>
            <InputNumber placeholder='Tháng' min={1} max={12} style={{marginRight:"10px",marginTop:"10px",width:"100px"}} onChange={(e)=>{setBirthdayMonth(e)}}/>
            <InputNumber placeholder='Năm' min={1900} max={currentTime.getFullYear()} style={{marginRight:"10px",marginTop:"10px",width:"100px"}} onChange={(e)=>{setBirthdayYear(e)}}/>
        </Space>
        </>,
          key:"2"
      },
      
    {
      label:  <Space direction="vertical">
      <label>Thời gian tạo</label>
      <DatePicker onChange={onChange} />
    </Space>,
      key: '3',
    },
    {
      label:
      <Space direction="vertical">
        <label>Nhóm khách hàng</label>
        <Form.Item
        name="customerType"
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
      </Space>,
    key:'8',
    },
    {
      label: 
      <Space direction='vertical'>
      <Form.Item>
      <label>Trạng thái</label>
      <br></br>
      <Select
      style={{marginTop:"10px",width:"10vw"}}
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
      </Space>,
        key:"4"
    },
    {
      label: <Button onClick={handleSubmit}>Lọc</Button>,
      key: '5',
    },
  ];
  return (
    <Dropdown
      menu={{
        items,
      }}
      open={open}
      onClick={handleMenuClick}
      trigger={"click"}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space
        style={{display:"flex",padding:"fit-content"}}>
          Bộ lọc
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};
export default CustomerFilter;