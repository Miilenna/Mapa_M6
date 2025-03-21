class Museu extends PuntInteres {
    horaris;
    preu;
    moneda;
    desc;

    constructor(id, esManual, pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio, horaris, preu, moneda, desc) {
        super(id, esManual, pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio);
        this.horaris = horaris;
        this.preu = preu;
        this.moneda = moneda;
        this.desc = desc;
    }
    get preuIva(){
        const IVA_PAISOS = {
            'ES': 0.21
        };
        const iva = IVA_PAISOS[this.pais] || 0;
        if (this.preu === 0) {
            return "Entrada gratuïta";
        } else if (iva) {
            return `${(this.preu * (1 + iva)).toFixed(2)}${this.moneda} (IVA)`;
        } else {
            return `${this.preu.toFixed(2)}${this.moneda} (no IVA)`;
        }
    }
}