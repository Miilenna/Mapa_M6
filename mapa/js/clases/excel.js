class Excel {
    readCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                try {
                    const lines = reader.result.trim().split("\n"); 
                    const data = lines.map((line) => line.split(",")); 
                    resolve(data); 
                } catch (error) {
                    reject(new Error("Error processant el fitxer CSV."));
                }
            };
            
            reader.onerror = () => {
                reject(new Error("Error llegint el fitxer CSV."));
            };
            reader.readAsText(file); 
        });
    }

    getInfoCountry(codi, ciutat) {
        return new Promise(async (resolve, reject) => {
            try {
                const resposta = await fetch(`https://restcountries.com/v3.1/alpha/${codi}`);
                if (!resposta.ok) {
                    throw new Error(`Error ${resposta.status}: ${resposta.statusText}`);
                }

                const dades = await resposta.json();
                const pais = dades[0];

                resolve({
                    city: ciutat,
                    flag: pais.flags.png, 
                    lat: pais.capitalInfo.latlng[0], 
                    long: pais.capitalInfo.latlng[1], 
                });
            } catch (error) {
                reject(new Error(`Error obtenint informació del país: ${error.message}`));
            }
        });
    }
}