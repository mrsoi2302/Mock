import { Button, Table } from "antd";
import React from "react";
import SearchInput from "./SearchInput";

export default function RowSelectionTable(props) {
  const url = props.url;
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "15% 15% 50% 20%",
        }}
      >
        {props.selectedRowKeys.length > 0 ? (
          <Button
            type="primary"
            onClick={props.delete}
            style={{
              zIndex: 1000,
              backgroundColor:"red"
            }}
          >
            Xóa
          </Button>
        ):props.setInputFile != undefined ? <Button
          type="primary"
          onClick={(e) => {
            props.setInputFile(true);
          }}
          style={{
            zIndex: 1000,
          }}
        >
          Nhập danh sách
        </Button>:<div></div>}
        {
          props.handlePrint != undefined ? <Button
          type="primary"
          onClick={props.handlePrint}
          style={{
            zIndex: 1000,
            marginLeft: "5px",
          }}
        >
          In danh sách
        </Button>:<div></div>
          /* {} */}
        
        
        <SearchInput 
          setValue={props.setValue}
          filter={props.filter}
          openFilter={props.openFilter}
          setOpenFilter={props.setOpenFilter}
        />
        <Button
          type="primary"
          href={url}
          style={{
            zIndex: 1000,
            marginLeft: "5px",
          }}
        >
          Thêm {props.name} mới
        </Button>
      </div>
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
