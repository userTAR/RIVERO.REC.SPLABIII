import {Anuncio_Auto} from "./clasesAuto.js";

let globalOption = "N/A";

// cuando la página recién carga
window.onload = function(){
    //eventos
    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.addEventListener("click", EventGuardarSobreJSON_SERVER);
    btnGuardar.addEventListener("click", TraerListadoController);

    document.getElementById("btnEliminar").addEventListener("click", EventEliminarSobreJSON_SERVER);
    document.getElementById("btnCancelar").addEventListener("click", LimpiarForm);
    document.addEventListener("click", EventClickFilas);
    
    let columnas = JSON.parse(localStorage.getItem("columnas"));
    if(columnas != null)
    {
        CrearTablaController(columnas,globalOption);
        columnas.forEach(element => {
            if(element == "titulo")
                document.getElementById("cbkTitulo").checked = true;
            else if(element == "transaccion")
                document.getElementById("cbkTransaccion").checked = true;
            else if(element == "descripcion")
                document.getElementById("cbkDescripcion").checked = true;
            else if(element == "precio")
                document.getElementById("cbkPrecio").checked = true;
            else if(element == "num_puertas")
                document.getElementById("cbkNumPuertas").checked = true;
            else if(element == "num_KMs")
                document.getElementById("cbkNumKms").checked = true;
            else if(element == "potenica")
                document.getElementById("cbkPotencia").checked = true;
        });
    }
    
    document.getElementById("optN/A").addEventListener("click",function(){
        globalOption = "N/A";
        CalculoController(false,false,true);
    });
    document.getElementById("optVenta").addEventListener("click",function(){
        globalOption = "venta";
        CalculoController(true,false,false);
    });
    document.getElementById("optAlquiler").addEventListener("click",function(){
        globalOption = "alquiler";
        CalculoController(false,true,false);
    });          
    
    document.getElementById("optN/A").addEventListener("click",EventListaController);
    document.getElementById("optVenta").addEventListener("click",EventListaController);
    document.getElementById("optAlquiler").addEventListener("click",EventListaController);

    document.getElementById("cbkTitulo").addEventListener("change", EventListaController);
    document.getElementById("cbkTransaccion").addEventListener("change", EventListaController);
    document.getElementById("cbkDescripcion").addEventListener("change", EventListaController);
    document.getElementById("cbkPrecio").addEventListener("change", EventListaController);
    document.getElementById("cbkNumPuertas").addEventListener("change", EventListaController);
    document.getElementById("cbkNumKms").addEventListener("change", EventListaController);
    document.getElementById("cbkPotencia").addEventListener("change", EventListaController);


    //inicio
    setTimeout(()=>document.getElementById("spinner").src = "../resources/spinner.gif",500);
    setTimeout(function(){
        TraerListadoController();
    },3000);
    document.getElementById("txtTitulo").focus();

};

//-------------------------------------------------------------------------------------------------

//eventos------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function EventGuardarSobreJSON_SERVER()
{
    if(AdministrarValidaciones())
        document.getElementById("formulario").preventDefault();
        else
        {
            let id = document.getElementById("txtId").value;
            if(id == "" || id == null)
            {
                AltaAutoAsync(id);
                TraerListadoController();

            }
            else
            {
                ModificacionAutoAsync(id);
                TraerListadoController();
            }
            LimpiarForm();
        }
}

function EventEliminarSobreJSON_SERVER()
{
    EliminarDBJSON(document.getElementById("txtId").value);
    console.log("JSON eliminado");
    TraerListadoController()
    LimpiarForm();
}

function EventClickFilas(e)
{
    if(!e.target.matches("td")) return; 
    RellenarFormController(e.target.parentNode.firstChild.textContent);
    document.getElementById("btnEliminar").style.display = "inline-block";
    document.getElementById("btnCancelar").style.display = "inline-block";
    console.log("Se ha hecho click y se ha rellenado el formulario con los datos");
}

