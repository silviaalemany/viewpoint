import React, { useRef, useState } from "react";
import { saveAs } from 'file-saver'

function UploadButton({setImageSource}) {
    const [file, setFile] = useState();

    function handleChange(e) {
        setFile(URL.createObjectURL(e.target.files[0]));
        setImageSource(e.target.files[0])
    }
    return (
        <div>
        <form action="/action_page.php">
            <input type="file" id="myFile" name="filename" onChange={handleChange}/>
        </form>
        </div>
    );
};

export default UploadButton;