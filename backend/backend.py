from flask import Flask, request,jsonify
import cv2
import mtcnn_face
from flask_cors import CORS
import numpy as np
import base64
from huggingface_hub import hf_hub_download
from ultralytics import YOLO
from supervision import Detections
from PIL import Image
from io import BytesIO
import insight_face
import yolo_face

app = Flask(__name__)

CORS(app)
@app.route("/file/mtcnn",methods=['POST'])
def mtcnnFace():

    if "image" not in request.files:
         return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    img_bytes = file.read()
    img_array = np.asarray(bytearray(img_bytes), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    result = mtcnn_face.mtcnn(img)
    
    if len(result) == 0:
        return jsonify({"error": "No faces detected"}), 400

    for elem in result:
        x1,y1,x2,y2 = elem["box"]
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
    _, img_encoded = cv2.imencode('.jpg', img)
    img_base64 = base64.b64encode(img_encoded.tobytes()).decode('utf-8')
    
    return {
        "image": img_base64
    } 

@app.route("/file/yolo8",methods=['POST'])
def yoloface():
   
    file = request.files['image']
    img_bytes = file.read()
    img_array = np.asarray(bytearray(img_bytes), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    pil_image = Image.open(BytesIO(img_bytes))

    xyxy = yolo_face.yolo_face(pil_image)

    for elem in xyxy:
        cv2.rectangle(img, (int(elem[0]), int(elem[1])), (int(elem[2]), int(elem[3])), (0, 255, 0), 2)
    _, img_encoded = cv2.imencode('.jpg', img)
    img_base64 = base64.b64encode(img_encoded.tobytes()).decode('utf-8')
    
    return {
        "image": img_base64
    } 

@app.route("/file/insightface",methods=['POST'])
def face():
    file = request.files['image']
    img_bytes = file.read()
    img_array = np.asarray(bytearray(img_bytes), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
   
    result = insight_face.insight_face(img)
    
    for elem in result:
        x1,y1,x2,y2 = elem.bbox.astype(int)
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
    _, img_encoded = cv2.imencode('.jpg', img)
    img_base64 = base64.b64encode(img_encoded.tobytes()).decode('utf-8')
    
    return {
        "image": img_base64
    } 

if __name__ == '__main__':
    app.run()