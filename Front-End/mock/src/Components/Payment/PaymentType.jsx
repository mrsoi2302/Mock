import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, DatePicker, Dropdown, Form, Input, InputNumber, Select, Space } from 'antd';
import { Option } from 'antd/es/mentions';
import axios from 'axios';
const PaymentType = () => {
    const [open, setOpen] = useState(false);
    const [name,setName]=useState("")
    const handleMenuClick = () => {
    setOpen(!open)
    };
    const createType=(e)=>{
      axios(
        {
          url:"http://localhost:8080/admin/payment-type",
          method:"post",
          headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
          },
          data:{
            name:name
          }
        }
      ).then(res=>{
        window.location.reload()
      }).catch(err=>{
        console.log(err);
      })
    }

  const items = [
    {
      label:<Space>
        <label>Tên</label>
        <br/>
        <Input onChange={e=>{setName(e.target.value)}} required/>
      </Space>,
      key:1
    },
    {
      label:<Space>
        <Button type='primary' style={{marginLeft:"10px"}} disabled={name.trim()===""} onClick={createType}>Tạo</Button>
      </Space>
    }
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
        style={{display:"flex",padding:"fit-content",margin:"10px"}}>
            <Button type='primary'>Tạo hình thức thanh toán mới</Button>
        </Space>
      </a>
    </Dropdown>
  );
};
export default PaymentType;