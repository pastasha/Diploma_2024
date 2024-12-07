import React, { useState} from "react";

export function EDA() {
    const [resultEDA, setResultEDA] = useState("");
    // when the Button component is clicked
    const handleClick = async (event) => {
        var analysisButton = document.querySelector(".analysis-button");
        analysisButton.classList.add("hidden");

        let data = []
        let response = await fetch('/start-eda',
            {
                method: 'post',
                body: data,
            }
        );
        let res = await response.json();
        if (res.status !== 1){
            alert('Error EDA processing');
        } else {
            setResultEDA(res);
        }
    };

    return (
        <div>
            <p>Exploratory Data Analysis, simply referred to as EDA, is the step where you understand the data in detail.</p>
            <div class="start-eda-button">
            <button className="standard-upload" onClick={handleClick}>
                Start EDA
            </button>

            {resultEDA ? <p>File size: {resultEDA}</p> : null}
        </div>
        </div>
    );
};