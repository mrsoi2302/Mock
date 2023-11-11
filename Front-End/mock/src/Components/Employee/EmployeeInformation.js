import { Alert, Button, Card, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import ExceptionBox from "../ExceptionBox";
export default function EmployeeInformation() {
  const navigate = useNavigate();
  const { code } = useParams();
  localStorage.setItem("open", "employee");
  localStorage.setItem("selected", "employee-list");
  const [data, setData] = useState({
    data: {},
    loading: true,
  });
  const [err, setErr] = useState(false);

  const handleDelete = () => {
    axios({
      url: baseURL + "/employee/admin",
      method: "delete",
      headers: {
        Authorization: Token,
      },
      data: [code],
    })
      .then((res) => {
        navigate("/employee-table");
      })
      .catch((err) => {
        setErr(true);
      });
  };
  useEffect(() => {
    axios({
      url: baseURL + "/employee/admin/information?code=" + code,
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
  const url = "/employee/modify/" + code;
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
        <h2>Thông tin nhân viên</h2>
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
              <h2>Thông tin nhân viên</h2>
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
                gridTemplateColumns: "25% 25% 25% 25%",
              }}
            >
              <div>
                <p>Họ và tên</p>
                <p>Mã nhân viên</p>
              </div>
              <div>
                <p>: {data.data.name}</p>
                <p>: {data.data.code}</p>
              </div>
              <div>
                <p>Tên đăng nhập</p>
                <p>Vai trò</p>
              </div>
              <div>
                <p>: {data.data.username}</p>
                <p>
                  : {data.data.role === "STAFF" ? "Nhân viên" : "Người dùng"}
                </p>
              </div>
            </div>
          </Space>
        </div>
      )}
    </div>
  );
}
