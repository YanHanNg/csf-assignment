import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Countries } from '../model';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  countries: Countries[] = [];

  constructor(private http: HttpClient, private newsDB: NewsDatabase) { }

  ngOnInit(): void {

    //Check DB if there is any Countries List
    this.newsDB.getSavedCountries()
      .then(data => {
        //Assign Data from DB to Countries Array
        this.countries = data;

        if(this.countries.length === 0)
        {
          console.info('Fetching Countries from URL');
          this.http.get('https://restcountries.eu/rest/v2/all')
            .toPromise()
            .then(results => {
              //@ts-ignore
              for(let result of results)
              {
                let country: Countries = {
                  countryCode: result.alpha2Code,
                  name: result.name,
                  flag: result.flag
                }
                this.countries.push(country);
              }
          })
          .then(data => {
            this.newsDB.saveCountries(this.countries);
          })
        }
      })
      .catch(err => {
        console.info(err);
      })
  }

}
