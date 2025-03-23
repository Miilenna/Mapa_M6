const dropZoneObj = document.querySelector(".dropZone");
let fitxer = [];
let puntInteres = [];
let tipusSelected = new Set([]);
let numId = 0;
const llistatDiv = document.getElementById('llocs');
const netejarButton = document.getElementById('netejar');
const puntsTotals = document.getElementById("numeroTotal");
const selectTipus = document.getElementById('tipus');
const selectOrdre = document.getElementById('ordre');
const filtreNomInput = document.getElementById('filtreNom');

filtreNomInput.addEventListener('input', function () {
    const valorFiltre = this.value.trim().toLowerCase(); 
    const tipusSeleccionat = selectTipus.value; 
    const ordreSeleccionat = selectOrdre.value; 
    filtrarPunts(tipusSeleccionat, ordreSeleccionat, valorFiltre); 
});
selectTipus.addEventListener('change', function () {
    const tipusSeleccionat = this.value;
    const ordreSeleccionat = selectOrdre.value; 
    filtrarPunts(tipusSeleccionat, ordreSeleccionat);
});
selectOrdre.addEventListener('change', function () {
    const ordreSeleccionat = this.value;
    const tipusSeleccionat = document.getElementById('tipus').value;
    filtrarPunts(tipusSeleccionat, ordreSeleccionat);
});

//-------------------------------------------------------------------------------//
function filtrarPunts(tipus, ordre, valorFiltre = "") {
    let puntsFiltrats;

    if (tipus === "tots") {
        puntsFiltrats = puntInteres;
    } else {
        puntsFiltrats = puntInteres.filter((punt) => punt.tipus.toLowerCase() === tipus);
    }

    if (valorFiltre !== "") {
        puntsFiltrats = puntsFiltrats.filter((punt) =>
            punt.nom.toLowerCase().includes(valorFiltre)
        );
    }
    const puntsOrdenats = ordenarPunts(puntsFiltrats, ordre);
    mapa.netejarMapa();
    mostrarLlistat(puntsOrdenats);
    contarPunts(puntsOrdenats);
    mostrarPuntsEnMapa(puntsOrdenats);
}

//-------------------------------------------------------------------------------//
function ordenarPunts(punts, ordre) {
    if (ordre === "ascendent") {
        return punts.slice().sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (ordre === "descendent") {
        return punts.slice().sort((a, b) => b.nom.localeCompare(a.nom));
    } else {
        return punts;
    }
}

//-------------------------------------------------------------------------------//
dropZoneObj.addEventListener("dragover", function (event) {
    event.preventDefault();
    console.log("dragover");
});

//-------------------------------------------------------------------------------//
dropZoneObj.addEventListener("drop", function (event) {
    event.preventDefault();
    console.log("drop");
    const files = event.dataTransfer.files;
    loadFile(files);
});

//-------------------------------------------------------------------------------//
const loadFile = async function (files) {
    if (files && files.length > 0) {
        const file = files[0];
        const extensio = file.name.split(".")[1];
        if (extensio.toLowerCase() === FILE_EXTENSION) {
            readCsv(file);
            console.log("El fitxer té un format correcte");
            const fitxer = await readCsv(file);
            console.log(fitxer);
            loadData(fitxer);
        } else {
            alert("El fitxer no té un format csv");
        }
        console.log(file);
    }
};

//-------------------------------------------------------------------------------//
const readCsv = function (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            fitxer = reader.result.trim().split("\n").slice(1);
            resolve(fitxer);
        };
        reader.onerror = () => {
            reject("Error reading the file. Please try again.", "error");
        };
        reader.readAsText(file, "UTF-8");
        console.log("El fitxer ha començat a carregar-se");
    });
};

//-------------------------------------------------------------------------------//
function filtrarPuntsPerTipus(tipus) {
    let puntsFiltrats;

    if (tipus === "tots") {
        puntsFiltrats = puntInteres;
    } else {
        puntsFiltrats = puntInteres.filter((punt) => punt.tipus.toLowerCase() === tipus);
    }

    mapa.netejarMapa();

    mostrarLlistat(puntsFiltrats);
    contarPunts(puntsFiltrats);
    mostrarPuntsEnMapa(puntsFiltrats); 
}

//-------------------------------------------------------------------------------//
function mostrarPuntsEnMapa(punts) {
    punts.forEach((punt) => {
        const descripcio = `
            <strong>${punt.nom}</strong><br>
            <strong>${punt.direccio}</strong><br>
            Puntuació: ${punt.puntuacio}
        `;
        mapa.mostrarPunt(punt.latitud, punt.longitud, descripcio);
    });
}

