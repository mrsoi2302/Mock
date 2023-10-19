import { Space, Table, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmBox from "../ConfirmBox";

function CustomerTable(props) {
  console.log(props.data);
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
            url:"http://localhost:8080/admin/customer?code="+code,
            method:'delete',
            headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
          }
        ).then((res)=>{
          axios(
            {
              url:"http://localhost:8080/admin/customer/deohieu?code="+code,
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
            window.location.reload()};
          })
        }).catch((err)=>{
          if(err.response.status===403){
             alert("Bạn không đủ thẩm quyền")
          window.location.reload()};
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
        obj={
          key:item.code,
          name:item.name,
          contact:item.contact,
          gender:item.gender,
          created_date:item.created_date.substring(0,10),
          modified_date:item.modified_date.substring(0,10)+" "+item.modified_date.substring(11,19),
          debt:item.debt,
          birthday:item.birthday_year+'/'+item.birthday_month+'/'+item.birthday_day,
          type:item.customerType.name,
          target:item.target,
          total:item.total,
          employee:item.employees,
          payment:item.payment,
          tags:[item.status.name]
        }
      }else{
          obj={
            key:item.code,
            name:item.name,
            contact:item.contact,
            gender:item.gender,
            created_date:item.created_date.substring(0,10),
            debt:item.debt,
            birthday:item.birthday_year+'/'+item.birthday_month+'/'+item.birthday_day,
            type:item.customerType.name,
            target:item.target,
            total:item.total,
            employee:item.employees,
            payment:item.payment,
            tags:[item.status.name]
        }
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
              <a onClick={(e) =>{navigate('/customer-information/'+record.key)}}>{record.name}</a>
            </Space>
          ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'contact',
            key: 'contact',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
        },
        
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
            key: 'birthday',
        },
        {
          title: 'Công nợ',
          dataIndex: 'debt',
          key: 'debt',
        },
        {
          title: 'Nhóm khách hàng',
          dataIndex: 'type',
          key: 'type',
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
export default CustomerTable;