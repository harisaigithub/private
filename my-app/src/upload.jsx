import React, { useState } from "react";
import axios from "axios";
import "./Upload.css";
import {
    FaCloudUploadAlt,
    FaFileAlt,
    FaSignOutAlt,
    FaUserCircle
} from "react-icons/fa";

const Upload = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const userId = localStorage.getItem("userId");

    const logout = () => {

        localStorage.removeItem("userId");

        window.location.href = "/";

    };

    const handleFileChange = (e) => {

        setSelectedFile(e.target.files[0]);

        setMessage("");

        setError("");

        setProgress(0);

    };

    const uploadFile = async () => {

        if (!selectedFile) {

            setError("Please select a file.");

            return;

        }

        const formData = new FormData();

        formData.append("file", selectedFile);

        formData.append("userId", userId);

        try {

            setUploading(true);

            setMessage("");

            setError("");

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

            setMessage(
                `${response.data.savedFile} uploaded successfully.`
            );

            setSelectedFile(null);

            document.getElementById("fileInput").value = "";

        }

        catch (err) {

            if (err.response) {

                setError(err.response.data.message);

            }

            else {

                setError("Upload Failed");

            }

        }

        finally {

            setUploading(false);

        }

    };

    return (

        <div className="upload-container">

            <div className="header">

                <div>

                    <h2>Employee Document Upload</h2>

                    <div className="user">

                        <FaUserCircle />

                        &nbsp;

                        Logged in User :

                        <b>

                            {userId}

                        </b>

                    </div>

                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >

                    <FaSignOutAlt />

                    &nbsp;

                    Logout

                </button>

            </div>

            <div className="content">

                <label
                    htmlFor="fileInput"
                    className="upload-box"
                >

                    <FaCloudUploadAlt
                        size={70}
                        color="#1f4e79"
                    />

                    <h3>

                        Click to Select Document

                    </h3>

                    <p>
    Drag & Drop your document here
</p>

<p style={{marginTop:"8px"}}>
    or click anywhere inside this box
</p>

<p style={{marginTop:"12px",color:"#888"}}>
    Supported Files • Maximum Size 100 MB
</p>

                    <input
                        id="fileInput"
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />

                </label>

                {

                    selectedFile &&

                   <div className="file-name">

    <h3 style={{marginBottom:"10px"}}>
        📄 Selected File
    </h3>

                        <FaFileAlt />

                        &nbsp;

                        <strong>

                            Selected File :

                        </strong>

                        <br />

                        {selectedFile.name}

                    </div>

                }

                {

                    uploading &&

                    <div className="progress">

                        <h4>

                            Uploading...

                        </h4>

                        <br />

                        {progress} %

                        <br /><br />

                        <progress
                            value={progress}
                            max="100"
                        />

                    </div>

                }

                <button

                    className="upload-btn"

                    onClick={uploadFile}

                    disabled={uploading}

                >

                    {

                        uploading

                            ?

                            "Uploading..."

                            :

                            "Upload Document"

                    }

                </button>

                {

                    message &&

                    <div className="success">

                        <strong>

                            ✓ Upload Successful

                        </strong>

                        <br /><br />

                        {message}

                    </div>

                }

                {

                    error &&

                    <div className="error">

                        <strong>

                            ✖ Upload Failed

                        </strong>

                        <br /><br />

                        {error}

                    </div>

                }

                <div className="footer">

                    Employee Management System (EMS)

                </div>

            </div>

        </div>

    );

};

export default Upload;