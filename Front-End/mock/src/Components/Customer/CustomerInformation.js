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
export default function CustomerInformation(props) {
  document.title = "Thông tin nhân viên";
  const navigate = useNavigate();
  const { code } = useParams();
  const [payments, setPayments] = useState([]);
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
    props.setOpenKeys("customer")
    props.setSelectedKeys("customer-list")
    axios({
      url: baseURL + "/payment/list",
      method: "post",
      headers: {
        Authorization: Token,
      },
      data: {
        value: null,
        t: {
          customer: {
            code: code,
          },
        },
      },
    })
      .then((res) => {
        setPayments(res.data);
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
        <div className="inside" style={{ display: "block",textAlign:"left",margin:"0 auto" }}>
          <Space
            direction="vertical"
            style={{
              width: "80%",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "15px",
              display: "flex",
              margin:"0% auto"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%",
              }}
            >
              <h2 style={{ textAlign: "left" }}>Thông tin khách hàng</h2>
              {/* <div
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
              </div> */}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "20% 30% 20% 30%",
              }}
            >
              <p>Tên khách hàng</p>
              <p>: {data.data.name}</p>

              <p>Giới tính</p>
              <p>: {data.data.gender}</p>

              <p>Ngày sinh</p>
              <p>
                :{" "}
                {Object.keys(data.data).length > 0
                  ? data.data.birthday.substring(0, 10)
                  : undefined}
              </p>
              <p>Mã khách hàng</p>
              <p>: {data.data.code}</p>
              <p>Số điện thoại</p>
              <p>: {data.data.contact}</p>
              <p>Email</p>
              <p>: {data.data.email}</p>
              <p>Ngày tạo</p>
              <p>
                :{" "}
                {Object.keys(data.data).length > 0
                  ? data.data.created_date.substring(0, 10)
                  : undefined}
              </p>
              <p>Tổng giao dịch</p>
              <p>: {data.data.total}</p>

              <p>Người quản lý</p>
              <p>
              <a href={"/employee/information/" + data.data.manager_code}>
                : {data.data.manager}
              </a>
              </p>
              <p>Trạng thái</p>
              <p>
                :{" "}
                {data.data.status === "active"
                  ? "Đã kích hoạt"
                  : "Chưa kích hoạt"}
              </p>
              <p>Nhóm khách hàng</p>
              <p>: {data.data.customer_type.content}</p>
            </div>
            <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "20% 20%",
                }}
              >
                <Button type="primary" size="large" href={url}>
                  Chỉnh sửa
                </Button>
                <Button type="link" size="large" onClick={handleDelete}>
                  Xóa
                </Button>
              </div>
          </Space>
          <PaymentList data={payments} />
        </div>
      )}
    </div>
  );
}
