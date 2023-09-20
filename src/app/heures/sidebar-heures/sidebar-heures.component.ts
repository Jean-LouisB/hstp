import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-heures',
  templateUrl: './sidebar-heures.component.html',
  styleUrls: ['./sidebar-heures.component.css']
})
export class SidebarHeuresComponent implements OnInit{
@Input() alerte: number | undefined;


ngOnInit(): void {
    
}
}
