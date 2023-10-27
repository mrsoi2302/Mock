import React, { useEffect, useState } from "react";
import '../style.css';
import axios from "axios";
import Account from "../Account";
import SearchInput from "../SearchInput";
import ExceptionBox from "../ExceptionBox";
import Paginate from "../Paginate";
import EmployeeTable from "./EmployeeTable";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
export default function EmployeeList(props){
    document.title="Danh sách nhân viên"
    const navigate=useNavigate()
    const [error,setError]=useState(true)
    const[count,setCount]=useState(0);
    const[data,setData]=useState([]);
    const[page,setPage]=useState(1)
    const[searchInput,setSearchInput]=useState(null );
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
                url:"http://localhost:8080/admin/employee/count",
                method:"POST",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                data:{
                    value:searchInput,
                    t:null
                }
            }
        ).then((res)=>(
            setCount(res.data)
        )).catch((err)=>{
            setError(false)
        })

        axios(
            {
                url:"http://localhost:8080/admin/employee/show?page="+(page-1),
                method:"post",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt"),
                },
                data:{
                    value:searchInput,
                    t:null,
                }
                
            }
        ).then((res)=>{
            setData(res.data)
        }).catch((err)=>{
            setError(false)
        })
        
    },[searchInput])
    return(
        <div className="content">
            <div className="taskbar">
                <h2>Danh sách nhân viên</h2>
                <Account
                    name={localStorage.getItem("name")}
                />
            </div>
            {!error && <Modal title="Cảnh báo" open={true} onCancel={e=>{navigate("/main")}} onOk={e=>{navigate("/main")}}>
                <p>Bạn không đủ thẩm quyền</p>
            </Modal>}
           {error && <div className="inside">
                <SearchInput
                    setSearchInput={handleSearch}
                />
                <Button type="primary" className="add" href="/create-employee">Thêm nhân viên mới</Button>
                {<EmployeeTable
                    data={data}
                />}
                <Paginate
                page={page}
                    onData={handlePaginate}
                    number={count}
                />
            </div>}
        </div>
    );
}