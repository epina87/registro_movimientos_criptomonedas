peticion = new XMLHttpRequest()

function peticion_todos_handler() {
    if (this.readyState === 4) {
        if (this.status === 200) {
            const los_datos = JSON.parse(this.responseText)
            const la_tabla = document.querySelector("#movements_table")
            const movimientos = los_datos.data

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
            
        } else {
            alert("Se ha producido un error en la consulta de movimientos")
        }
    }
}

window.onload = function(){

    peticion.open("GET", "http://localhost:5000/api/v1/movimientos", true)
    peticion.onload = peticion_todos_handler
    peticion.onerror = function() { alert("No se ha podido completar la petición de movimientos")}
    peticion.send()

}
