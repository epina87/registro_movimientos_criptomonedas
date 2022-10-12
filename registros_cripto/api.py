import requests
from config import apiKey



class ModelError(Exception):
    pass


class Cambio:
    def __init__(self,coin_from,coin_to):
        self.coin_from = coin_from
        self.coin_to = coin_to
        self.tasa = None 
        self.horafecha = None
    
    def actualiza(self,apikey):             
        r = requests.get("https://rest.coinapi.io/v1/exchangerate/{}/{}?apikey={}".format(self.coin_from,self.coin_to,apiKey))
        resultado = r.json()

        if r.status_code == 200:   
            self.tasa = resultado["rate"]
            self.horafecha = resultado["time"]
        else:
            raise ModelError("{}: {}".format(r.status_code,resultado["error"]))

        
