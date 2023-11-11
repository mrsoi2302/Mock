import React, { useEffect, useState } from "react";
import { ConfigProvider, Menu } from "antd";
import { useLocalStorage } from "./useLocalStorage";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem("Nhà cung cấp", "provider", null, [
    getItem(<a href="/provider-table">Danh sách</a>, "provider-list"),
    getItem(<p href="/create-provider">Tạo mới</p>, "create-provider"),
  ]),
  getItem("Khách hàng", "customer", null, [
    getItem(<a href="/customer-table">Danh sách</a>, "customer-list"),
    getItem(<a href="/customer-type">Nhóm khách hàng</a>, "customer-type"),
  ]),
  getItem("Sổ quỹ", "cash", null, [
    getItem(<a href="/payment-list">Danh sách phiếu chi</a>, "payment-list"),
    getItem(<a href="/create-payment">Tạo phiếu chi</a>, "create-payment"),
    getItem(<a href="/receipt-list">Danh sách phiếu thu</a>, "receipt-list"),
    getItem(<a href="/create-receipt">Tạo phiếu thu</a>, "create-receipt"),
  ]),
  getItem("Quản lý nhân viên", "employee", null, [
    getItem(<a href="/employee-table">Danh sách nhân viên</a>, "employee-list"),
    getItem(
      <a href="/create-employee">Tạo nhân viên mới</a>,
      "create-employee"
    ),
  ]),
];
const rootSubmenuKeys = ["provider", "customer", "cash", "employee"];

export default function Menubar(props) {
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState();
  const [myValue, setMyValue] = useLocalStorage("selected");
  const handleStorageChange = () => {
    console.log(localStorage.getItem("open"));
    setOpenKeys(localStorage.getItem("open"));
    setSelectedKeys(localStorage.getItem("selected"));
  };
  // Get current location information

  useEffect(() => {
    setOpenKeys([localStorage.getItem("open")]);
    setSelectedKeys(localStorage.getItem("selected"));
  }, [myValue]);
  let open = localStorage.getItem("open");
  const onClick = (e) => {
    setSelectedKeys(e.key);
  };
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
      <a href="/main">
        <img
          src="https://sapo.dktcdn.net/fe-cdn-production/images/sapo-omnichannel-w.png"
          alt=""
          className="logo"
        />
      </a>
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
          onClick={onClick}
          mode="inline"
          onOpenChange={onOpenChange}
          openKeys={openKeys}
          selectedKeys={[localStorage.getItem("selected")]}
          style={{
            background: "inherit",
            color: "white",
          }}
          items={items}
        />
      </ConfigProvider>
    </nav>
  );
}
