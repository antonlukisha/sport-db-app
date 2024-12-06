from typing import Optional, List
from pydantic import BaseModel

class Athlete(BaseModel):
    athlete_id: int
    first_name: str
    last_name: str
    patronymic: Optional[str]
    sport_id: int

class AthleteWithoutId(BaseModel):
    first_name: str
    last_name: str
    patronymic: Optional[str]
    sport: str

class Competition(BaseModel):
    competition_id: int
    competition_name: str
    season: str
    sports: str

class CompetitionWithoutId(BaseModel):
    competition_name: str
    season: str
    sports: str

class Result(BaseModel):
    athlete_id: int
    competition_id: int
    result: int

class Sport(BaseModel):
    sport_id: int
    sport_name: str

class SportWithoutId(BaseModel):
    sport_name: str