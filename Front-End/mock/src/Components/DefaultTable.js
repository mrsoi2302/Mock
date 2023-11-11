import { Table } from "antd";
import React from "react";

export default function DefaultTable(props) {
  return (
    <Table
      pagination={false}
      columns={props.columns}
      dataSource={props.data}
      style={{ width: "100%", zIndex: "1", marginTop: "10px" }}
      onChange={props.onChange}
    />
  );
}
