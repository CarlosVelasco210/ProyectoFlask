import os

# Ruta base del proyecto
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Configuracion de la URI de la base de datos SQLite
class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, "database", "sistema.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False