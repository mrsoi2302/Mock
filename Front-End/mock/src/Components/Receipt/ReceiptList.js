import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExceptionBox from "../ExceptionBox";
import Account from "../Account";
import SearchInput from "../SearchInput";
import { Button } from "antd";
import Paginate from "../Paginate";
import ReceiptType from "./ReceiptType";
import ReceiptTable from "./ReceiptTable";

export default function ReceiptList(){
    document.title="Danh sách khách hàng"
    const navigate=useNavigate()
    const [error,setError]=useState(true)
    const[count,setCount]=useState(0);
    const[data,setData]=useState([]);
    const[page,setPage]=useState(1)
    const[searchInput,setSearchInput]=useState(null);
    const handleSearch=(e)=>{
        setSearchInput(e);
    }
    const handlePaginate=(e)=>{
        setPage(e)
    }
    useEffect(()=>{
        localStorage.setItem("open","cash")
        localStorage.setItem("selected","receipt-list")
        axios(
            {
                url:"http://localhost:8080/receipt/filter",
                method:"POST",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                data:null
            }
        ).then((res)=>(
            setCount(res.data)
        )).catch((err)=>{
            setError(false)
        })
        axios(
            {
                url:"http://localhost:8080/receipt/show?page="+(page-1),
                method:"post",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt"),
                },
                data:{
                    value:searchInput,
                    t:null
                }
                
            }
        ).then((res)=>(
            setData(res.data)
        )).catch((err)=>{
            setError(false)
        })
        
    },[searchInput])
    return(
        <div className="content">
        {!error&&<ExceptionBox/>}
            <div className="taskbar">
                <h2>Danh sách phiếu thu</h2>
                <Account
                    name={localStorage.getItem("name")}
                />
            </div>
            <div className="inside">
                <SearchInput
                    setSearchInput={handleSearch}
                />
                <ReceiptType
                />
                <Button type="primary" className="add" href="/create-receipt">Thêm phiếu thu mới</Button>
                {data.length>0 && <ReceiptTable data={data}/>}
                <Paginate
                    onData={handlePaginate}
                    number={count}
                />
            </div>
        </div>
    );
}