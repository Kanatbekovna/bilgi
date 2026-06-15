"use client";
import Banner from '@/widgets/banner/Banner';
import StatsList from '@/widgets/statsList/StatsList';
import React, { useEffect, useState } from 'react';

const Home = () => {
    const [data , setData] = useState([])
    const API = "http://localhost:5000/journals"
    useEffect(() => {
        fetch(API)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                console.log(data);
            });
    }, [])
    return (
        <div>
            <Banner/>
            <StatsList/>
        </div>
    );
};

export default Home;