from fastapi import FastAPI

app = FastAPI(title="PredictUNI")

@app.get("/")
def root():
    return {"response": "Endpoint de Prueba Implementado"} 