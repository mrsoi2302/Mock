import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { formatDates } from './FormatDate';
import { baseURL } from '../Config';
import { CategoryScale, Chart, Interaction, LineController, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
Chart.register(LinearScale,CategoryScale,PointElement,LineElement,Tooltip)
const QuantityChart = () => {
    const [time, setTime] = useState([]);
    const [data, setData] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const t = formatDates;
                const x = [];
                const y = [];

                for (const date of t) {
                    const paymentResponse = await axios.post(
                        baseURL + "/payment/count-list",
                        { value: null, t: { created_date: date,status:"dung" } },
                        { headers: { Authorization: "Bearer " + localStorage.getItem("jwt") } }
                    );

                    const receiptResponse = await axios.post(
                        baseURL + "/receipt/count-list",
                        { value: null, t: { created_date: date,status:"dung"  } },
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
            label: 'Số lượng',
            data: data,
            borderColor: [
                'rgb(226, 58, 100)',
                'rgb(226, 58, 100)',
                'rgb(226, 58, 100)',
                'rgb(226, 58, 100)',
                'rgb(226, 58, 100)',
                'rgb(226, 58, 100)'
            ],
            borderWidth: 3,
        }],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Độ chia nhỏ nhất
                },
            },
        },
    };

    return (
        <div
            style={{ width: "35vw", height: "auto", marginLeft: "70px", backgroundColor: "whitesmoke", padding: "5px", borderRadius: "10px", textAlign: "center" }}>
            <h2>Tổng số phiếu đã tạo 7 ngày qua</h2>
            <Line
                data={config}
                options={options} />
        </div>
    );
};

export default QuantityChart;