function EventListaController(event)
{
    localStorage.removeItem("columnas");

    let array = Array();
    const titulo = document.getElementById("cbkTitulo");
    const transaccion = document.getElementById("cbkTransaccion");
    const descripcion = document.getElementById("cbkDescripcion");
    const precio = document.getElementById("cbkPrecio");
    const numPuertas = document.getElementById("cbkNumPuertas");
    const numKms = document.getElementById("cbkNumKms");
    const potencia = document.getElementById("cbkPotencia");

    if(titulo.checked == true)
        array.push("titulo");
    if(transaccion.checked == true)
        array.push("transaccion");
    if(descripcion.checked == true)
        array.push("descripcion");
    if(precio.checked == true)
        array.push("precio");
    if(numPuertas.checked == true)
        array.push("num_puertas");
    if(numKms.checked == true)
        array.push("num_KMs");
    if(potencia.checked == true)
        array.push("potencia");

    if(array.length != 0)
    {
        if(document.getElementById("divTablaFiltrada").hasChildNodes())
            document.getElementById("divTablaFiltrada").removeChild(document.getElementById("divTablaFiltrada").firstChild);
        localStorage.setItem("columnas",JSON.stringify(array));
        CrearTablaController(array,globalOption);
    }
    else
    {
        if(document.getElementById("divTablaFiltrada").hasChildNodes())
            document.getElementById("divTablaFiltrada").removeChild(document.getElementById("divTablaFiltrada").firstChild);
        else
            return;
    }
}


// funciones ---------------------------------------------------------------------------------------------------------------------------------------

function Crear_InsertarTablaDinamica(listado, DOMInsert)
{
    const tabla = document.createElement("table");
    tabla.setAttribute("class","tablaListado");
    //seccion thead
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    for(const key in listado[0])
    {
        const th = document.createElement("th");
        th.textContent = key;
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    tabla.appendChild(thead);
    //seccion tbody
    const tbody = document.createElement("tbody");
    
    listado.forEach(element => {
        const trBody = document.createElement("tr");
        for(const key in element)
        {
            const td = document.createElement("td");
            td.textContent = element[key];
            trBody.appendChild(td);
        }
        tbody.appendChild(trBody);
        tabla.appendChild(tbody);
    });
    document.getElementById(DOMInsert).appendChild(tabla);
}

function TraerListadoController()
{
    let data = [];

    const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            document.getElementById("spinner").src = "../resources/spinner.gif";  
            if (xhr.readyState == 4) 
            {
                if (xhr.status >= 200 && xhr.status < 299) 
                {
                    data = JSON.parse(xhr.responseText);
                    if(data.length != 0)
                    {
                        document.getElementById("divTabla").innerHTML = "";
                        Crear_InsertarTablaDinamica(data, "divTabla");
                        document.getElementById("spinner").src = "";
                        
                    }
                    else
                    {
                        document.getElementById("spinner").src = "";
                        document.getElementById("divTabla").innerHTML = "No hay elementos guardados";
                    }         
                        
                } 
                else 
                {
                    const statusText = xhr.statusText || "Ocurrio un error";
                    console.error(`Error: ${xhr.status} : ${statusText}`);
                }
                document.getElementById("spinner").src = "";
            }
        };
        xhr.open("GET", "http://localhost:5000/Autos"); 
        xhr.send();
}

function RellenarFormController(idLlenado)
{
    let data = [];

    const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            document.getElementById("spinner").src = "../resources/spinner.gif";  
            if (xhr.readyState == 4) 
            {
                if (xhr.status >= 200 && xhr.status < 299) 
                {
                    data = JSON.parse(xhr.responseText);
                    console.log(data);
                    if(data.length != 0)
                    {
                        data.forEach(element => {
                            if(element.id == idLlenado)
                            {
                                document.getElementById("txtId").value = element.id;
                                document.getElementById("txtId").style.display = "inline";
                                document.getElementById("txtTitulo").value = element.titulo;
                                document.querySelector('input[name="cboVenta"]:checked').value = element.transaccion;
                                document.getElementById("txtDescripcion").value = element.descripcion;
                                document.getElementById("txtPrecio").value = element.precio;
                                document.getElementById("txtPuertas").value = element.num_puertas;
                                document.getElementById("txtKm").value = element.num_KMs;
                                document.getElementById("txtPotencia").value = element.potencia;
                            }
                        });
                    }
                }
                else 
                {
                    const statusText = xhr.statusText || "Ocurrio un error";
                    console.error(`Error: ${xhr.status} : ${statusText}`);
                }
                document.getElementById("spinner").src = "";
            } 
        };
        xhr.open("GET", "http://localhost:5000/Autos"); 
        xhr.send();                 
            
        console.log(data);

}

