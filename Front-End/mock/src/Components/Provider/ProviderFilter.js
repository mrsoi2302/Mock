import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, DatePicker, Dropdown, Form, Select, Space } from 'antd';
import { Option } from 'antd/es/mentions';
const ProviderFilter = (props) => {
  const[status,setStatus]=useState(null);
  const[createdDate,setCreatedDate]=useState(null)
  const [open, setOpen] = useState(false);
  const handleMenuClick = (e) => {
    setOpen(!open)
  };
  const onChange = (date, dateString) => {
    setCreatedDate(dateString)
};
  const handleSubmit=(e)=>{
    props.setCreatedDate(createdDate)
    props.setStatus(status)
    setOpen(false)
    e.preventDefault()
  }
  const items = [
    {
      label:  <Space direction="vertical">
      <label>Thời gian</label>
      <DatePicker onChange={onChange} />
    </Space>,
      key: '1',
    },
    {
      label: <Form.Item>
      <label>Trạng thái</label>
      <Select
      style={{marginTop:"10px"}}
        placeholder="Select a option and change input text above"
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
    },
    {
      label: <Button onClick={handleSubmit}>Lọc</Button>,
      key: '3',
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
export default ProviderFilter;