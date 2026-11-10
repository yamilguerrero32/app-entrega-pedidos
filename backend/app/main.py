from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine

app = FastAPI(
    title="API de Repartidores",
    description="Sistema de gestión y seguimiento de entregas",
    version="1.0.0"
)


@app.get("/")
def inicio():
    return {
        "mensaje": "API de repartidores funcionando correctamente"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }

@app.get("/health/database")
def comprobar_base_datos():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "ok",
            "database": "PostgreSQL conectado correctamente"
        }

    except Exception as error:
        return {
            "status": "error",
            "message": str(error)
        }