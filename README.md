# Registro_cripto

### 1- Instalación de las dependencias, _"requirements.txt"._
        * -> _pip install -r requirements.txt_
___        

### 2- Creación base datos con el fichero _"/data/create.sql"_.
    * -> _sqlite3 datos.db_
    * sqlite> _.read data/create.sql_
    * sqlite> _.q_
___

### 3- Modificación del fichero config_template.py
   * a) Modificar ORIGIN_DATA=_"Añadiendo aqui la Ruta al fichero sqlite"_
   * b) Modificar SECRET_KEY= _"Añadiendo aqui la clave secreta para el encriptado de datos"_
   * c) Modificar APIKEY = _"Añadiendo aqui su apikey obtenida en coinapi.io"_
   * d) Renombrar el fichero config_template.py por config.py
___

### 4- Modificación del fichero .env_template
    * a) Modificar FLASK_DEBUG= _"Añadiendo True"_
    * b) Renombrar el fichero .env_template por .env
___