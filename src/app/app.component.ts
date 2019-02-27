import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Subscription} from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy{
    form: FormGroup;
    keys: string[];
    text;
    number;
    email;
    pattern;

    private subscription: Subscription;
    private subscriptions: Subscription[] = [];
    private invalidValues: Object;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
      this.form = this.fb.group({
        text: ['', Validators.minLength(3)],
        number: ['', Validators.min(50)],
        email: ['', Validators.email],
        pattern: ['', Validators.pattern('[0-9]*')]
      });

      this.invalidValues = {
        text: [],
        number: [],
        email: [],
        pattern: []
      }
      this.subscribeToForm();
    }

    subscribeToForm(): void {
      this.text = this.form.get('text');
      this.number = this.form.get('number');
      this.email = this.form.get('email');
      this.pattern = this.form.get('pattern');

      this.keys = Object.keys(this.invalidValues);
      this.keys.forEach((el) => {
        this.subscription = this[el].valueChanges
          .pipe(
            debounceTime(500)
          )
          .subscribe((val) => {
            if (this[el].invalid) {
              if (this.invalidValues[el].length === 2) {
                this.invalidValues[el].shift();
              }
              this.invalidValues[el].push(val);
            }
          });
          this.subscriptions.push(this.subscription);
      });
      
    }

    showInvalidValues(): void {
      console.log(this.invalidValues);
    }

    ngOnDestroy() {
      this.subscriptions.forEach((subscription)=>{
        subscription.unsubscribe();
      });
      this.subscriptions.length = 0;
    }
}
