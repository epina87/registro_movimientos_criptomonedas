





/* Consulta Todos Movimientos */

function consulta_peticion_todos(){
    peticion_todo.open("GET", "http://localhost:5000/api/v1/movimientos", true)
    peticion_todo.onload = peticion_todos_handler
    peticion_todo.onerror = function() { alert("No se ha podido completar la petición de movimientos")}
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
                alert(error)
            }
            else{
                alert("Se ha producido un error en la consulta de movimientos")
            }
            
        }
    }
}




/* Consulta Estado */

function consulta_peticion_estado(){
    peticion_estado.open("GET", "http://localhost:5000/api/v1/status", true)
    peticion_estado.onload = ver_stado
    peticion_estado.onerror = function() { alert("No se ha podido completar la petición del estado")}
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

        color_valor_positivo_negativo(estado_cartera.valor_actual.toFixed(8),"#cripto_Current_value")

        color_valor_positivo_negativo(estado_cartera.resultado.toFixed(8),"#cripto_Result_value")

    }

    else{
        
        alert("Se ha producido un error en la consulta del estado de los movimientos")
    } 
            
}




/* Consulta Alta Movimientos */

function alta_Movimiento(dic_movimiento) {

    peticion_alta.open("POST", "http://localhost:5000/api/v1/movimiento", true)
    peticion_alta.onload = peticion_alta_handler
    peticion_alta.onerror = function() { alert("No se ha podido completar la petición de movimientos")}
    peticion_alta.setRequestHeader("Content-Type", "application/json")

    const data_json = JSON.stringify(dic_movimiento)

    peticion_alta.send(data_json)
}

function peticion_alta_handler() {
    if (this.readyState === 4) {
        if (this.status === 201) {

            consulta_peticion_todos()
            consulta_peticion_estado()
            
            
        } else {
            alert("Se ha producido un error en el alta de movimientos")
        }
    }
}




/* Buscar Monedas */

function consulta_buscar_monedas(){
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
            const monedas_cartera = JSON.parse(this.responseText)
            
            const status = monedas_cartera.status
            
            if (status=="fail"){
                document.querySelector("#text_error").classList.remove("inactive")
                document.querySelector("#text_error").innerHTML = monedas_cartera.mensaje
            }    
            }
        }
    
    peticion_calculo.send()
}

