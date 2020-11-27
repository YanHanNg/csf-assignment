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
  topHeadLines: TopHeadline;

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private newsDB: NewsDatabase) { }

  ngOnInit(): void {
    this.country = this.activatedRoute.snapshot.params['country'];
    this.countryCode = this.activatedRoute.snapshot.params['countryCode'];
    this.countryCode = this.countryCode.trim().toLowerCase();

    this.newsDB.getApiKey()
      .then(apiKey => {
        console.info(apiKey);
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
              countryCode: this.country,
              queryDate: new Date(),
              articles: []
            }
            //@ts-ignore
            for(let d  of data.articles)
            {
              console.info(d);
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
            console.info(this.topHeadLines);
          })
      })
  }

}