//-------------------------------------------------------------------------------//
const loadData = function (fitxer) {
    selectTipus.innerHTML = '<option value="tots">Tots</option>';
    fitxer.forEach((liniaCSV) => {
        numId++;
        const dades = liniaCSV.split(CHAR_CSV);
        const tipus = dades[TIPUS].toLowerCase(); 

        switch (tipus) {
            case "espai":
                console.log("Instancia objecte PuntInteres");
                const espaiObj = new PuntInteres(numId, false, dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIRECCIO], dades[TIPUS], dades[LAT], dades[LON], dades[PUNTUACIO]);
                puntInteres.push(espaiObj);
                break;

            case "museu":
                console.log("Instancia objecte Museu");
                const museuObj = new Museu(numId, false, dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIRECCIO], dades[TIPUS], dades[LAT], dades[LON], dades[PUNTUACIO], dades[HORARIS], dades[PREU], dades[MONEDA], dades[DESCRIPCIO]);
                puntInteres.push(museuObj);
                break;

            case "atraccio":
                console.log("Instancia objecte Atraccio");
                const atraccioObj = new Atraccio(numId, false, dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIRECCIO], dades[TIPUS], dades[LAT], dades[LON], dades[PUNTUACIO], dades[HORARIS], dades[PREU], dades[MONEDA]);
                puntInteres.push(atraccioObj);
                break;

            default:
                console.error(`Tipus no vàlid: ${tipus}`);
                throw new Error("Has afegit un tipus que no és correcte");
        }

        tipusSelected.add(dades[TIPUS]);
        getInfoCountry(dades[CODI], dades[CIUTAT]);
    });

    mostrarPuntsEnMapa(puntInteres);

    tipusSelected.forEach((tipus) => {
        const option = document.createElement('option');
        option.value = tipus.toLowerCase();
        option.textContent = tipus;
        selectTipus.appendChild(option);
    });
    

    console.log(puntInteres);
    renderitzaLlista(puntInteres); 
    contarPunts(puntInteres);
};

//-------------------------------------------------------------------------------//
const renderitzaLlista = function (llista) {
    llista.forEach((obj) => {
        switch (obj.tipus.toLowerCase()) {
            case "espai":
                if (typeof pintarEspai === "function") {
                    pintarEspai(obj);
                } else {
                    console.log("Error: La función pintarEspai no está definida.");
                }
                break;

            case "museu":
                if (typeof pintarMuseu === "function") {
                    pintarMuseu(obj);
                } else {
                    console.log("Error: La función pintarMuseu no está definida.");
                }
                break;

            case "atraccio":
                if (typeof pintarAtraccio === "function") {
                    pintarAtraccio(obj);
                } else {
                    console.log("Error: La función pintarAtraccio no está definida.");
                }
                break;

            default:
                console.log("Error: Has afegit un tipus que no és correcte", obj);
                throw new Error("Has afegit un tipus que no és correcte");
        }
    });
    mostrarLlistat(llista);
};


//-------------------------------------------------------------------------------//
const getInfoCountry = async function (bandera, ciutat) {
    try {
        const resposta = await fetch(`https://restcountries.com/v3.1/alpha/${bandera}`);

        if (!resposta.ok) {
            throw new Error(`Error ${resposta.status}`);
        }

        const dades = await resposta.json();
        const banderaUrl = dades[0].flags.png; 
        

        const imgBandera = document.getElementById('bandera');
        imgBandera.src = banderaUrl;
        const spanCiutat = document.getElementById('ciutat');
        spanCiutat.textContent = ciutat;

        return banderaUrl; 
    } catch (error) {
        console.error("Error", error);
    }
};
//-------------------------------------------------------------------------------//
function mostrarLlistat(punts) {
    
    if (punts.length === 0) {
        llistatDiv.innerHTML = "No hi ha informació a mostrar";
    } else {
        llistatDiv.innerHTML = punts.map((punt, index) => {
            let infoPunt = '';
            let color = '';

            switch (punt.tipus.toLowerCase()) {  
                case 'espai':
                    infoPunt = `
                        <strong>${punt.nom}</strong> | ${punt.ciutat}<br>
                        Tipus: ${punt.tipus}
                    `;
                    color = 'background-color: #7fffd4; border: 1px solid red;';
                    break;

                case 'atraccio':
                    infoPunt = `
                        <strong>${punt.nom}</strong> | ${punt.ciutat}<br>
                        Tipus: ${punt.tipus}<br>
                        Horaris: ${punt.horaris}<br>
                        Preu: ${punt.preu}${punt.moneda}<br>
                    `;
                    color = 'background-color: #e1ff7f; border: 1px solid red;';
                    break;

                case 'museu':
                    infoPunt = `
                        <strong>${punt.nom}</strong> | ${punt.ciutat}<br>
                        Tipus: ${punt.tipus}<br>
                        Horaris: ${punt.horaris}<br>
                        Preu: ${punt.preu}${punt.moneda}<br>
                        Descripció: ${punt.descripcio}
                    `;
                    color = 'background-color: #ffd37f; border: 1px solid red;';
                    break;
            }

            return `
                <div style="${color}">
                    ${infoPunt}
                    <button onclick="eliminarPunt(${punt.id})">Delete</button>
                </div>
            `;
        }).join('');
    }
}

//-------------------------------------------------------------------------------//
function eliminarPunt(id) {
    const confirmacio = confirm("Estàs segur que vols eliminar el punt d'interès?");
    if (!confirmacio) return;

    const index = puntInteres.findIndex((punt) => punt.id === id);
    if (index === -1) return;

    const puntEliminat = puntInteres.splice(index, 1)[0];
    mapa.borrarPunt(puntEliminat.latitud, puntEliminat.longitud); 
    mostrarLlistat(puntInteres);
    contarPunts(puntInteres);
}

//-------------------------------------------------------------------------------//
netejarButton.addEventListener('click', () => {
    puntInteres = []; 
    console.log(puntInteres);
    mostrarLlistat(puntInteres); 
    puntsTotals.innerHTML="Totals: " + 0;
});

//-------------------------------------------------------------------------------//
function contarPunts(punts){
    puntsTotals.innerHTML="Totals: " + punts.length;
}

//-------------------------------------------------------------------------------//

mostrarPuntsEnMapa(puntInteres);
contarPunts(puntInteres);
const mapa = new Map();
const excel = new Excel();