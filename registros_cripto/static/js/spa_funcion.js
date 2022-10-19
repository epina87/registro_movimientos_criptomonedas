
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

function cuenta_regresiva(){
    var interval = ""
    var date = new Date('2020-01-01 00:05');
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
      if( minutes <= '04' && seconds <= '55' ) {
        document.querySelector("#time").style.color = "red";
        
      }
      if(minutes == '04' && seconds == '50'|| fin==true){
        clearInterval(interval); 
        desmarcar_aceptar()
      }      
    }, 1000);
    
}



