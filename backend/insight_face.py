import insightface

model = insightface.app.FaceAnalysis(name="buffalo_l")
model.prepare(ctx_id=-1)  # 0 = GPU, -1 = CPU

def insight_face(img):
    result = model.get(img)
    return result