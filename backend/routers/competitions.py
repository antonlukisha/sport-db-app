from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder

from database import get_db_connection
from dto import Competition, CompetitionWithoutId

router = APIRouter()

@router.post("/")
def add_competition(competition: CompetitionWithoutId):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        connection.start_transaction()
        query = """
            INSERT INTO competitions (competition_name, season)
            VALUES (%s, %s)
        """
        cursor.execute(query, (competition.competition_name, competition.season))
        competition_id = cursor.lastrowid

        query = """
            DELETE FROM competition_sports 
            WHERE competition_id = %s
        """
        cursor.execute(query, (competition_id,))

        query = "SELECT sport_id FROM sports WHERE sport_name = %s"
        for sport in competition.sports:
            cursor.execute(query, (sport,))
            sport_id = cursor.fetchone()

            if sport_id:
                insert_query = """
                    INSERT INTO competition_sports (competition_id, sport_id)
                    VALUES (%s, %s)
                """
                cursor.execute(insert_query, (competition_id, sport_id[0]))

        connection.commit()
        return {"message": "Competition added successfully"}
    except Exception as exception:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add competition: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.put("/")
def update_competition(competition: Competition):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "UPDATE competitions SET competition_name = %s, season = %s WHERE competition_id = %s"
        cursor.execute(query, (competition.competition_name, competition.season, competition.competition_id))
        query = "SELECT sport_id FROM sports WHERE sport_name = %s"
        for sport in competition.sports:
            cursor.execute(query, (sport,))
            sport_id = cursor.fetchone()
            if sport_id:
                insert_query = """
                    INSERT INTO competition_sports (competition_id, sport_id)
                    VALUES (%s, %s)
                    ON DUPLICATE KEY UPDATE competition_id = VALUES(competition_id), sport_id = VALUES(sport_id);
                """
                cursor.execute(insert_query, (competition.competition_id, sport_id[0]))
        connection.commit()
        return {"message": "Competition updated successfully"}
    except Exception as exception:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update competition: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.get("/all")
def get_competitions():
    connection = get_db_connection()
    cursor = connection.cursor()
    query = """
        SELECT 
            c.competition_id, 
            c.competition_name, 
            c.season, 
            GROUP_CONCAT(s.sport_name) AS sports
        FROM competitions c
        LEFT JOIN competition_sports cs ON c.competition_id = cs.competition_id
        LEFT JOIN sports s ON cs.sport_id = s.sport_id
        GROUP BY c.competition_id
    """
    try:
        cursor.execute(query)
        got_competitions = cursor.fetchall()
        competitions = []
        for competition in got_competitions:
            competitions.append({
                "competition_id": competition[0],
                "competition_name": competition[1],
                "season": competition[2],
                "sports": competition[3]
            })
        return {"competitions": jsonable_encoder(competitions)}
    except Exception as exception:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve competitions: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.delete("/id/{competition_id}")
def delete_competition(competition_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        connection.start_transaction()
        query = "DELETE FROM competitions WHERE competition_id = %s"
        cursor.execute(query, (competition_id,))
        connection.commit()
        return {"message": "Competition deleted successfully"}
    except Exception as exception:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete competition: {str(exception)}")
    finally:
        cursor.close()
        connection.close()
