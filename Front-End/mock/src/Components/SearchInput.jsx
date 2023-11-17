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
        position: "absolute",
        marginTop: "12vh",
        left: "30vw",
        display: "grid",
        width: "50vw",
        gridTemplateColumns: "20% 80%",
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
