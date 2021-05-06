import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-allretailers',
  templateUrl: './allretailers.component.html',
  styleUrls: ['./allretailers.component.scss']
})
export class AllretailersComponent implements OnInit {

  retailers: any;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  // page
  currentpage: number;
  constructor(private oAuthService: AuthenticationService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Retailers', active: true }];

    this.currentpage = 1;
    this.oAuthService.fngetRetailers().subscribe((retailers : any)=>{
      console.log('retailers',retailers);
      this.retailers = retailers.retailers;
  });
  }

}
