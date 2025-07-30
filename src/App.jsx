import './App.css'
import './index.css';
import React, { useState } from "react";

 
var value = 0
function App() {
  const [contentVisible, setContentVisible] = useState(true);

  const handleButtonClick = () => {
    setContentVisible(prevState => !prevState);
    value = 0 // Versteckt den Inhalt
  };

  const handleButtonClickValue = () => {
    value = 75
    setContentVisible(prevState => !prevState);
  }

 const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file)
    value = 100
  };

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
          <progress className="progress progress-neutral w-56" value={value} max="100"></progress> 
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
    <button onClick={handleButtonClick}
                className="btn btn-soft btn-secondary p-4"
              >
                Back
              </button>
              
      </div>
      </div>
      <progress className="progress progress-neutral w-56" value={value} max="100"></progress>
      </div>
      
      </div>
        )}
      </div>
    </>
  );
}
export default App;