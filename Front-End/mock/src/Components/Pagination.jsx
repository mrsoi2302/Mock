import React from 'react';
import { Pagination } from 'antd';
function Paginate(props) {
    const totalItems = 60;
    const pageSize = 10;
    const handlePage=(e)=>{
        props.onData(e);
    }
    const showSizeChanger = totalItems > pageSize;
    const changeSize=(e)=>{
        console.log(e);
    }
    return <Pagination defaultCurrent={1} total={60} onChange={handlePage} showSizeChanger={false}/>;
}
export default Paginate;