import { Alert, Button, Card, ConfigProvider, Modal, Space, Spin, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate, useParams } from "react-router-dom";
import { CaretLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import ExceptionBox from "../ExceptionBox";
import PaymentList from "./PaymentList";
import ChangeStatus from "../ChangeStatus";
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
  const [index, setIndex] = useState(false);
  const handleDelete = () => {
    axios({
      url: baseURL + "/customer/admin",
      method: "delete",
      headers: {
        Authorization: props.token,
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
    props.setOpenKeys("customer");
    props.setSelectedKeys("customer-list");
    axios({
      url: baseURL + "/payment/list",
      method: "post",
      headers: {
        Authorization: props.token,
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
            navigate("/customer-table")
            Modal.destroyAll()
          },
          onCancel:()=>{
            navigate("/customer-table")
            Modal.destroyAll()
          }
        })
        else 
        Modal.error({
          title:"Phiên đăng nhập hết hạn",
          onOk:()=>{
            localStorage.clear()
            document.cookie=""
            navigate("/")
            Modal.destroyAll()
          },
          onCancel:()=>{
            localStorage.clear()
            document.cookie=""
            navigate("/")
            Modal.destroyAll()
          },
          cancelText:"Quay lại"
        })
      });
  }, [index]);
  const url = "/customer/modify/" + code;
  return (
    <div className="content">
      <div className="taskbar">
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
              navigate("/payment-table");
            }}
            size="large"
            style={{ height: "fit-content" }}
          >
            <h3>
              <CaretLeftOutlined /> Danh sách khách hàng
            </h3>
          </Button>
        </ConfigProvider>
        <Account name={localStorage.getItem("name")} />
      </div>
      {err && <ExceptionBox url="/main" msg=<h2>Có lỗi xảy ra</h2> />}
      {data.loading ? (
        <Spin />
      ) : (
        <div
          className="inside"
          style={{ display: "block", textAlign: "left", margin: "0 auto" }}
        >
          <Space
            direction="vertical"
            style={{
              width: "80%",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "15px",
              display: "flex",
              margin: "0% auto",
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
                {data.data.status === "active" ? (
                  <div>
                    :{" "}
                    <Tag
                      style={{ marginLeft: "15px" }}
                      color="green"
                      key={data.data}
                    >
                      Đã kích hoạt
                    </Tag>
                  </div>
                ) : (
                  <div style={{ marginTop: "-10px" }}>
                    :{" "}
                    <ChangeStatus
                      name=<Tag color="red" key={data.data}>
                        Chưa kích hoạt
                      </Tag>
                      data={data.data}
                      index={index}
                      setIndex={setIndex}
                      url={"customer/staff"}
                      state="active"
                    />
                  </div>
                )}
              </p>
              <p>Nhóm khách hàng</p>
              <p>
                :{" "}
                {data.data.customer_type === null
                  ? "Không xác định"
                  : data.data.customer_type.content}
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "20% 20%",
              }}
            >
              <Button
                type="primary"
                size="large"
                onClick={(e) => navigate(url)}
              >
                Chỉnh sửa
              </Button>
              <Button
                type="text"
                size="large"
                onClick={handleDelete}
                style={{
                  marginLeft: "10px",
                  border: "1px red solid",
                  color: "red",
                }}
              >
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
