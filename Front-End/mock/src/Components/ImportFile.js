import React, { useState } from "react";
import { Input, Modal } from "antd";
export default function ImportFile(props) {
  const [check, setCheck] = useState(true);
  return (
    <Modal
      title="Nhập file Excel"
      open={true}
      onCancel={(e) => {
        props.setInputFile(false);
      }}
      okButtonProps={{ disabled: check }}
      onOk={props.submitList}
    >
      {props.msg}
      <Input
        onChange={(e) => {
          setCheck(false);
          props.setFile(e.target);
        }}
        type="file"
        accept=".xls, .xlsx"
      />
    </Modal>
  );
}
