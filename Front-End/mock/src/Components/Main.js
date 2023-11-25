import React, { useEffect, useState } from "react";
import "./style.css";
import Account from "./Account";
import axios from "axios";
import { baseURL } from "../Config";
import ExceptionBox from "./ExceptionBox";
import { Spin } from "antd";
import { Token } from "../Token";

export default function Main(props) {
  const [trading, setTrading] = useState({
    data: 0,
    loading: true,
  });
  const [incomplete, setIncomplete] = useState({
    data: 0,
    loading: true,
  });
  const [billToday, setBillToday] = useState({
    data: 0,
    loading: true,
  });
  const [unactive, setUnactive] = useState({
    data: 0,
    loading: true,
  });
  const [err, setErr] = useState(false);
  document.title = "Trang chủ";
  useEffect( () => {
    props.setOpenKeys("")
    props.setSelectedKeys("")
    let x=0,y=0
    axios({
      url: baseURL + "/receipt/count-trade",
      method: "get",
      headers: {
        Authorization:"Bearer "+localStorage.getItem("jwt"),
      },
    })
      .then((ress) => {
        axios({
          url: baseURL + "/payment/count-trade",
          method: "get",
          headers: {
            Authorization:"Bearer "+localStorage.getItem("jwt"),
          },
        })
          .then((res) => {
            setTrading({
              data: ress.data + res.data,
              loading: false,
            });
            console.log(trading)
          })
          
          .catch((err) => {
            setErr(true);
          });
      })
      .catch((err) => {
        setErr(true);
      });
    axios({
      url: baseURL + "/receipt/count-list",
      method: "post",
      headers: {
        Authorization:"Bearer "+localStorage.getItem("jwt"),
      },
      data: {
        value: null,
        t: {
          status: "unpaid",
        },
      },
    })
      .then((ress) => {
        axios({
          url: baseURL + "/payment/count-list",
          method: "post",
          headers: {
            Authorization:"Bearer "+localStorage.getItem("jwt"),
          },
          data: {
            value: null,
            t: {
              status: "unpaid",
            },
          },
        })
          .then((res) => {
            setIncomplete({
              data: ress.data + res.data,
              loading: false,
            });
          })
          .catch((err) => {
            setErr(true);
          });
      })
      .catch((err) => {
        setErr(true);
      });
    
    axios({
      url: baseURL + "/provider/count-list",
      method: "post",
      headers: {
        Authorization:"Bearer "+localStorage.getItem("jwt"),
      },
      data: {
        value: null,
        t: {
          status: "non-active",
          provider_type:{
          }
        },
      },
    })
      .then((res) => {
        axios({
          url: baseURL + "/customer/count-list",
          method: "post",
          headers: {
            Authorization:"Bearer "+localStorage.getItem("jwt"),
          },
          data: {
            value: null,
            t: {
              status: "non-active",
            }, 
          },
        })
          .then((ress) => {
            setUnactive({
              data:ress.data+res.data,
              loading:false
            })
            console.log(ress.data+res.data);
          })
          .catch((err) => {
            setErr(true);
          });
      })
      .catch((err) => {
        setErr(true);
      });
    var date = new Date(),
      month = "" + (date.getMonth() + 1),
      day = "" + (date.getDate()),
      year = date.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    var dateString = year + "-" + month + "-" + day;
    axios({
      url: baseURL + "/payment/count-list",
      method: "post",
      headers: {
        Authorization:"Bearer "+localStorage.getItem("jwt"),
      },
      data: {
        value: null,
        t: {
          created_date: dateString,
        },
      },
    })
      .then((res) => {
        axios({
          url: baseURL + "/receipt/count-list",
          method: "post",
          headers: {
            Authorization:"Bearer "+localStorage.getItem("jwt"),
          },
          data: {
            value: null,
            t: {
              created_date: dateString,
            },
          },
        })
          .then((ress) => {
            setBillToday({
              data:ress.data + res.data,
              loading: false,
            });
          })
          .catch((err) => {
            setErr(true);
          });
      })
      .catch((err) => {
        setErr(true);
      });
      const v=Token
  }, []);

  return (
    <div className="content" style={{minHeight:"90vh"}}>
      {err && <ExceptionBox url="/" msg="Phiên đăng nhập của bạn đã hết hạn" />}
      <div className="taskbar">
        <h2>Tổng quan</h2>
        <Account name={localStorage.getItem("name")} />
      </div>
      <div className="inside"
      style={{
        display:"grid",
        gridTemplateColumns:"repeat(4,25%)",
        paddingTop:"5%",
        paddingBottom:"5%"
      }}>
        <div className="grid">
          <img src="https://i.pinimg.com/originals/af/87/58/af875899c939bc45c1e41827173a6444.png" />
          <div style={{ color: "rgba(255,184,228,255)" }}>
            <p>Tổng giao dịch</p>
            {trading.loading ? <Spin /> : <h3>{trading.data===''? 0:trading.data}</h3>}
          </div>
        </div>
        <div className="grid">
          <img src="https://i.pinimg.com/474x/46/fb/fa/46fbfa422ddfacdce7733ede8e8ccb8a.jpg" />
          <div style={{ color: "rgba(214,202,250,255)" }}>
            <p>Chưa kích hoạt</p>
            {unactive.loading ? <Spin /> : <h3>{unactive.data}</h3>}
          </div>
        </div>
        <div className="grid">
          <img src="https://thumbs.dreamstime.com/b/money-sack-line-icon-red-background-flat-style-vector-illustration-179114776.jpg" />
          <div style={{ color: "rgba(239,65,54,255)" }}>
            <p>Chưa thanh toán</p>
            {incomplete.loading ? <Spin /> : <h3>{incomplete.data}</h3>}
          </div>
        </div>
        <div className="grid">
          <img src="https://i.pinimg.com/1200x/4a/58/84/4a5884f10b2a5a857c747a4fe88bcb14.jpg" />
          <div style={{ color: "rgba(157,164,133,255)" }}>
            <p>Tổng phiếu hôm nay</p>
            {billToday.loading ? <Spin /> : <h3>{billToday.data}</h3>}
          </div>
        </div>
        <div className="socialMedia">
        <a href="https://www.facebook.com/mrsoi2302">
          <img src="https://www.facebook.com/images/fb_icon_325x325.png" />
        </a>
        <a href="https://www.instagram.com/mrsoi2003/">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png" />
        </a>
        <a href="https://discord.com/channels/695440979209093181/829724046320599180">
          <img src="https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ" />
        </a>
        <a href="https://github.com/mrsoi2302">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/1200px-GitHub_Invertocat_Logo.svg.png" />
        </a>
      </div>
      </div>
    </div>
  );
}
