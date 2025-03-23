class Map {
    #map;
    #currentLat;
    #currentLong;
    #markers = {};

    constructor() {
        this.#currentLat = 41.3870; // Latitud predeterminada (Barcelona)
        this.#currentLong = 2.1699; // Longitud predeterminada (Barcelona)

        this.#getPosicioActual().then(() => {
            this.#inicialitzarMapa();
        }).catch((error) => {
            console.error("Error al obtener la posición actual:", error);
            this.#inicialitzarMapa();
        });
    }

    async #getPosicioActual() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.#currentLat = position.coords.latitude;
                        this.#currentLong = position.coords.longitude;
                        resolve();
                    },
                    (error) => {
                        console.error("Error en la geolocalización:", error);
                        reject(error);
                    }
                );
            } else {
                console.error("La geolocalización no está disponible en este navegador.");
                reject(new Error("Geolocalización no disponible"));
            }
        });
    }

    #inicialitzarMapa() {
        const mapCenter = [this.#currentLat, this.#currentLong];
        const zoomLevel = 12;

        this.#map = L.map('map').setView(mapCenter, zoomLevel);

        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        });
        tileLayer.addTo(this.#map);

        this.mostrarPuntInicial();
    }

    mostrarPuntInicial() {
        if (this.#currentLat && this.#currentLong) {
            this.mostrarPunt(this.#currentLat, this.#currentLong, "Estás aquí");
        }
    }

    actualitzarPosInitMapa(lat, lon) {
        this.#currentLat = lat;
        this.#currentLong = lon;
        this.#map.setView([lat, lon], this.#map.getZoom());
    }

    netejarMapa() {
        for (const id in this.#markers) {
            this.#map.removeLayer(this.#markers[id]);
        }
        this.#markers = {};
    }

    mostrarPunt(lat, long, desc = "") {
        const markerId = `${lat}-${long}`;
        const marker = L.marker([lat, long]).addTo(this.#map);

        if (desc) {
            marker.bindPopup(desc).openPopup();
        }

        this.#markers[markerId] = marker;
    }

    borrarPunt(id) {
        if (this.#markers[id]) {
            this.#map.removeLayer(this.#markers[id]);
            delete this.#markers[id];
            this.#map.invalidateSize();
        }
    }
}
