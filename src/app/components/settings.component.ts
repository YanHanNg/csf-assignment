import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  form: FormGroup;

  constructor(private newsDB: NewsDatabase, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.form = this.createForm();
  }

  addAPIKey() {
    this.newsDB.addApiKey(this.form.get('apiKey').value)
      .then(data => {
        this.router.navigate(['/countries']);
      })
  }

  private createForm()  {
    return this.fb.group({
      apiKey: this.fb.control('', [Validators.required])
    })
  }

}
