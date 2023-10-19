import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExceptionBox from "../ExceptionBox";
import Account from "../Account";
import SearchInput from "../SearchInput";
import { Button } from "antd";
import Paginate from "../Paginate";
import CustomerTable from "./CustomerTable";
import CustomerFilter from "./CustomerFilter";

export default function CustomerList(props){
    document.title="Danh sách khách hàng"
    const navigate=useNavigate()
    const [error,setError]=useState(true)
    const[count,setCount]=useState(0);
    const[data,setData]=useState([]);
    const[status,setStatus]=useState(null);
    const[createdDate,setCreatedDate]=useState(null)
    const[page,setPage]=useState(1)
    const[searchInput,setSearchInput]=useState(null);
    const[birthdayDay,setBirthdayDay]=useState()
    const[birthdayMonth,setBirthdayMonth]=useState()
    const[birthdayYear,setBirthdayYear]=useState()
    const[gender,setGender]=useState()
    const [customerType,setCustomerType]=useState()
    const handleSearch=(e)=>{
        setSearchInput(e);
    }
    const handlePaginate=(e)=>{
        setPage(e)
    }
    useEffect(()=>{
        const obj={
            id:null,
            code:null,
            name:null,
            contact:null,
            gender:gender,
            birthday_day:birthdayDay,
            birthday_month:birthdayMonth,
            birthday_year:birthdayYear,
            created_date:createdDate,
            modified_date:null,
            customerType:customerType,
            status:status
        }
        console.log(createdDate);
        localStorage.setItem("open","customer")
        localStorage.setItem("selected","customer-list")
        axios(
            {
                url:"http://localhost:8080/customer/filter",
                method:"POST",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                data:{
                    value:searchInput,
                    t:obj
                }
            }
        ).then((res)=>(
            setCount(res.data)
        )).catch((err)=>{
            setError(false)
        })
        console.log(obj);
        axios(
            {
                url:"http://localhost:8080/customer/show?page="+(page-1),
                method:"post",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt"),
                },
                data:{
                    value:searchInput,
                    t:obj
                }
                
            }
        ).then((res)=>(
            setData(res.data)
        )).catch((err)=>{
            setError(false)
        })
        
    },[searchInput,status,createdDate,gender,birthdayDay,birthdayMonth,birthdayYear,page])
    const handleCreate=(e)=>{
        navigate("/create-customer")
    }
    console.log(data);
    return(
        <div className="content">
        {!error&&<ExceptionBox/>}
            <div className="taskbar">
                <h2>Danh sách khách hàng</h2>
                <Account
                    name={localStorage.getItem("name")}
                />
            </div>
            <div className="inside">
                <SearchInput
                    setSearchInput={handleSearch}
                />
                <CustomerFilter
                    setStatus={setStatus}
                    setCreatedDate={setCreatedDate}
                    setBirthdayDay={setBirthdayDay}
                    setBirthdayMonth={setBirthdayMonth}
                    setBirthdayYear={setBirthdayYear}
                    setGender={setGender}
                />
                <Button type="primary" className="add" onClick={handleCreate}>Thêm khách hàng mới</Button>
                {data!=null &&  <CustomerTable
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