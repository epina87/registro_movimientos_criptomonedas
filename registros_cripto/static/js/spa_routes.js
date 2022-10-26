





/* Consulta Todos Movimientos */

function consulta_peticion_todos(){
    document.querySelector("#erores_conexion").classList.add("inactive")
    peticion_todo.open("GET", "http://localhost:5000/api/v1/movimientos", true)
    peticion_todo.onload = peticion_todos_handler
    peticion_todo.onerror = function() { 
        mostrar_error_conexion("No se ha podido completar la petición de movimientos")
        //alert("No se ha podido completar la petición de movimientos")
    }
    peticion_todo.send()

}
function peticion_todos_handler() {
    
    if (this.readyState === 4) {
        const los_datos = JSON.parse(this.responseText)
        
        if (this.status === 200) {
            
            const los_datos = JSON.parse(this.responseText)
            const la_tabla = document.querySelector("#movements_table")
            const movimientos = los_datos.data
            const mensaje = document.querySelector("#mensaje")
            if (movimientos.length == 0){           
                mensaje.style.display= "block"; 
                la_tabla.style.display= "none";         
            }
            else{
                clear_tab()
                mensaje.style.display= "none"; 
                la_tabla.style.display= "block"; 
                for (let i=0; i < movimientos.length; i++) {
                    item = movimientos[i]
                    const trow = document.createElement("tr")
    
                    const tddate = document.createElement("td")
                    const tdtime = document.createElement("td")
                    const tdfrom_sale = document.createElement("td")
                    const tdquantity_sale = document.createElement("td")
                    const tdfrom_buy = document.createElement("td")
                    const tdquantity_buy = document.createElement("td")
    
                    tddate.innerHTML = item.date
                    tdtime.innerHTML = item.time
                    tdfrom_sale.innerHTML = item.moneda_from
                    tdquantity_sale.innerHTML = item.cantidad_from
                    tdfrom_buy.innerHTML = item.moneda_to
                    tdquantity_buy.innerHTML = item.cantidad_to
    
                    trow.appendChild(tddate)
                    trow.appendChild(tdtime)
                    trow.appendChild(tdfrom_sale)                 
                    trow.appendChild(tdquantity_sale)
                    trow.appendChild(tdfrom_buy)
                    trow.appendChild(tdquantity_buy)


                    la_tabla.appendChild(trow)
                }
               
            }
            
            
        } else {
            
            error = los_datos.mensaje
            if (error != "") { 
                mostrar_error_conexion(error)
                //alert(error)
            }
            else{
                mostrar_error_conexion("Se ha producido un error en la consulta de movimientos")
                //alert("Se ha producido un error en la consulta de movimientos")
            }
            
        }
    }
}




/* Consulta Estado */

function consulta_peticion_estado(){
    document.querySelector("#erores_conexion").classList.add("inactive")
    peticion_estado.open("GET", "http://localhost:5000/api/v1/status", true)
    peticion_estado.onload = ver_stado
    peticion_estado.onerror = function() { 
        mostrar_error_conexion("No se ha podido completar la petición del estado")
        alert("No se ha podido completar la petición del estado")
    }
    peticion_estado.send()
}

function ver_stado(){
    clean_calc(["#cripto_invested","#cripto_recovered","#cripto_purchase_value","#cripto_Current_value"],0)
 
    if(this.readyState == 4 && this.status == 200){

        const cartera = JSON.parse(this.responseText)
        const estado_cartera = cartera.data

        color_valor_positivo_negativo(estado_cartera.invertido.toFixed(2),"#cripto_invested")

        color_valor_positivo_negativo(estado_cartera.recuperado.toFixed(2),"#cripto_recovered")

        color_valor_positivo_negativo(estado_cartera.valor_compra.toFixed(8),"#cripto_purchase_value")

        color_valor_positivo_negativo(estado_cartera.valor_actual.toFixed(2),"#cripto_Current_value")

        color_valor_positivo_negativo(estado_cartera.resultado.toFixed(2),"#cripto_Result_value")

    }

    else{
        mostrar_error_conexion("Se ha producido un error en la consulta del estado de los movimientos")
        //alert("Se ha producido un error en la consulta del estado de los movimientos")
    } 
            
}




/* Consulta Alta Movimientos */

function alta_Movimiento(dic_movimiento) {
    document.querySelector("#erores_conexion").classList.add("inactive")
    
    peticion_alta.open("POST", "http://localhost:5000/api/v1/movimiento", true)
    peticion_alta.onload = peticion_alta_handler
    peticion_alta.onerror = function() { 
        mostrar_error_conexion("No se ha podido completar la petición de movimientos")
        //alert("No se ha podido completar la petición de movimientos")
    }
    peticion_alta.setRequestHeader("Content-Type", "application/json")

    const data_json = JSON.stringify(dic_movimiento)

    peticion_alta.send(data_json)
}

function peticion_alta_handler() {
    if (this.readyState === 4) {
        if (this.status === 201) {

            

            consulta_peticion_todos()
            consulta_peticion_estado()
            cerrar_alta_Movimiento()
            
            
        } else {
            mostrar_error_conexion("Se ha producido un error en el alta de movimientos")
            //alert("Se ha producido un error en el alta de movimientos")
        }
    }
}

