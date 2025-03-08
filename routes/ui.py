from flask import Blueprint, render_template
from models import Credits

# Blueprint para las rutas de la interfaz de usuario
ui_bp = Blueprint("ui", __name__)

# Ruta para la pagina principal
@ui_bp.route("/")
def home():
    credits = Credits.query.all()
    return render_template("index.html", credits=credits)

# Ruta para editar un credito
@ui_bp.route("/edit_credit/<int:id>", methods=["GET"])
def edit_credit(id):
    credit = Credits.query.get_or_404(id)
    return render_template("edit_credit.html", credit=credit)

# Ruta para mostrar el formulario de agregar credito
@ui_bp.route("/add_credit", methods=["GET"])
def add_credit():
    return render_template("add_credit.html")