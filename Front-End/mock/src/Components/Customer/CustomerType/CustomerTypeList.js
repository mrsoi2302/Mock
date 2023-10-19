import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExceptionBox from "../../ExceptionBox";
import Account from "../../Account";
import { Button } from "antd";
import Paginate from "../../Paginate";
import CustomerTable from "../CustomerTable";
import CustomerTypeTable from "./CustomerTypeTable";

export default function CustomerTypeList(props){
    document.title="Danh sách nhà cung cấp"
    const navigate=useNavigate()
    const [error,setError]=useState(true)
    const[count,setCount]=useState(0);
    const[data,setData]=useState([]);
    const[createdDate,setCreatedDate]=useState(null)
    const[page,setPage]=useState(1)
    const[searchInput,setSearchInput]=useState(null);
    const handleSearch=(e)=>{
        setSearchInput(e);
    }
    const handlePaginate=(e)=>{
        setPage(e)
    }
    useEffect(()=>{
        console.log(createdDate);
        localStorage.setItem("open","customer")
        localStorage.setItem("selected","customer-type")
        axios(
            {
                url:"http://localhost:8080/customer-type/count",
                method:"GET",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
            }
        ).then((res)=>(
            setCount(res.data)
        )).catch((err)=>{
            setError(false)
        })
        axios(
            {
                url:"http://localhost:8080/customer-type/show?page="+(page-1),
                method:"get",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt"),
                },
            
                
            }
        ).then((res)=>(
            setData(res.data)
        )).catch((err)=>{
            setError(false)
        })
        
    },[searchInput, createdDate, page])
    const handleCreate=(e)=>{
        navigate("/create-customer-type")
    }
    return(
        <div className="content">
        {!error&&<ExceptionBox/>}
            <div className="taskbar">
                <h2>Danh sách nhóm khách hàng</h2>
                <Account
                    name={localStorage.getItem("name")}
                />
            </div>
            <div className="inside">
                <Button type="primary" className="add" onClick={handleCreate}>Thêm nhóm khách hàng mới</Button>
                {data!=null &&  <CustomerTypeTable
                    data={data}
                /> }
                <Paginate
                    onData={handlePaginate}
                    number={count}
                />
            </div>
        </div>
    );
}