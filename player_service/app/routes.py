from fastapi import APIRouter
from .database import db

router = APIRouter()
collection = db["players"]


def serialize(player):
    return {
        "id": str(player["_id"]),
        "name": player["name"],
        "age": player["age"],
        "club": player["club"],
        "position": player["position"]
    }


@router.get("/players")
def get_all_players():
    players = collection.find()
    return [serialize(player) for player in players]


@router.post("/players")
def create_player(player: dict):
    result = collection.insert_one(player)
    return {"id": str(result.inserted_id)}
