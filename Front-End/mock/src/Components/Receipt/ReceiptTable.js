import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Tag,
  message,
} from "antd";
import axios from "axios";
import "../style.css";
import { Link, useNavigate } from "react-router-dom";
import Account from "../Account";
import ExceptionBox from "../ExceptionBox";
import RowSelectionTable from "../RowSelectionTable";
import Paginate from "../Paginate";
import SearchInput from "../SearchInput";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { Option } from "antd/es/mentions";
import RowSelectionTableForBill from "../RowSelectionTableForBill";
import BillTypeModal from "../BillTypeModal";
function ReceiptTable(props) {
  document.title = "Danh sách phiếu thu";
  localStorage.setItem("open", "cash");
  localStorage.setItem("selected", "receipt-list");
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
  const [openBillModal, setOpenBillModal] = useState(false);
  const [groups, setGroups] = useState([]);
  let columns = [
    {
      title: "Mã phiếu thu",
      dataIndex: "code",
      key: "code",

      width: "15%",
    },
    {
      title: "Khách hàng thanh toán",
      dataIndex: "provider-name",
      key: "provider-name",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_date",
      key: "created_date",
    },
    {
      title: "Trạng thái",
      dataIndex: "manager",
      key: "manager",
    },
  ];
  useEffect(() => {
    props.setOpenKeys("cash");
    props.setSelectedKeys("receipt-list");
    let temp = [];
    axios({
      method: "post",
      url: baseURL + "/payment-type/list",
      headers: {
        Authorization: props.token,
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
        "/receipt/list?page=" +
        (page - 1) +
        "&limit=" +
        limit +
        "&sort=" +
        sort,
      method: "post",
      headers: {
        Authorization: props.token,
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
      url: baseURL + "/receipt/count-list",
      headers: {
        Authorization: props.token,
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
        Authorization: props.token,
      },
    }).then((res) => {
      setEmployeeList(res.data);
    }).catch(err=>{});
    axios({
      url: baseURL + "/receipt-group/list",
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      data: {
        value: value,
      },
    }).then((res) => {
      let temp = [];
      res.data.map((i) => {
        let x = {
          ...i,
          key: i.code,
        };
        temp.push(x);
      });
      setGroups(temp);
    });
  }, [value, limit, page, inputFile, index, sort]);
  const handleButton = () => {
    axios({
      url: baseURL + "/receipt/admin",
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
  const onChangeClick = (pagination, filters, sorter, extra) => {
    setSort(sorter.columnKey + "-" + sorter.order);
  };
  const handleSubmit = (e) => {
    setIndex(!index);
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
            showSearch
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
            placeholder="YYYY-MM-DD"
            style={{ marginTop: "10px", width: "15vw" }}
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
          <Form.Item name="receiptType">
            <Select
              placeholder="Chọn hình thức thanh toán"
              style={{ marginTop: "10px", width: "15vw" }}
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
              placeholder="Chọn trạng thái"
              style={{ marginTop: "10px", width: "15vw" }}
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
      label: (
        <Space direction="vertical">
          <label>Nhóm phiếu thu</label>
          <Select
            placeholder="Chọn nhóm"
            style={{ marginTop: "10px", width: "15vw" }}
            allowClear
            showSearch
            onClear={(e) => {
              setDataRequest({
                ...dataRequest,
                receiptGroup: null,
              });
            }}
            onSelect={(e) => {
              let arr = e.split("-");
              setDataRequest({
                ...dataRequest,
                receiptGroup: {
                  id: arr[0],
                },
              });
            }}
          >
            {groups.map((i) => {
              return <Option value={i.id + "-" + i.name}>{i.name}</Option>;
            })}
          </Select>
        </Space>
      ),
      key: "10",
    },
    {
      label: <Button onClick={handleSubmit}>Lọc</Button>,
      key: "5",
    },
  ];
  if (data.data.length > 0) {
    columns = [
      {
        title: "Mã phiếu thu",
        dataIndex: "code",
        key: "code",
        render: (_, record) => (
          <Space size="middle">
            <a onClick={(e) => navigate("/receipt/information/" + record.code)}>
              {record.code}
            </a>
          </Space>
        ),
        width: "15%",
      },
      {
        title: "Nhà cung cấp thanh toán",
        dataIndex: "provider-name",
        key: "provider-name",
        render: (_, record) => (
          <Space size="middle">
            {record.provider === null ? (
              <p>Không xác định</p>
            ) : (
              <a
                onClick={(e) =>
                  navigate("/provider/information/" + record.provider.code)
                }
              >
                {record.provider.name + "-" + record.provider.code}
              </a>
            )}
          </Space>
        ),
      },
      {
        title: "Giá trị",
        dataIndex: "revenue",
        key: "revenue",
        sorter: true,
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
        Authorization: props.token,
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
  const handleSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className="content">
      <div className="taskbar">
        <h2>Danh sách phiếu thu</h2>
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
                openBillModal={openBillModal}
                title="Các loại phiếu thu"
                name="receipt"
                setOpenBillModal={setOpenBillModal}
                index={index}
                setIndex={setIndex}
                code="RCG"
                groups={groups}
              />
              <RowSelectionTableForBill
                groups={groups}
                delete={handleButton}
                setOpenBillModal={setOpenBillModal}
                setOpenModal={setOpenModal}
                setValue={setValue}
                filter={items}
                openFilter={open}
                setOpenFilter={setOpen}
                url="/create-receipt"
                name="phiếu thu"
                selectedRowKeys={selectedRowKeys}
                handleSelection={handleSelection}
                columns={columns}
                data={data.data}
                quantity={selectedRowKeys.length}
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
export default ReceiptTable;
