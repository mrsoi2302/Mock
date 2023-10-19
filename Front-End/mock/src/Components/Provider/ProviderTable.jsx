import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Tag } from 'antd';
import axios from 'axios';
import ConfirmBox from '../ConfirmBox';
import '../style.css'
import { useNavigate } from 'react-router-dom';
function ProviderTable(props) {
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
            url:"http://localhost:8080/admin/provider?code="+code,
            method:'delete',
            headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
          }
        ).then((res)=>{
          window.location.reload()
        }).catch((err)=>{
          if(err.response.status===403){
            alert("Bạn không đủ thẩm quyền")
            window.location.reload()
          };
        })
      }
    },[start,props.data])
    const handleDelete=(e)=>{
      setCode(e.key)
      setConfirm(true);
    }
    props.data.forEach(item=>{
      var obj
      if(item.modified_date!=null){
        obj={key:item.code,
        name:item.name,
        contact:item.contact,
        created_date:item.created_date.substring(0,10),
        modified_date:item.modified_date.substring(0,10)+" "+item.modified_date.substring(11,19),
        debt:item.debt,
        total:item.total,
        employee:item.employees,
        tags:[item.status.name]}
      }else{
        obj={key:item.code,
          name:item.name,
          contact:item.contact,
          created_date:item.created_date.substring(0,10),
          debt:item.debt,
          total:item.total,
          employee:item.employees,
          tags:[item.status.name]}
      }
        data.push(obj)
      })
      const columns = [
        {
          title: 'Mã',
          dataIndex: 'key',
          key: 'key',
        },
        {
          title: 'Tên',
          dataIndex: 'name',
          key: 'name',
          render: (_, record) => (
            <Space size="middle">
              <a onClick={(e) =>{navigate('/provider-information/'+record.key)}}>{record.name}</a>
            </Space>
          ),
        },
        {
          title: 'Số điện thoại',
          dataIndex: 'contact',
          key: 'contact',
        },
        {
          title: 'Ngày tạo',
          dataIndex: 'created_date',
          key: 'created_date',
        },
        {
          title: 'Ngày chỉnh sửa',
          dataIndex: 'modified_date',
          key: 'modified_date',
        },
        {
          title: 'Công nợ',
          dataIndex: 'debt',
          key: 'debt',
        },
        {
          title: 'Tổng nợ',
          dataIndex: 'total',
          key: 'total',
        },
        {
            title: 'Trạng thái',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
              <>
                {tags.map((tag) => {
                  let color = tag=== "active" ? 'green' : 'red';
                  return (
                    <Tag color={color} key={tag}>
                      {tag.toUpperCase()}
                    </Tag>
                  );
                })}
              </>
            ),
          },
        {
          title: 'Người tạo',
          dataIndex: 'employee',
          key: 'employee',
          render: (employees) => (
            <>
              {employees.map((employee) => {
                return (
                  <p>{employee.username}</p>
                );
              })}
            </>
          ),
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
export default ProviderTable;