from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Numeric,
    func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Entrega(Base):
    __tablename__ = "entregas"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    pedido_id: Mapped[int] = mapped_column(
        ForeignKey("pedidos.id"),
        nullable=False,
        unique=True
    )

    asignacion_id: Mapped[int] = mapped_column(
        ForeignKey("asignaciones.id"),
        nullable=False
    )

    repartidor_id: Mapped[int] = mapped_column(
        ForeignKey("repartidores.id"),
        nullable=False
    )

    # Coordenadas GPS al confirmar la entrega
    latitud: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    longitud: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    precision_gps: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    # Distancia calculada por el backend respecto al domicilio
    distancia_metros: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    # Fecha y hora generadas por PostgreSQL
    entregado_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
