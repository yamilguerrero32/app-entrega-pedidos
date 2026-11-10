from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    String,
    func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Asignacion(Base):
    __tablename__ = "asignaciones"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    pedido_id: Mapped[int] = mapped_column(
        ForeignKey("pedidos.id"),
        nullable=False,
        index=True
    )

    repartidor_id: Mapped[int] = mapped_column(
        ForeignKey("repartidores.id"),
        nullable=False,
        index=True
    )

    estado: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="activa"
    )

    asignado_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    finalizado_en: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
