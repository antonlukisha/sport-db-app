from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder

from database import get_db_connection
from dto import Athlete, AthleteWithoutId

router = APIRouter()

@router.post("/")
def add_athlete(athlete: AthleteWithoutId):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "INSERT INTO athletes (first_name, last_name, patronymic, sport_id) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (athlete.first_name, athlete.last_name, athlete.patronymic, athlete.sport_id))
        connection.commit()
        return {"message": "Athlete added successfully"}
    except Exception as exception:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add athlete: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.put("/")
def update_athlete(athlete: Athlete):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "UPDATE athletes SET first_name = %s, last_name = %s, patronymic = %s, sport_id = %s, WHERE athlete_id = %s"
        cursor.execute(query, (athlete.first_name, athlete.last_name, athlete.patronymic, athlete.sport_id, athlete.athlete_id))
        connection.commit()
        return {"message": "Athlete updated successfully"}
    except Exception as exception:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update athlete: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.get("/all")
def get_athletes():
    connection = get_db_connection()
    cursor = connection.cursor()
    query = """
        SELECT *
        FROM athletes
    """
    try:
        cursor.execute(query)
        got_athletes = cursor.fetchall()
        athletes = []
        for athlete in got_athletes:
            athletes.append({
                "athlete_id": athlete[0],
                "first_name": athlete[1],
                "last_name": athlete[2],
                "patronymic": athlete[3],
                "sport_id": athlete[4]
            })
        return {"athletes": jsonable_encoder(athletes)}
    except Exception as exception:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve athletes: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.delete("/id/{athlete_id}")
def delete_athlete(athlete_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "DELETE FROM athletes WHERE athlete_id = %s"
        cursor.execute(query, (athlete_id,))
        connection.commit()
        return {"message": "Athlete deleted successfully"}
    except Exception as exception:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete athlete: {str(exception)}")
    finally:
        cursor.close()
        connection.close()