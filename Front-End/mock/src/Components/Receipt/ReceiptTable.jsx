import { Space, Table, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmBox from "../ConfirmBox";

function ReceiptTable(props) {
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
            url:"http://localhost:8080/admin/receipt?code="+code,
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
    if(props.data.length>=1){
      props.data.forEach(item=>{
      var obj={
        key:item.code,
        revenue:item.revenue,
        created_date:item.created_date.substring(0,10)+" "+item.created_date.substring(11,19),
        provider:item.provider,
        receiptType:item.receiptType.name
      }
        data.push(obj)
      })}
      const columns = [
        {
          title: 'Mã',
          dataIndex: 'key',
          key: 'key',
          render: (_, record) => (
            <Space size="middle">
              <a onClick={(e) =>{navigate('/receipt-information/'+record.key)}}>{record.key }</a>
            </Space>
          ),
        },
        {
            title: 'Giá trị',
            dataIndex: 'revenue',
            key: 'revenue',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_date',
            key: 'created_date',
        },
        
        {
            title: 'Nhà cung cấp',
            dataIndex: 'provider',
            key: 'provider',
            render: (_, record) => (
              <Space size="middle">
              <a onClick={(e) =>{navigate('/provider-information/'+record.provider.code)}}>{record.provider.name}</a>
              </Space>
            ),
        },
        {
          title: 'Hình thức thanh toán',
          dataIndex: 'receiptType',
          key: 'receiptType',
        },
      ];
    return(
      <>
        {confirm&&<ConfirmBox
          setStart={handleStart}
          setConfirm={handleConfirm}
          msg={"Bạn có chắc muốn xóa phiếu thu này chứ ?"}
        />}
        <Table columns={columns} dataSource={data} pagination={false} style={{zIndex:"1",marginTop:"10px"}}/>
      </>
    )
    }
export default ReceiptTable;