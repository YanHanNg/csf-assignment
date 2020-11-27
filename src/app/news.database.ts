import { Injectable } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import Dexie from 'dexie';
import { APIKey, Countries, TopHeadline } from './model';

@Injectable()
export class NewsDatabase extends Dexie {

    private key: Dexie.Table<APIKey, string>;
    private countries: Dexie.Table<Countries, string>;
    private topHeadline: Dexie.Table<TopHeadline, string>;

    constructor() {
        // Database Name
        super('NewsDB');

        //Setup Schema for V1
        this.version(1).stores({
            apiKey: "key",
            countries: "countryCode",
            topHeadline: "countryCode"
        })

        this.key = this.table('apiKey');
        this.countries = this.table('countries');
        this.topHeadline = this.table('topHeadline');
    }

    // async addApiKey(key: string) : Promise<any> {
    //     const apik: APIKey = {key: key, value: key};

    //     const resultsCount = await this.key.count();

    //     if(resultsCount <= 0)
    //     {
    //         return this.key.add(apik)
    //             .then(results => results)
    //     }
    //     else{
    //         this.key.clear();
    //         return this.key.add(apik)
    //             .then(results => results)
    //     }
    // }
    async addApiKey(key: string) : Promise<any> {
        const apik: APIKey = {key: key, value: key};

        const resultsCount = await this.key.where('key').equals(key).count();

        if(resultsCount <= 0)
        {
            return this.key.add(apik)
                .then(results => results)
        }
        //If there is already a record, ignore
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

    async deleteApiKey(key: string): Promise<any> {
        const resultsCount = await this.key.where('key').equals(key).count();

        if(resultsCount > 0)
        {
            return await this.key.where('key').equals(key).delete();
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

    async saveTopHeadLines(thl: TopHeadline) : Promise<any> {
        const resultsCount = await this.topHeadline.where('countryCode').equals(thl.countryCode)
            .count()

        if(resultsCount <= 0)
            return await this.topHeadline.add(thl);
        else
            return await this.topHeadline.put(thl);

    }

    async getTopHeadLines(countryCode: string) : Promise<TopHeadline> {
        const resultsCount = await this.topHeadline.where('countryCode').equals(countryCode)
            .count()

        if(resultsCount > 0)
            return await this.topHeadline.where('countryCode').equals(countryCode)
                .toArray()
                .then(data => {
                    return data[0] as TopHeadline;
                })
        else{
            return null as TopHeadline;
        }
    }

    async deleteTopHeadLines(countryCode: string) : Promise<any> {
        const resultsCount = await this.topHeadline.where('countryCode').equals(countryCode)
            .count()

        if(resultsCount > 0)
        {
            let record: TopHeadline = await this.topHeadline.where('countryCode').equals(countryCode)
                .toArray()
                .then(data => {
                    return data[0] as TopHeadline;
                });

            //Filter saved=true and only if there is record
            if(record.articles.length > 0)
                record.articles = record.articles.filter(d => d.saved === true)

            this.topHeadline.put(record);
        }
    }
}