import { Alert, Button, Card, Space, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import ExceptionBox from "../ExceptionBox";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PDF from './PDF';
export default function PaymentInformation() {
  document.title="Thông tin phiếu chi"
  const navigate = useNavigate();
  const { code } = useParams();
  localStorage.setItem("open", "payment");
  localStorage.setItem("selected", "payment-list");
  const[payments,setPayments]=useState([])
  const [data, setData] = useState({
    data: {},
    loading: true,
  });
  const [err, setErr] = useState(false);

  const handleDelete = () => {
    axios({
      url: baseURL + "/payment/admin",
      method: "delete",
      headers: {
        Authorization: Token,
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
          payment:{
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
      url: baseURL + "/payment/information?code=" + code,
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
                    }}
              >
              <PDFDownloadLink document={<PDF data={data.data}/>} fileName='receipt'>
                    <Button type="primary" style={{margin:"2px",width:"97%"}}>In</Button>
            </PDFDownloadLink>
                <Button type="primary" href={url} style={{margin:"2px"}}>
                  Chỉnh sửa
                </Button>
                <Button type="primary" style={{backgroundColor:"red",margin:"2px"}} onClick={handleDelete}>
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
                <p>Mã phiếu chi</p>
                <p>Ngày tạo</p>
                <p>Giá trị</p>
                <p>Hình thức thanh toán</p>
                
              </div>
              <div style={{wordWrap:"break-word"}}>
                <p>: {data.data.code}</p>
                <p>: {Object.keys(data.data).length>0 ? data.data.created_date.substring(0,10)+" "+data.data.created_date.substring(11,19):undefined}</p>
                <p>: {data.data.paid}</p>
                <p>: {data.data.paymentType.name}</p>
              </div>
              <div style={{marginLeft:"10px"}}>
                <p>Người quản lý</p>
                <p>Người nhận</p>
                <p>Trạng thái</p>
              </div>
              <div>
                <p>
                    : <a href={"/employee/information/  "+data.data.manager_code}>{data.data.manager}</a>

                </p>
                <p>: <a href={"/customer/information/"+data.data.customer.code}> {data.data.customer.name}</a> </p>
                <p>:
                <Tag color={data.data.status==="paid"? "green":"red"}>
                {data.data.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                </Tag>
                </p>
              </div>
            </div>
          </Space>
        </div>
      )}
    </div>
  );
}
