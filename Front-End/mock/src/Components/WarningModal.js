import { Modal } from "antd";
import React from "react";

export default function WarningModal(props){
    console.log(props.content);
    return
        Modal.warning({
            title: 'Xác nhận xoá',
            content: 'Bạn có chắc chắn muốn xoá không?',
            onOk() {
              // Xử lý xác nhận xoá ở đây
              console.log('Xác nhận xoá');
            },
            onCancel() {
              // Hủy bỏ xoá
              console.log('Hủy bỏ xoá');
            },
          });
}