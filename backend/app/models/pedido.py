from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    Numeric,
    String,
    UniqueConstraint,
    func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Pedido(Base):
    __tablename__ = "pedidos"

    __table_args__ = (
        UniqueConstraint(
            "sistema_origen",
            "folio_externo",
            name="uq_pedido_origen_folio"
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    # Identificación del pedido en el sistema externo
    sistema_origen: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="externo"
    )

    folio_externo: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    # Información del cliente
    cliente_nombre: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    cliente_telefono: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    direccion_entrega: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    # Coordenadas del domicilio
    latitud: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    longitud: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    # Información del pedido
    total: Mapped[float | None] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )

    estado: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="pendiente"
    )

    recibido_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
