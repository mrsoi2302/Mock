import { Button, Modal, Table } from "antd";
import React from "react";
import SearchInput from "./SearchInput";
import { useNavigate } from "react-router-dom";

export default function RowSelectionTable(props) {
  const navigate = useNavigate();
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
            type="text"
            onClick={
              (e) => {
                Modal.confirm({
                  title: "Xác nhận xoá",
                  content:
                    "Bạn có chắc chắn muốn xoá " +
                    props.quantity +
                    " " +
                    props.name +
                    " không ?",
                  onOk() {
                    props.delete();
                  },

                  cancelText: "Hủy bỏ",
                });
              }
              //props.delete
            }
            style={{
              border:"1px red solid",
              color:"red"
            }}
          >
            <strong>Xóa</strong>
          </Button>
        ) : props.setInputFile != undefined ? (
          <Button
            type="link"
            onClick={(e) => {
              props.setInputFile(true);
            }}
            style={{
              border:"1px #1677ff solid",

            }}
          >
            Nhập danh sách
          </Button>
        ) : (
          <div></div>
        )}
        {
          props.handlePrint != undefined ? (
            <Button
              type="link"
              onClick={props.handlePrint}
              style={{
                border:"1px #1677ff solid",
                marginLeft: "5px",
              }}
            >
              Xuất file Excel
            </Button>
          ) : (
            <div></div>
          )
          /* {} */
        }

        <SearchInput
          setValue={props.setValue}
          filter={props.filter}
          openFilter={props.openFilter}
          setOpenFilter={props.setOpenFilter}
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
