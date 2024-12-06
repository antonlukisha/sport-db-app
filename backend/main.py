from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import athletes, competitions, results, sports, test_data
from database import get_db_connection
import mysql.connector

app = FastAPI()

app.include_router(athletes.router, prefix="/athletes", tags=["Athletes"])
app.include_router(competitions.router, prefix="/competitions", tags=["Competitions"])
app.include_router(results.router, prefix="/results", tags=["Results"])
app.include_router(sports.router, prefix="/sports", tags=["Sports"])
app.include_router(test_data.router, prefix="/test", tags=["Tests"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    try:
        conn = get_db_connection()
        print("Connection successful!")
        conn.close()
    except mysql.connector.Error as error:
        print(f"Error: {error}")
