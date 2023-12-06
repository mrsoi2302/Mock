import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import { formatDates } from './FormatDate';
import { baseURL } from '../Config';
import { Chart, LineElement, PointElement, LinearScale, BarController, CategoryScale, Tooltip, Legend, Interaction } from 'chart.js/auto';
Chart.register(LineElement, PointElement, LinearScale, BarController, CategoryScale, Tooltip);
const RevenueChart = () => {
    const [time,setTime]=useState([])
    const [data,setData]=useState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const t = formatDates;
                const x = [];
                const y = [];
    
                for (const date of t) {
                    const paymentResponse = await axios.post(
                        baseURL + "/payment/count-trade",
                        { value: null, t: date },
                        { headers: { Authorization: "Bearer " + localStorage.getItem("jwt") } }
                    );
    
                    const receiptResponse = await axios.post(
                        baseURL + "/receipt/count-trade",
                        { value: null, t: date },
                        { headers: { Authorization: "Bearer " + localStorage.getItem("jwt") } }
                    );
    
                    const total = paymentResponse.data + receiptResponse.data;
                    x.push(total);
                    y.push(date);
                }
    
                setData(x);
                setTime(y);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, []);
    
    const config = {
        labels: time,
        datasets: [{
            label: 'Giá trị',
            data:data,
            borderColor: [
                'rgb(61, 58, 247)',
                'rgb(61, 58, 247)',
                'rgb(61, 58, 247)',
                'rgb(61, 58, 247)',
                'rgb(61, 58, 247)',
                'rgb(61, 58, 247)'
            ],
            borderWidth: 3,
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        }
    };

    return (
        <div
        style={{width:"35vw",height:"auto",marginLeft:"30px",backgroundColor:"whitesmoke",padding:"5px",borderRadius:"10px",textAlign:"center"}}>
            <h2>Tổng giá trị giao dịch 7 ngày qua</h2>
            <Line 
            data={config} 
            options={options} />
        </div>
    );
};

export default RevenueChart;
