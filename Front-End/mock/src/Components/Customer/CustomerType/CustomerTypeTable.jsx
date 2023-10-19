import { Space, Table, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmBox from "../../ConfirmBox";

function CustomerTypeTable(props) {
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
            url:"http://localhost:8080/admin/delete-type",
            method:'delete',
            headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            data:code
          }
        ).then((res)=>{
          window.location.reload()
        }).catch((err)=>{
          if(err.response.status===403) alert("Bạn không đủ thẩm quyền");
        })
      }
    },[start,props.data])
    const handleDelete=(e)=>{
      setCode(e.name)
      setConfirm(true);
    }
    console.log(props.data);
    props.data.forEach(item=>{
      var obj={
          key:item.code,
          name:item.name,
          created_date:item.created_date.substring(0,10),
          member:item.member,
          customers:item.customers
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
        },
        {
          title: 'Ngày tạo',
          dataIndex: 'created_date',
          key: 'created_date',
        },
        {
            title: 'Số khách hàng',
          dataIndex: 'member',
          key: 'member',
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
export default CustomerTypeTable;