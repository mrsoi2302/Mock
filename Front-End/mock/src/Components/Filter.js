import {
  Button,
  ConfigProvider,
  Dropdown,
} from "antd";
import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";

export default function Filter(props) {
  const [status, setStatus] = useState(null);
  const [createdDate, setCreatedDate] = useState(null);
  const handleMenuClick = (e) => {
    props.setOpen(!props.open);
  };
  const items = props.items;

  return (
    <Dropdown menu={{ items }} open={props.open} trigger={["click"]}>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              primaryColor: "red",
            },
          },
        }}
      >
        <Button
          type="text"
          style={{
            textAlign: "left",
            backgroundColor: "gainsboro",
            boxShadow: "none",
          }}
          onClick={handleMenuClick}
        >
          Bộ lọc
          <DownOutlined />
        </Button>
      </ConfigProvider>
    </Dropdown>
  );
}
