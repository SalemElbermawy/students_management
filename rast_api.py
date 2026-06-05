from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
    
)

class Student(BaseModel):
    id: int
    name:str
    grade:int
    
students=[
    Student(id=1,name="mohamed",grade=2),
    Student(id=2,name="Salme",grade=3)
]

# present students

@app.get("/students")

def read_student():
    return students

# add student

@app.post("/students")

def create_student(New_Student:Student):
    
    students.append(New_Student)
    
    return New_Student

# def create_student(New_Student:dict):
    
#     students.append(New_Student)
    
#     return New_Student

@app.put("/students/{student_id}")

def update_student(student_id:int,update_student:Student):
    
    for index,student in enumerate(students):
        
        if student.id == student_id:
            students[index]=update_student
            return update_student
    return {"message":"is not found"}

@app.delete("/student/{student_id}")

def delete_student(student_id:int):
    
    for index , student in enumerate(students):
        if student.id == student_id:
            del students[index]
            return {"message":"student deleted"}
    return {"error":"not found"}

print(students)