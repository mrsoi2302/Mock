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
import { CaretLeftOutlined } from "@ant-design/icons";
import Invoice from "../Invoice";
import ChangeStatus from "../ChangeStatus";
export default function PaymentInformation(props) {
  document.title = "Thông tin phiếu chi";
  const [index,setIndex]=useState(true)
  const navigate = useNavigate();
  const { code } = useParams();
  const [data, setData] = useState({
    data: {},
    loading: true,
  });
  const content = (
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
        {(data.data.paymentType === undefined||data.data.paymentType===null)
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
      <p>Khách hàng thanh toán</p>
      <p>
        :{" "}
        {(data.data.customer === null||data.data.customer===undefined) ? (
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
        {(data.data.paymentGroup === null||data.data.paymentGroup===undefined)
          ? "Không xác định"
          : data.data.paymentGroup.name}
      </p>
      <p>Trạng thái</p>
      <p>
        :{" "}
          {data.data.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
      </p>
    </div>
  );
  const [err, setErr] = useState(false);

  const handleDelete = () => {
   
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
    props.setOpenKeys("cash");
    props.setSelectedKeys("payment-list");
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
        if(err.response.status===404) Modal.error({
          title:"Không tìm thấy",
          onOk:()=>{
            navigate("/payment-table")
            Modal.destroyAll()
          },
          onCancel:()=>{
            navigate("/payment-table")
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
  }, [index]);
  const url = "/payment/modify/" + code;
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
              <CaretLeftOutlined /> Danh sách phiếu chi
            </h3>
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
            <h2>Thông tin phiếu chi</h2>
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
              <p>Khách hàng thanh toán</p>
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
              <div>
                  {data.data.status === "paid" ? (
                    <div>
                    :{" "}
                      <Tag
                        style={{ marginLeft: "15px" }}
                        color="green"
                        key={data.data}
                      >
                        Đã thanh toán
                      </Tag>
                    </div>
                  ) : (
                    <div style={{marginTop:"-12px"}}>
                    :{" "}
                    <ChangeStatus
                      name=<Tag color="red" key={data.data}>
                        Chưa thanh toán
                      </Tag>
                      data={{
                        t: {
                          ...data.data,
                          status: "paid",
                        },
                      }}
                      index={index}
                      setIndex={setIndex}
                      url={"payment/staff"}
                      state="paid"
                    />
                    </div>
                  )}
                </div>
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
                <Invoice content={content} title="phiếu chi" />
                <Button
                  type="link"
                  size="large"
                  style={{
                    border: "1px red solid",
                    color: "red",
                    width: "95%",
                  }}
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
