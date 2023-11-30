import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from "react-google-charts";

const ChartExample = () => {
    const [data, setData] = useState([])
    const getData = async () => {
        const res = await axios("/shop/chart1");
        //console.log(res.data);
        var rows = [];
        rows.push(['상품번호', '댓글수']);
        res.data.forEach(row => {
            rows.push([`[${row.pid}]`, row.count]);
        });
        setData(rows);
    }
    
    useEffect(()=>{
        getData();
    },[])

    const options = {
        chart: {
            title: "상품별 댓글수",
        },
    };
    return (
        <div className='p-5'>
            <Chart
                chartType="Bar"
                width="100%" height="400px"
                data={data}
                options={options} />
            <Chart
                chartType="Line"
                width="100%" height="400px"
                data={data}
                options={options} />
            <Chart
                chartType="PieChart"
                width="100%" height="400px"
                data={data}
                options={options} />
        </div>
    );
}

export default ChartExample