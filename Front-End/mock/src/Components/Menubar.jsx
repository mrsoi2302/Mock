import { Menu } from "antd";

function getItem(label, key, children, type) {
    return {
      key,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem('Nhà cung cấp', 'sub1', [
      getItem('Danh sách nhà cung cấp', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
      getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
    ]),
    getItem('Navigation Two', 'sub2', [
      getItem('Option 5', '5'),
      getItem('Option 6', '6'),
      getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
    ]),
    {
      type: 'divider',
    },
    getItem('Navigation Three', 'sub4',  [
      getItem('Option 9', '9'),
      getItem('Option 10', '10'),
      getItem('Option 11', '11'),
      getItem('Option 12', '12'),
    ]),
    getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
  ];
export default function Menubar(){
    return(
        <nav className="menubar">
                <a href="/main">
                <img src="https://sapo.dktcdn.net/fe-cdn-production/images/sapo-omnichannel-w.png" alt=""
                    className="logo"
                />
                </a>
                <Menu
                    style={
                        {
                            backgroundColor:"rgb(0, 0, 32)",
                            color:"white"
                        }
                    }
                    onClick={e=>{
                        console.log(e)
                    }}
            
                    mode="inline"
                    items={items}
                />
            </nav>
    );
}