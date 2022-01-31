import { Component, OnInit, ViewChild } from '@angular/core';
import { ListOrderComponent } from '../list-order/list-order.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  @ViewChild(ListOrderComponent) listOrderComponent;
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
    if(event === 1){
      this.listOrderComponent.refresh();
    }
  }

}
