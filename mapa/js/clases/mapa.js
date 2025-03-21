class Map{
    
    #map
    #currentLat;
    #currentLong;

    constructor(){
        this.#getPosicioActual();
        const mapCenter = [this.#currentLat,this.#currentLong]; // Coordinates for Barcelona, Spain 
        const zoomLevel = 12;
        this.#map = L.map('map').setView(mapCenter, zoomLevel); 
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' });
        tileLayer.addTo(this.#map); 

        ///por ver si va aqui
        const markerPosition = [41.3870, 2.1699]; // Example point in Barcelona 

        // Step 6: Create a marker and add it to the map
        const marker = L.marker(markerPosition).addTo(this.#map); 

        // Step 7: Add a popup to the marker
        const popupText = "This is a marker in Barcelona!"; 
        marker.bindPopup(popupText).openPopup(); 
    }


    mostrarPuntInicial(){
    }
       

    actualitzarPosInitMapa(lat,lon){
       
    }


    mostrarPunt(lat,long,desc=""){
       
    }

    borrarPunt(){

    }


    #getPosicioActual(){
        let lat = CURRENT_LAT;
        let lon = CURRENT_LNG;

        // Verifica si la geolocalización está disponible en el navegador
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
        
                // Coloca un marcador en la ubicación actual del usuario
                // L.marker([lat, lon]).addTo(map)
                //     .bindPopup("Estás aquí").openPopup();
        
                // // Centra el mapa en la ubicación actual
                // map.setView([lat, lon], 13);
            }, function (error) {
                console.error("Error en la geolocalización:", error);
            });

        } else {
            console.error("La geolocalización no está disponible en este navegador.");
        }

        this.#currentLat = lat;
        this.#currentLong = lon;
    }
}