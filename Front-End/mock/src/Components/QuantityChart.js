import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { BarElement, LinearScale, BarController, CategoryScale, Chart , PointElement, LineElement} from 'chart.js';
import axios from 'axios';
import { formatDates } from './FormatDate';
import { baseURL } from '../Config';
Chart.register(BarElement, LinearScale, BarController, CategoryScale,PointElement,LineElement);
const QuantityChart = () => {
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
                        baseURL + "/payment/count-list",
                        { value: null, t: { created_date: date } },
                        { headers: { Authorization: "Bearer " + localStorage.getItem("jwt") } }
                    );
    
                    const receiptResponse = await axios.post(
                        baseURL + "/receipt/count-list",
                        { value: null, t: { created_date: date } },
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
            label: '# of Votes',
            data:data,
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    stepSize: 1, // Độ chia nhỏ nhất
                },
            },
        }
    };

    return (
        <div
        style={{width:"30vw",height:"auto",marginLeft:"70px",backgroundColor:"whitesmoke",padding:"5px",borderRadius:"10px",textAlign:"center"}}>
            <h2>Tổng số phiếu đã tạo 7 ngày qua</h2>
            <Line 
            data={config} 
            options={options} />
        </div>
    );
};

export default QuantityChart;
