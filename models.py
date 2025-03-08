from flask_sqlalchemy import SQLAlchemy

# Instancia de SQLAlchemy para interactuar con la base de datos
db = SQLAlchemy()

# Modelo de la tabla 'creditos'
class Credits(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente = db.Column(db.String(100))
    monto = db.Column(db.Float)
    tasa_intereses = db.Column(db.Float)
    plazo = db.Column(db.Integer)
    fecha_otorgamiento = db.Column(db.String(10))