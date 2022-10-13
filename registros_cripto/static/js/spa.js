peticion = new XMLHttpRequest()

function peticion_todos_handler() {
    if (this.readyState === 4) {
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
                    tdquantity_sale.innerHTML = item.cantidad_from.toFixed(8)
                    tdfrom_buy.innerHTML = item.moneda_to
                    tdquantity_buy.innerHTML = item.cantidad_to.toFixed(8)
    
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
            alert("Se ha producido un error en la consulta de movimientos")
        }
    }
}

function alta_Movimiento(ev) {
    ev.preventDefault()
    document.querySelector("#quantity_from").value =  ""
    document.querySelector("#cripto_coin").innerHTML = ""
    document.querySelector("#cripto_total").innerHTML = ""
    document.querySelector("#selec_from").innerHTML = ""
    document.querySelector("#selec_to").innerHTML = ""
    document.querySelector("#text_time").classList.remove("inactive")

    document.querySelector("#text_time").innerHTML = ""
    document.querySelector("#text_date").innerHTML = ""



    const btn_alta = document.querySelector("#btn_business")
    if (btn_alta.innerHTML =='+'){
        btn_alta.innerHTML = '-' 
        document.querySelector("#business").classList.remove("inactive")

        const url = 'http://localhost:5000/api/v1/selec_from'

        peticion.open("GET", url,true)
        peticion.onreadystatechange = function(){

        if(this.readyState == 4 && this.status == 200){

            const monedas_cartera = JSON.parse(this.responseText)
            const monedas = monedas_cartera.data

            const selec_from = document.querySelector("#selec_from")
            combo_monedas(selec_from,monedas)
            const selec_to = document.querySelector("#selec_to")
            combo_monedas(selec_to,monedas)            
        }
        }
        peticion.send()

                
    }
    else{
        btn_alta.innerHTML ='+'    
        document.querySelector("#business").classList.add("inactive")
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
    selec_from = document.querySelector("#selec_from").value
    selec_to   = document.querySelector("#selec_to").value
    quantity   = document.querySelector("#quantity_from").value

    if (selec_from === selec_to){
        alert("La moneda 'From' tiene que ser diferente de la moneda 'To'")
        return        
    }
    if (!quantity ||quantity == 0){
        alert("La cantidad tiene que ser superior a 0")
        return        
    }

    
    const url = 'http://localhost:5000/api/v1/selec/'+selec_from+'/'+selec_to+'/'+quantity

    peticion.open("GET", url,true)
    peticion.onreadystatechange = function(){

        if(this.readyState == 4 && this.status == 200){
            const monedas_cartera = JSON.parse(this.responseText)
            const precio_moneda = monedas_cartera.data


            document.querySelector("#cripto_coin").innerHTML = precio_moneda.q.toFixed(8)
            document.querySelector("#cripto_total").innerHTML = precio_moneda.pv.toFixed(8)
            document.querySelector("#text_time").innerHTML = precio_moneda.time
            document.querySelector("#text_time").classList.remove("inactive")
            document.querySelector("#text_date").innerHTML = precio_moneda.date
            document.querySelector("#text_date").classList.remove("inactive")
            
            
        }
        else {
            const monedas_cartera = JSON.parse(this.responseText)
            const status = monedas_cartera.status
            if (status=="fail"){
                let coment_error = document.querySelector("#text_error")
                coment_error.classList.remove("inactive")
                coment_error.innerHTML = monedas_cartera.data


                document.querySelector("#cripto_coin").innerHTML = ""
                document.querySelector("#cripto_total").innerHTML = ""
           
                document.querySelector("#text_time").innerHTML = ""
                document.querySelector("#text_date").innerHTML = ""
            
            }

        }
    }
    peticion.send()



}



function nuevo_Movimiento(ev) {
    ev.preventDefault()


    const url = 'http://localhost:5000/api/v1/status'

    peticion.open("GET", url,true)
    peticion.onreadystatechange = function(){

        if(this.readyState == 4 && this.status == 200){

            movimientos
        }

        else{
            //alert("ERROR")
            pass
        } 
    
    
    }
    peticion.send()

                
    
    
}


window.onload = function(){

    peticion.open("GET", "http://localhost:5000/api/v1/movimientos", true)
    peticion.onload = peticion_todos_handler
    peticion.onerror = function() { alert("No se ha podido completar la petición de movimientos")}
    peticion.send()

    document.querySelector("#btn_business").onclick = alta_Movimiento
    document.querySelector("#calculate").onclick = revisar_Moneda
    document.querySelector("#btn_aceptar").onclick = nuevo_Movimiento



}
