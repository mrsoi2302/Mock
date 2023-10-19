import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./style.css"
import Account from './Account';
import SearchInput from './SearchInput';
import Paginate from './Paginate';
const columns = [
  {
    title: 'Hành động',
    dataIndex: 'action',
    key: 'action',
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    key: 'time',
  },
];
function HistoryTable() {
  document.title="Lịch sử"
  localStorage.removeItem("selected")
    localStorage.removeItem("open")
  const navigate=useNavigate();
  const [data,setData]=useState([])
  const[page,setPage]=useState(1)
  const[count,setCount]=useState(0);
  useEffect(()=>{
    axios(
      {
        url:"http://localhost:8080/admin/history/number",
        method:"get",
        headers:{
          "Authorization":"Bearer "+ localStorage.getItem("jwt")
        },
        
      }
    ).then(res=>{setCount(res.data)})
    .catch(err=>{alert("Không đủ quyền")
  navigate('/main')})
    axios(
      {
        url:"http://localhost:8080/admin/history/show?page="+(page-1),
        method:"post",
        headers:{
          "Authorization":"Bearer "+ localStorage.getItem("jwt")
        },
        data:{
          t:null,
          value:null
        }
      }
    ).then(res=>{setData(res.data)})
    .catch(err=>{alert("Không đủ quyền")
  navigate('/main')})
  },[page])
  
  const columns = [
    {
        title: 'Nội dung',
        dataIndex: 'msg',
        key: 'msg',
    },
    {
        title: 'Thời gian',
        dataIndex: 'time',
        key: 'time',
        render: (_, record) => (
          <Space size="middle">
            <p>{record.time.substring(0,10)+" "+record.time.substring(11,19)}</p>
          </Space>
        ),
    },
  ];
  const handlePaginate=(e)=>{
    setPage(e)
}
  return(
    <div className="content">
        <div className="taskbar">
            <h2>Lịch sử</h2>
            <Account
                name={localStorage.getItem("name")}
            />
        </div>
        <div className="inside">
        <Table columns={columns} dataSource={data} pagination={false} style={{zIndex:"1",marginTop:"10px"}}/>

        <Paginate
                    page={page}
                    onData={handlePaginate}
                    number={count}
                />
        </div>
    </div>
);
}
export default HistoryTable;