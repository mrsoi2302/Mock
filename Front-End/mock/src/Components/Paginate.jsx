import React from "react";
import { Pagination } from "antd";
function Paginate(props) {
  const handleShowSizeChange = (current, pageSize) => {
    props.setPage(current);
    props.setLimit(pageSize);
  };
  return (
    <Pagination
      current={props.page}
      total={props.number}
      onChange={handleShowSizeChange}
      showSizeChanger={true}
      onShowSizeChange={handleShowSizeChange}
      style={{ margin: "10px", paddingLeft: "31vw" }}
    />
  );
}
export default Paginate;
