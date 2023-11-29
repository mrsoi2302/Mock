import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Spin,
  Tag,
  message,
} from "antd";
import * as XLSX from "xlsx";
import axios from "axios";
import "../style.css";
import { Link, useNavigate } from "react-router-dom";
import Account from "../Account";
import ExceptionBox from "../ExceptionBox";
import RowSelectionTable from "../RowSelectionTable";
import Paginate from "../Paginate";
import ImportFile from "../ImportFile";
import SearchInput from "../SearchInput";
import { baseURL } from "../../Config";
import { Option } from "antd/es/mentions";
import CreatePayment from "./CreatePayment";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import RowSelectionTableForBill from "../RowSelectionTableForBill";
import BillTypeModal from "../BillTypeModal";
import { Token } from "../../Token";
function PaymentTable(props) {
  document.title = "Danh sách phiếu chi";
  localStorage.setItem("open", "cash");
  localStorage.setItem("selected", "payment-list");
  const navigate = useNavigate();
  const [data, setData] = useState({
    data: [],
    loading: true,
  });
  const [count, setCount] = useState(0);
  const [inputFile, setInputFile] = useState(false);
  const [value, setValue] = useState("");
  const [err, setErr] = useState(false);
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");
  const [index, setIndex] = useState(false);
  const [dataRequest, setDataRequest] = useState({});
  const [payment_type, setPayment_type] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [createType, setCreateType] = useState("");
  const [openBillModal,setOpenBillModal] = useState(false)
  let columns = [
    {
      title: "Mã phiếu chi",
      dataIndex: "code",
      key: "code",

      width: "15%",
    },
    {
      title: "Khách hàng chi trả",
      dataIndex: "customer-name",
      key: "customer-name",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_date",
      key: "created_date",
    },
    {
      title: "Người quản lý",
      dataIndex: "manager",
      key: "manager",
    },
  ];
  useEffect(() => {
    props.setOpenKeys("cash")
      props.setSelectedKeys("payment-list")
    let temp = [];
    axios({
      method: "post",
      url: baseURL + "/payment-type/list",
      headers: {
        Authorization: props.token
      },
      data: {
        value: null,
      },
    }).then((res) => {
      setPayment_type(res.data);
    });
    axios({
      url:
        baseURL +
        "/payment/list?page=" +
        (page - 1) +
        "&limit=" +
        limit +
        "&sort=" +
        sort,
      method: "post",
      headers: {
        Authorization:  props.token,
      },
      data: {
        value: value,
        t: dataRequest,
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
        setErr(true);
      });
    axios({
      method: "post",
      url: baseURL + "/payment/count-list",
      headers: {
        Authorization:  props.token,
      },
      data: {
        value: value,
        t: dataRequest,
      },
    })
      .then((res) => {
        setCount(res.data);
      })
      .catch((err) => {
        setErr(true);
      });
    axios({
      url: baseURL + "/employee/admin/list",
      method: "get",
      headers: {
        Authorization:  props.token,
      },
    }).then((res) => {
      setEmployeeList(res.data);
    });
  }, [value, limit, page, inputFile, index, sort]);
  const handleButton = () => {
    axios({
      url: baseURL + "/payment/admin",
      method: "delete",
      headers: {
        Authorization:  props.token,
      },
      data: selectedRowKeys,
    })
      .then((res) => {
        setIndex(!index);
        setSelectedRowKeys([]);
      })
      .catch((err) => setErr(true));
  };
  const onChangeClick = (pagination, filters, sorter, extra) => {
    setSort(sorter.columnKey + "-" + sorter.order);
    console.log(sort);
  };
  const handleSubmit = (e) => {
    setIndex(!index);
    console.log(dataRequest);
    setOpen(false);
  };
  let items = [
    {
      label: (
        <Space direction="vertical">
          <label>Người quản lý</label>
          <Select
            placeholder="Chọn người quản lý"
            style={{ marginTop: "10px", width: "15vw" }}
            allowClear
            onClear={(e) => {
              setDataRequest({
                ...dataRequest,
                manager: null,
                manager_code: null,
              });
            }}
            onSelect={(e) => {
              let arr = e.split("-");
              setDataRequest({
                ...dataRequest,
                manager: arr[1],
                manager_code: arr[2],
              });
            }}
          >
            {employeeList.map((i) => {
              return (
                <Option value={i.id + "-" + i.username + "-" + i.role}>
                  {i.username + "-" + i.role}
                </Option>
              );
            })}
          </Select>
        </Space>
      ),
      key: "1",
    },

    {
      label: (
        <Space direction="vertical">
          <label>Thời gian tạo</label>
          <DatePicker
            style={{ marginTop: "10px", width: "15vw" }}
            placeholder="YYYY-MM-DD"
            allowClear
            onChange={(e, s) => {
              setDataRequest({
                ...dataRequest,
                created_date: s,
              });
            }}
          />
        </Space>
      ),
      key: "2",
    },
    {
      label: (
        <Space direction="vertical">
          <label>Hình thức thanh toán</label>
          <Form.Item name="paymentType">
            <Select
                        style={{ marginTop: "10px", width: "15vw" }}
              placeholder="Chọn hình thức thanh toán"
              allowClear
              showSearch
              onChange={(e) => {
                let arr = null;
                if (e != null) {
                  arr = e.split("-");
                  setDataRequest({
                    ...dataRequest,
                    payment_type: {
                      id: arr[0],
                    },
                  });
                } else
                  setDataRequest({
                    ...dataRequest,
                    payment_type: null,
                  });
              }}
            >
              {payment_type.length > 0 &&
                payment_type.map((item) => {
                  return (
                    <Option key={item.id + "-" + item.name}>{item.name}</Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Space>
      ),
      key: "3",
    },
    {
      label: (
        <Space direction="vertical">
          <Form.Item>
            <label>Trạng thái</label>
            <br></br>
            <Select
              style={{ marginTop: "10px", width: "15vw" }}
              placeholder="Chọn trạng thái"
              allowClear
              onClear={(e) => {
                setDataRequest({ ...dataRequest, status: null });
              }}
              onSelect={(e) => {
                setDataRequest({
                  ...dataRequest,
                  status: e,
                });
              }}
            >
              <Option value="paid">Đã thanh toán</Option>
              <Option value="unpaid">Chưa thanh toán</Option>
            </Select>
          </Form.Item>
        </Space>
      ),
      key: "4",
    },
    {
      label: <Button onClick={handleSubmit}>Lọc</Button>,
      key: "5",
    },
  ];
  if (data.data.length > 0) {
    columns = [
      {
        title: "Mã phiếu chi",
        dataIndex: "code",
        key: "code",
        render: (_, record) => (
          <Space size="middle">
            <a onClick={(e) => navigate("/payment/information/" + record.code)}>
              {record.code}
            </a>
          </Space>
        ),
        width: "15%",
      },
      {
        title: "Khách hàng chi trả",
        dataIndex: "customer-name",
        key: "customer-name",
        render: (_, record) => (
          <Space size="middle">
            {record.customer===null ? <p>Không xác định</p>
            :
            <a
              onClick={(e) =>
                navigate("/customer/information/" + record.customer.code)
              }
            >
              {record.customer.name + "-" + record.customer.code}
            </a>}
          </Space>
        ),
      },
      {
        title: "Giá trị",
        dataIndex: "paid",
        key: "paid",
        sorter:true
      },
      {
        title: "Ngày tạo",
        dataIndex: "created_date",
        key: "created_date",
        render: (_, record) => (
          <Space size="middle">
            <p>
              {record.created_date.substring(0, 10) +
                " " +
                record.created_date.substring(11, 19)}
            </p>
          </Space>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (_, record) => (
          <Tag color={record.status === "paid" ? "green" : "red"}>
            {record.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
          </Tag>
        ),
      },
    ];
  }
  const onSelectChange = (newSelected) => {
    setSelectedRowKeys(newSelected);
  };
  const CreatePaymentType = (e) => {
    axios({
      url: baseURL + "/payment-type/admin/create",
      method: "post",
      headers: {
        Authorization:  props.token,
      },
      data: {
        name: createType,
      },
    })
      .then((res) => {
        setOpenModal(!openModal);
      })
      .catch((err) => {
        message.error("Tạo thất bại");
      });
  };
  console.log(index);
  const handleSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className="content">
      <div className="taskbar">
        <h2>Danh sách phiếu chi</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      {err ? (
        <ExceptionBox url="/main" msg=<h2>Có lỗi xảy ra</h2> />
      ) : (
        <div className="inside" style={{ display: "block" }}>
          {data.loading && loading ? (
            <Spin />
          ) : (
            <div>
              <Modal
                title="Thêm hình thức thanh toán mới"
                open={openModal}
                onCancel={(e) => {
                  setOpenModal(false);
                }}
                onOk={CreatePaymentType}
                okButtonProps={{
                  disabled: createType.length === 0,
                }}
              >
                <Form.Item label="Hình thức thanh toán">
                  <Input
                    onChange={(e) => {
                      setCreateType(e.target.value);
                    }}
                  />
                </Form.Item>
              </Modal>
              {/* <Button type="primary" style={{marginRight:"10px"}} onClick={e=>setOpenModal(true)}>Thêm hình thức thanh toán</Button> */}
              <BillTypeModal
                index={index}
                setIndex={setIndex}
                openBillModal={openBillModal}
                title="Các loại phiếu chi"
                name="payment"
                setOpenBillModal={setOpenBillModal}
                code="PMG"
              />
              <RowSelectionTableForBill
                delete={handleButton}
                setOpenBillModal={setOpenBillModal}
                setOpenModal={setOpenModal}
                setValue={setValue}
                filter={items}
                openFilter={open}
                setOpenFilter={setOpen}
                url="/create-payment"
                name="phiếu chi"
                selectedRowKeys={selectedRowKeys}
                handleSelection={handleSelection}
                columns={columns}
                data={data.data}
                onChange={onChangeClick}
              />
            </div>
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
export default PaymentTable;