function cerrar_alta_Movimiento(){
    clean_calc(["#cripto_coin","#cripto_total","#text_time","#text_date"])  
    document.querySelector("#quantity_from").value = ""
    document.querySelector("#text_time").classList.remove("inactive")


    const btn_alta = document.querySelector("#btn_business")
    if (btn_alta.innerHTML =='+'){
        btn_alta.innerHTML = '-' 
        document.querySelector("#business").classList.remove("inactive")
        document.querySelector("#btn_aceptar").disabled=true   
        document.querySelector("#calculate").classList.remove("inactive")  
        document.querySelector("#quantity_from").focus();
        
    }
    
    else{
        btn_alta.innerHTML ='+'    
        document.querySelector("#business").classList.add("inactive")
        document.querySelector("#btn_aceptar").disabled=false
        
        document.querySelector("#calculate").classList.add("inactive") 
    }

}


/* Buscar Monedas */

function consulta_buscar_monedas(){
    document.querySelector("#erores_conexion").classList.add("inactive")
    const url = 'http://localhost:5000/api/v1/selec_from'

    peticion_selec_moneda.open("GET", url,true)
    peticion_selec_moneda.onreadystatechange = function(){
        
    if(this.readyState == 4 && this.status == 200){

        const monedas_cartera = JSON.parse(this.responseText)

        const monedas_disponibles_cartera = monedas_cartera.data
        const monedas_todas = monedas_cartera.todas 

        document.querySelector("#selec_from").innerHTML = ""
        const selec_from = document.querySelector("#selec_from")
        combo_monedas(selec_from,monedas_disponibles_cartera)
        document.querySelector("#selec_to").innerHTML = ""
        const selec_to = document.querySelector("#selec_to")
        combo_monedas(selec_to,monedas_todas)      
       
    }
    }
    peticion_selec_moneda.send()            
}




/*Revisar Monedas */

function consulta_revisar_moneda(selec_from,selec_to,quantity){
    
    document.querySelector("#erores_conexion").classList.add("inactive")
    const url = 'http://localhost:5000/api/v1/selec/'+selec_from+'/'+selec_to+'/'+quantity

    peticion_calculo.open("GET", url,true)
    peticion_calculo.onreadystatechange = function(){
        
        if(this.readyState == 4 && this.status == 200){
            
            const monedas_cartera = JSON.parse(this.responseText)
            const precio_moneda = monedas_cartera.data

            document.querySelector("#cripto_total").innerHTML = precio_moneda.q.toFixed(8)
            document.querySelector("#cripto_coin").innerHTML = precio_moneda.pv.toFixed(8)

            document.querySelector("#text_time").innerHTML = precio_moneda.time
            document.querySelector("#text_time").classList.remove("inactive")
            document.querySelector("#text_date").innerHTML = precio_moneda.date
            document.querySelector("#text_date").classList.remove("inactive")

            document.querySelector("#calculate").classList.add("inactive")

            cantidad_from_calculada = quantity
            selec_to_calculada = selec_to
            selec_from_calculada = selec_from
            

            fin=true
            cuenta_regresiva()

            
        }
        
        else {
            if(this.status == 400){
                const monedas_cartera = JSON.parse(this.responseText)            
                const status = monedas_cartera.status
                if (status=="fail"){
                    document.querySelector("#text_error").classList.remove("inactive")
                    document.querySelector("#text_error").innerHTML = monedas_cartera.mensaje
                }    


                }          
            
            }
        }
    
    peticion_calculo.send()
}


function cuenta_regresiva(){
    var interval = ""
    var date = new Date('2020-01-01 00:03');
    fin=false
    document.querySelector("#btn_aceptar").disabled=false

    // Función para rellenar con ceros
    var padLeft = n => "00".substring(0, "00".length - n.length) + n;
    
    // Asignar el intervalo a una variable para poder eliminar el intervale cuando llegue al limite
    var interval = setInterval(() => {
        
        
      // Asignar el valor de minutos
      var minutes = padLeft(date.getMinutes() + "");
      // Asignqr el valor de segundos
      var seconds = padLeft(date.getSeconds() + "");

      document.querySelector("#minutes").innerHTML = "Oferta valida -   " + minutes+":"
      document.querySelector("#seconds").innerHTML = seconds
      
        console.log(minutes,seconds)
        console.log(fin)
      
      // Restarle a la fecha actual 1000 milisegundos
      date = new Date(date.getTime() - 1000);
       
      // Si llega a 1:00, cambio color a rojo
      document.querySelector("#time").style.color = "black";
      if( minutes <= '01' && seconds <= '00' ) {
        document.querySelector("#time").style.color = "red";
        
      }
      if(minutes == '00' && seconds == '00'|| fin==true){
        clearInterval(interval); 
        desmarcar_aceptar()
      }      
    }, 1000);
    
}

/*Error de conexión */
function mostrar_error_conexion(coment){

    document.querySelector("#erores_conexion").classList.remove("inactive")
    document.querySelector("#erores_conexion").innerHTML = coment
}

