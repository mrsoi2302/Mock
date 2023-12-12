import { Button, ConfigProvider, message } from "antd";
import axios from "axios";
import React from "react";
import { baseURL } from "../Config";
export default function ChangeStatus(props){
    const handleChange=()=>{
        axios(
            {
                url:baseURL+"/"+props.url,
                method:"PUT",
                headers:{
                    Authorization:"Bearer "+localStorage.getItem("jwt")
                },
                data:{
                    ...props.data,
                    status:props.state
                }
            }
        ).then(res=>{
            props.setIndex(!props.index)
        }).catch(err=>{
            message.error("Đổi trạng thái không thành công")
        })
    }
    return(
        <ConfigProvider
          theme={{
            components: {
              Button: {
                textHoverBg: "none",
                colorBgTextActive: "none",
              },
            },
          }}
        >
          <Button
            type="text"
            onClick={handleChange}
            size="large"
            style={{ height: "fit-content" }}
          >
           {props.name}
          </Button>
        </ConfigProvider>
    )
}