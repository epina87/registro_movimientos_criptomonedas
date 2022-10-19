Registro_cripto

1- Instalación de las dependencias, "requirements.txt".
        -> pip install -r requirements.txt

2- Creación base datos con el fichero "/data/create.sql".
        -> sqlite3 datos.db
   sqlite> .read data/create.sql
   sqlite> .q

3- Modificación del fichero config_template.py
    a) Modificar ORIGIN_DATA="Añadiendo aqui la Ruta al fichero sqlite"
    b) Modificar SECRET_KEY="Añadiendo aqui la clave secreta para el encriptado de datos"
    c) Modificar APIKEY = "Añadiendo aqui su apikey obtenida en coinapi.io"
    d) Renombrar el fichero config_template.py por config.py

4- Modificación del fichero .env_template
    a) Modificar FLASK_DEBUG="Añadiendo True"
    b) Renombrar el fichero .env_template por .env