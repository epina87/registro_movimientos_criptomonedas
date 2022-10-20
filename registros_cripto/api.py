import requests
from config import APIKEY,MONEDAS


class ModelError(Exception):
    pass

class Cambio:
    def __init__(self,coin_from,coin_to):
        self.coin_from = coin_from
        self.coin_to = coin_to
        self.tasa = None 
        self.hora = None
        self.fecha = None
    
    def actualiza(self): 
        
        try:           
            r = requests.get("https://rest.coinapi.io/v1/exchangerate/{}/{}?apikey={}".format(self.coin_from,self.coin_to,APIKEY))
        except requests.ConnectionError:
            raise ModelError("Failed to establish a new connection") 
            
        resultado = r.json()
        
                     
        if r.status_code == 200:  
            self.tasa = resultado["rate"]
            horafecha = resultado["time"]
            self.hora = horafecha[slice(12,19)]
            self.fecha =  horafecha[slice(0,10)]

        else:
            raise ModelError("{}: {}".format(r.status_code,resultado["error"]))
            
    

class TotalCambio:
    def __init__(self) -> None:
        self.intercambio_euro = {} 
    
    def buscarTodasEuro(self):
        
        try:
            r = requests.get("https://rest.coinapi.io/v1/exchangerate/EUR?apikey={}".format(APIKEY))
        except requests.ConnectionError:
            raise ModelError("Failed to establish a new connection") 
            
        resultado = r.json()
        
        if r.status_code == 200: 
            tasa_moneda = resultado["rates"]
            for dic_moneda in tasa_moneda:
                if dic_moneda.get("asset_id_quote") in MONEDAS:
                    self.intercambio_euro[dic_moneda.get("asset_id_quote")] = 1/dic_moneda.get("rate")   
            

        else:
            raise ModelError("{}: {}".format(r.status_code,resultado["error"]))
        