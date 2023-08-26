import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})

export class UserComponent implements OnInit , OnChanges{
@Input() users: any[] | undefined;
@Input() filter: boolean | undefined;
  

constructor(){
  
}
  ngOnChanges(changes: SimpleChanges): void {
    
  }

ngOnInit(){

}




}
