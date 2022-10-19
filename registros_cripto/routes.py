from distutils.log import error
from flask import jsonify,render_template,request
from registros_cripto import app
from registros_cripto.models import select_all,select_coins,sale_currency_control,result_total,insert
from registros_cripto.api import Cambio,ModelError,TotalCambio
from config import apiKey
from registros_cripto.form import MovimientosForm,error_validadcion_form

from flask_wtf import FlaskForm


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
        return return_josn_fail(str(e),400,"ERROR! En la consulta de los movimientos")

@app.route("/api/v1/movimiento", methods=["POST"])
def new_movements():
    registro = request.json
    
    form = MovimientosForm(data=registro)
    form.validate()
    
    msj_error = error_validadcion_form(form)
    if msj_error != "":
        return jsonify(
                    {
                        "status": "fail",
                        "mensaje": msj_error                 
                    }
                ),400

    moneda_from = registro["moneda_from"]
    if registro["moneda_from"] != "EUR": 

        sufficient_quantity = sale_currency_control(moneda_from)        
        try:
            quantity_change = float(registro["cantidad_from"])     
        except:
            error_txt= "Cantidad incorrecta, solo valores numericos"
            return return_josn_fail(error_txt,400,error_txt)


    if registro["moneda_from"] == "EUR" or  sufficient_quantity>= quantity_change:     
        try: 
            insert([registro["date"], registro["time"], registro["moneda_from"], registro["cantidad_from"], registro["moneda_to"], registro["cantidad_to"]])
           
            monedas = select_coins()
            return jsonify(
                    {
                        "status": "success",
                        "monedas":monedas                       
                    }
                ),201 
            

               
        except sqlite3.Error as e:
            return return_josn_fail(str(e),400,"ERROR! En la creacion del movimiento")
                
    else: 
        error_txt= "Saldo insuficiente" 
        return return_josn_fail(error_txt,400,error_txt)
    
@app.route("/api/v1/status", methods=["GET"])
def status_movements():
    totalCambio = TotalCambio()
    try:
        totalCambio.buscarTodasEuro()  

    except ModelError as variable:
        print(str(variable))
        return return_josn_fail(str(variable),400,"ERROR! en la conexión con la API")

    try:
        total = result_total(totalCambio.intercambio_euro)
        
        return jsonify(
                {
                    "status": "success",
                    "data": total
                    
                }
            ) 
    except sqlite3.Error as e:
        print(str(e))
        return return_josn_fail(str(e),400,"ERROR, en la conexión con la BD")

@app.route("/api/v1/selec_from", methods=["GET"])
def selec_from():
    try:
        monedas_cartera,monedas_todas = select_coins()
        return jsonify(
                {
                    "status": "success",
                    "data": monedas_cartera,
                    "todas": monedas_todas                   
                }
            ) 
    except sqlite3.Error as e:
        return return_josn_fail(str(e),400,"ERROR, en la conexión con la BD")

@app.route("/api/v1/selec/<coin_from>/<coin_to>/<q_from>", methods=["GET"])
def selec(coin_from,coin_to,q_from):
    try:
        if coin_from == coin_to or float(q_from)<=0 or q_from=="" or coin_from == "" or coin_to== "":
            error_txt = "Datos Incorrectos"
            return return_josn_fail(error_txt,400,error_txt)
    except:
        error_txt = "Datos Incorrectos"
        return return_josn_fail(error_txt,400,error_txt)    
    else:  
        if coin_from != "EUR":     
            sufficient_quantity = sale_currency_control(coin_from)        
        try:
            quantity_change = float(q_from)     
        except:
            error_txt = "Cantidad incorrecta, solo valores numericos" 
            return return_josn_fail(error_txt,400,error_txt)

        if coin_from == "EUR" or sufficient_quantity>= quantity_change:            
            try:
                tipoCambio = Cambio(coin_from,coin_to)

                tipoCambio.actualiza()            
                
                return jsonify(
                {
                        
                    "data": {"q":tipoCambio.tasa * quantity_change,"pv":tipoCambio.tasa,"time":tipoCambio.hora,"date":tipoCambio.fecha},
                    "status": "success"
                    
                }
            ) 

            except ModelError as variable: 
                return return_josn_fail(str(variable),400,"No se ha podido establecer la conexión")
            
                
        else: 
            error_txt = f"Cantidad insuficiente de {coin_from}, en tu cartera" 
            return return_josn_fail(error_txt,400,error_txt)

def return_josn_fail(coment,http_error,mensaje):
    return jsonify(
            {
                "status": "fail",
                "data": coment,
                "mensaje":mensaje
            }
        ),http_error



