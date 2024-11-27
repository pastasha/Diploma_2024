import { useRef } from "react";
import React, { useState } from "react";
import "../styles/fileUploader.css";
import Papa from "papaparse";

export function FileUploader() {

    // Create a reference to the hidden file input element
    const hiddenFileInput = useRef(null);

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState("");

    // States to store parsed data, table Column name and the values
    const [parsedData, setParsedData] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [values, setValues] = useState([]);

    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file
    const handleChange = async (event) => {
        const fileUploaded = event.target.files[0];
        if (fileUploaded != null && fileUploaded.type === 'text/csv') {

            const data = new FormData();
            data.append('file_from_react', fileUploaded);
        
            let response = await fetch('/data_analysis',
                {
                method: 'post',
                body: data,
                }
            );
            let res = await response.json();
            if (res.status !== 1){
                alert('Error uploading file');
            } else {
                setFileName(fileUploaded.name);
                setFileSize(fileUploaded.size);
                Papa.parse(fileUploaded, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function (results) {
                        const rowsArray = [];
                        const valuesArray = [];
                
                        // Iterating data to get column name and their values
                        results.data.map((d) => {
                            rowsArray.push(Object.keys(d));
                            valuesArray.push(Object.values(d));
                        });
                
                        // Parsed Data Response in array format
                        setParsedData(results.data);
                        // Filtered Column Names
                        setTableRows(rowsArray[0]);
                        // Filtered Values
                        setValues(valuesArray);
                    }
                });
            }
        } else {
            alert('Unexpected file type.');
        }
    };
    return (
        <div>
            {/* Upload button */}
            <button className="button-upload" onClick={handleClick}>
                Upload a file
            </button>
            <input
                type="file"
                onChange={handleChange}
                ref={hiddenFileInput}
                style={{ display: "none" }} // Make the file input element invisible
                accept=".csv"
            />

            {/* File info */}
            {fileName ? <p>Uploaded file: {fileName}</p> : null}
            {fileSize ? <p>File size: {fileSize}</p> : null}

            {/* Table */}
            <div class="uploaded-file-wrapper">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            {tableRows.map((rows, index) => {
                                return <th scope="col" key={index}>{rows}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {values.map((value, index) => {
                            if (index <= 4) {
                                return (
                                    <tr key={index}> 
                                        {value.map((val, i) => {
                                            return <td key={i}>{val}</td>;
                                        })}
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
