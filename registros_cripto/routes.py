from flask import jsonify,render_template,request
from registros_cripto import app
from registros_cripto.models import select_all,select_coins,sale_currency_control
from registros_cripto.api import Cambio,ModelError
from config import apiKey

import sqlite3

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/v1/movimientos", methods=["GET"])
def all_movements():
    try:
        registros = select_all()
        return jsonify(
                {
                    "data": registros,
                    "status": "success"
                }
            ) 
    except sqlite3.Error as e:
        return jsonify(
            {
                "status": "fail",
                "data": str(e)
            }
        ), 400


@app.route("/api/v1/movimiento", methods=["POST"])
def new_movements():
    registro = request.json


@app.route("/api/v1/status", methods=["GET"])
def status_movements():
    pass

@app.route("/api/v1/selec_from", methods=["GET"])
def selec_from():
    try:
        monedas = select_coins()
        return jsonify(
                {
                    "status": "success",
                    "data": monedas
                    
                }
            ) 
    except sqlite3.Error as e:
        return return_josn_fail(str(e),400)


@app.route("/api/v1/selec/<coin_from>/<coin_to>/<q_from>", methods=["GET"])
def selec(coin_from,coin_to,q_from):
    if coin_from == coin_to or q_from==0 or q_from=="" or coin_from == "" or coin_to== "":
        return return_josn_fail("Datos Incorrectos",400)
    else:       
        sufficient_quantity = sale_currency_control(coin_from,q_from)        
        try:
            quantity_change = float(q_from)     
        except:
            return return_josn_fail("Cantidad incorrecta, solo valores numericos",400)

        if sufficient_quantity>= quantity_change:
            
            tipoCambio = Cambio(coin_from,coin_to)
            try:
                tipoCambio.actualiza(apiKey)            
                #mostrarTipoCambio(tipoCambio.tasa)
                return jsonify(
                {
                    "data": {"q":tipoCambio.tasa,"pv":tipoCambio.tasa*quantity_change},
                    "status": "success"
                }
            ) 

            except ModelError as variable:
                return return_josn_fail(variable,400)
                
        else:   
            return return_josn_fail(f"Cantidad insuficiente de {coin_from}, en tu cartera",400)

def return_josn_fail(coment,http_error):
    return jsonify(
            {
                "status": "fail",
                "data": coment
            }
        ),http_error



