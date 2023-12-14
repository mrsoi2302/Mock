import { Button, Form, Modal, Select, Space, Spin, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { Option } from "antd/es/mentions";
import "../style.css";
import Account from "../Account";
import SearchInput from "../SearchInput";
import ExceptionBox from "../ExceptionBox";
import Paginate from "../Paginate";
import RowSelectionTable from "../RowSelectionTable";
import * as XLSX from "xlsx";
import ImportFile from "../ImportFile";
export default function EmployeeTable(props) {
  document.title = "Danh sách nhân viên";
  localStorage.setItem("open", "employee");
  localStorage.setItem("selected", "employee-list");
  const navigate = useNavigate();
  const [data, setData] = useState({
    data: [],
    loading: true,
  });
  const [count, setCount] = useState(0);
  
  const [inputFile, setInputFile] = useState(false);
  const [role, setRole] = useState();
  const [value, setValue] = useState();
  const [err, setErr] = useState(false);
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [index, setIndex] = useState(true);
  let columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
  ];
  useEffect(() => {
    props.setOpenKeys("employee");
    props.setSelectedKeys("employee-list");
    let temp = [];
    if(!document.cookie.includes("ADMIN")){
      Modal.warning(
        {
          title:"Có vẻ bạn không đủ thẩm quyền để truy cập trang này",
          onOk:(e=>{
            navigate("/main")
            Modal.destroyAll()}),
          onCancel:(e=>{
            navigate("/main")
            Modal.destroyAll()
          }),
          
        }
      )
    }
    if(document.cookie.includes("ADMIN")) 
    axios({
      method: "post",
      url:
        baseURL + "/employee/admin/list?page=" + (page - 1) + "&limit=" + limit,
      headers: {
        Authorization: props.token,
      },
      data: {
        value: value,
        t: {
          role: role,
        },
      },
    })
      .then((res) => {
        res.data.map((i) => {
          temp.push({
            ...i,
            key: i.code,
          });
        });
        setData({
          data: temp,
          loading: false,
        });
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
    axios({
      method: "post",
      url: baseURL + "/employee/count-list",
      headers: {
        Authorization: props.token,
      },
      data: {
        value: value,
        t: {
          role: role,
        },
      },
    })
      .then((res) => {
        setCount(res.data);
      })
      .catch((err) => {
      });
      
      return (()=>{
        Modal.destroyAll()
      })
      
  }, [role, value, page, limit, loading, inputFile, index]);
  const handleButton = (e) => {
    setLoading(true);
    axios({
      url: baseURL + "/employee/admin",
      method: "delete",
      headers: {
        Authorization: props.token,
      },
      data: selectedRowKeys,
    })
      .then((res) => {
        setIndex(!index);
        setSelectedRowKeys([]);
      })
      .catch((err) => setErr(true));
  };
  let eRole;
  const handleSubmit = (e) => {
    setRole(eRole);
    setOpen(false);
  };
  let items = [
    {
      label: (
        <Form.Item>
          <label>Vai trò</label>
          <Select
            style={{ maxWidth: "400px" }}
            allowClear
            onSelect={(e) => {
              eRole = e;
            }}
          >
            <Option key="STAFF">Nhân viên</Option>
            <Option key="USER">Người dùng</Option>
          </Select>
        </Form.Item>
      ),
      key: 3,
    },
    {
      label: <Button onClick={handleSubmit}>Lọc</Button>,
      key: 4,
    },
  ];
  if (data.data.length > 0) {
    columns = [
      {
        title: "Mã nhân viên",
        dataIndex: "key",
        key: "key",
        render: (_, record) => (
          <Space size="middle">
            <a
              onClick={(e) => navigate("/employee/information/" + record.code)}
            >
              {record.code}
            </a>
          </Space>
        ),
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Tên đăng nhập",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "Vai trò",
        dataIndex: "role",
        key: "role",
        render: (_, tag) => (
          <>
            {tag.role==="ADMIN" ?
            <Tag color="blue" key={tag}>
              Quản trị viên
            </Tag>
            :
            tag.role === "STAFF" ? (
              <Tag color="red" key={tag}>
                Nhân viên
              </Tag>
            ) : (
              <Tag color="green" key={tag}>
                Người dùng
              </Tag>
            )}
          </>
        ),
      },
    ];
  }
  const onSelectChange = (newSelected) => {
    setSelectedRowKeys(newSelected);
  };
  const handlePrint = () => {
    const i = [["Mã nhân viên", "Tên", "Vai trò", "Tên đăng nhập", "Mật khẩu"]];
    data.data.map((d) => {
      i.push([d.code, d.name, d.role, d.username, d.password]);
    });
    const ws = XLSX.utils.aoa_to_sheet(i);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Danh_sách_nhân_viên.xlsx");
  };
  const handleSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className="content">
      <div className="taskbar">
        <h3>Danh sách nhân viên</h3>
        <Account name={localStorage.getItem("name")} />
      </div>

      {err ? (
        <ExceptionBox url="/main" msg=<h2>Có lỗi xảy ra</h2> />
      ) : (
        <div className="inside" style={{ display: "block" }}>
          {data.loading && loading ? (
            <Spin />
          ) : (
            <RowSelectionTable
              delete={handleButton}
              setValue={setValue}
              filter={items}
              openFilter={open}
              setOpenFilter={setOpen}
              handlePrint={handlePrint}
              url="/create-employee"
              name="nhân viên"
              handleButton={handleButton}
              selectedRowKeys={selectedRowKeys}
              handleSelection={handleSelection}
              columns={columns}
              data={data.data}
              quantity={selectedRowKeys.length}
            />
          )}
          <Paginate
            page={page}
            setPage={setPage}
            number={count}
            setLimit={setLimit}
            limit={limit}
          />
        </div>
      )}
    </div>
  );
}
