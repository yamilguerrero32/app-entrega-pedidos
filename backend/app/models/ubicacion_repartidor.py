from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UbicacionRepartidor(Base):
    __tablename__ = "ubicaciones_repartidor"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    repartidor_id: Mapped[int] = mapped_column(
        ForeignKey("repartidores.id"),
        nullable=False,
        index=True
    )

    # Coordenadas GPS
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

    # Fecha y hora de recepción en el servidor
    registrado_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True
    )
