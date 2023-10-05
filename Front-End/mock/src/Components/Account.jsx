import React from 'react';
import { Button, Dropdown } from 'antd';
const items = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="/information">
        Thông tin tài khoản
      </a>
    ),
  },
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
      <a target="_blank" rel="noopener noreferrer" href="/logout">
        Đăng xuất
      </a>
    ),
  },
];
const Account = (props) => (
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
      >Welcome, {props.name}</Button>
    </Dropdown>
    </>
);
export default Account;