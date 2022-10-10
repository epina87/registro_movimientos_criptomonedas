from registros_cripto import app

@app.route("/")
def index():
    return "Servidor Levantado"