const config = require('./config.js')

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
            console.log(bus)
            setTimeout(() => {
                if (arrayLength > 0) {
                    document.querySelector('.time').innerHTML = bus.data.ibus[0]["text-ca"]
                } else {
                    document.querySelector('.time').innerHTML = "No information"
                }
            }, 3000);
        })
}

const changeParadasSelected = (id) => {
    const value = id.value
    const values = value.split(' - ');
    console.log(values[0])
    console.log(values[1])
    get(values[0], values[1])
    console.log(value)
}

const paradas = (id) => {
    fetch(`https://api.tmb.cat/v1/transit/linies/bus/${id}/trajectes/parades?app_id=${config.appId}&app_key=${config.apiKey}&cql_filter=(TIPUS_PAQUET+IN+(1)+AND+ID_SENTIT+IN+(1))&sortBy=ORDRE`)
        .then(data => data.json())
        .then((paradas) => {
            const container = document.querySelector('.paradas');
            container.innerHTML = "";
            const selector = document.createElement('select');
            const options = document.createElement('option');
            options.text = "Selecciona una parada"
            container.appendChild(selector);
            selector.appendChild(options);
            selector.onchange = function(){ changeParadasSelected(this);};
            return paradas.features.map((item) => {
                const options = document.createElement('option');
                const textNode = document.createTextNode(item.properties.NOM_PARADA)
                options.value = `${item.properties.CODI_LINIA} - ${item.properties.CODI_PARADA}`
                options.appendChild(textNode);
                selector.appendChild(options);
                console.log(item.properties.CODI_PARADA, item.properties.CODI_LINIA, item.properties.NOM_LINIA)
            })
        })
}

const changeBusesSelected = (id) => {
    const value = id.value
    paradas(value)
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
