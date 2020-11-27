import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { APIKey, Countries } from './model';

@Injectable()
export class NewsDatabase extends Dexie {

    private key: Dexie.Table<APIKey, string>;
    private countries: Dexie.Table<Countries, string>;

    constructor() {
        // Database Name
        super('NewsDB');

        //Setup Schema for V1
        this.version(1).stores({
            apiKey: "key",
            countries: "countryCode"
        })

        this.key = this.table('apiKey');
        this.countries = this.table('countries');
    }

    async addApiKey(key: string) : Promise<any> {
        const apik: APIKey = {key: key, value: key};

        const resultsCount = await this.key.count();
        console.info(resultsCount);
        if(resultsCount <= 0)
        {
            return this.key.add(apik)
                .then(results => results)
        }
        else{
            this.key.clear();
            return this.key.add(apik)
                .then(results => results)
        }
    }

    async checkApiKey(): Promise<any> {
        const resultsCount = await this.key.count();

        if(resultsCount <= 0)
            return false;
        else
            return true;
    }

    async getApiKey(): Promise<string> {
        const resultsCount = await this.key.count();

        if(resultsCount <= 0)
            return "";
        else
        {
            return await this.key.toArray()
                .then(data => {
                    return data[0].value;
                });
        }
            
    }

    async saveCountries(countries: Countries[]) : Promise<any> {
        this.countries.clear();

        for(let country of countries)
        {
            await this.countries.add(country);
        }
    }

    async getSavedCountries() : Promise<Countries[]> {
        return this.countries.toArray()
        .then(data => {
            return data.map(d => {
                return {
                    countryCode: d.countryCode,
                    name: d.name,
                    flag: d.flag
                } as Countries
            })
        })
    }

}