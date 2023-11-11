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
  const onChange = (date, dateString) => {
    setCreatedDate(dateString);
  };

  const items = props.items;

  return (
    <Dropdown menu={{ items }} open={props.open} trigger={"click"}>
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
          onClick={handleMenuClick}
          type="text"
          style={{
            width: "100%",
            textAlign: "right",
            backgroundColor: "gainsboro",
            boxShadow: "none",
          }}
        >
          Bộ lọc
          <DownOutlined />
        </Button>
      </ConfigProvider>
    </Dropdown>
  );
}
