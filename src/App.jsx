import './App.css'
import './index.css';
import React, { useState } from "react";

 



function App() {
const [stepIndex, setStepIndex] = useState(0);
const [showModal, setShowModal] = useState(false);
const [showResult, setShowResult] = useState(false);
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

  const closeModal = () => {
    setShowModal(false);
  };

  const [contentVisible, setContentVisible] = useState(true);
  const [contentVisible2, setContentVisible2] = useState(true);
  const handleButtonClick = () => {
    setContentVisible(prevState => !prevState);
    setStepIndex(0)
  };

  const handleButtonClickValue = () => {
    setContentVisible(prevState => !prevState);
    setStepIndex(1)
  }

 const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file)
    setStepIndex(2);
   setShowModal(true)
  
  };

  const uploadFile = () =>{
    setShowModal(false)
    setShowResult(true)
    setStepIndex(3)
    setContentVisible2(false)
  }

    return (
    <>
      {/* Navbar */}
      <div className="navbar bg-neutral text-neutral-content">
        <button className="btn btn-ghost text-xl">AI-App</button>
      </div>
      
      {/* Hauptcontainer */}
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        {contentVisible ? (
          <>
            <div className="bg-gray-950 p-8 text-white shadow-xl rounded-lg">
            <h1 className="text-3xl font-bold text-center text-white">
              Select a model:
            </h1>

            {/* Buttons */}
            <div className="flex gap-4 justify-center items-center mt-6">
              <button
                onClick={handleButtonClickValue}
                className="btn btn-soft btn-primary p-4"
              >
                YoloFace
              </button>
              <button
                onClick={handleButtonClickValue}
                className="btn btn-soft btn-primary p-4"
              >
                MTCNN
              </button>
              <button
                onClick={handleButtonClickValue}
                className="btn btn-soft btn-primary p-4"
              >
                CAN-CNN
              </button>
            </div>
            </div>
   <div>
  {display_progress(stepIndex)}
</div>
          </>
        ) : (
           <div className="min-h-screen flex items-center justify-center p-6">
      <div className= "min-h-screen  p-6 flex flex-col items-center justify-center gap-6">
        <div className="bg-gray-950 p-8 text-white shadow-xl rounded-lg">
    <h1 className="text-3xl font-bold text-center text-white">
              Upload a picture please:
            </h1>
            <div className="flex gap-4 justify-center items-center mt-6">
           <input 
    type="file" 
    className="file-input file-input-bordered file-input-primary" onChange={handleFileChange}
  />
  {showModal && (
  <div className="modal modal-open">
    <div className="modal-box">
      <h3 className="font-bold text-lg">File upload</h3>
      <p className="py-4">Are you sure to upload the file?</p>
      <div className="modal-action">
        <button className="btn btn-soft btn-primary" onClick={uploadFile}>Upload</button>
        <button className="btn btn-soft btn-error" onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}
    <button onClick={handleButtonClick}
                className="btn btn-soft btn-secondary p-4"
              >
                Back
              </button>
      </div>
      </div>
  <div>
  {display_progress(stepIndex)}
</div>
      </div>
      </div>
        )}
      </div>
    </>
  );
}
export default App;