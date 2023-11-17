import { Alert, Button, Card, Space, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import ExceptionBox from "../ExceptionBox";
import PaymentList from "./PaymentList";
export default function CustomerInformation() {
  document.title="Thông tin nhân viên"
  const navigate = useNavigate();
  const { code } = useParams();
  localStorage.setItem("open", "customer");
  localStorage.setItem("selected", "customer-list");
  const[payments,setPayments]=useState([])
  const [data, setData] = useState({
    data: {},
    loading: true,
  });
  const [err, setErr] = useState(false);

  const handleDelete = () => {
    axios({
      url: baseURL + "/customer/admin",
      method: "delete",
      headers: {
        Authorization: Token,
      },
      data: [code],
    })
      .then((res) => {
        navigate("/customer-table");
      })
      .catch((err) => {
        setErr(true);
      });
  };
  useEffect(() => {
    axios({
      url:
        baseURL +
        "/payment/list",
      method: "post",
      headers: {
        Authorization: Token,
      },
      data: {
        value:null,
        t:{
          customer:{
            code:code
          }
        },
      },
    })
      .then((res) => {
        setPayments(res.data)
      })
      .catch((err) => {
        setErr(true);
      });
    axios({
      url: baseURL + "/customer/information?code=" + code,
      method: "get",
      headers: {
        Authorization: Token,
      },
    })
      .then((res) => {
        setData({
          data: res.data,
          loading: false,
        });
      })
      .catch((err) => {
        setErr(true);
      });
  }, []);
  const url = "/customer/modify/" + code;
  return (
    <div className="content">
      <div className="taskbar">
        {err && (
          <Alert
            message="Tạo thất bại"
            showIcon
            description="Chỉ quản trị viên mới có thể tạo được nhân viên mới"
            type="error"
            style={{
              position: "absolute",
              margin: "20%",
            }}
            closable
          />
        )}
        <h2>Thông tin khách hàng</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      {err && <ExceptionBox url="/main" msg=<h2>Có lỗi xảy ra</h2> />}
      {data.loading ? (
        <Spin />
      ) : (
        <div className="inside" style={{ display: "block" }}>
          <Space
            direction="vertical"
            style={{
              width: "60vw",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "15px",
              display: "flex",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%",
              }}
            >
              <h2>Thông tin khách hàng</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: "50% 50%",
                }}
              >
                <Button type="primary" href={url}>
                  Chỉnh sửa
                </Button>
                <Button type="link" onClick={handleDelete}>
                  Xóa
                </Button>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "20% 30% 20% 30%",
              }}
            >
              <div >
                <p>Tên khách hàng</p>
                <p>Giới tính</p>
                <p>Ngày sinh</p>
                <p>Mã khách hàng</p>
                <p>Số điện thoại</p>
                <p>Email</p>
                
              </div>
              <div style={{wordWrap:"break-word"}}>
                <p>: {data.data.name}</p>
                <p>: {data.data.gender}</p>
                <p>: {Object.keys(data.data).length>0 ? data.data.birthday.substring(0,10):undefined}</p>
                <p>: {data.data.code}</p>
                <p>: {data.data.contact}</p>
                <p>: {data.data.email}</p>
              </div>
              <div style={{marginLeft:"10px"}}>
                <p>Ngày tạo</p>
                <p>Tổng giao dịch</p>
                <p>Người quản lý</p>
                <p>Trạng thái</p>
                <p>Nhóm khách hàng</p>
                <p>: {data.data.customer_type.content}</p>
              </div>
              <div s>
                <p>: {Object.keys(data.data).length>0 ? data.data.created_date.substring(0,10):undefined}</p>
                <p>: {data.data.total}</p>
                <a href={"/employee/information/"+data.data.manager_code}>: {data.data.manager}</a>
                <p>: 
                <Tag color={data.data.status==="active"? "green":"red"}>
                {data.data.status === "active" ? "Đã kích hoạt" : "Chưa kích hoạt"}
                </Tag>
                </p>
              </div>
            </div>
          </Space>
          <PaymentList data={payments}/>
        </div>
      )}
    </div>
  );
}
