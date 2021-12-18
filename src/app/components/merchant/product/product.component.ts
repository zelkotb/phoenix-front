import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor() { }

  selected : number;

  ngOnInit(): void {
    let index = localStorage.getItem("tabndex");
    if(index){
      this.selected = Number(index);
    }
  }

  saveIndex(event){
    localStorage.setItem("tabndex",event.toString());
  }

}
