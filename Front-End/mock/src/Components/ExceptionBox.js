import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
const ExceptionBox = () => {
    const navigate=useNavigate();
    const handleOk=()=>{
        localStorage.clear()
        navigate('/')
    }
  return (
    <>
      <Modal title="Cảnh báo" open={true} onOk={handleOk} >
        <p>Thời gian đăng nhập của bạn đã hết hạn</p>
        <p>Vui lòng đăng nhập lại để tiếp tục sử dụng dịch vụ</p>
      </Modal>
    </>
  );
};
export default ExceptionBox;