from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder

from database import get_db_connection
from dto import Result

router = APIRouter()

@router.post("/")
def add_result(result: Result):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "INSERT INTO results (athlete_id, competition_id, result) VALUES (%s, %s, %s)"
        cursor.execute(query, (result.athlete_id, result.competition_id, result.result))
        connection.commit()
        return {"message": "Result added successfully"}
    except Exception as exception:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add result: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.get("/all")
def get_results():
    connection = get_db_connection()
    cursor = connection.cursor()
    query = """
        SELECT *
        FROM results
    """
    try:
        cursor.execute(query)
        got_results = cursor.fetchall()
        results =[]
        for result in got_results:
            results.append({
                "athlete_id": result[0],
                "competition_id": result[1],
                "result": result[2]
            })
        return {"results": jsonable_encoder(results)}
    except Exception as exception:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve results: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.get("/average-results")
def average_results(season: str):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = """
        SELECT AVG(r.result)
        FROM results r
        JOIN competitions c ON r.competition_id = c.id
        WHERE c.season = %s
    """
    try:
        cursor.execute(query, (season,))
        avg_result = cursor.fetchone()[0]
        if avg_result is None:
            raise HTTPException(status_code=404, detail="No results found for this season")
        return {"season": season, "average_result": avg_result}
    except Exception as exception:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve average result for this season: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.get("/best-result/{athlete_id}")
def get_best_result(athlete_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = """
        SELECT MAX(result)
        FROM results
        WHERE athlete_id = %s
    """
    try:
        cursor.execute(query, (athlete_id,))
        best_result = cursor.fetchone()[0]
        if best_result is None:
            raise HTTPException(status_code=201, detail="No results found for this athlete")
        return {"athlete_id": athlete_id, "best_result": best_result}
    except Exception as exception:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve best result for this athlete: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.get("/winner/{competition_id}")
def get_winner(competition_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = """
        SELECT a.first_name, a.last_name, MAX(r.result)
        FROM results r
        JOIN athletes a ON r.athlete_id = a.athlete_id
        WHERE r.competition_id = %s
        GROUP BY a.id
        ORDER BY MAX(r.result) DESC
        LIMIT 1
    """
    try:
        cursor.execute(query, (competition_id,))
        winner = cursor.fetchone()
        if not winner:
            raise HTTPException(status_code=201, detail="No results found for this competition")
        return { "winner": f"{winner[0]} {winner[1]}", "best_result": winner[2] }
    except Exception as exception:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve results: {str(exception)}")
    finally:
        cursor.close()
        connection.close()