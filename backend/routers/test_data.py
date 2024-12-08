from fastapi import APIRouter, HTTPException
from database import get_db_connection

router = APIRouter()

@router.post("/")
def upload_db():
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
                ('Лёгкая атлетика'),
                ('Хоккей'),
                ('Волейбол'),
                ('Бокс');
        """)

        cursor.execute(""" 
            INSERT INTO competitions (competition_name, season) 
            VALUES 
                ('World Cup 2024', 'Лето'), 
                ('Champions League 2024', 'Все сезоны'), 
                ('Олимпийские игры 2024', 'Лето'), 
                ('NBA Финал 2024', 'Весна'),
                ('Зимние Олимпийские Игры 2024', 'Зима'),
                ('Чемпионат Европы по лёгкой атлетике 2024', 'Осень'),
                ('Wimbledon 2024', 'Лето'),
                ('Чемпионат мира по хоккею 2024', 'Зима');
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
                (4, 5),
                (5, 6),
                (5, 4),
                (6, 5),
                (7, 3),
                (8, 6);
        """)

        cursor.execute(""" 
            INSERT INTO athletes (first_name, patronymic, last_name, sport_id) 
            VALUES 
                ('Евгений', 'Деннисович', 'Смоловой', 2), 
                ('Иван', 'Сергеевич', 'Виноградов', 1), 
                ('Михаил', 'Васильевич', 'Дёмкин', 3), 
                ('Светлана', 'Вениаминовна', 'Смирнова', 4),
                ('Алексей', 'Иванович', 'Кузнецов', 5),
                ('Анна', 'Петровна', 'Васильева', 6),
                ('Дмитрий', 'Владимирович', 'Ильин', 7),
                ('Ольга', 'Алексеевна', 'Зуева', 8);
        """)

        cursor.execute(""" 
            INSERT INTO results (athlete_id, competition_id, result) 
            VALUES 
                (1, 1, 75.5), 
                (2, 1, 80.3), 
                (3, 2, 90.0), 
                (4, 3, 85.4),
                (5, 6, 95.2),
                (6, 5, 88.7),
                (7, 7, 91.1),
                (8, 8, 89.9),
                (1, 3, 78.4),
                (2, 4, 83.5),
                (3, 7, 92.0),
                (4, 6, 87.5);
        """)

        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

        connection.commit()
        return {"message": "Extended test data uploaded successfully"}
    except Exception as exception:
        connection.rollback()
        raise HTTPException(status_code=201, detail=f"Error uploading data: {str(exception)}")
    finally:
        cursor.close()
        connection.close()

@router.delete("/")
def delete_db():
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

        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

        connection.commit()
        return {"message": "DB data deleted successfully"}
    except Exception as exception:
        connection.rollback()
        raise HTTPException(status_code=201, detail=f"Error deleted data: {str(exception)}")
    finally:
        cursor.close()
        connection.close()