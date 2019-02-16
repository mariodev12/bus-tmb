const config = require('./config/config.js')

window.onload = () => {
    buses();
    //paradas();
}

const get = (idLinia, idParada) => {
    console.log(idLinia,idParada)
    
    fetch(`https://api.tmb.cat/v1/ibus/lines/${idLinia}/stops/${idParada}?app_id=${config.appId}&app_key=${config.apiKey}`)
        .then(data => data.json())
        .then((bus) => {
            const arrayLength = bus.data.ibus.length;

            if (arrayLength > 0) {
                document.querySelector('.time').innerHTML = bus.data.ibus[0]["text-ca"]
            } else {
                document.querySelector('.time').innerHTML = "Sin información"
            }
        })
}

const changeParadasSelected = (id) => {
    const value = id.value
    const values = value.split(' - ');
    get(values[0], values[1])
}

const paradas = (id, direction=1, classDiv) => {
    fetch(`https://api.tmb.cat/v1/transit/linies/bus/${id}/trajectes/parades?app_id=${config.appId}&app_key=${config.apiKey}&cql_filter=(TIPUS_PAQUET+IN+(1)+AND+ID_SENTIT+IN+(${direction}))&sortBy=ORDRE`)
        .then(data => data.json())
        .then((paradas) => {
            const container = document.querySelector(classDiv);
            container.innerHTML = "";
            const textDirection = document.createElement('h4')
            textDirection.innerHTML = `De ${paradas.features[0].properties.DESTI_TRAJECTE} a ${paradas.features[0].properties.ORIGEN_TRAJECTE}`
            textDirection.setAttribute('class', "text-parada");
            container.appendChild(textDirection);
            const selector = document.createElement('select');
            const options = document.createElement('option');
            options.text = "Selecciona una parada"
            container.appendChild(selector);
            selector.appendChild(options);
            selector.onchange = function(){ changeParadasSelected(this);};
            return paradas.features.slice(0).reverse().map((item) => {
                const options = document.createElement('option');
                const textNode = document.createTextNode(item.properties.NOM_PARADA)
                options.value = `${item.properties.CODI_LINIA} - ${item.properties.CODI_PARADA}`
                options.appendChild(textNode);
                selector.appendChild(options);
            })
        })
}

const changeBusesSelected = (id) => {
    const value = id.value
    paradas(value, 1, ".ida")
    paradas(value, 2, ".vuelta")
}

const buses = () => {
    fetch(`https://api.tmb.cat/v1/transit/linies/bus/?app_id=${config.appId}&app_key=${config.apiKey}&cql_filter=(CODI_FAMILIA+IN+(1,3,5,6,7))&propertyName=CODI_LINIA,ID_LINIA,NOM_LINIA,DESC_LINIA,ORIGEN_LINIA,DESTI_LINIA,NOM_TIPUS_TRANSPORT,ORDRE_FAMILIA,COLOR_LINIA,COLOR_TEXT_LINIA,ID_OPERADOR`)
        .then(data => data.json())
        .then((bus) => {
            const container = document.querySelector('.bus');
            container.innerHTML = ""
            const selector = document.createElement('select');
            const options = document.createElement('option');
            options.text = "Selecciona una linea de autobus"
            container.appendChild(selector);
            selector.appendChild(options);
            selector.onchange = function(){ changeBusesSelected(this);};
            return bus.features.map((item) => {
                const options = document.createElement('option');
                const textNode = document.createTextNode(item.properties.NOM_LINIA)
                options.value = item.properties.CODI_LINIA 
                options.appendChild(textNode);
                selector.appendChild(options);
            })
        })
}
