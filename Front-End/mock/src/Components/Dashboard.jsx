import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import axios from 'axios';
import ExceptionBox from './ExceptionBox';

function Dashboard (props){
    const[number,setNumber]=useState(0);
    const[error,setError]=useState(true)
    const link='http://localhost:3000/'+props.type+"-list"
    useEffect(()=>{
        axios(
            {
                url:"http://localhost:8080/"+props.type+"/count",
                method:"GET",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                }
            }
        ).then(
            res=>{
                setNumber(res.data)
            }
        ).catch(err=>{
            setError(false)
        })
    },[]
    )
  return(
    <>
        {!error && <ExceptionBox/>}
        <a href={link}>
            <Card
                title={props.title}
                style={{
                    minWidth: 300,
                    display:"block",
                    borderColor:"gray",
                    margin:"10px",
                    boxShadow:"1px 1px",
                    backgroundColor:"whitesmoke",
                }}
                >
                <p>{number}</p>
            </Card>
        </a>
    </>
  ); 
};
export default Dashboard;