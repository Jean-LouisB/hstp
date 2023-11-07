import { Component, OnInit } from '@angular/core';
import { heureDecToStr } from '@fabricekopf/date-france'
import { UserService } from 'src/app/core/services/users.service';



@Component({
  selector: 'app-sidebar-heures',
  templateUrl: './sidebar-heures.component.html',
  styleUrls: ['./sidebar-heures.component.css']
})
export class SidebarHeuresComponent implements OnInit {
  autoriseLaSaisie:boolean = false;
  constructor(
    private userService: UserService,
  ) {

  }

  ngOnInit(): void {
    this.getIfSaisieAllowed()
  }

  getIfSaisieAllowed(){
    this.userService.getAutorisationSaisie()
    .then((response: boolean)=>{
      this.autoriseLaSaisie = response;
    }
    )
  }


}

