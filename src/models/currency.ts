export class CurrencyModel {
    constructor(
        public id?:number,
        public simbol?: any,
        public steagulTarii?: any,
        public denumireValuta?: any,
        public abreviereDenumireValuta?: any,
        public valoareRaportataLaEuro?: any,
        public isSelected?: any,
        public vUnitaraInEuro?: any,
        public vRaportataLaValutaSelectata?: any,
        public vMultiplicata: any = 1

    ) { }
}