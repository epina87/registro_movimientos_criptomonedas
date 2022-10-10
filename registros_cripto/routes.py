from flask import jsonify,render_template,request
from registros_cripto import app
from registros_cripto.models import select_all

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/v1/movimientos", methods=["GET"])
def all_movements():
    registros = select_all()
    return jsonify(
            {
                "data": registros,
                "status": "OK"
            }
        ) 
    pass

@app.route("/api/v1/movimiento", methods=["POST"])
def new_movements():
    pass

@app.route("/api/v1/status", methods=["GET"])
def status_movements():
    pass