from mtcnn import MTCNN

detector = MTCNN()
def mtcnn(img):
     result = detector.detect_faces(img)
     return result
    