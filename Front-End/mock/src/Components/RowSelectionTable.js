import { Button, Table } from "antd";
import React from "react";

export default function RowSelectionTable(props) {
  const url = props.url;
  return (
    <div>
      <Button
        type="primary"
        onClick={(e) => {
          props.setInputFile(true);
        }}
        style={{
          position: "absolute",
          zIndex: 1000,
          marginTop: "-5vh",
          marginLeft: "8vw",
          display:props.setInputFile!=undefined ? "block":"none"
        }}
      >
        Nhập danh sách
      </Button>
      <Button
        type="primary"
        onClick={props.handlePrint}
        style={{ position: "absolute", zIndex: 1000, marginTop: "-5vh",display:props.handlePrint!=undefined ? "block":"none" }}
      >
        In danh sách
      </Button>
      {props.selectedRowKeys.length > 0 && (
        <Button

          type="primary"
          onClick={props.handleButton}
          style={{
            position: "absolute",
            zIndex: 1000,
            marginTop: "-5vh",
            marginLeft: "17.3vw",
            display:props.handleButton!=undefined ? "block":"none"
          }}
        >
          Xóa
        </Button>
      )}
      <Button
        type="primary"
        href={url}
        style={{
          position: "absolute",
          zIndex: 1000,
          marginTop: "-5vh",
          right: "1vw",
        }}
      >
        Thêm {props.name} mới
      </Button>
      <Table
        rowSelection={props.handleSelection}
        pagination={false}
        columns={props.columns}
        dataSource={props.data}
        style={{ width: "100%", zIndex: "1", marginTop: "10px" }}
        onChange={props.onChange}
      />
    </div>
  );
}
