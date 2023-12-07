import React, { useEffect, useState } from "react";
import { ConfigProvider, Menu } from "antd";
import { useLocalStorage } from "./useLocalStorage";
import { Link } from "react-router-dom";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const rootSubmenuKeys = ["provider", "customer", "cash", "employee"];

export default function Menubar(props) {
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const items = [
    getItem(<strong>Nhà cung cấp</strong>, "provider", null, [
      getItem(
        <Link to="/provider-table">Danh sách nhà cung cấp</Link>,
        "provider-list"
      ),
      getItem(
        <Link to="/provider-type">Nhóm nhà cung cấp</Link>,
        "provider-type"
      ),
    ]),
    getItem(<strong>Khách hàng</strong>, "customer", null, [
      getItem(<Link to="/customer-table">Danh sách</Link>, "customer-list"),
      getItem(<Link to="/customer-type">Nhóm khách hàng</Link>, "customer-type"),
    ]),
    getItem(<strong>Sổ quỹ</strong>, "cash", null, [
      getItem(
        <Link to="/payment-table">Danh sách phiếu thu</Link>,
        "payment-list"
      ),
      getItem(
        <Link to="/receipt-table">Danh sách phiếu chi</Link>,
        "receipt-list"
      ),
    ]),
    document.cookie.includes("ADMIN") && getItem(<strong>Quản lý nhân viên</strong>, "employee", null, [
      getItem(
        <Link to="/employee-table">Danh sách nhân viên</Link>,
        "employee-list"
      ),
      getItem(
        <Link to="/create-employee">Tạo nhân viên mới</Link>,
        "create-employee"
      ),
    ]),
  ];
  useEffect(() => {
    setOpenKeys([props.openKeys]);
    setSelectedKeys(props.selectedKeys);
  }, [props.selectedKeys, props.openKeys]);

  // Get current location information
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  return (
    <nav className="menubar">
      <Link to="/main">
        <img
          src="https://sapo.dktcdn.net/fe-cdn-production/images/sapo-omnichannel-w.png"
          alt=""
          className="logo"
        />
      </Link>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemHoverColor: "none",
              itemHoverBg: "rgba(255, 255, 255, 0.3)",
              itemSelectedBg: "rgba(255, 255, 255, 0.9)",
              itemSelectedColor: "#08f!important",
            },
          },
        }}
      >
        <Menu
          mode="inline"
          onOpenChange={onOpenChange}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          style={{
            background: "inherit",
            color: "white",
            textAlign: "left",
          }}
          items={items}
        />
      </ConfigProvider>
    </nav>
  );
}
