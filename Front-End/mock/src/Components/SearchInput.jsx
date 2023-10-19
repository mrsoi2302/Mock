import { AudioOutlined } from '@ant-design/icons';
import React from 'react';
import { Input, Space } from 'antd';
const { Search } = Input;
const onSearch = (value, _e, info) => console.log(info?.source, value);
function SearchInput (props){
  const handleChange=(e)=>{
    props.setSearchInput(e.target.value)
  }
  return(
    <Space direction="vertical">
    <Search placeholder="Tìm kiếm" onSearch={onSearch} enterButton onChange={handleChange}
      style={
        {
          width:"50vw",
        }
      } />
    </Space>
  )
};
export default SearchInput;