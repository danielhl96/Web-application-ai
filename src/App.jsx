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
const [result, setResult] = useState(false);
const [failure, setFailure] = useState(false);
const [label, setlabel] = useState("Loading");

  const display_progress = (index) => {
  const steps = ["Select a model", "Select a file", "Upload the file", "Result"];

  return (
    <ul className="steps">
      {steps.map((step, i) => (
        <li
          key={i}
          className={`step ${i <= index ? "step-success" : ""}`}
        >
          {step}
        </li>
      ))}
    </ul>
  );
};
  const handleButtonClick = () => {
    setContentVisible(true);
    setContentVisible2(true);
    setStepIndex(0)
    setShowModal(false)
    setSpinner(prevState => !prevState)
    setImageUrl(null)
    setfile(null)
    setResult(false)
    setFailure(false)
  };

  const handleButtonClickValue = (path) => {
    setContentVisible(prevState => !prevState);
    setApiUrl(path)
    setStepIndex(1)
  }

 const handleFileChange = (event) => {
    let file = event.target.files[0];
    setfile(file)
    setStepIndex(1);
    setShowModal(true)
  };
  
  const anotherFileChange = () =>{
    setStepIndex(1);
    setContentVisible(false)
    setContentVisible2(true)
    setShowModal(false)
    setResult(false)
    setSpinner(true)
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
    setStepIndex(2)
    setContentVisible2(false)
    setContentVisible(false)
    setlabel("Loading")
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
    setResult(true)
    setStepIndex(3)
    setFailure(false)
    setlabel("Successfull")
  })
  .catch(() => {
    setSpinner(false)
    setContentVisible(true);
    setContentVisible2(true);
    setStepIndex(0)
    setFailure(true)
  });
  }

  const showFailure=() =>{
    return (
     <div className="modal modal-open">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">File upload</h3>
                        <p className="py-4">There was something going wrong</p>
                        <div className="modal-action">
                          <button
                            className="btn btn-soft btn-error"
                            onClick={handleButtonClick}
                          >
                            Ok
                          </button>
                        </div>
                      </div>
                    </div>
    );
}

   return (
  <>
    {/* Navbar – immer sichtbar */}
    <div className="bg-neutral text-white p-2 sticky top-0 z-10">
    <div className="navbar bg-neutral text-neutral-content">
      <p className="text-xl font-normal">AI-App</p>
    </div>
    </div>

    {/* Hauptinhalt – nur wenn contentVisible2 === true */}
    {contentVisible2 ? (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        {contentVisible ? (
          <>
            <div className="bg-gray-950 p-8 text-white shadow-xl rounded-lg">
              <h1 className="text-3xl font-normal text-center text-white">
                Select a model:
              </h1>
              {failure && (
                <div>{showFailure()}</div>)}
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
                  MTCNN-Face
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
                <h1 className="text-3xl font-normal text-center text-white">
                  Upload a picture please:
                </h1>
                <div className="flex gap-4 justify-center items-center mt-6">
                  <input
                    type="file"
                    className="file-input file-input-bordered file-input-primary"
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png"
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
                <p className = "mt-1 text-xs text-gray-500 text-center" > Only JPEG and PNG up to 25MB </p>
              </div>
              <div>{display_progress(stepIndex)}</div>
            </div>
          </div>
        )}
      </div>
    ) : (
      // Falls contentVisible2 false ist, kannst du null oder ein anderes Element anzeigen lassen
      
        <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-6">
          <div className="bg-gray-950 align-middle p-8 text-white shadow-xl rounded-lg">
            <h3 className= "mt2 text-2xl font-normal " >{label}</h3>
      <div class="carousel-item">
        {result && (       
    <div className="mt-5">
      <button onClick={anotherFileChange} className="btn btn-soft btn-warning p-4 mr-4 mb-4" >Another image </button>
      <button onClick={handleButtonClick} className="btn btn-soft btn-error p-4 mb-4"  >Back </button>
  {imageUrl && <Example binary64={imageUrl} width={500} height={500} />}
  
</div>
 )}
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