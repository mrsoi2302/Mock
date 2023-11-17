import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
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

export default function CreateReceipt() {
  document.title = "Tạo phiếu thu mới";
  localStorage.setItem("open", "cash");
  localStorage.setItem("selected", "create-receipt");
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [value, setValue] = useState();
  const [error, setError] = useState(false);
  const [dataOfType, setDataOfType] = useState([]);
  const [provider_type, setProvider_type] = useState([]);
  const [provider, setProvider] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    axios({
      url: baseURL + "/payment-type/list",
      method: "post",
      headers: {
        Authorization: Token,
      },
      data: {
        value: null,
      },
    })
      .then((res) => {
        setDataOfType(res.data);
        console.log(dataOfType);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu từ hình thức thanh toán");
      });
    axios({
      url: baseURL + "/provider-type/list",
      method: "post",
      headers: {
        Authorization: Token,
      },
      data: {
        value: value,
      },
    })
      .then((res) => {
        setProvider_type(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu nhóm nhà cung cấp");
      });
  }, [value]);
  const handleSubmit = () => {
    axios({
      method: "post",
      url: baseURL + "/receipt/staff/create-one",
      headers: {
        Authorization: Token,
      },
      data: data,
    })
      .then((res) => {
        navigate("/receipt-table");
      })
      .catch((err) => {
        message.error("Tạo thất bại");
      });
  };
  const handleType = (e) => {
    const arr = e.split("-");
    axios({
      url: baseURL + "/provider/create-receipt",
      method: "post",
      headers: {
        Authorization: Token,
      },
      data: {
        id: arr[0],
      },
    })
      .then((res) => {
        setProvider(res.data);
      })
      .catch((err) => {
        message.error("Có lỗi khi lấy dữ liệu từ nhà cung cấp");
      });
  };
  return (
    <div className="content">
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
        <h2>Tạo phiếu thu</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div
        className="inside"
        style={{ backgroundColor: "white", display: "block" }}
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
            label="Mã phiếu thu"
            rules={[
              {
                pattern: "^(?!PMT).*",
                message: "Tiền tố PMT không hợp lệ",
              },
            ]}
            style={{
              width: "40%",
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
            name="provider_type"
            label="Nhóm nhà cung cấp"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ float: "left", width: "40%" }}
          >
            <Select
              showSearch
              placeholder="Chọn nhóm nhà cung cấp"
              onChange={e=>{
                form.setFieldsValue({ provider:null });
              }}
              onSelect={handleType}
              style={{
                float: "left",
              }}
            >
              {provider_type.map((i) => {
                if (provider_type.length > 0)
                  return (
                    <Option value={i.id + "-" + i.content}>{i.content}</Option>
                  );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="provider"
            label="Nhà cung cấp thanh toán"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              showSearch
              onChange={(e) => {
                const arr = e.split("-");
                setData({
                  ...data,
                  provider: {
                    id: arr[0],
                    code: arr[2],
                    name:arr[1]
                  },
                });
              }}
              disabled={provider.length === 0}
              placeholder="Chọn nhà cung cấp"
              style={{ paddingLeft: "10px" }}
            >
              {provider.map((i) => {
                if (provider_type.length > 0)
                  return (
                    <Option value={i.id + "-" + i.name + "-" + i.code}>
                      {i.name + "-" + i.code}
                    </Option>
                  );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="payment_type"
            label="Hình thức thanh toán"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ width: "40%", float: "left" }}
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
                console.log(i);
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
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[
              {
                required: true,
              },
            ]}
            style={
              {
                width:"40%",
                marginRight:"10px"
              }
            }
          >
            <Select
              placeholder="Chọn trạng thái"
              onSelect={(e) => {
                setData({
                  ...data,
                  status: e,
                });
              }}
              style={{ width: "100%" }}
            >
              <Option value="paid">Đã thanh toán</Option>
              <Option value="unpaid"> Chưa thanh toán</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" style={{ margin: "10px" }} htmlType="submit">
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
