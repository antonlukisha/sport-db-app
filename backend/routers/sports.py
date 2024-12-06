from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder

from database import get_db_connection
from dto import Sport, SportWithoutId

router = APIRouter()

@router.post("/")
def add_sport(sport: SportWithoutId):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "INSERT INTO sports (sport_name) VALUES (%s)"
        cursor.execute(query, (sport.sport_name,))
        connection.commit()
        return {"message": "Sport added successfully"}
    except Exception as exception:
        raise HTTPException(status_code=500, detail=f"Failed to add sport: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.put("/")
def update_sport(sport: Sport):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "UPDATE sports SET sport_name = %s, WHERE sport_id = %s"
        cursor.execute(query, (sport.sport_name, sport.sport_id))
        connection.commit()
        return {"message": "Sport updated successfully"}
    except Exception as exception:
        raise HTTPException(status_code=500, detail=f"Failed to update sport: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.get("/all")
def get_sports():
    connection = get_db_connection()
    cursor = connection.cursor()
    query = """
        SELECT *
        FROM sports
    """
    try:
        cursor.execute(query)
        got_sports = cursor.fetchall()
        sports = []
        for sport in got_sports:
            sports.append({
                "sport_id": sport[0],
                "sport_name": sport[1]
            })
        return {"sports": jsonable_encoder(sports)}
    except Exception as exception:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve sports: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.get("/id/{sport_id}")
def get_sports_by_id(sport_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = """
        SELECT *
        FROM sports
        WHERE sport_id = %s
    """
    try:
        cursor.execute(query, (sport_id,))
        got_sport = cursor.fetchone()
        if not got_sport:
            raise HTTPException(status_code=404, detail="Sport not found")
        sport = {
            "sport_id": got_sport[0],
            "sport_name": got_sport[1]
        }
        return {"sport": jsonable_encoder(sport)}
    except Exception as exception:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve sport by ID: {str(exception)}")
    finally:
        cursor.close()
        connection.close()
