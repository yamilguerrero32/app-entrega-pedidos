# App Entrega de Pedidos

Aplicación móvil para repartidores con validación de entregas mediante geolocalización GPS y un backend desarrollado con FastAPI.

## Descripción

Este proyecto busca facilitar la gestión y confirmación de entregas a domicilio. El repartidor puede consultar un pedido, visualizar su destino y confirmar la entrega únicamente cuando se encuentra dentro de un radio de proximidad establecido.

El sistema está compuesto por una aplicación móvil y una API que administra los pedidos, repartidores, asignaciones, entregas y ubicaciones.

## Arquitectura

El proyecto está organizado en dos módulos principales:

```text
app-entrega-pedidos/
│
├── app-repartidor/       # Aplicación móvil
│   ├── src/
│   ├── assets/
│   └── package.json
│
├── backend/              # API y lógica del servidor
│   ├── app/
│   │   ├── models/
│   │   ├── main.py
│   │   ├── config.py
│   │   └── database.py
│   ├── migrations/
│   ├── alembic.ini
│   └── requirements.txt
│
└── .gitignore
```

## Tecnologías utilizadas

### Aplicación móvil
- React Native
- Expo
- TypeScript
- Expo Location

### Backend
- Python
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Psycopg

## Funcionalidades

### Aplicación móvil
- Obtención de la ubicación GPS del repartidor.
- Cálculo de distancia entre el repartidor y el destino.
- Validación de proximidad mediante un radio de entrega.
- Habilitación del botón de confirmación cuando se cumplen las condiciones de distancia.
- Registro temporal de la hora y ubicación de confirmación.

### Backend
- Conexión con PostgreSQL.
- Modelos para repartidores, pedidos, asignaciones, entregas y ubicaciones.
- Migraciones de base de datos con Alembic.
- Restricción para evitar duplicar pedidos del mismo sistema de origen y folio externo.
- Endpoints de comprobación de disponibilidad de la API y conexión a la base de datos.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/yamilguerrero32/app-entrega-pedidos.git
cd app-entrega-pedidos
```

### 2. Aplicación móvil

```bash
cd app-repartidor
npm install
npx expo start
```

### 3. Backend

Desde la carpeta raíz:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Crear un archivo `.env` dentro de `backend/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=repartidores_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

Crear previamente la base de datos PostgreSQL `repartidores_db`.

Ejecutar las migraciones:

```powershell
alembic upgrade head
```

Iniciar el servidor:

```powershell
uvicorn app.main:app --reload
```

Documentación interactiva de la API:

`http://127.0.0.1:8000/docs`

## Estado del proyecto

El proyecto se encuentra en desarrollo.

- [x] Estructura inicial de la aplicación móvil.
- [x] Validación de proximidad GPS en la aplicación.
- [x] Estructura inicial del backend.
- [x] Modelado de la base de datos.
- [x] Migración inicial con Alembic.
- [x] Conexión entre FastAPI y PostgreSQL.
- [ ] Autenticación de repartidores.
- [ ] Integración de la aplicación móvil con el backend.
- [ ] Recepción automática de pedidos desde sistemas externos.
- [ ] Asignación de pedidos a repartidores.
- [ ] Validación de entregas desde el servidor.
- [ ] Seguimiento de ubicación en tiempo real.
- [ ] Historial persistente de entregas.

## Objetivo

Desarrollar una solución que permita controlar las entregas, registrar tiempos de operación y mejorar la trazabilidad de los pedidos mediante geolocalización.

---

**Desarrollado como proyecto de software en evolución.**