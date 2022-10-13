import requests
from config import apiKey,monedas



class ModelError(Exception):
    pass


class Cambio:
    def __init__(self,coin_from,coin_to):
        self.coin_from = coin_from
        self.coin_to = coin_to
        self.tasa = None 
        self.hora = None
        self.fecha = None
    
    def actualiza(self,apikey):             
        r = requests.get("https://rest.coinapi.io/v1/exchangerate/{}/{}?apikey={}".format(self.coin_from,self.coin_to,apiKey))
        resultado = r.json()

        if r.status_code == 200:   
            self.tasa = resultado["rate"]
            horafecha = resultado["time"]
            self.hora = horafecha[slice(0,10)]
            self.fecha = horafecha[slice(12,19)] 

        else:
            raise ModelError("{}: {}".format(r.status_code,resultado["error"]))

class TotalCambio:
    def __init__(self) -> None:
        self.intercambio_euro = {} 
    
    def buscarTodasEuro(self):
        r = requests.get("https://rest.coinapi.io/v1/exchangerate/EUR?apikey={}".format(apiKey))
        resultado = r.json()

        

        if r.status_code == 200: 
            tasa_moneda = resultado["rates"]
            for dic_moneda in tasa_moneda:
                if dic_moneda.get("asset_id_quote") in monedas:
                    self.intercambio_euro[dic_moneda.get("asset_id_quote")] = 1/dic_moneda.get("rate")   
            

        else:
            raise ModelError("{}: {}".format(r.status_code,resultado["error"]))



        
