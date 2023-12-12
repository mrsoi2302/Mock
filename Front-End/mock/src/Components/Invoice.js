import { Button } from "antd";
import React from "react";
import printJS from "print-js"
export default function Invoice(props){
    const handlePrint=()=>{
        printJS({
            printable:"invoice-container",
            type:"html",
            documentTitle:props.title,
            targetStyles:['*']
        });
    }
    return(
        <div>
            <div style={{display:"none"}}>
                <div id="invoice-container"
                style={{
                }}>
                    <h2 style={{textAlign:"center",fontSize:"30px"}}>{props.title.toUpperCase()}</h2>
                    {props.content}
                    <p style={{float:"right",marginRight:"10%"}}>Người giao dịch</p>
                    <p>Người quản lý</p>
                </div>
            </div>
            <Button
            size="large"
            style={{
                border: "1px #1677ff     solid",
                color: "#1677ff",
                width: "95%",
              }}
            onClick={handlePrint}
            >
                In 
            </Button>
        </div>
    )
}