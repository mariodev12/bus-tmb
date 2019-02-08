const config = {
    'appId': '',
    'apiKey': ''
}

window.onload = () => {
    get();
    paradas();
}

const get = () => {
    fetch(`https://api.tmb.cat/v1/ibus/lines/6/stops/3256?app_id=${config.appId}&app_key=${config.apiKey}`)
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

const paradas = () => {
    fetch(`https://api.tmb.cat/v1/transit/linies/bus/212/trajectes/parades?app_id=${config.appId}&app_key=${config.apiKey}&cql_filter=(TIPUS_PAQUET+IN+(1)+AND+ID_SENTIT+IN+(1))&sortBy=ORDRE`)
        .then(data => data.json())
        .then((paradas) => {
            const container = document.querySelector('.container');
            const selector = document.createElement('select');
            container.appendChild(selector);
            return paradas.features.map((item) => {
                const options = document.createElement('option');
                const textNode = document.createTextNode(item.properties.NOM_PARADA)
                options.appendChild(textNode);
                selector.appendChild(options);
                console.log(item.properties.CODI_PARADA, item.properties.CODI_LINIA, item.properties.NOM_LINIA)
            })
        })
}

setInterval(() => {
    get()
}, 30000);