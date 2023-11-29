import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Modal,
  Space,
  Table,
  message,
} from "antd";
import { CloseCircleOutlined ,PlusCircleOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../Config";

export default function BillTypeModal(props) {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [createData, setCreateData] = useState({
    name:" "
  });
  const [createForm, setCreateForm] = useState(false);
  const [render, setRender] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  useEffect(() => {
    axios({
      url: baseURL + "/" + props.name + "-group/list",
      method: "post",
      headers: {
        Authorization: "Bearer "+localStorage.getItem("jwt"),
      },
      data: {
        value: value,
      },
    }).then((res) => {
      let temp=[]
      res.data.map(i=>{
        let x={
            ...i,
            key:i.code
        }
        temp.push(x);
      })
      setData(temp)
    });
  }, [value, render]);
  const createType = () => {
    axios({
      url: baseURL + "/" + props.name + "-group/staff/create",
      method: "post",
      headers: {
        Authorization: "Bearer "+localStorage.getItem("jwt"),
      },
      data: createData,
    })
      .then((res) => {
        setCreateData({
          name:" "
        })
        setValue("");
        setCreateForm(false);
        setRender(!render);
      })
      .catch((err) => {
        message.error("Tạo không thành công");
      });
  };
  const onSelectChange = (newSelected) => {
    console.log(newSelected);
    setSelectedRowKeys(newSelected);
  };
  const handleSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const deleteType = (arr) => {
    axios({
      url: baseURL + "/" + props.name + "-group/admin",
      method: "delete",
      headers: {
        Authorization: "Bearer "+localStorage.getItem("jwt"),
      },
      data: arr,
    })
      .then((res) => {
        setSelectedRowKeys([]);
        setRender(!render);
        props.setIndex(!props.index)
        message.success("Xóa thành công")
      })
      .catch(err=>{
        console.log(err);
        message.error("Xóa không thành công")
      })
  };
  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: "30%",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      key: "action",
      render: (_, tag) => (
        <CloseCircleOutlined
          onClick={(e) => {
            deleteType([tag.code]);
          }}
          style={{ color: "red" }}
        />
      ),
      width: "10%",
    },
  ];
  console.log(createData.name.trim().length);
  return (
    <Modal
      title={props.title}
      open={props.openBillModal}
      onOk={(e) => {
        !createForm ? props.setOpenBillModal(false) : createType();
      }}
      onCancel={(e)=>{
        !createForm ? props.setOpenBillModal(false) : setCreateForm(false);
      }}
      footer={[
        selectedRowKeys.length>0 && <Button onClick={e=>{deleteType(selectedRowKeys)}} type="primary" style={{
            marginRight:"50%",
            backgroundColor:"red"
        }}>
          Xóa
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={createForm && createData.name.trim().length===0}
          onClick={(e) => {
            createForm ? createType():props.setOpenBillModal(false)
          }}
        >
          Ok
        </Button>,
        <Button
          key="back"
          onClick={(e) => {
            !createForm ? props.setOpenBillModal(false) : setCreateForm(false);
          }}
        >
          Quay lại
        </Button>,
      ]}
    >
      {createForm ? (
        <Form
          layout="vertical"
          style={{
            maxWidth: "100%",
            margin: "3% 5%",
          }}
        >
          <Form.Item
            name="code"
            label="Mã"
            rules={[
              {
                pattern: "^(?!" + props.code + ").*",
                message: "Tiền tố " + props.code + " không hợp lệ",
              },
            ]}
          >
            <Input
              onChange={(e) => {
                setCreateData({
                  ...createData,
                  code: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              onChange={(e) => {
                setCreateData({
                  ...createData,
                  name: e.target.value,
                });
              }}
            />
          </Form.Item>
        </Form>
      ) : (
        <div>
        <Space.Compact
        style={{width:"100%"}}>
          <Input 
            placeholder="Tìm kiếm"
            onChange={(e) => {
              setValue(e.target.value);
            }}
            enterButton
          />
           <Button type="primary" onClick={e=>{setCreateForm(true)}}><PlusCircleOutlined size={"10px"}/></Button>
          </Space.Compact>
          <Table
            rowSelection={handleSelection}
            pagination={false}
            columns={columns}
            dataSource={data}
            scroll={{ y: 500 }}
            locale={{
              emptyText: (
                <Button
                  onClick={(e) => {
                    setCreateForm(true);
                  }}
                  type="primary"
                >
                  Thêm mới
                </Button>
              ),
            }}
          />
        </div>
      )}
    </Modal>
  );
}
