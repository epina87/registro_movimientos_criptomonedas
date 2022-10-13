import sqlite3
from config import apiKey,monedas,ORIGIN_DATA




def select_all():
    
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    cur.execute("SELECT id,date,time,moneda_from,cantidad_from,moneda_to,cantidad_to from movimientos order by date,time;")

    resultado = filas_to_diccionario(cur.fetchall(), cur.description)

    conn.close()

    return resultado

def select_coins():
    '''
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()  
    cur.execute("SELECT moneda_from,cantidad_from,moneda_to,cantidad_to from movimientos order by date,time;")  

    filas=cur.fetchall()
    resultado=[]
    d = {}
    for fila in filas:
        print (fila[0])
        vender = d.get(fila[0])
        if vender == "":
            d[fila[0]] = fila[1]
        



    '''
    return monedas



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

def sale_currency_control(coin_from,q_from):
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
    
    dic_sell =  dictionary(monedas)
    dic_buy  = dictionary(monedas)
    
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
            recovered +=   dic_buy.get(moneda)
    purchase_value = invested - recovered 
    Current_value =  total_buy - total_sell

    total = {"invertido":invested,"recuperado":recovered,"valor_compra":purchase_value,"valor_actual":Current_value}

    return total
    

def dictionary(monedas):
    dic={}
    for moneda in monedas:
        dic[moneda] = 0.0
    return dic    


