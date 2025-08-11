from ultralytics import YOLO
from supervision import Detections
from PIL import Image
from io import BytesIO
from huggingface_hub import hf_hub_download

def yolo_face(pil_image):
 
    model_path = hf_hub_download(repo_id="arnabdhar/YOLOv8-Face-Detection", filename="model.pt")
    model = YOLO(model_path)

    output = model(pil_image)
    detections = Detections.from_ultralytics(output[0])
    xyxy = detections.xyxy
    return xyxy
