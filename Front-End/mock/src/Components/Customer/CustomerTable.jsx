import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
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
import { useNavigate } from "react-router-dom";
import Account from "../Account";
import ExceptionBox from "../ExceptionBox";
import RowSelectionTable from "../RowSelectionTable";
import Paginate from "../Paginate";
import ImportFile from "../ImportFile";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { Option } from "antd/es/mentions";
function CustomerTable(props) {
  document.title = "Danh sách khách hàng";
  const [file, setFile] = useState();
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
  const [list, setList] = useState([]);
  const [sort, setSort] = useState("");
  const [index, setIndex] = useState(false);
  const [dataRequest, setDataRequest] = useState({});
  const [dataOfType, setDataOfType] = useState([]);
  const [customer_type, setProvider_type] = useState();
  const [success, setSuccess] = useState(0);
  const [failed, setFailed] = useState(0);
  const [typeCreated, setTypeCreated] = useState(0);
  const [checkBox, setCheckBox] = useState(false);
  let columns = [
    {
      title: "Mã khách hàng",
      dataIndex: "code",
      key: "code",  
      width: "15%",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giới tính",
      dataIndex: "gender  ",
      key: "gender  ",
    },
    {
      title: "Số điện thoại",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "25%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];
  useEffect(() => {
    props.setOpenKeys("customer")
    props.setSelectedKeys("customer-list")
    let temp = [];
    axios({
      method: "post",
      url: baseURL + "/customer-type/list",
      headers: {
        Authorization: Token,
      },
      data: {
        value: null,
      },
    })
      .then((res) => {
        setDataOfType(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios({
      url:
        baseURL +
        "/customer/list?page=" +
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
        console.log(err);
        setErr(true);
      });
    axios({
      method: "post",
      url: baseURL + "/customer/count-list",
      headers: {
        Authorization: Token,
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
  }, [value, loading, inputFile, customer_type, index, sort, page, limit]);
  const handleButton = () => {
    axios({
      url: baseURL + "/customer/admin",
      method: "delete",
      headers: {
        Authorization: Token,
      },
      data: selectedRowKeys,
    })
      .then((res) => {
        setIndex(!index);
        setSelectedRowKeys([]);
      })
      .catch((err) => setErr(true));
  };
  const submitList = async () => {
    if (file && file.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const d = new Uint8Array(e.target.result);
          const workbook = XLSX.read(d, { type: "array" });
          // Lấy dữ liệu từ sheet đầu tiên
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet, {
            header: 2,
            range: 1,
          });
          // Xử lý dữ liệu, ví dụ: log ra console
          let check = [];
          dataOfType.map((i) => {
            check.push(i.content);
          });
          jsonData.map(async (json) => {
            if (
              typeof json.customer_type != "undefined" &&
              (json.status === "non-active" || json.status === "active")
            ) {
              if (!check.includes(String(json.customer_type))) {
                await axios({
                  method: "post",
                  url: baseURL + "/customer-type/admin/create",
                  headers: {
                    Authorization: Token,
                  },
                  data: {
                    content:
                      typeof json.customer_type === "undefined"
                        ? null
                        : String(json.customer_type).trim(),
                  },
                })
                  .then((res) => {
                    message.success(
                      "Đã tạo thêm nhóm nhà cung cấp " + json.customer_type
                    );
                    setTypeCreated(typeCreated + 1);
                  })
                  .catch((err) => {
                    message.error("Tạo nhóm thất bại");
                  });
              }
              if (json.status !== "non-acitve" && json.status !== "active")
                throw new Error();
              let { customer_type, ...newObj } = json;
              console.log(typeof json.customer_type === "undefined");
              newObj = {
                ...newObj,
                customer_type: {
                  content:
                    typeof json.customer_type === "undefined"
                      ? null
                      : String(json.customer_type).trim(),
                },
              };
              await axios({
                method: "post",
                url: baseURL + "/customer/staff/create-one",
                headers: {
                  Authorization: Token,
                },
                data: newObj,
              })
                .then((res) => {
                  setSuccess(success + 1);
                  message.success("Tạo thành công nhà cung cấp " + newObj.name);
                })
                .catch((err) => {
                  setFailed(failed + 1);
                  message.error("Tạo thất bại nhà cung cấp " + newObj.name);
                });
              return newObj;
            } else {
              message.error("Đối tượng " + json.name + " không hợp lệ");
            }
          });
          setCheckBox(true);
        } catch (err) {
          message.error("File không hợp lệ");
        }
      };
      reader.readAsArrayBuffer(file.files[0]);
    }
  };
  const onChangeClick = (pagination, filters, sorter, extra) => {
    setSort(sorter.columnKey + "-" + sorter.order);
    console.log(sort);
  };
  const onChange = (date, dateString) => {
    setDataRequest({
      ...dataRequest,
      created_date: dateString,
    });
  };
  const currentTime = new Date();
  const handleSubmit = (e) => {
    setIndex(!index);
    console.log(dataRequest);
    setOpen(false);
  };
  let items = [
    {
      label: (
        <Space direction="vertical">
          <label>Giới tính</label>
          <Select
          placeholder="Chọn giới tính"
            style={{ marginTop: "10px", width: "15vw",textAlign:"center" }}
            allowClear
            onSelect={(e) => {
              setDataRequest({
                ...dataRequest,
                gender: e,
              });
            }}
          >
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
            <Option value="LGBT">Giới tính thứ 3</Option>
          </Select>
        </Space>
      ),
      key: "1",
    },
    {
      label: (
        <>
          <label>Ngày tháng năm sinh</label>
          <br></br>
          <Space >
            <InputNumber

              placeholder="Ngày"
              min={1}
              max={31}
              style={{ marginRight: "10px", marginTop: "10px", width: "100px",textAlign:"center" }}
              onChange={(e) => {
                setDataRequest({ ...dataRequest, birthday_day: e });
              }}
            />
            <InputNumber

              placeholder="Tháng"
              min={1}
              max={12}
              style={{ marginRight: "10px", marginTop: "10px", width: "100px",textAlign:"center" }}
              onChange={(e) => {
                setDataRequest({ ...dataRequest, birthday_month: e });
              }}
            />
            <InputNumber

              placeholder="Năm"
              min={1900}
              max={currentTime.getFullYear()}
              style={{ marginRight: "10px", marginTop: "10px", width: "100px",textAlign:"center" }}
              onChange={(e) => {
                setDataRequest({ ...dataRequest, birthday_year: e });
              }}
            />
          </Space>
        </>
      ),
      key: "2",
    },

    {
      label: (
        <Space direction="vertical">
          <label>Thời gian tạo</label>
          <DatePicker onChange={onChange} style={{width:"15vw",textAlign:"center"}} placeholder="YYYY-MM-DD" />
        </Space>
      ),
      key: "3",
    },
    {
      label: (
        <Space direction="vertical">
          <label>Nhóm khách hàng</label>
          <Form.Item name="customerType">
            <Select
              placeholder="Chọn nhóm khách hàng"
              style={{
                width:"15vw",
                textAlign:"center"
              }}
              allowClear
              onSelect={(e) => {
                setDataRequest({
                  ...dataRequest,
                  customer_type: {
                    id: e,
                  },
                });
              }}
            >
              {dataOfType.map((item) => {
                return <Option key={item.id}>{item.content}</Option>;
              })}
            </Select>
          </Form.Item>
        </Space>
      ),
      key: "8",
    },
    {
      label: (
        <Space direction="vertical">
          <Form.Item>
            <label>Trạng thái</label>
            <br></br>
            <Select
            placeholder="Chọn trạng thái"
              style={{ marginTop: "10px", width: "15vw",textAlign:"center" }}
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
              <Option value="active">Đã kích hoạt</Option>
              <Option value="non-active">Chưa kích hoạt</Option>
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
        title: "Mã khách hàng",
        dataIndex: "key",
        key: "key",
        render: (_, record) => (
          <Space size="middle">
            <a
              onClick={(e) => navigate("/customer/information/" + record.code)}
            >
              {record.code}
            </a>
          </Space>
        ),
        width: "15%",
      },
      {
        title: "Tên khách hàng",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Số điện thoại",
        dataIndex: "contact",
        key: "contact",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: "25%",
      },
      {
        title: "Tổng giao dịch",
        dataIndex: "total",
        key: "total",
        sorter: true,
      },
      {
        title: "Trang thái",
        dataIndex: "status",
        key: "status",
        render: (_, tag) => (
          <>
            {tag.status === "active" ? (
              <Tag color="green" key={tag}>
                Đã kích hoạt
              </Tag>
            ) : (
              <Tag color="red" key={tag}>
                Chưa kích hoạt
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
    const i = [
      [
        "Mã khách hàng",
        "Họ và tên",
        "Giới tính",
        "Ngày sinh",
        "Số điện thoại",
        "Ngày tạo",
        "Email",
        "Tổng giao dịch",
        "Nhóm khách hàng",
        "Người phụ trách",
        "Trạng thái",
      ],
    ];
    data.data.map((d) => {
      i.push([
        d.code,
        d.name,
        d.gender,
        d.birthday,
        d.contact,
        d.created_date,
        d.email,
        d.total,
        d.customer_type.content,
        d.manager,
        d.status,
      ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(i);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách");
    XLSX.writeFile(wb, "Danh_sách_khách_hàng.xlsx");
  };
  const handleSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className="content">
      <div className="taskbar">
        <h2>Danh sách khách hàng</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      {/* <SearchInput
        setValue={setValue}
        filter={items}
        openFilter={open}
        setOpenFilter={setOpen}
      /> */}
      {checkBox && (
        <Modal
          open={checkBox}
          onCancel={(e) => {
            setInputFile(!inputFile)
            setCheckBox(!checkBox);
            setSuccess(0);
            setTypeCreated(0);
            setFailed(0);
          }}
          onOk={(e) => {
            setInputFile(!inputFile)
            setCheckBox(!checkBox);
            setSuccess(0);
            setTypeCreated(0);
            setFailed(0);
          }}
        >
          <p>Số khách hàng đã thêm thành công: {success>0 ? success+1:success}</p>
          <p>Số khách hàng thêm không thành công: {failed>0 ? failed+1:failed}</p>
          <p>Số nhóm khách hàng đã bổ sung: {typeCreated>0 ? failed+1:failed}</p>
        </Modal>
      )}
      {inputFile && (
        <ImportFile
          setInputFile={setInputFile}
          setFile={setFile}
          submitList={submitList}
          msg=<div>
            <p>
              Thực hiện theo bản mẫu
              <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQS-drt0caPA5s7_MHsNPJ4fXNkVpogoAPKb_5ARWUlG4qKMG7DdJDD1QaJ97RyiZqQg3tAXmhTF050/pub?output=xlsx">
                Tại đây
              </a>
            </p>
            <p>Mã khách hàng không được chứa tiền tố "CTM"</p>
            <p>Ngày sinh cần có định dạng YYYY-MM-DD</p>
            <p>Nhóm khách hàng cần được thiết lập trước trong danh sách</p>
            <p>Chỉ có 2 trạng thái là "active" và "non-active"</p>
          </div>
        />
      )}
      {err ? (
        <ExceptionBox url="/main" msg=<h2>Có lỗi xảy ra</h2> />
      ) : (
        <div className="inside" style={{ display: "block" }}>
          {data.loading && loading ? (
            <Spin />
          ) : (
            <RowSelectionTable
              quantity={selectedRowKeys.length}
              delete={handleButton}
              handlePrint={handlePrint}
              url="/create-customer"
              name="khách hàng"
              handleButton={handleButton}
              selectedRowKeys={selectedRowKeys}
              handleSelection={handleSelection}
              columns={columns}
              data={data.data}
              setInputFile={setInputFile}
              setFile={setFile}
              onChange={onChangeClick}
              setValue={setValue}
              filter={items}
              openFilter={open}
              setOpenFilter={setOpen}
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
export default CustomerTable;
