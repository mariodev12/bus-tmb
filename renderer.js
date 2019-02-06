const config = {
    'appId': 'appId',
    'apiKey': 'apiKey'
}

window.onload = () => {
    get();
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

setInterval(() => {
    get()
}, 30000);