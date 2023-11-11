import React from "react";
import { Modal } from "antd";
const ConfirmBox = (props) => {
  const handleOk = () => {
    props.setStart(true);
    props.setConfirm(false);
  };
  const handleCancel = () => {
    props.setConfirm(false);
  };
  return (
    <>
      <Modal
        title="Cảnh báo"
        open={true}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{props.msg}</p>
      </Modal>
    </>
  );
};
export default ConfirmBox;
