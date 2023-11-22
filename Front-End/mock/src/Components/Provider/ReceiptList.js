import { Space, Table, Tag } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReceiptList(props){
    const navigate=useNavigate()
    const columns=[
                {
                title: "Mã thu phiếu",
                dataIndex: "code",
                key: "code",
                render: (_, record) => (
                  <Space size="middle">
                    <a
                      onClick={(e) => navigate("/receipt/information/" + record.code)}
                    >
                      {record.code}
                    </a>
                  </Space>
                ),
                width: "15%",
              },
              {
                title: "Giá trị",
                dataIndex: "revenue",
                key: "revenue",
                sorter:(a,b)=>(a.revenue-b.revenue)
              },
              {
                title: "Người quản lý",
                dataIndex: "manager",
                key: "manager",
                width: "25%",
              },
              {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                render: (_, record) => (
                    <Tag color={record.status==="paid" ? "green":"red"}>
                        {record.status==="paid"? "Đã thanh toán":"Chưa thanh toán"}
                    </Tag>
                  ),
              },
              {
                title: "Hình thức thanh toán",
                dataIndex: "payment_type",
                key: "payment_type",
                width:"17%"
              },
    ]
    return(
        <Table columns={columns} style={
            { 
                margin:"0% 5%",
                marginTop:"20px",
                width:"90%",
                marginBottom:"10%",
            }
        }
            scroll={{y:500}}
            dataSource={props.data}
            loading={props.data===null}
            pagination={false}
            
        />
    )}