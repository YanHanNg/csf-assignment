import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private newsDB: NewsDatabase, private router: Router) { }

  ngOnInit(): void {
    this.newsDB.checkApiKey().then(data => {
      if(data === true)
        this.router.navigate(['/countries']);
      else
        this.router.navigate(['/settings']);
    })
  }

}
