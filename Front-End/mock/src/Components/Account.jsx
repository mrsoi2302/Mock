import React from 'react';
import { Button, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
function Account(props){
  const navigate=useNavigate()
  const handleLogOut=(e)=>{
    localStorage.clear()
    navigate("/")
  }
  const items = [
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="/history">
          Lịch sử hoạt động
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="/change-password">
          Đổi mật khẩu
        </a>
      ),
    },
    {
      key: '4',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={handleLogOut}>
          Đăng xuất
        </a>
      ),
    },
  ];

  return(
  <>
    <Dropdown
      menu={{
        items,
      }}
      placement="bottom"
      arrow
    >
      <Button
      style={{marginRight:"20px",
      backgroundColor:"whitesmoke",
      border:"none",
      fontSize:"large",
      boxShadow:"none"}}
      >Welcome, {localStorage.getItem("username")}</Button>
    </Dropdown>
    </>
  )
};
export default Account;