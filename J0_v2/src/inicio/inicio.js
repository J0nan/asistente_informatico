function cargar_apartados(ruta, intentado=0){
    fetch(ruta)
    .then(response => response.text())
    .then(contenido => {
        const lista = document.getElementById("lista");
        const filas = contenido.split('\n');
        filas.forEach(fila => {
            let a = document.createElement("a");
            fila = fila.replace(/[\r\n]+/gm, "" ); //Contine tanto el titulo como el HTML si lo hubiera
            linea_separada = fila.split('['); //Separamos el titulo con el HTML
            if (linea_separada.length==1) {
                a.setAttribute('href',encodeURI(`./src/instruccion.html?titulo=${linea_separada}&paso=1`));
            } else {
                nombre_html=linea_separada[1].substr(0,linea_separada[1].indexOf(']'))
                if(nombre_html==""||nombre_html.substr(-5)!=".html"){
                    console.error("Sintaxis del contenido erroneo en la linea: "+fila)
                } else {
                    parametros=linea_separada[1].split('<=')[1];
                    var href_parametros;
                    if (parametros!=undefined) {
                        //Hay parametros
                        var sURLVariables = parametros.split('&');

                        for(var i = 0; i<sURLVariables.length; i++){
                            console.log(sURLVariables[i])
                            var sParameterName = sURLVariables[i].split('=');
                            if(sParameterName[1][0]=='{'){
                                console.log(1)
                                if(i==0){
                                    console.log("Esta ??")
                                    href_parametros = sParameterName[0];
                                } else {
                                    href_parametros += eval(`${sParameterName[1].substr(1,sParameterName[1].indexOf('}'))}`);
                                }
                                href_parametros += '=';
                                href_parametros += sParameterName[1];
                            } else {
                                console.log(2)
                                if(i==0){
                                    href_parametros = sURLVariables[i];
                                } else {
                                    href_parametros += sURLVariables[i];
                                }
                            }
                        }
                        a.setAttribute('href',encodeURI(`./src/${nombre_html}?${parametros}`));
                    } else {
                        console.log("ESTA UNDEFINED")
                        a.setAttribute('href',encodeURI(`./src/${nombre_html}?titulo=${linea_separada[0]}`));
                    }
                    console.log(parametros)
                }
            }
            a.setAttribute('class',"list-group-item list-group-item-action");
            a.textContent = linea_separada[0]
            lista.appendChild(a)
            // console.log(linea_separada[0])
        });
    })
    .catch(e => {
        console.error("Error "+e);
        if( intentado == 0){
            console.warn("Probando con ruta completa al archivo de contenido: "+URL_GITHUB_PAGES+"/res/contenido.txt");
            cargar_apartados(URL_GITHUB_PAGES+'/res/contenido.txt',1)
        }
    });
}

function GetURLParameters(sParam){
    var sPageURL = decodeURIComponent(window.location.search.substring(1));
    var sURLVariables = sPageURL.split('&');
    for(var i = 0; i<sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if(sParameterName[0]==sParam){
            return sParameterName[1];
        }
    }
}