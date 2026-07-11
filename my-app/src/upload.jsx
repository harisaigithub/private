import React, { useState } from "react";
import axios from "axios";

const Upload = () => {

    const [selectedFile, setSelectedFile] = useState(null);

    const [uploading, setUploading] = useState(false);

    const [progress, setProgress] = useState(0);

    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {

        setSelectedFile(e.target.files[0]);

        setMessage("");

        setProgress(0);

    };

    const uploadFile = async () => {

        if (!selectedFile) {

            alert("Please Select File");

            return;

        }

        const formData = new FormData();

        formData.append("file", selectedFile);

        try {

            setUploading(true);

            const response = await axios.post(
                "http://localhost:5000/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },

                    onUploadProgress: (event) => {

                        const percent = Math.round(
                            (event.loaded * 100) / event.total
                        );

                        setProgress(percent);

                    }
                }
            );

            setMessage(response.data.message);

            alert("Uploaded Successfully");

            setSelectedFile(null);

            document.getElementById("fileInput").value = "";

        }

        catch (err) {

            console.log(err);

            if (err.response) {

                alert(err.response.data.message);

            }

            else {

                alert("Upload Failed");

            }

        }

        finally {

            setUploading(false);

        }

    };

    return (

        <div
            style={{
                width: "500px",
                margin: "80px auto",
                padding: "30px",
                border: "1px solid gray",
                borderRadius: "10px"
            }}
        >

            <h2>Document Upload</h2>

            <br />

            <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
            />

            <br /><br />

            {

                selectedFile && (

                    <div>

                        <b>Selected File :</b>

                        <br />

                        {selectedFile.name}

                        <br /><br />

                    </div>

                )

            }

            {

                uploading && (

                    <div>

                        Uploading...

                        <br />

                        {progress} %

                        <br />

                        <progress
                            value={progress}
                            max="100"
                            style={{
                                width: "100%"
                            }}
                        />

                    </div>

                )

            }

            <br />

            <button

                onClick={uploadFile}

                disabled={uploading}

                style={{
                    padding: "10px 20px",
                    cursor: "pointer"
                }}

            >

                {

                    uploading

                        ? "Uploading..."

                        : "Upload"

                }

            </button>

            <br /><br />

            {

                message && (

                    <h3 style={{ color: "green" }}>

                        {message}

                    </h3>

                )

            }

        </div>

    );

};

export default Upload;