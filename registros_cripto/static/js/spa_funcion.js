
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




function revision_calculo(){
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

    if(selec_to_calculada != moneda_to){
        error_aceptar("Necesario calcular la tasa. Moneda 'to' diferente al calculo")      
        return     
    }
    if(selec_from_calculada != moneda_from){
        error_aceptar("Necesario calcular la tasa. Moneda 'from' diferente al calculo")      
        return 
    }


}


function color_head(){
    const canvas = document.querySelector("#canvas")
    const ctx = canvas.getContext("2d")
    const WIDTH = canvas.width = 1400
    const HEIGHT = canvas.height= 300

    const backgroundgradient = ctx.createRadialGradient(0,0,200,WIDTH,HEIGHT, 100)

    backgroundgradient.addColorStop(0,"blue")
    backgroundgradient.addColorStop(0.5,"#eb3f00")
    backgroundgradient.addColorStop(1,"purple")

    ctx.fillStyle = backgroundgradient
    ctx.fillRect(0,0,WIDTH,HEIGHT)

    ctx.font= "70px 'Courgette', cursive"
    ctx.strokeStyle = "white";
    ctx.strokeText("myCRYPTO", 300, 150);

    const colortext = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
    colortext.addColorStop(0.2,"red")
    colortext.addColorStop(0.3,"yellow")
    colortext.addColorStop(0.5,"green")

    ctx.font= "69px  'Courgette', cursive"
    ctx.fillStyle = colortext;
    ctx.fillText("myCRYPTO", 300, 150);
}


