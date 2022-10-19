
function clean_calc(list_id,value=""){    
    for (let i=0; i < list_id.length; i++) {
        document.querySelector(list_id[i]).innerHTML = value   
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

function combo_monedas(selec,monedas){
    for (let i=0; i < monedas.length; i++) {
        item = monedas[i]

        let opt = document.createElement('option')
        opt.value = item
        opt.innerHTML = item
        selec.appendChild(opt)
            
    }

}

function error_aceptar(coment){
    document.querySelector("#text_error").classList.remove("inactive")
    document.querySelector("#text_error").innerHTML = coment
    desmarcar_aceptar()
    return        
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

 function desmarcar_aceptar(){
    cantidad_from_calculada = 0 
    selec_to_calculada = ""
    selec_from_calculada=""
    
    clean_calc(["#cripto_coin","#cripto_total","#text_time","#text_date","#minutes","#seconds"]) 

    fin=true
    
    document.querySelector("#btn_aceptar").disabled=true
    document.querySelector("#calculate").classList.remove("inactive")
    document.querySelector("#quantity_from").focus();

}





