peticion_todo = new XMLHttpRequest()
peticion_estado = new XMLHttpRequest()
peticion_calculo = new XMLHttpRequest()
peticion_selec_moneda = new XMLHttpRequest()
peticion_alta = new XMLHttpRequest()
cantidad_from_calculada = 0 
fin=true
selec_to_calculada= ""
selec_from_calculada= ""





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

function clear_tab(){
    const la_tabla = document.querySelector("#movements_table")
    la_tabla.innerHTML = ""
    const trow = document.createElement("tr")
    
    const thdate = document.createElement("th")
    const thtime = document.createElement("th")
    const thfrom_sale = document.createElement("th")
    const thquantity_sale = document.createElement("th")
    const thfrom_buy = document.createElement("th")
    const thquantity_buy = document.createElement("th")

    thdate.innerHTML = "Fecha"
    thtime.innerHTML = "Hora"
    thfrom_sale.innerHTML = "From"
    thquantity_sale.innerHTML = "Cantidad"
    thfrom_buy.innerHTML = "From"
    thquantity_buy.innerHTML = "Cantidad"

    trow.appendChild(thdate)
    trow.appendChild(thtime)
    trow.appendChild(thfrom_sale)                 
    trow.appendChild(thquantity_sale)
    trow.appendChild(thfrom_buy)
    trow.appendChild(thquantity_buy)


    la_tabla.appendChild(trow)

}

function alta_Movimiento(ev) {
    ev.preventDefault()

    clean_calc(["#cripto_coin","#cripto_total","#text_time","#text_date"])  
    document.querySelector("#quantity_from").value = ""

    document.querySelector("#text_time").classList.remove("inactive")


    const btn_alta = document.querySelector("#btn_business")
    if (btn_alta.innerHTML =='+'){
        btn_alta.innerHTML = '-' 
        document.querySelector("#business").classList.remove("inactive")

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

            document.querySelector("#btn_aceptar").disabled=true   
            document.querySelector("#calculate").classList.remove("inactive")  
            document.querySelector("#quantity_from").focus();
            
        }
        }
        peticion_selec_moneda.send()            
    }
    else{
        btn_alta.innerHTML ='+'    
        document.querySelector("#business").classList.add("inactive")
        document.querySelector("#btn_aceptar").disabled=false
        
        document.querySelector("#calculate").classList.add("inactive") 
    }
    
}

function combo_monedas(selec,monedas){
    for (let i=0; i < monedas.length; i++) {
        item = monedas[i]

        let opt = document.createElement('option')
        opt.value = item
        opt.innerHTML = item
        selec.appendChild(opt)
            
    }

}

function revisar_Moneda(ev) {
    ev.preventDefault()
    
    document.querySelector("#text_error").classList.add("inactive")
    clean_calc(["#cripto_coin","#cripto_total","#text_time","#text_date"])
    fin=true

    

    selec_from = document.querySelector("#selec_from").value
    selec_to   = document.querySelector("#selec_to").value
    quantity   = document.querySelector("#quantity_from").value

    if (selec_from === selec_to){
        document.querySelector("#text_error").classList.remove("inactive")
        document.querySelector("#text_error").innerHTML = "Las monedas tiene que ser diferentes"
        
        return        
    }
    if (!quantity ||quantity == 0){
        document.querySelector("#text_error").classList.remove("inactive")
        document.querySelector("#text_error").innerHTML = "La cantidad tiene que ser superior a 0"
        
        return        
    }
    
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
                alert(monedas_cartera.data)
                document.querySelector("#text_error").classList.remove("inactive")
                document.querySelector("#text_error").innerHTML = monedas_cartera.mensaje
            }    
            }
        }
    
    peticion_calculo.send()
}

function clean_calc(list_id,value=""){    
    for (let i=0; i < list_id.length; i++) {
        document.querySelector(list_id[i]).innerHTML = value   
    }
}

