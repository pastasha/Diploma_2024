import React, { Component }  from 'react';
import { FileUploader } from "./FileUploader";
import { Predict } from "./Predict";
import "../styles/base.css";

export default function Home() {
    return (
        <div>
            <h3>EPA - Home</h3>
            <p>This is a paragraph on the HomePage of the Environmental Performance Analyzer.</p>
            <FileUploader />

            <Predict />
        </div>
    );
}