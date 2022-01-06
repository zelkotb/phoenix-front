import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor() { }

  selected : number;

  ngOnInit(): void {
    let index = localStorage.getItem("tabndexOrder");
    if(index){
      this.selected = Number(index);
    }
  }

  saveIndex(event){
    localStorage.setItem("tabndexOrder",event.toString());
  }

}
