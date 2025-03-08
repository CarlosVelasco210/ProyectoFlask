from flask import Blueprint, jsonify, request
from models import db, Credits

# Blueprint para las rutas de la API
api_bp = Blueprint("api", __name__)

# Ruta para obtener todos los creditos
@api_bp.route('/api/credits', methods=['GET'])
def get_credits():
    # Obtener todos los creditos ordenados por cliente
    credits = Credits.query.order_by(Credits.cliente).all() 
    credits_data = [{
        'id': credit.id,
        'cliente': credit.cliente,
        'monto': credit.monto,
        'tasa_intereses': credit.tasa_intereses,
        'plazo': credit.plazo,
        'fecha_otorgamiento': credit.fecha_otorgamiento
    } for credit in credits]
    
    return jsonify({'credits': credits_data})

# Ruta para registrar un nuevo credito
@api_bp.route("/api/credits", methods=["POST"])
def create_credit():
    # Obtener los datos del cuerpo de la solicitud
    data = request.get_json()
    new_credit = Credits(
        cliente=data["cliente"],
        monto=data["monto"],
        tasa_intereses=data["tasa_intereses"],
        plazo=data["plazo"],
        fecha_otorgamiento=data["fecha_otorgamiento"]
    )
    # Guardar el nuevo credito en la base de datos
    db.session.add(new_credit)
    db.session.commit()
    return jsonify({"message": "Credito registrado exitosamente"}), 201

# Ruta para actualizar un credito existente
@api_bp.route("/api/credits/<int:id>", methods=["PUT"])
def update_credit(id):
    # Obtener los datos del cuerpo de la solicitud
    data = request.get_json()
    # Buscar el credito por ID (devuelve 404 si no existe)
    credit = Credits.query.get_or_404(id)
    # Actualizar los campos del credito
    credit.cliente = data["cliente"]
    credit.monto = data["monto"]
    credit.tasa_intereses = data["tasa_intereses"]
    credit.plazo = data["plazo"]
    credit.fecha_otorgamiento = data["fecha_otorgamiento"]
    db.session.commit()
    return jsonify({"message": "Credito actualizado exitosamente"})

# Ruta para eliminar un credito
@api_bp.route("/api/credits/<int:id>", methods=["DELETE"])
def delete_credit(id):
    # Buscar el credito por ID (devuelve 404 si no existe)
    credit = Credits.query.get_or_404(id)
    # Eliminar el credito de la base de datos
    db.session.delete(credit)
    db.session.commit()
    return jsonify({"message": "Credito eliminado exitosamente"})

# Ruta para buscar creditos por cliente
@api_bp.route('/api/credits/search', methods=['GET'])
def search_credits():
    # Obtener el nombre del cliente
    cliente = request.args.get('cliente', '').upper()
    # Buscar creditos que coincidan con el nombre del cliente
    credits = Credits.query.filter(Credits.cliente.ilike(f'%{cliente}%')).all()
    # Formatear los datos para la respuesta JSON
    credits_data = [{
        'id': credit.id,
        'cliente': credit.cliente,
        'monto': credit.monto,
        'tasa_intereses': credit.tasa_intereses,
        'plazo': credit.plazo,
        'fecha_otorgamiento': credit.fecha_otorgamiento
    } for credit in credits]
    
    return jsonify({'credits': credits_data})

# Ruta para obtener estadisticas de creditos
@api_bp.route("/api/creditos_estadisticas", methods=["GET"])
def creditos_estadisticas():
    # Calcular el total de creditos otorgados
    total_creditos = db.session.query(db.func.sum(Credits.monto)).scalar()

    # Obtener estadisticas por cliente (cantidad de creditos y monto total)
    clientes = db.session.query(Credits.cliente, db.func.count(Credits.id), 
                                db.func.sum(Credits.monto)  
                               ).group_by(Credits.cliente).all()

    return jsonify({
        "total_creditos": total_creditos,
        "creditos_por_cliente": [{"cliente": c[0], "cantidad": c[1], "total_monto": c[2]} for c in clientes]
    })