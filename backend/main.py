from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from pathlib import Path
from ai_service import GeminiAIService
import os

app = FastAPI()

gemini_service = GeminiAIService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data_file = Path("dummyData.json")
if not data_file.exists():
    data_file = Path("../dummyData.json")

with open(data_file, "r") as f:
    DUMMY_DATA = json.load(f)

@app.get("/api/sales-reps")
def get_sales_reps():
    return DUMMY_DATA

@app.post("/api/ai")
async def ai_endpoint(request: Request):
    body = await request.json()
    user_question = body.get("question", "")
    
    response = gemini_service.process_query(user_question)
    return response

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
