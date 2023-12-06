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
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { CaretLeftOutlined } from "@ant-design/icons";

import PDF from "./PDF";
export default function ReceiptInformation(props) {
  document.title = "Thông tin phiếu thu";
  const navigate = useNavigate();
  const { code } = useParams();

  const [data, setData] = useState({
    data: {},
    loading: true,
  });
  const [err, setErr] = useState(false);

  const handleDelete = () => {
    axios({
      url: baseURL + "/receipt/admin",
      method: "delete",
      headers: {
        Authorization: props.token,
      },
      data: [code],
    })
      .then((res) => {
        navigate("/receipt-table");
      })
      .catch((err) => {
        setErr(true);
      });
  };
  useEffect(() => {
    props.setOpenKeys("cash");
    props.setSelectedKeys("receipt-list");
    axios({
      url: baseURL + "/receipt/information?code=" + code,
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
  const url = "/receipt/modify/" + code;
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
              navigate("/receipt-table");
            }}
            size="large"
            style={{ height: "fit-content" }}
          >
            <h2>
              <CaretLeftOutlined /> Danh sách phiếu thu
            </h2>
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
              margin: "3% 5%",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "15px",
              display: "block",
              textAlign: "left",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%",
              }}
            >
              <h2>Thông tin khách hàng</h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "20% 30% 20% 30%",
                textAlign: "left",
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
                  : undefined}
              </p>
              <p>Giá trị</p>
              <p>: {data.data.revenue}</p>
              <p>Hình thức thanh toán</p>
              <p>: {data.data.payment_type.name}</p>
              <p>Người quản lý</p>
              <p>
                :{" "}
                <Link to={"/employee/information/  " + data.data.manager_code}>
                  {data.data.manager}
                </Link>
              </p>
              <p>Loại phiếu thu</p>
              <p>
                :{" "}
                {data.data.receiptGroup === null
                  ? "Không xác định"
                  : data.data.receiptGroup.name}
              </p>
              <p>Người thanh toán</p>
              <p>
                :{" "}
                {data.data.provider === null ? (
                  data.data.provider_name
                ) : (
                  <Link to={"/provider/information/" + data.data.provider.code}>
                    {" "}
                    {data.data.provider.name}
                  </Link>
                )}{" "}
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
                gridTemplateColumns: "15% 15% 15%",
              }}
            >
              <Button
                type="primary"
                size="large"
                onClick={(e) => {
                  navigate(url);
                }}
                style={{ width: "95%" }}
              >
                Chỉnh sửa
              </Button>
              <PDFDownloadLink
                document={<PDF data={data.data} />}
                fileName="receipt"
              >
                <Button
                  type="text"
                  size="large"
                  style={{ border:"1px #1677ff solid",width: "95%", color:"#1677ff"}}
                >
                  In phiếu thu
                </Button>
              </PDFDownloadLink>
              <Button
                type="link"
                size="large"
                style={{ border:"1px red solid", color: "red", width: "95%", }}
                onClick={(e) => {
                  Modal.confirm({
                    content: "Bạn muốn xóa phiếu thu " + code + " ?",
                    onOk() {
                      handleDelete();
                    },
                  });
                }}
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