const AltaAutoAsync = async (identificador) => {
    document.getElementById("spinner").src = "../resources/spinner.gif";

    let data = [];

    let id = identificador;
    let titulo = document.getElementById("txtTitulo").value;
    let transaccion = document.querySelector('input[name="cboVenta"]:checked').value
    let descripcion = document.getElementById("txtDescripcion").value;
    let precio = document.getElementById("txtPrecio").value;
    let puertas = document.getElementById("txtPuertas").value;
    let km = document.getElementById("txtKm").value;
    let potencia = document.getElementById("txtPotencia").value;
    
    let Auto  = new Anuncio_Auto(id,titulo,transaccion,descripcion,precio,puertas,km,potencia);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(Auto),
    };
    try {
        const res = await fetch("http://localhost:5000/Autos", options);

        if (!res.ok) {
          throw { error: res.status, statusText: res.statusText };
        }
        data = await res.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        document.getElementById("spinner").src = "";
      }
};

const ModificacionAutoAsync = async (identificador) => {
    document.getElementById("spinner").src = "../resources/spinner.gif";

    let data = [];

    let id = identificador;
    let titulo = document.getElementById("txtTitulo").value;
    let transaccion = document.querySelector('input[name="cboVenta"]:checked').value
    let descripcion = document.getElementById("txtDescripcion").value;
    let precio = document.getElementById("txtPrecio").value;
    let puertas = document.getElementById("txtPuertas").value;
    let km = document.getElementById("txtKm").value;
    let potencia = document.getElementById("txtPotencia").value;
    
    let Auto  = new Anuncio_Auto(id,titulo,transaccion,descripcion,precio,puertas,km,potencia);

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(Auto),
    };
    try {
        const res = await fetch(`http://localhost:5000/Autos/${id}`, options);

        if (!res.ok) {
          throw { error: res.status, statusText: res.statusText };
        }
        data = await res.json();
        console.log("Auto modificado: " +data);
      } catch (error) {
        console.error(error);
      } finally {
        document.getElementById("spinner").src = "";
      }
};

function EliminarDBJSON(key)
{
    let data = [];
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        document.getElementById("spinner").src = "../resources/spinner.gif";
        if (xhr.readyState == 4) {
          if (xhr.status >= 200 && xhr.status < 299) {
            data = JSON.parse(xhr.responseText);
            console.log("Auto eliminado: " +data);
          } else {
            const statusText = xhr.statusText || "Ocurrio un error";

            console.error(`Error: ${xhr.status} : ${statusText}`);
          }
          document.getElementById("spinner").src = "";
        }
      };
      xhr.open("DELETE", `http://localhost:5000/Autos/${key}`);
      xhr.send();
}

function LimpiarForm()
{
    document.getElementById("formulario").reset();
    document.getElementById("txtId").style.display = "none";

    document.getElementById("txtTitulo").removeAttribute("readonly");
    document.getElementById("btnCancelar").style.display = "none";
    document.getElementById("btnEliminar").style.display = "none";

}
// funciones 2do parcial ------------------------------------------------------------------------------------------------------------------------------


