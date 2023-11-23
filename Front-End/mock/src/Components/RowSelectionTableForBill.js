import { Button, Table } from "antd";
import React from "react";
import SearchInput from "./SearchInput";

export default function RowSelectionTableForBill(props) {
  const url = props.url;
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "15% 18% 47% 20%",
        }}
      >
        {props.selectedRowKeys.length > 0 ? (
          <Button
            
            type="primary"
            onClick={props.delete}
            style={{
              
              backgroundColor:"red"
            }}
          >
            Xóa
          </Button>
        ):<Button
          
          type="primary"
          onClick={(e) => {
            props.setOpenBillModal(true)
            
          }}
          style={{
            
          }}
        >
          Thêm loại {props.name} mới
        </Button>}
          <Button
            
          type="primary"
          onClick={e=>{props.setOpenModal(true)}}
          style={{
            
            marginLeft: "5px",
          }}
        >
          Thêm hình thức thanh toán
        </Button>
        
        
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
