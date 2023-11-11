import React from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
const ExceptionBox = (props) => {
  const navigate = useNavigate();
  const handleOk = () => {
    if (props.url === "/") localStorage.clear();
    localStorage.removeItem("open")
    localStorage.removeItem("selected")
    navigate(props.url);
  };
  return (
    <>
      <Modal
        title="Cảnh báo"
        open={true}
        onOk={handleOk}
        onCancel={handleOk}
      >
        <p style={{ textAlign: "center" }}>{props.msg}</p>
      </Modal>
    </>
  );
};
export default ExceptionBox;
