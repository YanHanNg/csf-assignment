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
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.error('Error when adding APIKey:', err);
      })
  }

  deleteAPIKey() {
    this.newsDB.deleteApiKey(this.form.get('apiKey').value)
      .then(data => {
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.error('Error when deleting APIKey:', err);
      })
  }

  private createForm()  {
    return this.fb.group({
      apiKey: this.fb.control('', [Validators.required])
    })
  }

}
