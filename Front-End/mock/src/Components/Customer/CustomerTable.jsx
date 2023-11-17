import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
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
import SearchInput from "../SearchInput";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import { Option } from "antd/es/mentions";
function CustomerTable(props) {
  document.title = "Danh sách khách hàng";
  localStorage.setItem("open", "customer");
  localStorage.setItem("selected", "customer-list");
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
  const[dataRequest,setDataRequest]=useState({});
  const [dataOfType, setDataOfType] = useState([]);
  const [customer_type, setProvider_type] = useState();

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
    let temp = [];
    axios({
      method: "post",
      url: baseURL + "/customer-type/list",
      headers: {
        Authorization: Token,
      },
      data:{
        value:null,
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
  }, [value, loading, inputFile,customer_type,index,sort]);
  const handleButton = () => {
    axios({
      url: baseURL + "/customer/admin",
      method: "delete",
      headers: {
        Authorization: Token,
      },
      data: selectedRowKeys,
    })
      .then((res)=>{setIndex(!index)
      setSelectedRowKeys([])})
      .catch((err) => setErr(true));
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
            range:1
          });
          console.log(jsonData);
          // Xử lý dữ liệu, ví dụ: log ra console
          let check=[]
          dataOfType.map(i=>{
            check.push(i.content)
          })
          let newArray = [];
          jsonData.map((json) => {
            if (!check.includes(json.customer_type)) throw new Error();
            if(json.status!="non-acitve"&&json.status!="active") throw new Error()
            let { customer_type, ...newObj } = json;
            newObj = {
              ...newObj,
            };
            console.log(newObj);
            newArray.push(newObj);
            return newObj
          });
            setList(newArray);
            // ... rest of the code
            if (list.length > 0) {
              console.log(list);
              axios({
                method: "post",
                url: baseURL + "/customer/staff/create-many",
                headers: {
                  Authorization: Token,
                },
                data: list,
              })
                .then((res) => {
                  setInputFile(false);
                })
                .catch((err) => {
                  message.error("File không hợp lệ");
                });
            }
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
      created_date:dateString
    })
  };
  const currentTime=new Date();
  const handleSubmit = (e) => {
    setIndex(!index)
    console.log(dataRequest);
    setOpen(false);
  };
  let items = [
    {  
      label:  <Space direction="vertical">
    <label>Giới tính</label>
    <Select
    style={{marginTop:"10px",width:"10vw"}}
      allowClear
      onSelect={(e)=>{
          setDataRequest(
            {
              ...dataRequest,
              gender:e
            }
          )
      }}
    > 
      <Option value="Nam">Nam</Option>
      <Option value="Nữ">Nữ</Option>
      <Option value="LGBT">Giới tính thứ 3</Option>
    </Select>
  </Space>,
    key: '1',
  },
  {
      label:
      <>
      <label>Ngày tháng năm sinh</label>
      <br></br>
      <Space >
          <InputNumber placeholder='Ngày' min={1} max={31} style={{marginRight:"10px",marginTop:"10px",width:"100px"}} onChange={(e)=>{setDataRequest({...dataRequest,birthday_day:e})}}/>
          <InputNumber placeholder='Tháng' min={1} max={12} style={{marginRight:"10px",marginTop:"10px",width:"100px"}} onChange={(e)=>{setDataRequest({...dataRequest,birthday_month:e})}}/>
          <InputNumber placeholder='Năm' min={1900} max={currentTime.getFullYear()} style={{marginRight:"10px",marginTop:"10px",width:"100px"}} onChange={(e)=>{setDataRequest({...dataRequest,birthday_year:e})}}/>
      </Space>
      </>,
        key:"2"
    },
    
  {
    label:  <Space direction="vertical">
    <label>Thời gian tạo</label>
    <DatePicker onChange={onChange} />
  </Space>,
    key: '3',
  },
  {
    label:
    <Space direction="vertical">
      <label>Nhóm khách hàng</label>
      <Form.Item
      name="customerType"
    >
      <Select
        allowClear
        onSelect={(e)=>{
          setDataRequest({
            ...dataRequest,
            customer_type:{
              id:e
            }
          })
        }}
      >
      {dataOfType.map(item=>{
        return <Option key={item.id} >{item.content}</Option>
      })}
      </Select>
    </Form.Item>
    </Space>,
  key:'8',
  },
  {
    label: 
    <Space direction='vertical'>
    <Form.Item>
    <label>Trạng thái</label>
    <br></br>
    <Select
    style={{marginTop:"10px",width:"10vw"}}
      allowClear
      onClear={e=>{setDataRequest(
        {...dataRequest,
        status:null}
      )}}
      onSelect={(e)=>{
        setDataRequest({
          ...dataRequest,
          status:e
        })
      }}
    > 
      <Option value="active">Đã kích hoạt</Option>
      <Option value="non-active">Chưa kích hoạt</Option>
    </Select>
  </Form.Item>
    </Space>,
      key:"4"
  },
  {
    label: <Button onClick={handleSubmit}>Lọc</Button>,
    key: '5',
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
        sorter:true
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
              Thực hiện theo bản mẫu
              <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQS-drt0caPA5s7_MHsNPJ4fXNkVpogoAPKb_5ARWUlG4qKMG7DdJDD1QaJ97RyiZqQg3tAXmhTF050/pub?output=xlsx">
                Tại đây
              </a>
            </p>
            <p>Mã khách hàng không được chứa tiền tố "CTM"</p>
            <p>Ngày sinh cần có định dạng YYYY/MM/DD</p>
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
