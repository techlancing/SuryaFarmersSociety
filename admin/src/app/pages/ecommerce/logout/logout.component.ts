import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private oAuthenticationService : AuthenticationService) { }

  ngOnInit(): void {
    this.oAuthenticationService.logout();
  }

}
