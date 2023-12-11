import React, { useEffect, useState } from "react";
import "../style.css";
import Account from "../Account";
import { useNavigate } from "react-router-dom";
import { Alert, Button, ConfigProvider, Form, Input, Modal, Select } from "antd";
import { Option } from "antd/es/mentions";
import axios from "axios";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { CaretLeftOutlined } from "@ant-design/icons";

export default function CreateProvider(props) {
  document.title = "Tạo nhà cung cấp";
  const [data, setData] = useState(
    {status:"active"}
  );
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [form] = Form.useForm();
  const [dataOfType, setDataOfType] = useState([]);
  const [value, setValue] = useState("");
  useEffect(() => {
    props.setOpenKeys("provider");
    props.setSelectedKeys("provider-list");
    axios({
      method: "post",
      url: baseURL + "/provider-type/list",
      headers: {
        Authorization: props.token,
      },
      data: {
        value: value,
      },
    })
      .then((res) => {
        setDataOfType(res.data);
      })
      .catch((err) => {
      });
  }, [value]);
  const handleSubmit = () => {
    axios({
      url: baseURL + "/provider/staff/create-one",
      method: "post",
      headers: {
        Authorization: props.token,
      },
      data: data,
    })
      .then((res) => {
        navigate("/provider-table");
      })
      .catch((err) => {
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
  };
  return (
    <div className="content" style={{ paddingTop: "10px" }}>
      <div className="taskbar">
        {error && (
          <Alert
            message="Tạo thất bại"
            showIcon
            description="Chỉ quản trị viên mới có thể tạo được nhà cung cấp mới"
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
              navigate("/provider-table");
            }}
            size="large"
            style={{ height: "fit-content" }}
          >
            <h3>
              <CaretLeftOutlined /> Thông tin phiếu thu
            </h3>
          </Button>
        </ConfigProvider>
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
            margin: "3% 5%",
          }}
        >
          <Form.Item
            name="name"
            label="Tên nhà cung cấp"
            rules={[
              {
                required: true,
                message: "Vùng này không được để trống",
              },
            ]}
          >
            <Input
              onChange={(e) => {
                setData({
                  ...data,
                  name: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="code"
            label="Mã nhà cung cấp"
            initialValue=""
            rules={[
              {
                pattern: "^(?!PRV).*",
                message: "Tiền tố PRV không hợp lệ",
              },
            ]}
            style={{
              float: "left",
              width: "45%",
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
          <Form.Item name="provider_type" label="Nhóm khách hàng">
            <Select
              showSearch
              notFoundContent={
              <div style={{textAlign:"center"}}>
                <img src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png?f=webp" width="10%"/>
                <p>Không có dữ liệu</p>
              </div>}
              placeholder="Chọn nhóm khách hàng"
              filterOption={false}
              onSearch={(e) => {
                setValue(e);
              }}
              onSelect={(e) => {
                setData({
                  ...data,
                  provider_type: {
                    id: e,
                  },
                });
              }}
              style={{ paddingLeft: "10px" }}
            >
              {dataOfType.map((i) => {
                if (dataOfType.length > 0)
                  return <Option value={i.id}>{i.content}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                required: true,
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input
              onChange={(e) => {
                setData({
                  ...data,
                  email: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^\d+$/,
                required: true,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
            style={{
              float: "left",
              width: "45%",
            }}
          >
            <Input
              onChange={(e) => {
                setData({
                  ...data,
                  contact: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            initialValue={"Đã kích hoạt"}
            name="status"
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
              onSearch={(e) => {
                setValue(e);
              }}
              onSelect={(e) => {
                setData({
                  ...data,
                  status: e,
                });
              }}
              style={{ paddingLeft: "10px" }}
            >
              <Option value="active">Đã kích hoạt</Option>
              <Option value="non-active"> Chưa kích hoạt</Option>
            </Select>
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
