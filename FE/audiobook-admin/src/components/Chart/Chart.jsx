import React from 'react';
import './Chart.css';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Chart = ({ title = 'Chart Title', data = [], dataKey = 'value', grid = true }) => {
  return (
    <div className='chart'>
      <h3 className='chart-title'>{title}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke='#468d84' />
          <Line type="monotone" dataKey={dataKey} stroke='#468d84' />
          <Tooltip />
          {grid && <CartesianGrid stroke='#e0dfdf' strokeDasharray="5 5" />}
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
