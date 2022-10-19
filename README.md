# Registro_cripto

### 1- Instalación de las dependencias, _"requirements.txt"._
        * -> pip install -r requirements.txt
___        

### 2- Creación base datos con el fichero _"/data/create.sql"._
    * -> sqlite3 datos.db
    * sqlite> .read data/create.sql
    * sqlite> .q
___

### 3- Modificación del fichero config_template.py
   * a) Modificar ORIGIN_DATA=_"Añadiendo aquí  la Ruta al fichero sqlite"_
   * b) Modificar SECRET_KEY= _"Añadiendo aquí  la clave secreta para el encriptado de datos"_
   * c) Modificar APIKEY = _"Añadiendo aquí  su apikey obtenida en coinapi.io"_
   * d) Renombrar el fichero config_template.py por config.py
___

### 4- Modificación del fichero .env_template
  * a) Modificar FLASK_DEBUG= _"Añadiendo True"_
  * b) Renombrar el fichero .env_template por .env
___