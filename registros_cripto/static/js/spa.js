peticion_todo = new XMLHttpRequest()
peticion_estado = new XMLHttpRequest()
peticion_calculo = new XMLHttpRequest()
peticion_selec_moneda = new XMLHttpRequest()
peticion_alta = new XMLHttpRequest()
cantidad_from_calculada = 0 
fin=true
selec_to_calculada= ""
selec_from_calculada= ""





function mostrar_alta_Movimiento(ev) {
    ev.preventDefault()


    clean_calc(["#cripto_coin","#cripto_total","#text_time","#text_date"])  
    document.querySelector("#quantity_from").value = ""
    document.querySelector("#text_time").classList.remove("inactive")


    const btn_alta = document.querySelector("#btn_business")
    if (btn_alta.innerHTML =='+'){
        btn_alta.innerHTML = '-' 
        document.querySelector("#business").classList.remove("inactive")

        consulta_buscar_monedas()

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


function revisar_Moneda(ev) {
    ev.preventDefault()


    document.querySelector("#text_error").classList.add("inactive")
    clean_calc(["#cripto_coin","#cripto_total","#text_time","#text_date"])
    fin=true

    selec_from = document.querySelector("#selec_from").value
    selec_to   = document.querySelector("#selec_to").value
    quantity   = document.querySelector("#quantity_from").value

    if (selec_from === selec_to){       
        error_aceptar("Las monedas tiene que ser diferentes")
        return        
    }
    if (!quantity ||quantity <= 0){
        error_aceptar("La cantidad tiene que ser superior a 0")      
        return        
    }
    
    consulta_revisar_moneda(selec_from,selec_to,quantity)
    
}


function nuevo_Movimiento(ev) {
    ev.preventDefault()


    const date = document.querySelector("#text_date").innerText 
    const time = document.querySelector("#text_time").innerText 
    const moneda_from = document.querySelector("#selec_from").value

    const cantidad_from = document.querySelector("#quantity_from").value

    const moneda_to = document.querySelector("#selec_to").value
    const cantidad_to = document.querySelector("#cripto_total").innerText 

     

    revision_calculo()
    
    alta_Movimiento({date:date, time:time, moneda_from:moneda_from, cantidad_from:cantidad_from, moneda_to:moneda_to, cantidad_to:cantidad_to})
    desmarcar_aceptar()
    
    
}



window.onload = function(){

    consulta_peticion_todos()
    consulta_peticion_estado()
    
    document.querySelector("#btn_business").onclick = mostrar_alta_Movimiento
    document.querySelector("#calculate").onclick = revisar_Moneda
    document.querySelector("#btn_aceptar").onclick = nuevo_Movimiento
    document.querySelector("#btn_actualizar").onclick = consulta_peticion_estado

    const input = document.querySelector('#quantity_from')
    input.addEventListener('change', revision_calculo)
    document.querySelector('#selec_from').addEventListener('change', revision_calculo)
    document.querySelector('#selec_to').addEventListener('change', revision_calculo)

    color_head()
}






 







 