function CalculoController(venta = true, alquiler = false, na = false)
{
    let data = [];

    const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) 
            {
                if (xhr.status >= 200 && xhr.status < 299) 
                {
                    let promedio;
                    let maximo;
                    let minimo;
                    let promedioPotencia;
                    data = JSON.parse(xhr.responseText);
                    //caso que se quiera calcular promedio para la venta
                    if(venta == true && alquiler == false && na == false)
                    {
                        if(data.length != 0)
                        {
                            const dataFiltrada = FiltrarTransaccion_Filter(data,"venta");
                            promedio = CalcularPromedioController(dataFiltrada);
                            maximo = CalcularMaximoController(dataFiltrada).precio;
                            minimo = CalcularMinimoController(dataFiltrada).precio;
                            promedioPotencia = CalcularPromedioPotencia(dataFiltrada);
                            document.getElementById("txtPromedio").value = promedio;
                            document.getElementById("txtMaximo").value = maximo;
                            document.getElementById("txtMinimo").value = minimo;
                            document.getElementById("txtPromedioPotencia").value = promedioPotencia;
                        }
                        else
                        {
                            document.getElementById("txtPromedio").value = "";
                            document.getElementById("txtMaximo").value = "";
                            document.getElementById("txtMinimo").value = "";
                            document.getElementById("txtPromedioPotencia").value = "";
                        }
                    }
                    //caso que se quiera calcular promedio para el alquiler
                    else if(venta == false && alquiler == true && na == false)
                    {
                        if(data.length != 0)
                        {
                            const dataFiltrada = FiltrarTransaccion_Filter(data,"alquiler");
                            promedio = CalcularPromedioController(dataFiltrada);
                            maximo = CalcularMaximoController(dataFiltrada).precio;
                            minimo = CalcularMinimoController(dataFiltrada).precio;
                            promedioPotencia = CalcularPromedioPotencia(dataFiltrada);
                            document.getElementById("txtPromedio").value = promedio;
                            document.getElementById("txtMaximo").value = maximo;
                            document.getElementById("txtMinimo").value = minimo;
                            document.getElementById("txtPromedioPotencia").value = promedioPotencia;
                        }
                        else
                        {
                            document.getElementById("txtPromedio").value = "";
                            document.getElementById("txtMaximo").value = "";
                            document.getElementById("txtMinimo").value = "";
                            document.getElementById("txtPromedioPotencia").value = "";
                        }
                    }
                    else if(venta == false && alquiler == false && na == true)
                    {
                        if(data.length != 0)
                        {
                            const dataFiltrada = FiltrarTransaccion_Filter(data,"N/A");
                            promedio = CalcularPromedioController(dataFiltrada);
                            maximo = CalcularMaximoController(dataFiltrada).precio;
                            minimo = CalcularMinimoController(dataFiltrada).precio;
                            promedioPotencia = CalcularPromedioPotencia(dataFiltrada);
                            document.getElementById("txtPromedio").value = promedio;
                            document.getElementById("txtMaximo").value = maximo;
                            document.getElementById("txtMinimo").value = minimo;
                            document.getElementById("txtPromedioPotencia").value = promedioPotencia;
                        }
                        else
                        {
                            document.getElementById("txtPromedio").value = "";
                            document.getElementById("txtMaximo").value = "";
                            document.getElementById("txtMinimo").value = "";
                            document.getElementById("txtPromedioPotencia").value = "";
                        }
                    }
                    console.log("promedio: " +promedio);
                } 
                else 
                {
                    const statusText = xhr.statusText || "Ocurrio un error";

                    console.error(`Error: ${xhr.status} : ${statusText}`);
                }
            }
        };
        xhr.open("GET", "http://localhost:5000/Autos"); 
        xhr.send();
}

function CalcularPromedioController(data)
{
    let contador = 0;
    let sumado = 0;

    data.forEach(element => {
        contador++;
        sumado += parseFloat(element.precio);
    });
    return sumado / contador;
}
function CalcularMaximoController(data)
{
    return data.reduce(function(anterior,actual){
        if(anterior.precio < actual.precio)
            return actual;
        else
            return anterior;
    });
}
function CalcularMinimoController(data)
{
    return data.reduce(function(anterior,actual){
        if(anterior.precio > actual.precio)
            return actual;
        else
            return anterior;
    });
}
function CalcularPromedioPotencia(data)
{
    let contador = 0;
    let sumado = 0;

    data.forEach(element => {
        contador++;
        sumado += parseFloat(element.potencia);
    });
    return sumado / contador;
}


