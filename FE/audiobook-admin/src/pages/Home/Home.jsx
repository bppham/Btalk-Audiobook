import React, { useEffect, useState } from "react";
import "./Home.css";
import FeaturedInfo from "../../components/FeaturedInfo/FeaturedInfo";
import Chart from "../../components/Chart/Chart";
import { getAllMonthListenCount } from "../../services/StatisticsService";
const Home = () => {
  const [listenData, setListenData] = useState([]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    fetchMonlyListen();
  }, []);

  const fetchMonlyListen = async () => {
    try {
      const response = await getAllMonthListenCount();
      if (response.data.code === 1000) {
        const result = response.data.result;

        const monthData = Object.entries(result).map(([monthStr, count]) => {
          const monthIndex = parseInt(monthStr, 10) - 1;
          return {
            name: monthNames[monthIndex],
            total: count,
          };
        });

        setListenData(monthData);
      }
    } catch (error) {
      console.log("Error get listens stats", error);
    }
  };

  return (
    <div className="home">
      <FeaturedInfo />
      <Chart data={listenData} title="Listen Analytics" grid dataKey="total" />
    </div>
  );
};

export default Home;
