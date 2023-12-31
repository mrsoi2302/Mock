import {
  Alert,
  Button,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  message,
} from "antd";
import { Option } from "antd/es/mentions";
import "../Account";
import React, { useEffect, useState } from "react";
import Account from "../Account";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { useNavigate } from "react-router-dom";
import { CaretLeftOutlined } from "@ant-design/icons";

export default function CreateReceipt(props) {
  document.title = "Tạo phiếu chi mới";

  const navigate = useNavigate();
  const [data, setData] = useState({
    status:"unpaid"
  });
  const [value, setValue] = useState();
  const [error, setError] = useState(false);
  const [dataOfType, setDataOfType] = useState([]);
  const [receiptGroup, setReceiptGroup] = useState([]);
  const [provider, setProvider] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    props.setOpenKeys("cash");
    props.setSelectedKeys("receipt-list");
    axios({
      url: baseURL + "/provider/create-receipt",
      method: "post",
      headers: {
        Authorization: props.token,
      },
      data: {},
    })
      .then((res) => {
        setProvider(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu từ nhà cung cấp");
      });
    axios({
      url: baseURL + "/payment-type/list",
      method: "post",
      headers: {
        Authorization: props.token,
      },
      data: {
        value: null,
      },
    })
      .then((res) => {
        setDataOfType(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu từ hình thức thanh toán");
      });
    axios({
      url: baseURL + "/receipt-group/list",
      method: "post",
      headers: {
        Authorization: props.token,
      },
      data: {
        value: value,
      },
    })
      .then((res) => {
        setReceiptGroup(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu nhóm phiếu chi");
      });
  }, [value]);
  const handleSubmit = () => {
    axios({
      method: "post",
      url: baseURL + "/receipt/staff/create-one",
      headers: {
        Authorization: props.token,
      },
      data: data,
    })
      .then((res) => {
        navigate("/receipt-table");
      })
      .catch((err) => {
        if(err.response.status===406)
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
        else message.error("Tạo thất bại");
      });
  };

  return (
    <div className="content" style={{ paddingTop: "10px" }}>
      {" "}
      <div className="taskbar">
        {error && (
          <Alert
            message="Tạo thất bại"
            showIcon
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
            <h3>
              <CaretLeftOutlined /> Danh sách phiếu chi
            </h3>
          </Button>
        </ConfigProvider>{" "}
        <Account name={localStorage.getItem("name")} />
      </div>
      <div
        style={{
          backgroundColor: "white",
          display: "block",
          margin: "3% 5%",
          textAlign: "left",
          borderRadius: "10px",
          padding: "1% 2% 5vh",
        }}
      >
        <h2 style={{ paddingLeft: "10px" }}>Thông tin chung</h2>
        <hr style={{ borderTop: "1px solid whitesmoke" }} />

        <Form
          onFinish={handleSubmit}
          form={form}
          layout="vertical"
          style={{
            maxWidth: "100%",
            margin: "10px",
          }}
        >
          <Form.Item
            name="code"
            label="Mã phiếu chi"
            rules={[
              {
                pattern: "^(?!PMT).*",
                message: "Tiền tố PMT không hợp lệ",
              },
            ]}
            style={{
              width: "47%",
              float: "left",
            }}
          >
            <Input
              onChange={(e) => {
                setData({
                  ...data,
                  code: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="provider"
            label="Nhà cung cấp giao dịch"
            rules={[
              {
                message: "Vùng này không được để trống",
                required: true,
              },
            ]}
          >
            <Select
              notFoundContent={
              <div style={{textAlign:"center"}}>
                <img src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png?f=webp" width="10%"/>
                <p>Không có dữ liệu</p>
              </div>}
              showSearch
              onChange={(e) => {
                const arr = e.split("-");
                setData({
                  ...data,
                  provider: {
                    id: arr[0],
                    code: arr[2],
                    name: arr[1],
                  },
                });
              }}
              placeholder="Chọn nhà cung cấp"
              style={{ paddingLeft: "10px" }}
            >
              {provider.map((i) => {
                return (
                  <Option value={i.id + "-" + i.name + "-" + i.code}>
                    {i.name + "-" + i.code}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="receiptGroup"
            label="Loại phiếu chi"
            style={{ float: "left", width: "47%" }}
            rules={[
              {
                required: true,
                message: "Vùng này không được để trống",
              },
            ]}
          >
            <Select
              notFoundContent={
              <div style={{textAlign:"center"}}>
                <img src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png?f=webp" width="10%"/>
                <p>Không có dữ liệu</p>
              </div>}
              showSearch
              allowClear
              onClear={(e) => {
                setData({ ...data, receiptGroup: null });
              }}
              placeholder="Chọn loại phiếu chi"
              onSelect={(e) => {
                const arr = e.split("-");
                setData({
                  ...data,
                  receiptGroup: {
                    id: arr[0],
                  },
                });
              }}
              style={{
                float: "left",
              }}
            >
              {receiptGroup.map((i) => {
                if (receiptGroup.length > 0)
                  return (
                    <Option value={i.id + "-" + i.code + "-" + i.name}>
                      {i.name + "-" + i.code}
                    </Option>
                  );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            initialValue={"Chưa thanh toán"}
            label="Trạng thái"
            rules={[
              {
                required: true,
                message: "Vùng này không được để trống",
              },
            ]}
          >
            <Select
              placeholder="Chọn trạng thái"
              onSelect={(e) => {
                setData({
                  ...data,
                  status: e,
                });
              }}
              style={{ width: "100%", paddingLeft: "10px" }}
            >
              <Option value="paid">Đã thanh toán</Option>
              <Option value="unpaid"> Chưa thanh toán</Option>
            </Select>
          </Form.Item>
          <Form.Item
            notFoundContent={
              <div style={{textAlign:"center"}}>
                <img src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png?f=webp" width="10%"/>
                <p>Không có dữ liệu</p>
              </div>}
            name="payment_type"
            label="Hình thức thanh toán"
            rules={[
              {
                message: "Vùng này không được để trống",
                required: true,
              },
            ]}
            style={{ width: "47%", float: "left" }}
          >
            <Select
              showSearch
              placeholder="Chọn hình thức thanh toán"
              onSelect={(e) => {
                const arr = e.split("-");
                setData({
                  ...data,
                  payment_type: {
                    id: arr[0],
                    name: arr[1],
                  },
                });
              }}
            >
              {dataOfType.map((i) => {
                if (dataOfType.length > 0)
                  return <Option value={i.id + "-" + i.name}>{i.name}</Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="revenue"
            label="Giá trị"
            initialValue={0}
            rules={[
              {
                required: true,
                message: "Vùng này không được để trống",
              },
            ]}
          >
            <InputNumber
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{
                marginLeft: "10px",
                width: "98.5%",
              }}
              onChange={(e) => {
                setData({
                  ...data,
                  revenue: e,
                });
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              style={{ margin: "10px" }}
              htmlType="submit"
              size="large"
            >
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
