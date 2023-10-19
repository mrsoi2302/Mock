import React, { useEffect, useMemo, useState } from 'react';
import { Menu } from 'antd';
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
  getItem('Nhà cung cấp', 'provider',null , [
    getItem(<a href='/provider-list'>Danh sách</a>, 'provider-list'),
    getItem(<a href='/create-provider'>Tạo mới</a>, 'create-provider'),
  ]),
  getItem('Khách hàng', 'customer', null, [
    getItem(<a href='/customer-list'>Danh sách</a>, 'customer-list'),
    getItem(<a href='/customer-type'>Nhóm khách hàng</a>, 'customer-type'),
  ]),
  getItem('Sổ quỹ', 'cash',null, [
    getItem(<a href='/payment-list'>Danh sách phiếu chi</a>, 'payment-list'),
    getItem(<a href='/create-payment'>Tạo phiếu chi</a>, 'create-payment'),
    getItem(<a href='/receipt-list'>Danh sách phiếu thu</a>, 'receipt-list'),
    getItem(<a href='/create-receipt'>Tạo phiếu thu</a>, 'create-receipt'),
  ]),
  getItem('Quản lý nhân viên', 'employee',null, [
    getItem(<a href='/employee-list'>Danh sách nhân viên</a>, 'employee-list'),
    getItem(<a href='/create-employee'>Tạo nhân viên mới</a>, 'employee-create'),
  ]),
];
const rootSubmenuKeys = ['provider', 'customer', 'cash','employee'];
  

export default function Menubar(props){
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState();
  useEffect(()=>{
      setOpenKeys([localStorage.getItem("open")])
      setSelectedKeys(localStorage.getItem("selected"))
  },[localStorage.getItem("selected")])
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

        return(
        <nav className="menubar">
                <a href="/main">
                <img src="https://sapo.dktcdn.net/fe-cdn-production/images/sapo-omnichannel-w.png" alt=""
                    className="logo"
                />
                </a>
                <Menu
                  mode="inline"
                  openKeys={openKeys}
                  onOpenChange={onOpenChange}
                  selectedKeys={[localStorage.getItem('selected')]}
                  style={{
                    background:"inherit",
                    color:"white",
                  }}
                  items={items}
                />
            </nav>
    );  
}