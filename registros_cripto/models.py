import sqlite3
from config import apiKey,monedas,ORIGIN_DATA


def select_all():
    
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    cur.execute("SELECT * from movimientos order by date;")

    resultado = filas_to_diccionario(cur.fetchall(), cur.description)

    conn.close()
    print(resultado)


    return resultado

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
