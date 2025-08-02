from flask import Flask, request,jsonify
import cv2
from mtcnn import MTCNN
from flask_cors import CORS
import numpy as np
import base64
from huggingface_hub import hf_hub_download
from ultralytics import YOLO
from supervision import Detections
from PIL import Image

app = Flask(__name__)

CORS(app)
@app.route("/file/mtcnn",methods=['POST'])
def mtcnn():

    if "image" not in request.files:
         return jsonify({"error": "No image file provided"}), 400

    detector = MTCNN()
    file = request.files['image']
    img_bytes = file.read()
    img_array = np.asarray(bytearray(img_bytes), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    img_resized = cv2.resize(img, (500, 500))
    result = detector.detect_faces(img_resized)

    if len(result) == 0:
        return jsonify({"error": "No faces detected"}), 400

    for elem in result:
        x1,y1,x2,y2 = elem["box"]
        cv2.rectangle(img_resized, (x1, y1), (x2, y2), (0, 255, 0), 2)
    _, img_encoded = cv2.imencode('.jpg', img_resized)
    img_base64 = base64.b64encode(img_encoded.tobytes()).decode('utf-8')
    
    return {
        "image": img_base64
    } 

@app.route("/file/yolo8",methods=['POST'])
def yolo_face():
    model_path = hf_hub_download(repo_id="arnabdhar/YOLOv8-Face-Detection", filename="model.pt")
    # load model
    model = YOLO(model_path)

    file = request.files['image']
    
   
    output = model(Image.open(file))
    results = Detections.from_ultralytics(output[0])
    
    
    img_bytes = file.read()
    img_array = np.asarray(bytearray(img_bytes), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    

    for elem in results:
        detections_from_ultralytics = elem.pandas().xywh
        x1,y1,x2,y2 = detections_from_ultralytics[['xmin', 'ymin', 'xmax', 'ymax']]
        cv2.rectangle(img, (int(x1), int(y1)), (int(x2), int(y2), (0, 255, 0), 2))
    _, img_encoded = cv2.imencode('.jpg', img)
    img_base64 = base64.b64encode(img_encoded.tobytes()).decode('utf-8')
    
    return {
        "image": img_base64
    } 

if __name__ == '__main__':
    app.run()