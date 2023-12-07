import { Alert, Button, Card, ConfigProvider, Modal, Space, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import ExceptionBox from "../ExceptionBox";
import ReceiptList from "./ReceiptList";
import { CaretLeftOutlined } from "@ant-design/icons";
import ChangeStatus from "../ChangeStatus";

export default function ProviderInformation(props) {
  document.title = "Thông tin nhân viên";
  const navigate = useNavigate();
  const { code } = useParams();
  const [receipts, setReceipts] = useState([]);
  const[index,setIndex]=useState(false)
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
        Authorization: props.token,
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
    props.setOpenKeys("provider");
    props.setSelectedKeys("provider-list");
    axios({
      url: baseURL + "/receipt/receipt-list?code=" + code,
      method: "get",
      headers: {
        Authorization: props.token,
      },
    }).then((res) => {
      setReceipts(res.data);
    });
    axios({
      url: baseURL + "/provider/information?code=" + code,
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
            navigate("/provider-table")
            Modal.destroyAll()
          },
          onCancel:()=>{
            navigate("/provider-table")
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
  const url = "/provider/modify/" + code;
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
              navigate("/provider-table");
            }}
            size="large"
            style={{ height: "fit-content" }}
          >
            <h3>
              <CaretLeftOutlined /> Danh sách nhà cung cấp
            </h3>
          </Button>
        </ConfigProvider>
        <Account name={localStorage.getItem("name")} />
      </div>
      {err && <ExceptionBox url="/main" msg=<h2>Có lỗi xảy ra</h2> />}
      {data.loading ? (
        <Spin />
      ) : (
        <div className="inside">
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
                borderBottom: "solid 0.5px gainsboro",
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
                {/* <Button type="primary" href={url}>
                  Chỉnh sửa
                </Button>
                <Button type="link" onClick={handleDelete}>
                  Xóa
                </Button> */}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "20% 30% 20% 30%",
              }}
            >
              <p>Tên nhà cung cấp</p>
              <p>: {data.data.name}</p>
              <p>Mã nhà cung cấp</p>
              <p>: {data.data.code}</p>
              <p>Số điện thoại</p>
              <p>: {data.data.contact}</p>
              <p>Email</p>
              <p>: {data.data.email}</p>
              <p>Nhóm khách hàng</p>
              <p>
                :{" "}
                {data.data.provider_type === null
                  ? "Không xác định"
                  : data.data.provider_type.content}
              </p>
              <p>Ngày tạo</p>
              <p>: {data.data.created_date.substring(0, 10)}</p>
              <p>Tổng giao dịch</p>
              <p>: {data.data.total}</p>
              <p>Người quản lý</p>
              <p>
                <Link to={"/employee/information/" + data.data.manager_code}>
                  : {data.data.manager}
                </Link>
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
                      url={"provider/staff"}
                      state="active"
                    />
                  </div>
                )}
              </p>
            </div>
            <br />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "20% 20%",
              }}
            >
              <Button
                size="large"
                type="primary"
                onClick={(e) => {
                  navigate(url);
                }}
              >
                Chỉnh sửa
              </Button>
              <Button
                type="text"
                size="large"
                onClick={handleDelete}
                style={{
                  marginLeft:"10px",
                  border:"1px red solid",
                  color: "red" }}
              >
                Xóa
              </Button>
            </div>
          </Space>
          <ReceiptList data={receipts} />
        </div>
      )}
    </div>
  );
}