function CrearTablaController(arrayCheckboxs, filtroSeleccionado)
{
    let data = [];
    if(document.getElementById("divTablaFiltrada").hasChildNodes())
        document.getElementById("divTablaFiltrada").removeChild(document.getElementById("divTablaFiltrada").firstChild);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) 
        {
            if (xhr.status >= 200 && xhr.status < 299) 
            {
                data = JSON.parse(xhr.responseText);
                if(data.length != 0)
                {
                    const FiltroTransaccion = FiltrarTransaccion_Filter(data,filtroSeleccionado)
                    const dataFiltrada = FiltrarData_Map(FiltroTransaccion,arrayCheckboxs);
                    Crear_InsertarTablaDinamica(dataFiltrada,"divTablaFiltrada");
                    console.log(dataFiltrada);
                }
            } 
            else 
            {
                const statusText = xhr.statusText || "Ocurrio un error";

                console.error(`Error: ${xhr.status} : ${statusText}`);
            }
        }
    };
    xhr.open("GET", "http://localhost:5000/Autos"); 
    xhr.send();
}

function FiltrarData_Map(data,arrayCheckboxs)
{
    let dataFiltrada = data.map(function(element,indice,array)
    {
        let nuevoAuto = [];
        let flag = true;

        for(const key in element)
        {
            arrayCheckboxs.forEach(checkboxs => {
                if(checkboxs == key || key == "id" && flag == true)
                {
                    nuevoAuto[key] = element[key];
                    flag = false;
                }
            });
        }

        return nuevoAuto;
    });

    return dataFiltrada;
}

function FiltrarTransaccion_Filter(data,filtroSeleccionado)
{
    const dataFiltrada = data.filter(function(auto){
        if(auto["transaccion"] == filtroSeleccionado || filtroSeleccionado == "N/A")
            return auto;
    });

    return dataFiltrada;
}

//---------------------------------------------------------------------------------------------------
//validaciones de formulario
function ValidarCamposVacios(id) {
    var retorno = false;
    if (document.getElementById(id).value == "")
        retorno = true;
    return retorno;
}

function AdministrarSpanError(id, accion) {
    if (accion) {
        document.getElementById(id).style.display = "inline-block";
    }
    else {
        document.getElementById(id).style.display = "none";
    }
}

function VerificarSpans(){
    var retorno = false;
    var titulo = document.getElementById("spanTitulo").style.display;
    var descripcion = document.getElementById("spanDescripcion").style.display;
    var precio = document.getElementById("spanPrecio").style.display;
    var Puertas = document.getElementById("spanPuertas").style.display;
    var Km = document.getElementById("spanKm").style.display;
    var Potencia = document.getElementById("spanPotencia").style.display;
    if (titulo != "none" || descripcion != "none" || precio != "none" || Puertas != "none" || Km != "none" || Potencia != "none") {
        retorno = true;
    }
    return retorno;
}

function AdministrarValidaciones() {
    if (ValidarCamposVacios("txtTitulo"))
        AdministrarSpanError("spanTitulo", true);
    else
        AdministrarSpanError("spanTitulo", false);
    if (ValidarCamposVacios("txtDescripcion"))
        AdministrarSpanError("spanDescripcion", true);
    else
        AdministrarSpanError("spanDescripcion", false);
    if (ValidarCamposVacios("txtPrecio"))
        AdministrarSpanError("spanPrecio", true);
    else
        AdministrarSpanError("spanPrecio", false);
    if (ValidarCamposVacios("txtPuertas"))
        AdministrarSpanError("spanPuertas", true);
    else
        AdministrarSpanError("spanPuertas", false);
    if (ValidarCamposVacios("txtKm"))
        AdministrarSpanError("spanKm", true);
    else
        AdministrarSpanError("spanKm", false);
    if (ValidarCamposVacios("txtPotencia"))
        AdministrarSpanError("spanPotencia", true);
    else
        AdministrarSpanError("spanPotencia", false);
    if (VerificarSpans())
        return true;
    else
        return false;
}
//----------------------------------------------------------------------------------------------------



