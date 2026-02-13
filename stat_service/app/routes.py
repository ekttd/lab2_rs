from fastapi import APIRouter, HTTPException
from bson import ObjectId
from .database import db
from .config import PLAYER_SERVICE_URL
import requests

router = APIRouter()
collection = db["statistics"]


def serialize(stat):
    return {
        "id": str(stat["_id"]),
        "player_id": stat["player_id"],
        "goals": stat["goals"],
        "assists": stat["assists"],
        "matches_played": stat["matches_played"]
    }


# получить всю статистику
@router.get("/statistics")
def get_all_statistics():
    stats = collection.find()
    return [serialize(stat) for stat in stats]


# добавить статистику игроку
@router.post("/statistics")
def create_statistics(stat: dict):

    # есть ли вообще такой игрок
    response = requests.get(f"{PLAYER_SERVICE_URL}/players/{stat['player_id']}")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Player does not exist")

    result = collection.insert_one(stat)
    return {"id": str(result.inserted_id)}


# получить статистику по игрока по id
@router.get("/statistics/{player_id}")
def get_player_statistics(player_id: str):
    stat = collection.find_one({"player_id": player_id})

    if not stat:
        raise HTTPException(status_code=404, detail="Statistics not found")

    return serialize(stat)


# получить данные имя игрока + статистика
@router.get("/full-statistics/{player_id}")
def get_full_statistics(player_id: str):

    player_response = requests.get(f"{PLAYER_SERVICE_URL}/players/{player_id}")

    if player_response.status_code != 200:
        raise HTTPException(status_code=404, detail="Player not found")

    player = player_response.json()

    stat = collection.find_one({"player_id": player_id})

    if not stat:
        raise HTTPException(status_code=404, detail="Statistics not found")

    return {
        "player": player,
        "statistics": serialize(stat)
    }
