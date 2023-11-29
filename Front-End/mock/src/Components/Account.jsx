import React from "react";
import { Button, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
function Account(props) {
  const navigate = useNavigate();
  const handleLogOut = (e) => {
    localStorage.clear();
    navigate("/");
  };
  const items = [
    {
      key: "2",
      label: (
        <Link  to="/history">
          Lịch sử hoạt động
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link  to="/change-password">
          Đổi mật khẩu
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <a  onClick={handleLogOut}>
          Đăng xuất
        </a>
      ),
    },
  ];

  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
        placement="bottom"
        arrow
      >
        <Button
          style={{
            marginRight: "20px",
            backgroundColor: "whitesmoke",
            border: "none",
            fontSize: "large",
            boxShadow: "none",
          }}
        >
          Welcome, {localStorage.getItem("username")}
        </Button>
      </Dropdown>
    </>
  );
}
export default Account;
