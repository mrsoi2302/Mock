import { Button, Form, Input, Modal, Space, Spin, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../Config";
import { Token } from "../../Token";
import "../style.css";
import Account from "../Account";
import ExceptionBox from "../ExceptionBox";
import Search from "antd/es/input/Search";
import { useNavigate } from "react-router-dom";

export default function ProviderType(props) {
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
  const [warningModal, setWarningModal] = useState(false);
  const navigate=useNavigate()
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
    const fetchData = async () => {
      try {
        props.setOpenKeys("provider");
        props.setSelectedKeys("provider-type");
        setData({
          data: [],
          loading: true,
        });

        const providerTypeList = await axios({
          method: "post",
          url: baseURL + "/provider-type/list",
          headers: {
            Authorization: props.token,
          },
          data: {
            value: value,
          },
        });

        const temp = await Promise.all(
          providerTypeList.data.map(async (i) => {
            const ress = await axios({
              url: baseURL + "/provider/count-list",
              method: "post",
              data: {
                t: {
                  provider_type: i,
                },
              },
              headers: {
                Authorization: props.token,
              },
            });

            return {
              code: i.code,
              content: i.content,
              quantity: ress.data,
            };
          })
        );

        setData({
          data: temp,
          loading: false,
        });
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
        if(err.response.status===406)
          Modal.error({
            title:"Phiên đăng nhập hết hạn",
            onOk:()=>{
              localStorage.clear()
              document.cookie=""
              navigate("")
              Modal.destroyAll()
            },
            onCancel:()=>{
              localStorage.clear()
              document.cookie=""
              navigate("")
              Modal.destroyAll()
            },
            cancelText:"Quay lại"
          })
        setData({
          data: [],
          loading: false,
        });
      }
    };

    fetchData();
  }, [value, loading, index]);

  const handleDelete = (e) => {
    axios({
      method: "delete",
      url: baseURL + "/provider-type/admin?code=" + e.code,
      headers: {
        Authorization: props.token,
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
      url: baseURL + "/provider-type/staff/create",
      headers: {
        Authorization: props.token,
      },
      data: create,
    })
      .then((res) => {
        setIndex(!index);
      })
      .catch((err) => {
        if(err.response.status===400) message.error("Nhóm khách hàng "+create.content+" đã tồn tại")
        else message.error("Tạo thất bại");
      });
    form.resetFields();
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
          <div>
            <Space size="middle">
              <Button
                type="link"
                style={{ color: "red" }}
                onClick={(e) => {
                  Modal.confirm({
                    title: "Xác nhận xoá",
                    content:
                      "Bạn có chắc chắn muốn xoá nhóm nhà cung cấp " +
                      record.code +
                      " không?",
                    onOk() {
                      handleDelete(record);
                    },
                    cancelText: "Hủy bỏ",
                  });
                }}
              >
                Xóa
              </Button>
            </Space>
          </div>
        ),
      },
    ];
  }
  return (
    <div className="content">
      <div className="taskbar">
        <h2>Danh sách nhóm nhà cung cấp</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <Modal
        open={openModal}
        onCancel={(e) => {
          setOpenModal(false);
          form.resetFields();
        }}
        onOk={createType}
        okButtonProps={{ disabled: create.content.trim().length === 0 }}
        title="Tạo nhóm nhà cung cấp mới"
        okText="Tạo"
        cancelText="Quay lại"
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
            name="content"
            initialValue={""}
            label="Tên nhóm"
            rules={[
              {
                message:"Vùng này không được để trống",
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
        </Form>
      </Modal>

      {err ? (
        <ExceptionBox url="/main" msg=<h2>Có lỗi xảy ra</h2> />
      ) : (
        <div className="inside" style={{ display: "block" }}>
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
                    marginLeft: "10px",
                    zIndex: 100,
                  }}
                  onClick={(e) => {
                    setOpenModal(true);
                  }}
                >
                  Thêm mới
                </Button>
              </div>
              <Table
                showSorterTooltip={false}
                locale={{
                  emptyText: (
                    <div>
                      <img
                        src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png?f=webp"
                        width="10%"
                      />
                      <h3>Không có dữ liệu</h3>
                    </div>
                  ),
                }}
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
