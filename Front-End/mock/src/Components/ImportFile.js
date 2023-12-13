import React, { useState } from "react";
import { Input, Modal } from "antd";
export default function ImportFile(props) {
  const [check, setCheck] = useState(true);
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      title="Nhập file Excel"
      open={true}
      onCancel={(e) => {
        props.setInputFile(false);
      }}
      okButtonProps={{ disabled: check,loading:loading }}
      onOk={e=>{
        props.submitList()
        setLoading(true)
      }}
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
