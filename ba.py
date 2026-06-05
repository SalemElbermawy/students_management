from fastapi import FastAPI,Query
from pydantic import BaseModel

class Bmi (BaseModel):
    bmi:float


app = FastAPI()

@app.get("/")
def Hi():
    return {"message" : "Marhaba Python"}


@app.get("/calculate_bmi")

def calculate_bmi(weight: float = Query(...,gt=20,lt=200,description="weight kg")
                  , height:float = Query(...,gt=20,lt=100,description="tall m")):
    bmi= weight / (height**2)
    return Bmi(bmi=bmi)