import { Button, Form, Input, Modal, Space, Spin, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import "../style.css";
import Account from "../Account";
import ExceptionBox from "../ExceptionBox";
import Search from "antd/es/input/Search";

export default function ProviderType() {
  document.title = "Nhóm nhà cung cấp";
  localStorage.setItem("open", "provider");
  localStorage.setItem("selected", "provider-type");
  const [create, setCreate] = useState({
    content: " ",
  });
  const [data, setData] = useState({
    data: [],
    loading: true,
  });
  const [form] = Form.useForm();
  const [value, setValue] = useState();
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  let columns = [
    {
      title: "Mã nhóm",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Nhóm nhà cung cấp",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={(e) => {
              handleDelete(record);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    setData({
      data: [],
      loading: true,
    });
    let temp = [];
    axios({
      method: "post",
      url: baseURL + "/provider-type/list",
      headers: {
        Authorization: Token,
      },
      data: {
        value: value,
      },
    }).then((res) => {
      res.data.map((i) => {
        axios({
          url: baseURL + "/provider/count-list",
          method: "post",
          data: {
            t: {
              provider_type: i,
            },
          },
          headers: {
            Authorization: Token,
          },
        }).then((ress) => {
          setData({
            data: [
              ...data.data,
              {
                code: i.code,
                content: i.content,
                quantity: ress.data,
              },
            ],
            loading: false,
          });
        });
      });
      setData({
        data: temp,
        loading: false,
      });
      console.log(data);
    });
  }, [value, loading, index]);
  const handleDelete = (e) => {
    axios({
      method: "delet",
      url: baseURL + "/provider-type/admin?code=" + e.code,
      headers: {
        Authorization: Token,
      },
    })
      .then((res) => {
        setIndex(!index);
      })
      .catch((err) => {
        message.error("Không thành công");
      });
  };
  const createType = (e) => {
    axios({
      method: "post",
      url: baseURL + "/provider-type/admin/create",
      headers: {
        Authorization: Token,
      },
      data: create,
    })
      .then((res) => {
        setIndex(!index);
      })
      .catch((err) => {
        message.error("Tạo thất bại");
      });
    setOpenModal(!openModal);
  };
  if (data.data.length > 0) {
    columns = [
      {
        title: "Mã nhóm",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "Nhóm nhà cung cấp",
        dataIndex: "content",
        key: "content",
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: "Thao tác",
        dataIndex: "action",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <Button
              type="link"
              onClick={(e) => {
                handleDelete(record);
              }}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ];
  }
  return (
    <div className="content">
      <div className="taskbar">
        <h2>Danh sách nhân viên</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <Modal
        open={openModal}
        onCancel={(e) => {
          setOpenModal(false);
        }}
        onOk={createType}
        okButtonProps={{ disabled:create.content.trim().length===0}}
        title="Tạo nhóm nhà cung cấp mới"
      >
        <Form
          onFinish={createType}
          form={form}
          layout="vertical"
          style={{
            maxWidth: "100%",
            margin: "10px",
          }}
        >
          <Form.Item
            name="code"
            label="Mã nhóm"
            rules={[
              {
                pattern: "^(?!PRT).*",
                message: "Tiền tố PRT không hợp lệ",
              },
            ]}
          >
            <Input
              onChange={(e) => {
                setCreate((res) => {
                  setCreate({
                    ...create,
                    code: e.target.value,
                  });
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="content"
            label="Tên nhóm"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              onChange={(e) => {
                setCreate({
                  ...create,
                  content: e.target.value,
                });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div
        style={{
          marginTop: "12vh",
          display: "grid",
          width: "50vw",
          gridTemplateColumns: "20% 80%",
        }}
      ></div>
      {err ? (
        <ExceptionBox url="/main" msg=<h2>Có lỗi xảy ra</h2> />
      ) : (
        <div className="inside" style={{ textAlign: "right" }}>
          {data.loading && loading ? (
            <Spin />
          ) : (
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "10% 60% 15%",
                }}
              >
                <div></div>
                <Search
                  placeholder="Tìm kiếm"
                  enterButton
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                  style={{ width: "100%" }}
                />
                <Button
                  type="primary"
                  style={{
                    zIndex: 1000,
                  }}
                  onClick={(e) => {
                    setOpenModal(true);
                    console.log(openModal);
                  }}
                >
                  Thêm mới
                </Button>
              </div>
              <Table
                pagination={true}
                columns={columns}
                dataSource={data.data}
                style={{ width: "100%", zIndex: "1", marginTop: "10px" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
