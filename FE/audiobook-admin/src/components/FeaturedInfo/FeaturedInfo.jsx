"use client";
import React, { useEffect, useState } from "react";
import "./FeaturedInfo.css";
import {
  getAllListensCountThisYear,
  getTotalAudiobooks,
  getTotalUsers,
} from "../../services/StatisticsService";

const FeaturedInfo = () => {
  const [allUser, setAllUser] = useState(0);
  const [allAudiobooks, setAllAudiobooks] = useState(0);
  const [thisYearListenCount, setThisYearListenCount] = useState(0);

  useEffect(() => {
    fetchUsers();
    fetchAudiobooks();
    fetchListensCount();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getTotalUsers();
      console.log(response);
      if (response.data.code === 1000) {
        setAllUser(response.data.result);
      }
    } catch (error) {
      console.log("Error get user stats");
    }
  };

  const fetchAudiobooks = async () => {
    try {
      const response = await getTotalAudiobooks();
      console.log(response);
      if (response.data.code === 1000) {
        setAllAudiobooks(response.data.result);
      }
    } catch (error) {
      console.log("Error get listens stats");
    }
  };

  const fetchListensCount = async () => {
    try {
      const response = await getAllListensCountThisYear();
      console.log(response);
      if (response.data.code === 1000) {
        setThisYearListenCount(response.data.result);
      }
    } catch (error) {
      console.log("Error get audiobooks stats");
    }
  };

  return (
    <div className="featured">
      <div className="featured-item">
        <span className="featured-title">Users</span>
        <div className="featured-money-container">
          <span className="featured-money">{allUser}</span>
        </div>
      </div>

      <div className="featured-item">
        <span className="featured-title">Audiobooks</span>
        <div className="featured-money-container">
          <span className="featured-money">{allAudiobooks}</span>
        </div>
      </div>

      <div className="featured-item">
        <span className="featured-title">Total Listens this year</span>
        <div className="featured-money-container">
          <span className="featured-money">{thisYearListenCount}</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInfo;
