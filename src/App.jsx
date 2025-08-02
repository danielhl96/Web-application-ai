import './App.css'
import './index.css';
import React, { useState } from "react";
import axios from 'axios';
 

function App() {


const [stepIndex, setStepIndex] = useState(0);
const [showModal, setShowModal] = useState(false);
const[imageUrl,setImageUrl] = useState(null)
const[sfile,setfile] = useState(null)
const[apiUrl,setApiUrl] = useState(null)
const[spinnerOn,setSpinner] = useState(true)
const [contentVisible, setContentVisible] = useState(true);
const [contentVisible2, setContentVisible2] = useState(true);

  const display_progress = (index) => {
  const steps = ["Select a model", "Select a file", "Upload the file", "Result"];

  return (
    <ul className="steps">
      {steps.map((step, i) => (
        <li
          key={i}
          className={`step ${i <= index ? "step-primary" : ""}`}
        >
          {step}
        </li>
      ))}
    </ul>
  );
};

 
  const handleButtonClick = () => {
    setContentVisible(prevState => !prevState);
    setContentVisible2(prevState => !prevState);
    setStepIndex(0)
    setShowModal(false)
    setSpinner(prevState => !prevState)
  };

  const handleButtonClickValue = (path) => {
    setContentVisible(prevState => !prevState);
    setApiUrl(path)
    setStepIndex(1)
  }

 const handleFileChange = (event) => {
    let file = event.target.files[0];
    setfile(file)
    setStepIndex(2);
    setShowModal(true)
  };

 const Example = ({ binary64, width, height }) => {
  return (
    <img
      src={`data:image/jpeg;base64,${binary64}`}  // base64 encoded image
      width={width}
      height={height}
      alt="Image"
    />
  );
};

  const uploadFile = () =>{
    setShowModal(false)
    setStepIndex(3)
    setContentVisible2(false)
    setContentVisible(false)
    const formData = new FormData();
    formData.append("image",sfile)
    axios.post(apiUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'  // Wichtig, um den Dateityp korrekt zu senden
    }
  })
  .then((res) => {
    setImageUrl(res.data.image)
    setSpinner(false)
  })
  .catch(() => {
    setSpinner(false)
  });
  }

   return (
  <>
    {/* Navbar – immer sichtbar */}
    <div className="navbar bg-neutral text-neutral-content">
      <button className="btn btn-ghost text-xl">AI-App</button>
    </div>

    {/* Hauptinhalt – nur wenn contentVisible2 === true */}
    {contentVisible2 ? (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        {contentVisible ? (
          <>
            <div className="bg-gray-950 p-8 text-white shadow-xl rounded-lg">
              <h1 className="text-3xl font-bold text-center text-white">
                Select a model:
              </h1>

              <div className="flex gap-4 justify-center items-center mt-6">
                <button
                  onClick={()=> {handleButtonClickValue("http://localhost:5000/file/yolo8")}}
                  className="btn btn-soft btn-primary p-4"
                >
                  YoloFace
                </button>
                <button
                  onClick={() => handleButtonClickValue("http://localhost:5000/file/mtcnn")}
                  className="btn btn-soft btn-primary p-4"
                >
                  MTCNN
                </button>
                <button
                   onClick={() =>{handleButtonClickValue("http://localhost:5000/file/can")}}
                  className="btn btn-soft btn-primary p-4"
                >
                  CAN-CNN
                </button>
              </div>
            </div>
            <div>{display_progress(stepIndex)}</div>
          </>
        ) : (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-6">
              <div className="bg-gray-950 p-8 text-white shadow-xl rounded-lg">
                <h1 className="text-3xl font-bold text-center text-white">
                  Upload a picture please:
                </h1>
                <div className="flex gap-4 justify-center items-center mt-6">
                  <input
                    type="file"
                    className="file-input file-input-bordered file-input-primary"
                    onChange={handleFileChange}
                    accept="image/jpeg"
                  />
                  {showModal && (
                    <div className="modal modal-open">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">File upload</h3>
                        <p className="py-4">Are you sure to upload the file?</p>
                        <div className="modal-action">
                          <button
                            className="btn btn-soft btn-primary"
                            onClick={uploadFile}
                          >
                            Upload
                          </button>
                          <button
                            className="btn btn-soft btn-error"
                            onClick={handleButtonClick}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleButtonClick}
                    className="btn btn-soft btn-secondary p-4"
                  >
                    Back
                  </button>
                </div>
              </div>
              <div>{display_progress(stepIndex)}</div>
            </div>
          </div>
        )}
      </div>
    ) : (
      // Falls contentVisible2 false ist, kannst du null oder ein anderes Element anzeigen lassen
        <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-6">
      <div class="carousel-item">
    <div>
      <button onClick={handleButtonClick} className="btn btn-soft btn-primary p-4" >Back </button>
  {imageUrl && <Example binary64={imageUrl} width={500} height={500} />}
  
</div>
  </div>
 {spinnerOn && (
  <span className="loading loading-spinner loading-xl"></span>
)}
   <div>{display_progress(stepIndex)}</div>
  </div>
  
    )}
  </>
);
}
export default App;