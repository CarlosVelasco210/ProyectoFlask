from flask import Flask
from config import Config
from models import db
from routes.api import api_bp
from routes.ui import ui_bp

# Crear la aplicacion Flask
app = Flask(__name__)
# Cargar la configuracion desde la clase Config
app.config.from_object(Config)

# Inicializar la base de datos con la aplicacion
db.init_app(app)

# Registrar los blueprints para las rutas de la API y la interfaz de usuario
app.register_blueprint(api_bp)
app.register_blueprint(ui_bp)

if __name__ == "__main__":
    app.run(debug=True)