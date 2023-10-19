import React from 'react';
import { Pagination } from 'antd';
function Paginate(props) {  
    const handlePage=(e)=>{
        props.onData(e);
    }
    
    return <Pagination current={props.page} total={props.number} onChange={handlePage} showSizeChanger={false} style={{margin:"10px"}}/>;
}
export default Paginate;