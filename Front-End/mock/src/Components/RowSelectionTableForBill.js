import { Button, Modal, Table } from "antd";
import React from "react";
import SearchInput from "./SearchInput";
import { useNavigate } from "react-router-dom";

export default function RowSelectionTableForBill(props) {
  const url = props.url;
  const navigate = useNavigate();
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
            onClick={(e) => {
              Modal.confirm({
                title:
                  "Bạn muốn xóa " + props.quantity + " " + props.name + " ?",
                onOk() {
                  props.delete();
                },
              });
            }}
            style={{
              backgroundColor: "red",
            }}
          >
            Xóa
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={(e) => {
              props.setOpenBillModal(true);
            }}
            style={{}}
          >
            Thêm loại {props.name} mới
          </Button>
        )}
        <Button
          type="primary"
          onClick={(e) => {
            props.setOpenModal(true);
          }}
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
          groups={props.groups}
        />
        <Button
          type="primary"
          onClick={(e) => {
            navigate(url);
          }}
          style={{
            marginLeft: "5px",
          }}
        >
          Thêm {props.name} mới
        </Button>
      </div>
      <Table
        showSorterTooltip={false}
        locale={
          {
            emptyText:<div>
              <img src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png?f=webp" width="10%"/>
              <h3>Không có dữ liệu</h3>
            </div>
          }
        }
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
