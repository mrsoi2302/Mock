import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
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
  getItem('K', 'provider',null , [
    getItem('Option 1', 'list'),
    getItem('Option 2', '2'),
    getItem('Option 3', '3'),
    getItem('Option 4', '4'),
  ]),
  getItem('Navigation Two', 'sub2', null, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),
  getItem('Navigation Three', 'sub4',null, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
];
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
  
export default function Menubar(props){
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  }; 
        const open=props.open;
        console.log(open===props.open);
        return(
        <nav className="menubar">
                <a href="/main">
                <img src="https://sapo.dktcdn.net/fe-cdn-production/images/sapo-omnichannel-w.png" alt=""
                    className="logo"
                />
                </a>
                <Menu
                    style={
                        {
                            backgroundColor:"inherit",
                            color:"white",
                        }
                    }
                    mode="inline"
                    defaultOpenKeys={open}
                    defaultSelectedKeys={"list"}
                    onOpenChange={onOpenChange}
                    items={items}
                />
            </nav>
    );
}