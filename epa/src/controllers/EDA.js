import React, { useState, useEffect } from "react";

const serverURL = "http://127.0.0.1:5000/"
export function EDA() {
    function imageComponent(filename) {
        const imageUrl = serverURL + filename;
        return <img src={imageUrl} alt="filename" />;
    };

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
        if (!res.success){
            alert('Error EDA processing');
        } else {
            let edaData = res.data
            let edaResult = {
                "correlationMatrixPlot": imageComponent(edaData.correlationMatrixPlot),
                "zScorePlot": imageComponent(edaData.zScorePlot),
                "pairplotPlot": imageComponent(edaData.pairplotPlot),
                "classDistribution": imageComponent(edaData.classDistribution)
            }
            let dataDistributionPlots = {}
            for (const ddPlot in edaData.dataDistributionPlots) {
                dataDistributionPlots[ddPlot] = edaData.dataDistributionPlots[ddPlot]
            }
            edaResult.dataDistributionPlots = dataDistributionPlots;
            let emissionIndexPlots = {}
            for (const eiPlot in edaData.emissionIndexPlots) {
                emissionIndexPlots[eiPlot] = edaData.emissionIndexPlots[eiPlot]
            }
            edaResult.emissionIndexPlots = emissionIndexPlots;
            setResultEDA(edaResult);
        }
    }; 

    return (
        <div>
            <p>Exploratory Data Analysis, simply referred to as EDA, is the step where you understand the data in detail.</p>
            <div class="start-eda-button">
            <button className="standard-upload" onClick={handleClick}>
                Start EDA
            </button>

            <p>Correlation Matrix</p>
            {resultEDA && resultEDA.correlationMatrixPlot ? resultEDA.correlationMatrixPlot : ''}

            <p>Z-Score</p>
            {resultEDA && resultEDA.zScorePlot ? resultEDA.zScorePlot : ''}

            <p>Pairplot</p>
            {resultEDA && resultEDA.pairplotPlot ? resultEDA.pairplotPlot : ''}

            <p>Class Distribution</p>
            {resultEDA && resultEDA.classDistribution ? resultEDA.classDistribution : ''}
        </div>
        </div>
    );
};