import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Modal,
  Space,
  Spin,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import ExceptionBox from "../ExceptionBox";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CaretLeftOutlined } from "@ant-design/icons";
import PDF from "./PDF";
export default function PaymentInformation(props) {
  document.title = "Thông tin phiếu chi";
  const navigate = useNavigate();
  const { code } = useParams();
  const [data, setData] = useState({
    data: {},
    loading: true,
  });
  const [err, setErr] = useState(false);

  const handleDelete = () => {
    props.setOpenKeys("cash");
    props.setSelectedKeys("payment-list");
    axios({
      url: baseURL + "/payment/admin",
      method: "delete",
      headers: {
        Authorization: props.token,
      },
      data: [code],
    })
      .then((res) => {
        navigate("/payment-table");
      })
      .catch((err) => {
        setErr(true);
      });
  };
  useEffect(() => {
    axios({
      url: baseURL + "/payment/information?code=" + code,
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
        setErr(true);
      });
  }, []);
  const url = "/payment/modify/" + code;
  return (
    <div className="content">
      <div className="taskbar">
        {err && (
          <Alert
            message="Tạo thất bại"
            showIcon
            description="Chỉ quản trị viên mới có thể tạo được phiếu chi mới"
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
              navigate("/payment-table");
            }}
            size="large"
            style={{ height: "fit-content" }}
          >
            <h2>
              <CaretLeftOutlined /> Danh sách phiếu chi
            </h2>
          </Button>
        </ConfigProvider>
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
              margin: "0 auto",
              textAlign: "left",
            }}
          >
            <h2>Thông tin khách hàng</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "20% 30% 20% 30%",
              }}
            >
              <p>Mã phiếu chi</p>
              <p>: {data.data.code}</p>

              <p>Ngày tạo</p>
              <p>
                :{" "}
                {Object.keys(data.data).length > 0
                  ? data.data.created_date.substring(0, 10) +
                    " " +
                    data.data.created_date.substring(11, 19)
                  : "Không xác định"}
              </p>

              <p>Giá trị</p>
              <p>: {data.data.paid}</p>

              <p>Hình thức thanh toán</p>

              <p>
                :{" "}
                {data.data.paymentType === null
                  ? "Không xác định"
                  : data.data.paymentType.name}
              </p>
              <p>Người quản lý</p>
              <p>
                :{" "}
                <Link to={"/employee/information/  " + data.data.manager_code}>
                  {data.data.manager}
                </Link>
              </p>
              <p>Người nhận</p>
              <p>
                :{" "}
                {data.data.customer === null ? (
                  data.data.customer_name
                ) : (
                  <Link to={"/customer/information/" + data.data.customer.code}>
                    {" "}
                    {data.data.customer.name}
                  </Link>
                )}
              </p>
              <p>Loại phiếu thu</p>
              <p>
                :{" "}
                {data.data.paymentGroup === null
                  ? "Không xác định"
                  : data.data.paymentGroup.name}
              </p>
              <p>Trạng thái</p>
              <p>
                :{" "}
                <Tag color={data.data.status === "paid" ? "green" : "red"}>
                  {data.data.status === "paid"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </Tag>
              </p>
            </div>
            <div
              style={{
                display: "grid",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "20% 20% 20%",
                }}
              >
                <PDFDownloadLink
                  document={<PDF data={data.data} />}
                  fileName="receipt"
                >
                  <Button
                    type="primary"
                    size="large"
                    style={{ width: "90%", marginLeft: "10%" }}
                  >
                    In
                  </Button>
                </PDFDownloadLink>
                <Button
                  type="primary"
                  size="large"
                  onClick={(e) => {
                    navigate(url);
                  }}
                  style={{ width: "90%", marginLeft: "10%" }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  type="link"
                  size="large"
                  style={{ color: "red", width: "90%", marginLeft: "10%" }}
                  onClick={(e) => {
                    Modal.confirm({
                      content: "Bạn muốn xóa phiếu chi " + code + " ?",
                      onOk() {
                        handleDelete();
                      },
                    });
                  }}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </Space>
        </div>
      )}
    </div>
  );
}
