import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
const columns = [
  {
    title: 'Hành động',
    dataIndex: 'action',
    key: 'action',
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    key: 'time',
  },
];
function HistoryTable(props) {
  const data=[];
  props.data.forEach(item=>{
    var obj={
      key:item.id,
      action:item.msg,
      time:item.time  
    }
    data.push(obj)
  })
  return <Table columns={columns}  dataSource={data} style={{width:"fit-content"}}/>;
}
export default HistoryTable;