import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.models';
@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.scss']
})
export class AllusersComponent implements OnInit {
  users: any;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  // page
  currentpage: number;
  constructor(private oAuthService: AuthenticationService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'EndUsers', active: true }];

    this.currentpage = 1;
    this.oAuthService.fngetUsers().subscribe((users : any)=>{
      console.log('users',users);
      this.users = users.users;
  });
  }

}
