import React  from 'react';
import { FileUploader } from "./FileUploader";
import { Predict } from "./Predict";
import "../styles/base.css";

export default function Home() {
    return (
        <div>
            <p>Upload csv file with environmental data.</p>
            <FileUploader />
        </div>
    );
}