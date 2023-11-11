import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import * as XLSX from "xlsx";
import axios from "axios";
import ConfirmBox from "../ConfirmBox";
import "../style.css";
import { useNavigate } from "react-router-dom";
import Account from "../Account";
import ExceptionBox from "../ExceptionBox";
import RowSelectionTable from "../RowSelectionTable";
import Paginate from "../Paginate";
import ImportFile from "../ImportFile";
import SearchInput from "../SearchInput";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { Option } from "antd/es/mentions";
function ProviderTable(props) {
  document.title = "Danh sách nhà cung cấp";
  localStorage.setItem("open", "employee");
  localStorage.setItem("selected", "employee-list");
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
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [sort, setSort] = useState("");
  const [dataOfType, setDataOfType] = useState([]);
  const [provider_type, setProvider_type] = useState();

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
    let temp = [];
    axios({
      method: "post",
      url: baseURL + "/provider-type/list",
      headers: {
        Authorization: Token,
      },
      data:{
        value:null
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
        "/provider/list?page=" +
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
        console.log(err);
        setErr(true);
      });
    axios({
      method: "post",
      url: baseURL + "/provider/count-list",
      headers: {
        Authorization: Token,
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
  }, [created_date, status, value, loading, inputFile,provider_type]);
  const handleButton = (e) => {
    setLoading(true);
    axios({
      url: baseURL + "/provider/admin",
      method: "delete",
      headers: {
        Authorization: Token,
      },
      data: selectedRowKeys,
    })
      .then(setLoading(!loading))
      .catch((err) => setErr(true));
  };
  let edate, estatus;
  const handleSubmit = (e) => {
    setCreated_date(edate);
    setStatus(estatus);
    setOpen(false);
  };
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
          const newArray = [];
          jsonData.map((json) => {
            if (!dataOfType.includes(json.provider_type)) throw new Error();
            let { provider_type, ...newObj } = json;
            newObj = {
              ...newObj,
              provider_type: {
                content: json,
              },
            };
            newArray.push(newObj);
          });
          setList(newArray);
          // ... rest of the code
          if (list.length > 0) {
            console.log(list);
            axios({
              method: "post",
              url: baseURL + "/employee/admin/create-many",
              headers: {
                Authorization: Token,
              },
              data: list,
            })
              .then((res) => {
                setInputFile(false);
              })
              .catch((err) => {
                alert("File không hợp lệ");
              });
          }
        } catch (err) {
          alert("File không hợp lệ");
        }
      };
      reader.readAsArrayBuffer(file.files[0]);
    }
  };
  const onChange = (date, dateString) => {
    setCreated_date(dateString);
  };
  let items = [
    {
      label: (
        <Space direction="vertical">
          <label>Thời gian</label>
          <DatePicker onChange={onChange} />
        </Space>
      ),
      key: "1",
    },
    {
      label: (
        <Form.Item>
          <label>Trạng thái</label>
          <Select
            style={{ marginTop: "10px" }}
            placeholder="Select a option and change input text above"
            allowClear
            onSelect={(e) => {
              setStatus(e);
            }}
          >
            <Option value="active">Đã kích hoạt</Option>
            <Option value="non-active">Chưa kích hoạt</Option>
          </Select>
        </Form.Item>
      ),
      key: "2",
    },
    {
      label: (
        <Form.Item>
          <label>Nhóm nhà cung cấp</label>
          <Select
            style={{ marginTop: "10px" }}
            placeholder="Select a option and change input text above"
            allowClear
            onSelect={(e) => {
              setProvider_type(e);
            }}
          >
            {dataOfType.map((i) => {
              if (dataOfType.length > 0)
                return <Option value={i.content}>{i.content}</Option>;
            })}
          </Select>
        </Form.Item>
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
        d.provider_type.content,
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
      <SearchInput
        setValue={setValue}
        filter={items}
        openFilter={open}
        setOpenFilter={setOpen}
      />
      {inputFile && (
        <ImportFile
          setInputFile={setInputFile}
          setFile={setFile}
          submitList={submitList}
          msg=<div>
            <p>
              Thực hiện theo bản mẫu{" "}
              <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSU4DpL4BIBoTkI7VzYbgHJn8h47KssO4RxiMp0lHczRDXccOdKzAE-OnWpWLXaug2q_gU6ggrzxA-A/pub?output=xlsx">
                {" "}
                Tại đây
              </a>
            </p>
            <p>Mã nhà cung cấp không được chứa tiền tố "EPL"</p>
            <p>Chỉ được sử dụng 2 vai trò là "STAFF" và "USER"</p>
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
