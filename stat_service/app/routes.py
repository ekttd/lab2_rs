from fastapi import APIRouter, HTTPException
from bson import ObjectId
from .database import db
import requests

router = APIRouter()
collection = db["statistics"]


def serialize(stat):
    return {
        "id": str(stat["_id"]),
        "goals": stat["goals"],
        "assists": stat["assists"],
        "matches_played": stat["matches_played"]
    }



@router.get("/statistics")
def get_all_statistics():
    stats = collection.find()
    return [serialize(stat) for stat in stats]


@router.post("/statistics/by-name")
def create_statistics_by_name(stat: dict):

    name = stat.get("name")

    if not name:
        raise HTTPException(status_code=400, detail="Name is required")

    # запрос к player-service
    response = requests.get(f"{PLAYER_SERVICE_URL}/players/search/{name}")


    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Player service error")

    players = response.json()

    if not players:
        raise HTTPException(status_code=404, detail="Player not found")

    player = players[0]
    player_id = player["id"]

    try:
        obj_id = ObjectId(player_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid player ID format")

    existing = collection.find_one({"_id": obj_id})
    if existing:
        raise HTTPException(status_code=400, detail="Statistics already exists")

    stat_document = {
        "_id": obj_id,
        "goals": stat.get("goals", 0),
        "assists": stat.get("assists", 0),
        "matches_played": stat.get("matches_played", 0)
    }

    collection.insert_one(stat_document)

    return {
        "message": "Statistics created",
        "player_id": player_id
    }



@router.get("/statistics/by-name/{name}")
def get_statistics_by_name(name: str):

    # запрос к player-service
    response = requests.get(f"{PLAYER_SERVICE_URL}/players/search/{name}")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Player service error")

    players = response.json()

    if not players:
        raise HTTPException(status_code=404, detail="Player not found")

    player = players[0]
    player_id = player["id"]

    try:
        obj_id = ObjectId(player_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid player ID format")

    stat = collection.find_one({"_id": obj_id})

    if not stat:
        raise HTTPException(status_code=404, detail="Statistics not found")

    return {
        "player": player,
        "statistics": serialize(stat)
    }
