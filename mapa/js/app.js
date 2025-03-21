const dropZoneObj = document.querySelector(".dropZone");
let fitxer = [];
let puntInteres = [];
let tipusSelected = new Set([]);
let numId = 0;

const selectTipus = document.getElementById('tipus');

dropZoneObj.addEventListener("dragover", function (event) {
    event.preventDefault();
    console.log("dragover");
});

dropZoneObj.addEventListener("drop", function (event) {
    event.preventDefault();
    console.log("drop");
    const files = event.dataTransfer.files;
    loadFile(files);
});

const loadFile = async function (files) {
    if (files && files.length > 0) {
        const file = files[0];
        const extensio = file.name.split(".")[1];
        if (extensio.toLowerCase() === FILE_EXTENSION) {
            readCsv(file);
            console.log("El fitxer té un format correcte");
            const fitxer = await readCsv(file);
            loadData(fitxer);
            getInfoCountry();
            console.log(fitxer);
        } else {
            alert("El fitxer no té un format csv");
        }
        console.log(file);
    }
};

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

const loadData = function (fitxer) {
    selectTipus.innerHTML = '<option value="tots">Tots</option>';

    fitxer.forEach((liniaCSV) => {
        numId++;
        const dades = liniaCSV.split(CHAR_CSV);
        console.log(dades[TIPUS]);

        switch (dades[TIPUS].toLowerCase()) {
            case "espai":
                console.log("Instancia objecte PuntInteres");
                const espaiObj = new PuntInteres(numId, false, dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIRECCIO], dades[TIPUS],  dades[LAT], dades[LON], dades[HORARIS], dades[PREU], dades[DESCRIPCIO], dades[PUNT], dades[MONEDA]);
                puntInteres.push(espaiObj);
                break;

            case "museu":
                console.log("Instancia objecte Museu");
                const museuObj = new Museu(numId, false, dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIRECCIO], dades[TIPUS],  dades[LAT], dades[LON], dades[HORARIS], dades[PREU], dades[DESCRIPCIO], dades[PUNT], dades[MONEDA]);
                puntInteres.push(museuObj);
                break;

            case "atraccio":
                console.log("Instancia objecte Atraccio");
                const atraccioObj = new Atraccio(numId, false, dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIRECCIO], dades[TIPUS],  dades[LAT], dades[LON], dades[HORARIS], dades[PREU], dades[DESCRIPCIO], dades[PUNT], dades[MONEDA]);
                puntInteres.push(atraccioObj);
                break;

            default:
                throw new Error("Has afegit un tipus que no és correcte");
        }

        tipusSelected.add(dades[TIPUS]);
    });

    tipusSelected.forEach((tipus) => {
        const option = document.createElement('option');
        option.value = tipus.toLowerCase();
        option.textContent = tipus;
        selectTipus.appendChild(option);
    });

    console.log(puntInteres);
    renderitzaLlista(puntInteres); 
};

const pintarEspai = function (obj) {
    const pi = document.createElement("div");
};

const pintarMuseu = function (obj) {
};

const pintarAtraccio = function (obj) {
};

const renderitzaLlista = function (llista) {
    llista.forEach((obj) => {
        switch (obj.tipus.toLowerCase()) {
            case "espai":
                pintarEspai(obj);
                break;

            case "museu":
                pintarMuseu(obj);
                break;

            case "atraccio":
                pintarAtraccio(obj);
                break;

            default:
                throw new Error(() => {
                    alert("Has afegit un tipus que no és correcte");
                });
        }
    });
};

const getInfoCountry = async function (bandera) {
    try {
        const resposta = await fetch(`https://restcountries.com/v3.1/alpha/${bandera}`);

        if (!resposta.ok) {
            throw new Error(Error `${resposta.status}`);
        }

        const dades = await resposta.json();
        const bandera = dades[0].flags.png;
        return bandera;
    } catch (error) {
        console.error("Error", error);
    }
};

const mapa = new Map();