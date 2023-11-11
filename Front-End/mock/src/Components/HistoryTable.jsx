import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Select, Space, Spin } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Account from "./Account";
import Paginate from "./Paginate";
import { baseURL } from "../Config";
import ExceptionBox from "./ExceptionBox";
import SearchInput from "./SearchInput";
import { Option } from "antd/es/mentions";
import DefaultTable from "./DefaultTable";
import { Token } from "../Token";
function HistoryTable() {
  document.title = "Lịch sử";
  localStorage.removeItem("selected");
  localStorage.removeItem("open");
  const navigate = useNavigate();
  const [data, setData] = useState({
    data: [],
    loading: true,
  });
  const [employee, setEmployee] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(null);
  const [employee_code, setemployee_code] = useState(null);
  const [name, setName] = useState(null);
  const [err, setErr] = useState(false);
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("");
  let columns = [
    {
      title: "Nội dung",
      dataIndex: "1",
      key: "msg",
    },
    {
      title: "Thời gian",
      dataIndex: "2",
      key: "time",
      sorter: true,
    },
  ];
  var ename, ecode, edate;
  useEffect(() => {
    axios({
      method: "get",
      url: baseURL + "/employee/list",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        setEmployee(res.data);
      })
      .catch((err) => {
        setErr(true);
      });
    axios({
      url: baseURL + "/history/count",
      method: "post",
      headers: {
        Authorization: Token,
      },
      data: {
        employee_code: employee_code,
        name: name,
        time: time,
      },
    })
      .then((res) => {
        setCount(res.data);
      })
      .catch((err) => {
        console.log(err);
        setErr(true);
      });
    axios({
      url:
        baseURL +
        "/history/list?page=" +
        (page - 1) +
        "&limit=" +
        limit +
        "&sort=" +
        sort,
      method: "post",
      headers: {
        Authorization: Token,
      },
      data: {
        employee_code: employee_code,
        name: name,
        time: time,
      },
    })
      .then((res) => {
        const update = {
          data: res.data,
          loading: true,
        };
        update.loading = false;
        setData(update);
      })
      .catch((err) => {
        console.log(err);
        setErr(true);
      });
  }, [page, limit, name, time, employee_code, sort]);
  const handleSubmit = (e) => {
    setName(ename);
    setemployee_code(ecode);
    setTime(edate);
    setOpen(false);
  };
  let items = [];
  if (employee.length > 0) {
    items = [
      {
        label: (
          <Space direction="vertical">
            <label>Thời gian</label>
            <DatePicker
              onChange={(date, dateString) => {
                edate = dateString.substring(0, 10);
              }}
            />
          </Space>
        ),
        key: "1",
      },
      {
        label: (
          <Form.Item>
            <label>Tên nhân viên</label>
            <Select
              style={{ maxWidth: "400px" }}
              allowClear
              onSelect={(e) => {
                ename = e;
              }}
            >
              {employee.map((item) => {
                return <Option key={item.name}>{item.name}</Option>;
              })}
            </Select>
          </Form.Item>
        ),
        key: 2,
      },
      {
        label: (
          <Form.Item>
            <label>Mã nhân viên</label>
            <Select
              style={{ maxWidth: "400px" }}
              allowClear
              onSelect={(e) => {
                ecode = e;
              }}
            >
              {employee.map((item) => {
                return <Option key={item.code}>{item.code}</Option>;
              })}
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
  }
  if (data.data.length > 0) {
    columns = [
      {
        title: "Nội dung",
        dataIndex: "1",
        key: "msg",
        render: (_, record) => (
          <Space size="middle">
            <p>
              <a
                onClick={(e) => {
                  navigate("employee/information/" + record.employee_code);
                }}
              >
                {record.name}
              </a>{" "}
              {record.msg}
            </p>
          </Space>
        ),
      },
      {
        title: "Thời gian",
        dataIndex: "2",
        key: "time",
        render: (_, record) => (
          <Space size="middle">
            <p>
              {record.time.substring(0, 10) +
                " " +
                record.time.substring(11, 19)}
            </p>
          </Space>
        ),
        sorter: true,
      },
    ];
  }
  const onChange = (pagination, filters, sorter, extra) => {
    setSort(sorter.columnKey + "-" + sorter.order);
  };
  return (
    <div className="content">
      <div className="taskbar">
        <h2>Lịch sử</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <SearchInput
        filter={items}
        openFilter={open}
        setOpenFilter={setOpen}
        displaySearch={"none"}
      />
      {err ? (
        <ExceptionBox url="/main" msg=<h2>Có lỗi xảy ra</h2> />
      ) : (
        <div className="inside" style={{ display: "block" }}>
          {data.loading ? (
            <Spin />
          ) : (
            <DefaultTable
              columns={columns}
              data={data.data}
              onChange={onChange}
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
export default HistoryTable;
