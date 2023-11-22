import React from "react";
import { Input, Space } from "antd";
import Filter from "./Filter";
const { Search } = Input;
function SearchInput(props) {
  const handleChange = (e) => {
    props.setValue(e.target.value);
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "16% 84%",
      }}
    >
      <Filter
        items={props.filter}
        open={props.openFilter}
        setOpen={props.setOpenFilter}
      />
      <Search
        placeholder="Tìm kiếm"
        enterButton
        onChange={handleChange}
        style={{ width: "100%", display: props.displaySearch }}
      />
    </div>
  );
}
export default SearchInput;
