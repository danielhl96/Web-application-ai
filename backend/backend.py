from flask import Flask, request
import cv2
from mtcnn import MTCNN
from flask_cors import CORS
import numpy as np
import base64
app = Flask(__name__)

CORS(app)
@app.route("/file/mtcnn",methods=['POST'])
def mtcnn():
    detector = MTCNN()
    file = request.files['image']
    print(file)
    img_bytes = file.read()
    img_array = np.asarray(bytearray(img_bytes), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    print(img.shape)
    img_resized = cv2.resize(img, (500, 500))
    print(img_resized.shape)
    result = detector.detect_faces(img_resized)
    print("Result: ")
    print(result)
    for elem in result:
        x1,y1,x2,y2 = elem["box"]
        cv2.rectangle(img_resized, (x1, y1), (x2, y2), (0, 255, 0), 2)
    _, img_encoded = cv2.imencode('.jpg', img_resized)
    img_base64 = base64.b64encode(img_encoded.tobytes()).decode('utf-8')
    return {
        "image": img_base64
    } 

if __name__ == '__main__':
    app.run()