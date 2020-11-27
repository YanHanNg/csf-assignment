import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Articles, TopHeadline } from '../model';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-news-countries',
  templateUrl: './news-countries.component.html',
  styleUrls: ['./news-countries.component.css']
})
export class NewsCountriesComponent implements OnInit {

  country: string;
  countryCode: string;
  apiKey: string;
  topHeadLines: TopHeadline = {
    countryCode: '',
    queryDate: new Date(),
    articles: []
  }

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private newsDB: NewsDatabase) { }

  ngOnInit(): void {
    this.country = this.activatedRoute.snapshot.params['country'];
    this.countryCode = this.activatedRoute.snapshot.params['countryCode'];
    //this.countryCode = this.countryCode.trim().toLowerCase();

    this.newsDB.getTopHeadLines(this.countryCode)
      .then(data => {
        
        if(data === null)
        {
          console.info('Fetching from URL');
          this.getTopHeadlineFromURL();
        }
        else
        {
          console.info('Fetching from Database');
          //Check the Data of the Request, if more than 5 min has passed requery
          let currDate = new Date();
          let allowedDate = new Date(data.queryDate);
          allowedDate.setMinutes(allowedDate.getMinutes() + 5);
          if(currDate < allowedDate)
          {
            console.info('Cached');
            this.topHeadLines = data;
            console.info(this.topHeadLines.articles.length);
          }
          else
          {
            console.info('Non Cached');
            //Delete from Database then Requery
            this.newsDB.deleteTopHeadLines(data.countryCode)
              .then(data => {
                console.info('Fetching from URL after Deleting from Cached');
                this.getTopHeadlineFromURL();
              })
          }
        }
      })
  }

  getTopHeadlineFromURL() {
    //Fetching API Key then Query
    this.newsDB.getApiKey()
      .then(apiKey => {
        return this.apiKey = apiKey;
      })
      .then(data => {
        let params = new HttpParams()
          .set('country', this.countryCode)
          .set('apiKey', this.apiKey);

        //Query for Results of the Country
        this.http.get('https://newsapi.org/v2/top-headlines', { params: params })
          .toPromise()
          .then(data => {
            this.topHeadLines = {
              countryCode: this.countryCode,
              queryDate: new Date(),
              articles: []
            }
            //@ts-ignore
            for(let d  of data.articles)
            {
              let article: Articles = {
                sourceName: d.source.name,
                author: d.author,
                title: d.title,
                description: d.description,
                url: d.url,
                image: d.urlToImage,
                publishedAt: d.publishedAt,
                content: d.content,
                saved: false
              }
              this.topHeadLines.articles.push(article);
            }
            this.newsDB.saveTopHeadLines(this.topHeadLines);
          })
      })
  }

}
