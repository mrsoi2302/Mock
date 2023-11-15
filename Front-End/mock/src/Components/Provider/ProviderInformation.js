import { Alert, Button, Card, Space, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import ExceptionBox from "../ExceptionBox";
import ReceiptList from "./ReceiptList";
export default function ProviderInformation() {
  document.title="Thông tin nhân viên"
  const navigate = useNavigate();
  const { code } = useParams();
  localStorage.setItem("open", "provider");
  localStorage.setItem("selected", "provider-list");
  const [data, setData] = useState({
    data: {},
    loading: true,
  });
  const [err, setErr] = useState(false);

  const handleDelete = () => {
    axios({
      url: baseURL + "/provider/admin",
      method: "delete",
      headers: {
        Authorization: Token,
      },
      data: [code],
    })
      .then((res) => {
        navigate("/provider-table");
      })
      .catch((err) => {
        setErr(true);
      });
  };
  useEffect(() => {
    axios({
      url: baseURL + "/provider/information?code=" + code,
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
  const url = "/provider/modify/" + code;
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
        <h2>Thông tin nhà cung cấp</h2>
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
              <h2>Thông tin nhà cung cấp</h2>
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
                <p>Tên nhà cung cấp</p>
                <p>Mã nhà cung cấp</p>
                <p>Số điện thoại</p>
                <p>Email</p>
                <p>Nhóm khách hàng</p>
              </div>
              <div style={{wordWrap:"break-word"}}>
                <p>:{data.data.name}</p>
                <p>: {data.data.code}</p>
                <p>: {data.data.contact}</p>
                <p >:{data.data.email}</p>
                <p>: {data.data.provider_type.content}</p>
              </div>
              <div style={{marginLeft:"10px"}}>
                <p>Ngày tạo</p>
                <p>Tổng giao dịch</p>
                <p>Người quản lý</p>
                <p>Trạng thái</p>
              </div>
              <div s>
                <p>: {data.data.created_date.substring(0,10)}</p>
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
          <ReceiptList data={data.data.receipts}/>
        </div>
      )}
    </div>
  );
}
