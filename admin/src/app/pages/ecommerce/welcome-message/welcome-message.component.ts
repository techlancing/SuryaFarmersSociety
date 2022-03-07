import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome-message',
  templateUrl: './welcome-message.component.html',
  styleUrls: ['./welcome-message.component.scss']
})
export class WelcomeMessageComponent implements OnInit {
  employee: boolean;

  constructor(private activatedroute : ActivatedRoute) { }

  ngOnInit(): void {
    if(this.activatedroute.snapshot.data.type === 'employee') this.employee = true ;
    else this.employee = false;
  }

}
