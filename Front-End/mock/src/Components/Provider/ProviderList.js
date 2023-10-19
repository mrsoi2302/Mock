import React, { useEffect, useState } from "react";
import '../style.css';
import axios from "axios";
import Account from "../Account";
import SearchInput from "../SearchInput";
import ExceptionBox from "../ExceptionBox";
import Paginate from "../Paginate";
import ProviderTable from "./ProviderTable";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import ProviderFilter from "./ProviderFilter";

export default function ProviderList(props){
    document.title="Danh sách nhà cung cấp"
    const navigate=useNavigate()
    const [error,setError]=useState(true)
    const[count,setCount]=useState(0);
    const[data,setData]=useState([]);
    const[status,setStatus]=useState(null);
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
        localStorage.setItem("open","provider")
        localStorage.setItem("selected","provider-list")
        axios(
            {
                url:"http://localhost:8080/provider/count",
                method:"GET",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                }
            }
        ).then((res)=>(
            setCount(res.data)
        )).catch((err)=>{
            setError(false)
        })
        const obj={
            id:null,
            code:null,
            name:null,
            contact:null,
            created_date:createdDate,
            modified_date:null,
            status:status
        }
        axios(
            {
                url:"http://localhost:8080/provider/show?page="+(page-1),
                method:"post",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt"),
                },
                data:{
                    value:searchInput,
                    t:obj
                }
                
            }
        ).then((res)=>{
            setData(res.data)
        }).catch((err)=>{
            setError(false)
        })
        
    },[searchInput,status,createdDate,page])
    return(
        <div className="content">
        {!error&&<ExceptionBox/>}
            <div className="taskbar">
                <h2>Danh sách nhà cung cấp</h2>
                <Account
                    name={localStorage.getItem("name")}
                />
            </div>
            <div className="inside">
                <SearchInput
                    setSearchInput={handleSearch}
                />
                <Button type="primary" className="add" href="/create-provider">Thêm nhà cung cấp mới</Button>
                <ProviderFilter
                    createdDate={createdDate}
                    setStatus={setStatus}
                    setCreatedDate={setCreatedDate}
                />
                {<ProviderTable
                    data={data}
                />}
                <Paginate
                    page={page}
                    onData={handlePaginate}
                    number={count}
                />
            </div>
        </div>
    );
}