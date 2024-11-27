import React, { useState, useEffect } from 'react';

export function Predict() {
    // object for storing and using data
    const [data, setdata] = useState({
        name: "",
        age: 0,
        date: "",
        programming: "",
    });

    // Using useEffect for single rendering
    useEffect(() => {
        // Using fetch to fetch the api from 
        // flask server it will be redirected to proxy
        fetch("/data").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setdata({
                    name: data.Name,
                    age: data.Age,
                    date: data.Date,
                    programming: data.programming,
                });
            })
        );
    }, []);

    /*async function predict(features) {
        const response = await fetch('http://localhost:3000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ features })
        });
        const result = await response.json();
        console.log(result.prediction);
    }*/

    return (
        <div>
            <h1>React and flask</h1>
            {/* Calling a data from setdata for showing */}
            <p>{data.name}</p>
            <p>{data.age}</p>
            <p>{data.date}</p>
            <p>{data.programming}</p>
        </div>
    );
}