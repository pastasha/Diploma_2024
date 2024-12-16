import React, { useState, useEffect } from 'react';

export function Predict() {

    const [predictionResult, setPredictionResult] = useState("");

    // when the Button component is clicked
    const handleClick = async (event) => {
        let data = {
            modelID: "decision-tree"
        };
        let response = await fetch('/predict',
            {
                method: 'post',
                body: JSON.stringify(data),
            }
        );
        let res = await response.json();
        if (!res.success){
            alert('Error Prediction processing');
        } else {
            let predictData = res.data;
            setPredictionResult(predictData);
        }
    }; 

    return (
        <div>
            <button className="standard-upload" onClick={handleClick}>
                Start Prediction
            </button>
            {predictionResult ? predictionResult : ''}
        </div>
    );
}