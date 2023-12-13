import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import * as XLSX from "xlsx";
import axios from "axios";
import ConfirmBox from "../ConfirmBox";
import "../style.css";
import { useLocation, useNavigate } from "react-router-dom";
import Account from "../Account";
import ExceptionBox from "../ExceptionBox";
import RowSelectionTable from "../RowSelectionTable";
import Paginate from "../Paginate";
import ImportFile from "../ImportFile";
import SearchInput from "../SearchInput";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { Option } from "antd/es/mentions";
import ChangeStatus from "../ChangeStatus";
function ProviderTable(props) {
  document.title = "Danh sách nhà cung cấp";
  localStorage.setItem("open", "provider");
  localStorage.setItem("selected", "provider-list");
  const [file, setFile] = useState();
  const navigate = useNavigate();
  const [data, setData] = useState({
    data: [],
    loading: true,
  });
  const [count, setCount] = useState(0);
  const [inputFile, setInputFile] = useState(false);
  const [created_date, setCreated_date] = useState();
  const [status, setStatus] = useState();
  const [value, setValue] = useState("");
  const [err, setErr] = useState(false);
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [sort, setSort] = useState("");
  const [index, setIndex] = useState(false);
  const [dataOfType, setDataOfType] = useState([]);
  const [provider_type, setProvider_type] = useState();
  const [success, setSuccess] = useState(0);
  const [failed, setFailed] = useState(0);
  const [typeCreated, setTypeCreated] = useState(0);
  const [checkBox, setCheckBox] = useState(false);
  let columns = [
    {
      title: "Mã nhà cung cấp",
      dataIndex: "key",
      key: "key",
      width: "15%",
    },
    {
      title: "Tên nhà cung cấp",
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];
  useEffect(() => {
    props.setOpenKeys("provider");
    props.setSelectedKeys("provider-list");
    let temp = [];

    axios({
      method: "post",
      url: baseURL + "/provider-type/list",
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
        console.log(err.data);
      });
    axios({
      url:
        baseURL +
        "/provider/list?page=" +
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
        t: {
          created_date: created_date,
          status: status,
          provider_type: {
            content: provider_type,
          },
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
        console.log(err.response);
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
      url: baseURL + "/provider/count-list",
      headers: {
        Authorization: props.token,
      },
      data: {
        value: value,
        t: {
          created_date: created_date,
          status: status,
          provider_type: {
            content: provider_type,
          },
        },
      },
    })
      .then((res) => {
        setCount(res.data);
      })
      .catch((err) => {
        setErr(true);
      });
  }, [
    created_date,
    value,
    loading,
    inputFile,
    index,
    sort,
    page,
    limit,
  ]);
  const handleButton = () => {
    axios({
      url: baseURL + "/provider/admin",
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
  let edate, estatus;
  const onChange = (date, dateString) => {
    edate = dateString;
  };
  const handleSubmit = (e) => {
    setCreated_date(edate);
    // console.log(created_date);
    setOpen(false);
    setIndex(!index)
  };

  async function processData(jsonData,check) {
    let x=0;
    let s=0;
    let f=0;
    let t=0;
    for (const json of jsonData) {
      x++;
      if (json.status === "non-active" || json.status === "active") {
        if (!check.includes(String(json.provider_type))) {
          try {
            const response = await axios.post(baseURL + "/provider-type/staff/create", {
              content: json.provider_type === undefined ? "" : String(json.provider_type).trim(),
            }, {
              headers: {
                Authorization: props.token,
              },
            });
            message.success("Đã tạo thêm nhóm nhà cung cấp " + json.provider_type);
            t++
          } catch (error) {
            message.error("Tạo nhóm thất bại");
          }
        }
  
        let { provider_type, ...newObj } = json;
        newObj = {
          ...newObj,
          provider_type: {
            content: json.provider_type === undefined ? "" : String(json.provider_type).trim(),
          },
        };
  
        try {
          const response = await axios.post(baseURL + "/provider/staff/create-one", newObj, {
            headers: {
              Authorization: props.token,
            },
          });
          s++
        } catch (error) {
          f++
        }
      } else {
        message.error("Đối tượng " + json.name + " không hợp lệ");
      }
    }
    if(x===jsonData.length){
      setCheckBox(true)
      setSuccess(s)
      setFailed(f)
      setTypeCreated(t)
    }
  }
  const submitList = () => {
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
          processData(jsonData,check);
        } catch (err) {
          
          message.error("File không hợp lệ");
        }
      };
      reader.readAsArrayBuffer(file.files[0]);
    }
  };
  const onChangeClick = (pagination, filters, sorter, extra) => {
    setSort(sorter.columnKey + "-" + sorter.order);
  };

  let items = [
    {
      label: (
        <Space direction="vertical">
          <label>Thời gian tạo</label>
          <DatePicker
            onChange={onChange}
            placeholder="YYYY-MM-DD"
            style={{ width: "15vw" }}
          />
        </Space>
      ),
      key: "1",
    },
    {
      label: (
        <Space direction="vertical">
          <label>Trạng thái</label>
          <Select
            style={{ width: "15vw" }}
            placeholder="Chọn trạng thái"
            allowClear
            onClear={(e) => {
              setStatus(null);
            }}
            onSelect={(e) => {
              setStatus(e);
            }}
          >
            <Option value="active">Đã kích hoạt</Option>
            <Option value="non-active">Chưa kích hoạt</Option>
          </Select>
        </Space>
      ),
      key: "2",
    },
    {
      label: (
        <Space direction="vertical">
          <label>Nhóm nhà cung cấp</label>
          <Select
            style={{ width: "15vw" }}
            placeholder="Chọn nhóm"
            allowClear
            onClear={(e) => {
              setProvider_type(null);
            }}
            onSelect={(e) => {
              setProvider_type(e);
            }}
          >
            {dataOfType.map((i) => {
              if (dataOfType.length > 0)
                return <Option value={i.content}>{i.content}</Option>;
            })}
          </Select>
        </Space>
      ),
      key: "3",
    },
    {
      label: <Button onClick={handleSubmit}>Lọc</Button>,
      key: "4",
    },
  ];
  if (data.data.length > 0) {
    columns = [
      {
        title: "Mã nhà cung cấp",
        dataIndex: "key",
        key: "key",
        render: (_, record) => (
          <Space size="middle">
            <a
              onClick={(e) => navigate("/provider/information/" + record.code)}
            >
              {record.code}
            </a>
          </Space>
        ),
        width: "15%",
      },
      {
        title: "Tên nhà cung cấp",
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
        width:"15vw",
        render: (_, tag) => (
          <>
            {tag.status === "active" ? (
              <Tag style={{marginLeft:"15px"}} color="green" key={tag}>
                Đã kích hoạt
              </Tag>
            ) : (
              <ChangeStatus
                name=<Tag color="red" key={tag}>
                  Chưa kích hoạt
                </Tag>
                data={tag}
                index={index}
                setIndex={setIndex}
                url={"provider/staff"}
                state="active"
              />
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
        "Mã nhà cung cấp",
        "Tên",
        "Số điện thoại",
        "Email",
        "Tổng giao dịch",
        "Nhóm nhà cung cấp",
        "Người phụ trách",
        "Trạng thái",
      ],
    ];
    data.data.map((d) => {
      i.push([
        d.code,
        d.name,
        d.contact,
        d.email,
        d.total,
        d.provider_type === null ? "Không xác định" : d.provider_type.content,
        d.manager,
        d.status,
      ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(i);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Danh_sách_nhà_cung_cấp.xlsx");
  };
  const handleSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className="content">
      <div className="taskbar">
        <h2>Danh sách nhà cung cấp</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      {inputFile && (
        <ImportFile
          setInputFile={setInputFile}
          setFile={setFile}
          submitList={submitList}
          loading={success+failed+typeCreated}
          msg=<div>
            <p>
              Thực hiện theo bản mẫu{" "}
              <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQMbkSjf9H36G9fqaLbhCfHaasbDHR17ScTanGJ60vosjZnpsCu8rE1d-mvjSS7v5JzsW3ynYN7Q7p8/pub?output=xlsx">
                {" "}
                Tại đây
              </a>
            </p>
            <p>Mã nhà cung cấp không được chứa tiền tố "PRV"</p>
            <p>Chỉ có 2 trạng thái là "active" và "non-active"</p>
          </div>
        />
      )}
      {checkBox && (
        <Modal
          open={checkBox}
          onCancel={(e) => {
            setCheckBox(!checkBox);
            setSuccess(0);
            setTypeCreated(0);
            setFailed(0);
            setInputFile(false);
          }}
          onOk={(e) => {
            setCheckBox(!checkBox);
            setSuccess(0);
            setTypeCreated(0);
            setFailed(0);
            setInputFile(false);
          }}
          cancelText="Quay lại"
        >
          <p>
            Số nhà cung cấp đã thêm thành công:
            {" "+success}
          </p>
          <p>
            Số nhà cung cấp thêm không thành công:
            {" "+failed}
          </p>
          <p>
            Số nhóm nhà cung cấp đã bổ sung:
            {" "+typeCreated}
          </p>
        </Modal>
      )}
      {err ? (
        <div></div>
      ) : (
        <div className="inside" style={{ display: "block" }}>
          {data.loading && loading ? (
            <Spin />
          ) : (
            <RowSelectionTable
              delete={handleButton}
              quantity={selectedRowKeys.length}
              handlePrint={handlePrint}
              url="/create-provider"
              name="nhà cung cấp"
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
export default ProviderTable;
