import { Alert, Button, Card, ConfigProvider, Modal, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { CaretLeftOutlined } from "@ant-design/icons";

import ExceptionBox from "../ExceptionBox";
export default function EmployeeInformation(props) {
  document.title = "Thông tin nhân viên";
  const navigate = useNavigate();
  const { code } = useParams();
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
        Authorization: props.token,
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
    props.setOpenKeys("employee");
    props.setSelectedKeys("employee-list");
    axios({
      url: baseURL + "/employee/admin/information?code=" + code,
      method: "get",
      headers: {
        Authorization: props.token,
      },
    })
      .then((res) => {
        setData({
          data: res.data,
          loading: false,
        });
      })
      .catch((err) => {
        if(err.response.status===404) Modal.error({
          title:"Không tìm thấy",
          onOk:()=>{
            navigate("/employee-table")
            Modal.destroyAll()
          },
          onCancel:()=>{
            navigate("/employee-table")
            Modal.destroyAll()
          }
        })
        else if(err.response.status===406)
        Modal.error({
          title:"Phiên đăng nhập hết hạn",
          onOk:()=>{
            localStorage.clear()
            document.cookie=""
            navigate("")
            Modal.destroyAll()
          },
          onCancel:()=>{
            localStorage.clear()
            document.cookie=""
            navigate("")
            Modal.destroyAll()
          },
          cancelText:"Quay lại"
        })
      });
      if(!document.cookie.includes("ADMIN")){
        Modal.warning(
          {
            title:"Có vẻ bạn không đủ thẩm quyền để truy cập trang này",
            onOk:(e=>{
              navigate("/main")
              Modal.destroyAll()}),
            onCancel:(e=>{
              navigate("/main")
              Modal.destroyAll()
            }),
            
          }
        )
      }
      return (()=>{
        Modal.destroyAll()
      })
  }, []);
  const url = "/employee/modify/" + code;
  return (
    <div className="content">
      <div className="taskbar">
        {err && (
          <Alert
            message="Truy cập thất bại"
            showIcon
            description="Có vẻ bạn không có quyền truy cập"
            type="error"
            style={{
              position: "absolute",
              margin: "20%",
            }}
            closable
          />
        )}
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
            onClick={(e) => {
              navigate("/employee-table");
            }}
            size="large"
            style={{ height: "fit-content" }}
          >
            <h3>
              <CaretLeftOutlined /> Danh sách nhân viên
            </h3>
          </Button>
        </ConfigProvider>
        <Account name={localStorage.getItem("name")} />
      </div>
      {err && <ExceptionBox url="/main" msg=<h2>Có lỗi xảy ra</h2> />}
      {data.loading ? (
        <Spin />
      ) : (
        <div className="inside" style={{ display: "block", textAlign: "left" }}>
          <Space
            direction="vertical"
            style={{
              width: "60vw",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "15px",
              display: "flex",
              margin: "0 auto",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%",
              }}
            >
              <h2>Thông tin nhân viên</h2>
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
                gridTemplateColumns: "25% 25% 25% 25%",
              }}
            >
              <p>Họ và tên</p>
              <p>: {data.data.name}</p>
              <p>Mã nhân viên</p>
              <p>: {data.data.code}</p>
              <p>Tên đăng nhập</p>
              <p>: {data.data.username}</p>
              <p>Vai trò</p>
              <p>: {data.data.role === "STAFF" ? "Nhân viên" : "Người dùng"}</p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "20% 20%",
              }}
            >
              <Button
                type="primary"
                onClick={(e) => {
                  navigate(url);
                }}
                size="large"
              >
                Chỉnh sửa
              </Button>
              <Button
                type="link"
                style={{ color: "red" }}
                onClick={(e) => {
                  Modal.confirm({
                    title: "Bạn muốn xóa nhân viên " + code + "?",
                    onOk() {
                      handleDelete();
                    },
                  });
                }}
                size="large"
              >
                Xóa
              </Button>
            </div>
          </Space>
        </div>
      )}
    </div>
  );
}
