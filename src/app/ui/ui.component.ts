import { Component, OnInit } from '@angular/core';
import { CurrencyModel } from 'src/models/currency';
import { DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';




@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UIComponent implements OnInit {
  closeResult?: string;
  currentDate: any;
  currentYear: any;
  currentMonth: any;
  currentDay: any;
  observable: any;
  multiplicator: number = 1;


  selectedCurrenciesForAddToArray: CurrencyModel[] = [];

  selectedDate: NgbDateStruct = { year: 9999, month: 99, day: 99 };

  selectedCurrency: CurrencyModel = new CurrencyModel();

  selectedCurrencies: CurrencyModel[] = [

  ];
  //array cu toate datele de intrare
  allCurrencies: CurrencyModel[] = [
    new CurrencyModel(1, "€", "/assets/eu_flag.jpg", "Euro", "EUR"),
    new CurrencyModel(2, "L", "/assets/Albanian lek.png", "Albanian lek", "ALL"),
    new CurrencyModel(3, "$", "/assets/Argentine peso.png", "Argentine peso", "ARS"),
    new CurrencyModel(4, "$", "/assets/Canadian dollar.png", "Canadian dollar", "CAD"),
    new CurrencyModel(5, "£", "/assets/British pound.png", "British pound", "GBP"),
    new CurrencyModel(6, "$", "/assets/United States dollar.png", "United States dollar", "USD"),
    new CurrencyModel(7, "₦", "/assets/Nigerian naira.png", "Nigerian naira", "NGN"),
    new CurrencyModel(8, "B/.", "/assets/Panamanian balboa.png", "Panamanian balboa", "PAB"),
    new CurrencyModel(9, "lei", "/assets/Romanian leu.png", "Romanian leu", "RON"),
    new CurrencyModel(10, "₽", "/assets/Russian ruble.png", "Russian ruble", "RUB"),
    new CurrencyModel(11, "﷼", "/assets/Saudi riyal.png", "Saudi riyal", "SAR"),
    new CurrencyModel(12, "дин. or din.", "/assets/Sri Lankan rupee.png", "Sri Lankan rupee", "RSD"),
    new CurrencyModel(13, "Rs, රු or ரூ", "/assets/Swedish krona.png", "Swedish krona", "LKR"),
    new CurrencyModel(14, "kr", "/assets/Panamanian balboa.png", "Panamanian balboa", "SEK"),
    new CurrencyModel(15, "$", "/assets/New Taiwan dollar.png", "New Taiwan dollar", "TWD"),
    new CurrencyModel(16, "₴", "/assets/Ukrainian hryvnia.png", "Ukrainian hryvnia", "UAH"),








  ];
  constructor(private datePipe: DatePipe, private modalService: NgbModal,
    private http: HttpClient) {
    this.setCurrentDate();

  }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }




  closeDiv(element: any) {
    let index = this.selectedCurrenciesForAddToArray.indexOf(element);
    this.selectedCurrencies.splice(index, 1);
    this.selectedCurrenciesForAddToArray.splice(index, 1);
  }

  // metoda folosita pentru a taia decimalele in plus
  set2Decimals() {
    this.selectedCurrencies.forEach(c => {
      c.vRaportataLaValutaSelectata = Math.round((c.vRaportataLaValutaSelectata + Number.EPSILON) * 100) / 100;
      c.vMultiplicata = Math.round((c.vMultiplicata + Number.EPSILON) * 100) / 100;
    })

  }
  //metoda folosita pentru a calcula valoarea in raport cu valoarea unitara a valutei selectate
  calculeazaValoareaInRaportCuValutaSelectata() {
    this.selectedCurrencies.forEach(c => {
      c.vRaportataLaValutaSelectata = this.selectedCurrency.vUnitaraInEuro / c.vUnitaraInEuro;
      c.vMultiplicata = this.selectedCurrency.vMultiplicata * c.vRaportataLaValutaSelectata;
      c.vRaportataLaValutaSelectata = 1 / c.vRaportataLaValutaSelectata;

    })
  }
  // metoda folosita pentru a deduce valoarea unitara a elementelor din array in euro
  calculeazaValoareaUnitaraInEuro() {
    this.selectedCurrencies.forEach(c => {
      c.vUnitaraInEuro = 1 / c.valoareRaportataLaEuro;
      console.log(c.vUnitaraInEuro);
    })


  }
  // metoda folosita pentru a adauga elementele din lista de adaugare in array-ul cu valutele selectate pentru afisat
  addAllToArray() {
    this.selectedCurrencies = [];
    this.selectedCurrenciesForAddToArray.forEach((cToAdd: any) => {
      this.selectedCurrencies.push(cToAdd);
    });
    // this.selectedCurrenciesForAddToArray = [];
  }
  // metoda verifica daca arrayul include un element. Este utilizata inpreuna cu *ngIf pentru a schimba aspectul casutelor selectate
  checkIfExists(element: any) {
    return this.selectedCurrenciesForAddToArray.includes(element);

  }
  // metoda adauga elemente intr-o lista temporara
  addToSelectedCurrenciesForAddToArray(element: any) {
    if (this.selectedCurrenciesForAddToArray.includes(element) == false) {
      this.selectedCurrenciesForAddToArray.push(element)

    } else if (this.selectedCurrenciesForAddToArray.includes(element)) {
      let index = this.selectedCurrenciesForAddToArray.indexOf(element);
      this.selectedCurrenciesForAddToArray.splice(index, 1);
    }

  }

  selectAll() {
    this.allCurrencies.forEach(c => {
      if (this.selectedCurrenciesForAddToArray.includes(c) == false) {
        this.selectedCurrenciesForAddToArray.push(c)
      }
    });
  }
  deselectAll() {
    this.selectedCurrenciesForAddToArray = [];
  }


  //modifica clasa pentru divul selectat
  setCssClassForSelectedDiv(currency: CurrencyModel) {
    this.selectedCurrencies.forEach(c => {
      document.getElementById("cardDivId" + c.id)?.setAttribute("class", "cardDiv");
      c.isSelected = false
    })
    currency.isSelected = true;
    document.getElementById("cardDivId" + currency.id)?.setAttribute("class", "selectedDiv");
  }

  //metoda este aplicata cu (click) pentru toate valutele afisate, aceasta metoda pregateste datele de intrare pentru 
  //functia getRatesAjax() pe care la urma o apeleaza
  selectCurrencyMethod(currency: CurrencyModel) {
    this.setCssClassForSelectedDiv(currency);
    this.selectedCurrency = currency;
    let date = this.formatDateAsString();
    let symbols = this.formatSymbols();
    this.getRatesAjax(date, symbols);
  }

  //metoda salveaza valoarea raportata in euro pentru fiecare element din array, valorile luandule din observable, unde sunt stocate dupa efectuarea
  //apelului catre API
  setSelectedCurrencies() {
    this.selectedCurrencies.forEach((c) => {
      c.valoareRaportataLaEuro = this.observable.rates[c.abreviereDenumireValuta];
      console.log(this.observable.rates[c.abreviereDenumireValuta]);
    })
  }
  //metoda pregateste un string acceptat de formatul de url pe care se face GET
  formatSymbols() {
    let symbols = "";
    this.selectedCurrencies.forEach((element) => {
      symbols += element.abreviereDenumireValuta + ","
    });
    symbols = symbols.substring(0, symbols.length - 1);
    return symbols;
  }


  setCurrentDate() {
    this.currentDate = new Date();
    this.currentDate = this.datePipe.transform(this.currentDate, "yyyy-MM-dd");
    this.currentYear = this.datePipe.transform(this.currentDate, "yyyy");
    this.currentMonth = this.datePipe.transform(this.currentDate, "MM");
    this.currentDay = this.datePipe.transform(this.currentDate, "dd");
    this.selectedDate = { year: (Number(this.currentYear)), month: (Number(this.currentMonth)), day: (Number(this.currentDay)) };
  }
  //metoda pregateste un string acceptat de formatul de url pe care se face GET

  formatDateAsString() {
    let stringDate = this.selectedDate?.year + "-";
    if (this.selectedDate?.month < 10) {
      stringDate += "0" + this.selectedDate?.month + "-";
    } else {
      stringDate += this.selectedDate?.month + "-";
    }
    if (this.selectedDate?.day < 10) {
      stringDate += "0" + this.selectedDate?.day + "-";
    } else {
      stringDate += this.selectedDate?.day + "-";
    };
    return stringDate;
  }
  // metoda face un request de tip get pe API-ul exchangeratesapi pentru a primi datele necesare
  //acestea sunt pe urma salvate in observable dupa care se executa un sir de functii pentru a procesa datele primite
  getRatesAjax(date: string, symbols: string) {
    let accessKey = "access_key=f962f18feb580641a53e4a2179b846d2";
    let uri = "http://api.exchangeratesapi.io/v1/" + date + "?" + accessKey + "&symbols=" + symbols + "&format=2";
    var xhttp = new XMLHttpRequest();
    let result: any;
    console.log(uri);
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("get success");
        result = JSON.parse(this.responseText);
        console.log(result);
        return result;
      }
    };
    xhttp.open("GET", uri, true);
    xhttp.send();
    setTimeout(() => {
      this.observable = result;
      this.setSelectedCurrencies();
      this.calculeazaValoareaUnitaraInEuro();
      this.calculeazaValoareaInRaportCuValutaSelectata();
      this.set2Decimals();
    }, 400);
  }

  ngOnInit(): void {
  }


}