function nuevo_Movimiento(ev) {
    ev.preventDefault()

    const date = document.querySelector("#text_date").innerText 
    const time = document.querySelector("#text_time").innerText 
    const moneda_from = document.querySelector("#selec_from").value

    const cantidad_from = document.querySelector("#quantity_from").value

    const moneda_to = document.querySelector("#selec_to").value
    const cantidad_to = document.querySelector("#cripto_total").innerText 



    if (moneda_from === moneda_to){
        error_aceptar("Las monedas tiene que ser diferentes")   
    
        return        
    }
    if (!cantidad_from ||cantidad_from == 0){
        error_aceptar("La cantidad tiene que ser superior a 0")
        return        
    }

    if (!cantidad_to ||cantidad_to == 0){
        error_aceptar("Necesario calcular la tasa, clik en la calculadora")      
        return        
    }
    if(cantidad_from_calculada !=cantidad_from){
        error_aceptar("Necesario calcular la tasa. Valor de 'Q', incorrecto")      
        return     
    }

    if(selec_to_calculada === moneda_to){
        error_aceptar("Necesario calcular la tasa. Moneda 'to' diferente al calculo")      
        return     
    }
    if(selec_from_calculada === moneda_from){
        error_aceptar("Necesario calcular la tasa. Moneda 'from' diferente al calculo")      
        return 
    }
    
    
    peticion_alta.open("POST", "http://localhost:5000/api/v1/movimiento", true)
    peticion_alta.onload = peticion_alta_handler
    peticion_alta.onerror = function() { alert("No se ha podido completar la petición de movimientos")}
    peticion_alta.setRequestHeader("Content-Type", "application/json")

    
    
    const data_json = JSON.stringify({date:date, time:time, moneda_from:moneda_from, cantidad_from:cantidad_from, moneda_to:moneda_to, cantidad_to:cantidad_to})

    peticion_alta.send(data_json)
    
}

function error_aceptar(coment){
    document.querySelector("#text_error").classList.remove("inactive")
    document.querySelector("#text_error").innerHTML = coment
    desmarcar_aceptar()
    return        
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

function consulta_peticion_todos(){
    peticion_todo.open("GET", "http://localhost:5000/api/v1/movimientos", true)
    peticion_todo.onload = peticion_todos_handler
    peticion_todo.onerror = function() { alert("No se ha podido completar la petición de movimientos")}
    peticion_todo.send()

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
    }

    else{
        
        alert("Se ha producido un error en la consulta del estado de los movimientos")
    } 
            
}
 function color_valor_positivo_negativo(valor,nombre_campo){
    document.querySelector(nombre_campo).innerHTML = valor 
    if (valor>= 0){
        document.querySelector(nombre_campo).style.color = "green"          
    }    
    else{
        document.querySelector(nombre_campo).style.color = "red"
    }
 }

function consulta_peticion_estado(){
    peticion_estado.open("GET", "http://localhost:5000/api/v1/status", true)
    peticion_estado.onload = ver_stado
    peticion_estado.onerror = function() { alert("No se ha podido completar la petición del estado")}
    peticion_estado.send()
}


window.onload = function(){

    consulta_peticion_todos()
    consulta_peticion_estado()
    
    document.querySelector("#btn_business").onclick = alta_Movimiento
    document.querySelector("#calculate").onclick = revisar_Moneda
    document.querySelector("#btn_aceptar").onclick = nuevo_Movimiento
    const input = document.querySelector('#quantity_from')
    input.addEventListener('change', desmarcar_aceptar)
    document.querySelector('#selec_from').addEventListener('change', desmarcar_aceptar)
    document.querySelector('#selec_to').addEventListener('change', desmarcar_aceptar)
    

}


function cuenta_regresiva(){
    var interval = ""
    var date = new Date('2020-01-01 00:05');
    fin=false

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
      if( minutes <= '01' && seconds <= '50' ) {
        document.querySelector("#time").style.color = "red";
        
      }
      if(minutes == '04' && seconds == '20'|| fin==true){
        clearInterval(interval); 
        desmarcar_aceptar()
      }



      
      
    }, 1000);
    



}

function desmarcar_aceptar(){
    cantidad_from_calculada = 0 
    selec_to_calculada = ""
    selec_from_calculada=""
    
    clean_calc(["#cripto_coin","#cripto_total","#text_time","#text_date","#minutes","#seconds"]) 

    fin=true
    
    document.querySelector("#btn_aceptar").disabled=false
    document.querySelector("#calculate").classList.remove("inactive")
    document.querySelector("#quantity_from").focus();

}
 