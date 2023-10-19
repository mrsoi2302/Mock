import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Tag } from 'antd';
import axios from 'axios';
import ConfirmBox from '../ConfirmBox';
import '../style.css'
import { useNavigate } from 'react-router-dom';
function EmployeeTable(props) {
    const navigate=useNavigate();
    const [confirm,setConfirm]=useState(false);
    const [start,setStart]=useState(false);
    const [code,setCode]=useState("")
    let data=[]
    const handleStart=(e)=>{
      setStart(e)
    }
    const handleConfirm=(e)=>{
      setConfirm(e)
    }
    
    useEffect(()=>{
      if(start){
        axios(
          {
            url:"http://localhost:8080/admin/employee?code="+code,
            method:'delete',
            headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
          }
        ).then((res)=>{
          window.location.reload()
        }).catch((err)=>{
          if(err.response.status===403) alert("Bạn không đủ thẩm quyền");
        })
      }
    },[start,props.data])
    const handleDelete=(e)=>{
      setCode(e.key)
      setConfirm(true);
    }
    props.data.forEach(item=>{
      var obj
        obj={key:item.code,
        name:item.name,
        username:item.username,
        password:item.password,
        role:item.role
      }
        data.push(obj)
      })
      const columns = [
        {
          title: 'Mã nhân viên',
          dataIndex: 'key',
          key: 'key',
        },
        {
          title: 'Tên',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Tên đăng nhập',
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: 'Mật khẩu',
          dataIndex: 'password',
          key: 'password',
        },
        {
          title: 'Vai trò',
          dataIndex: 'role',
          key: 'role',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                <a onClick={(e) => handleDelete(record)}>Delete</a>
              </Space>
            ),
          },
      ];
    return(
      <>
        {confirm&&<ConfirmBox
          setStart={handleStart}
          setConfirm={handleConfirm}
          msg={"Bạn có chắc muốn xóa người này chứ ?"}
        />}
        <Table columns={columns} dataSource={data} pagination={false} style={{zIndex:"1",marginTop:"10px"}}/>
      </>
    )
    }
export default EmployeeTable;