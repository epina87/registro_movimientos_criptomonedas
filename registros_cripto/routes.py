from flask import jsonify,render_template,request
from registros_cripto import app
from registros_cripto.models import select_all,select_coins,sale_currency_control,result_total,insert,selec_id
from registros_cripto.api import Cambio,ModelError,TotalCambio
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
        return return_josn_fail(str(e),400)

@app.route("/api/v1/movimiento", methods=["POST"])
def new_movements():
    registro = request.json
    
    moneda_from = registro["moneda_from"]
    if registro["moneda_from"] != "EUR": 

        sufficient_quantity = sale_currency_control(moneda_from)        
        try:
            quantity_change = float(registro["cantidad_from"])     
        except:
            return return_josn_fail("Cantidad incorrecta, solo valores numericos",400)


    if registro["moneda_from"] == "EUR" or  sufficient_quantity>= quantity_change:     
        try: 
            insert([registro["date"], registro["time"], registro["moneda_from"], registro["cantidad_from"], registro["moneda_to"], registro["cantidad_to"]])

            #selec_id([registro["date"], registro["time"], registro["moneda_from"], registro["cantidad_from"], registro["moneda_to"], registro["cantidad_to"]])
           
            monedas = select_coins()
            return jsonify(
                    {
                        "status": "success",
                        "id":"Nuevo id***",
                        "monedas":monedas                       
                    }
                ),201 
            

               
        except sqlite3.Error as e:
            return return_josn_fail(str(e),400)
                
    else:   
        return return_josn_fail("Saldo insuficiente",400)
    
@app.route("/api/v1/status", methods=["GET"])
def status_movements():
    totalCambio = TotalCambio()
    try:
        totalCambio.buscarTodasEuro()  

    except ModelError as variable:
        return return_josn_fail(variable,400)

    try:
        total = result_total(totalCambio.intercambio_euro)
        
        return jsonify(
                {
                    "status": "success",
                    "data": total
                    
                }
            ) 
    except sqlite3.Error as e:
        return return_josn_fail(str(e),400)

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
        if coin_from != "EUR":     
            sufficient_quantity = sale_currency_control(coin_from)        
        try:
            quantity_change = float(q_from)     
        except:
            return return_josn_fail("Cantidad incorrecta, solo valores numericos",400)

        if coin_from == "EUR" or sufficient_quantity>= quantity_change:
            
            tipoCambio = Cambio(coin_from,coin_to)
            try:
                tipoCambio.actualiza()            
                
                return jsonify(
                {
                        
                    "data": {"q":tipoCambio.tasa * quantity_change,"pv":tipoCambio.tasa,"time":tipoCambio.hora,"date":tipoCambio.fecha},
                    "status": "success"
                    
                }
            ) 

            except ModelError as variable:
               return return_josn_fail(variable,400)
            #except:
            #    return return_josn_fail("No se ha podido establecer la conexión",400)
                
        else:   
            return return_josn_fail(f"Cantidad insuficiente de {coin_from}, en tu cartera",400)

def return_josn_fail(coment,http_error):
    return jsonify(
            {
                "status": "fail",
                "data": coment
            }
        ),http_error



