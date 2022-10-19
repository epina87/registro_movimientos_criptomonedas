import sqlite3
from config import MONEDAS,ORIGIN_DATA




def select_all():
    
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    cur.execute("SELECT id,date,time,moneda_from,cantidad_from,moneda_to,cantidad_to from movimientos order by date,time;")

    resultado = filas_to_diccionario(cur.fetchall(), cur.description)

    conn.close()
    for movimiento in resultado:      
         
        if movimiento["moneda_from"] == "EUR":
           movimiento["cantidad_from"] = round(movimiento["cantidad_from"] ,2) 
        else:
            movimiento["cantidad_from"] = round(movimiento["cantidad_from"] ,8)  

        if movimiento["moneda_to"] == "EUR":
           movimiento["cantidad_to"] = round(movimiento["cantidad_to"] ,2) 
        else:
            movimiento["cantidad_to"] = round(movimiento["cantidad_to"] ,8)   

    return resultado

def select_coins():
    
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    cur.execute("SELECT moneda_from,cantidad_from,moneda_to,cantidad_to from movimientos;")
    history = cur.fetchall()
    conn.close()
    
    dic_sell =  dictionary(MONEDAS)
    dic_buy  = dictionary(MONEDAS)

    for registro in history:    
        dic_sell[registro[0]] += registro[1] 
        dic_buy[registro[2]] += registro[3] 

    monedas_cartera=["EUR"]

    for moneda in dic_sell:
        if moneda != "EUR":
            if dic_buy[moneda]>dic_sell[moneda]:
                monedas_cartera.append(moneda)    
            
    return monedas_cartera,MONEDAS

def filas_to_diccionario(filas, columnas):
    resultado = []
    for fila in filas:
        posicion_columna = 0
        d = {}
        for campo in columnas:
            d[campo[0]] = fila[posicion_columna]
            posicion_columna += 1
        resultado.append(d)

    return resultado

def sale_currency_control(coin_from):
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    cur.execute("SELECT cantidad_from from movimientos WHERE moneda_from = ?", (coin_from,))

    total_sell = total_coins_BD(cur.fetchall())

    cur.execute("SELECT cantidad_to from movimientos WHERE moneda_to = ?", (coin_from,))

    total_buy = total_coins_BD(cur.fetchall())
    total_coin = total_buy-total_sell

    conn.close()
    return total_coin

def total_coins_BD(list_coin):
    total = 0
    for price in list_coin:
        total+=price[0]

    return total

def result_total(totalCambio):

    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    cur.execute("SELECT moneda_from,cantidad_from,moneda_to,cantidad_to from movimientos;")
    history = cur.fetchall()
    conn.close()
    
    dic_sell =  dictionary(MONEDAS)
    dic_buy  = dictionary(MONEDAS)
    
    for registro in history:    
        dic_sell[registro[0]] += registro[1] 
        dic_buy[registro[2]] += registro[3] 


    total_sell  = 0 
    total_buy   = 0 
    invested    = 0
    recovered   = 0


    for moneda in dic_sell:
        if moneda != "EUR":
            total_sell += totalCambio.get(moneda)  * dic_sell.get(moneda)
            total_buy += totalCambio.get(moneda)  * dic_buy.get(moneda)
        else:
            invested += dic_sell.get(moneda)  
            recovered += dic_buy.get(moneda)
    purchase_value = invested - recovered 
    Current_value =  total_buy - total_sell
    result = round(Current_value,8) - round(purchase_value,8) 

    total = {"invertido":round(invested,2),"recuperado":round(recovered,2),"valor_compra":round(purchase_value,8),"valor_actual":round(Current_value,8),"resultado":round(result,8) }

    return total
    
def dictionary(monedas):
    dic={}
    for moneda in monedas:
        dic[moneda] = 0.0
    return dic   

def insert(registro):
    
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    cur.execute("INSERT INTO movimientos (date, time, moneda_from, cantidad_from, moneda_to, cantidad_to) values (?, ?, ?, ?, ?, ?);", (registro))
    conn.commit()
    conn.close()
   



