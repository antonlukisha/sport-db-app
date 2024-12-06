from fastapi import APIRouter, HTTPException
from database import get_db_connection

router = APIRouter()

@router.post("/")
def upload_sport():
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        connection.start_transaction()
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")

        cursor.execute("TRUNCATE TABLE sports;")
        cursor.execute("TRUNCATE TABLE competitions;")
        cursor.execute("TRUNCATE TABLE competition_sports;")
        cursor.execute("TRUNCATE TABLE athletes;")
        cursor.execute("TRUNCATE TABLE results;")

        cursor.execute(""" 
            INSERT INTO sports (sport_name) 
            VALUES 
                ('Футбол'), 
                ('Баскетбол'), 
                ('Теннис'), 
                ('Плавание'), 
                ('Лёгкая атлетика');
        """)

        cursor.execute(""" 
            INSERT INTO competitions (competition_name, season) 
            VALUES 
                ('World Cup 2024', 'Лето'), 
                ('Champions League 2024', 'Все сезоны'), 
                ('Олимпийские игры 2024', 'Лето'), 
                ('NBA Финал 2024', 'Весна');
        """)

        cursor.execute(""" 
            INSERT INTO competition_sports (competition_id, sport_id) 
            VALUES 
                (1, 1),
                (1, 2), 
                (2, 3), 
                (3, 1),
                (3, 4), 
                (4, 2),
                (4, 5);
        """)

        cursor.execute(""" 
            INSERT INTO athletes (first_name, last_name, patronymic, sport_id) 
            VALUES 
                ('Евгений', 'Деннисович', 'Смоловой', 2), 
                ('Иван', 'Сергеевич', 'Виноградов', 1), 
                ('Михаил', 'Васильевич', 'Дёмкин', 3), 
                ('Светлана', 'Вениаминовна', 'Смирнова', 4);
        """)

        cursor.execute(""" 
            INSERT INTO results (athlete_id, competition_id, result) 
            VALUES 
                (1, 1, 75.5), 
                (2, 1, 80.3), 
                (3, 2, 90.0), 
                (4, 3, 85.4);
        """)

        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

        connection.commit()
        return {"message": "Test data uploaded successfully"}
    except Exception as exception:
        connection.rollback()
        raise HTTPException(status_code=201, detail=f"No results found for this competition: {str(exception)}")
    finally:
        cursor.close()
        connection.close()
