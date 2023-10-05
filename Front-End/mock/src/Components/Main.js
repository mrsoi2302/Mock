import React, { useEffect, useLayoutEffect, useState } from "react";
import './style.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Paginate from "./Pagination";
import TableCom from "./HistoryTable";


export default function Main(){
  const [data,setData]=useState([]);
  const [page,setPage]=useState(1);
  const navigate=useNavigate()
  const handleDataFromChild = (data) => {
    setPage(data);
  }
  useEffect(()=>{
    document.title="Trang chủ"
    axios(
      {
        url:"http://localhost:8080/admin/history/show?page="+(page-1),
        method:"post",
        headers:{
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        data:{
          T:null,
          value:null
        }
      }
       )
    .then(res=>{
      setData(res.data);
    }).catch(err=>{
      localStorage.removeItem("jwt")
      navigate('/')
      console.log(err);
      }) 
    },[page])
    return(
      <div className="content">

        <TableCom
          id={1}
          data={data}
        />
      </div>
      
    );
        
}