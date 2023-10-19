import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Account from "../Account";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function ProviderInformation() {
  document.title = "Thông tin nhà cung cấp";
  const [form] = Form.useForm();

  const [data, setData] = useState(null); // Khởi tạo data ban đầu là null
  const [adjust, setAdjust] = useState(false);
  const [err, setErr] = useState(false);
  const [code, setCode] = useState(window.location.pathname.substring(22));
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [debt, setDebt] = useState(0);
  const [status, setStatus] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [employee, setEmployee] = useState(null);
  const [receipts, setReceipts] = useState([]);

  const handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    switch (field) {
      case "name":
        setName(value);
        break;
      case "contact":
        setContact(value);
        break;
      default:
        break;
    }
  };

  const handleStatusChange = (value) => {
    if(value==="active") setStatus({
        id:1,
        name:value
    })
    else setStatus({
        id:2,
        name:value
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    form
      .validateFields()
      .then(() => {
        axios({
          url: "http://localhost:8080/admin/provider",
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          data: {
            code: code,
            name: name,
            contact: contact,
            created_date: createdDate,
            modified_date: modifiedDate,
            debt: debt,
            status: status,
          },
        })
          .then((res) => {
            window.location.reload();
          })
          .catch((err) => alert("failed"));
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  useEffect(() => {
    axios({
      url: "http://localhost:8080/provider/information?code=" + code,
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        setData(res.data); // Cập nhật data từ dữ liệu API
      })
      .catch((err) => {
        setErr(true);
      });
  }, [code]);

  useEffect(() => {
    if (data != null) {
      setContact(data.contact);
      setDebt(data.debt);
      setName(data.name);
      setStatus(data.status);
      if (data.created_date != null)
        setCreatedDate(data.created_date.substring(0, 10));
      if (data.modified_date != null)
        setModifiedDate(data.modified_date.substring(0, 10));
      setReceipts(data.receipts);
      if (data.employees.length > 0) setEmployee(data.employees[0]);
    }
  }, [data]);

  return (
    <div className="content">
      <div className="taskbar">
        <h2>Thông tin nhà cung cấp</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div className="inside">
        {data!= null && <Form
          {...layout}
          form={form}
          style={{
            maxWidth: 600,
            margin: "10px",
          }}
        >
          <Form.Item name="code" label="Mã" rules={[{ required: true }]} initialValue={data.code}>
            <Input  disabled={true} readOnly />
          </Form.Item>
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]} initialValue={data.name}>
            <Input
              name="name"
              disabled={!adjust}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
        name="contact"
        label="Số điện thoại"
        rules={[
          {
            pattern:"^\\d+$",
            required: true,
            message:"Số điện thoại không hợp lệ"
          },
        ]}
        initialValue={data.contact}
      >
        <Input
        disabled={!adjust}
          onChange={(e)=>{
            setContact(e.target.value);
          }}
        />
      </Form.Item>
          <Form.Item name="debt" label="Công nợ" required rules={[{ required: true }]} initialValue={data.debt}>
            <Input value={debt} disabled={true} readOnly />
          </Form.Item>
          <Form.Item name="employee" label="Người tạo" required rules={[{ required: true }]} initialValue={data.employees[0].name}>
            <Input
              name="employee"
              disabled={true}
              readOnly
            />
          </Form.Item>
          <Form.Item name="created-date" label="Ngày tạo" required rules={[{ required: true }]} initialValue={data.created_date.substring(0,10)}>
            <Input value={createdDate} disabled={true} readOnly />
          </Form.Item>
          {data.modified_date && <Form.Item name="modified_date" label="Ngày chỉnh sửa" rules={[{ required: true }]} initialValue={data.modified_date.substring(0,10)}>
            <Input value={modifiedDate} disabled={true} readOnly />
          </Form.Item>}
          <Form.Item name="status" label="Trạng thái" required rules={[{ required: true }]} initialValue={data.status.name}>
            <Select
              disabled={!adjust}
              onSelect={handleStatusChange}
            >
              <Option value="active">active</Option>
              <Option value="non-active">non-active</Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            {!adjust && (
              <Button onClick={() => setAdjust(!adjust)} style={{ margin: "10px" }}>
                Chỉnh sửa
              </Button>
            )}
            {adjust && (
              <>
                <Button
                  style={{ margin: "10px" }}
                  onClick={handleSubmit}
                  htmlType="submit"
                >
                  Xác nhận
                </Button>
                <Button onClick={() => setAdjust(!adjust)} style={{ margin: "10px" }}>
                  Hủy
                </Button>
              </>
            )}
          </Form.Item>
        </Form>}
      </div>
    </div>
  );
}
