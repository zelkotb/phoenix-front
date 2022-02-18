import { Component, OnInit, ViewChild } from '@angular/core';
import { HistoryComponent } from '../history/history.component';
import { OrderInDistributionComponent } from '../order-in-distribution/order-in-distribution.component';
import { OrderInWaitToPickUpComponent } from '../order-in-wait-to-pick-up/order-in-wait-to-pick-up.component';
import { OrderInWaitComponent } from '../order-in-wait/order-in-wait.component';
import { OrderPickedUpComponent } from '../order-picked-up/order-picked-up.component';
import { OrderRefusedOrCanceledComponent } from '../order-refused-or-canceled/order-refused-or-canceled.component';
import { OrderShippedComponent } from '../order-shipped/order-shipped.component';
import { OrderValidatedComponent } from '../order-validated/order-validated.component';
import { OrderReturnedComponent } from '../order-returned/order-returned.component';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order-admin.component.html',
  styleUrls: ['./order-admin.component.css']
})
export class OrderAdminComponent implements OnInit {

  @ViewChild(OrderInWaitComponent) orderInWaitComponent;
  @ViewChild(OrderInWaitToPickUpComponent) orderInWaitToPickUpComponent;
  @ViewChild(OrderPickedUpComponent) orderPickedUpComponent;
  @ViewChild(OrderShippedComponent) orderShippedComponent;
  @ViewChild(OrderInDistributionComponent) orderInDistributionComponent;
  @ViewChild(HistoryComponent) historyComponent;
  @ViewChild(OrderValidatedComponent) orderValidatedComponent;
  @ViewChild(OrderRefusedOrCanceledComponent) orderRefusedOrCanceledComponent;
  @ViewChild(OrderReturnedComponent) orderReturnedComponent;

  constructor() { }

  selected : number;
  
  ngOnInit(): void {
    let index = localStorage.getItem("tabndexOrderAdmin");
    if(index){
      this.selected = Number(index);
    }
  }

  saveIndex(event){
    localStorage.setItem("tabndexOrderAdmin",event.toString());
    if(event === 0){
      this.orderInWaitComponent.refresh();
    } else if(event === 1){
      this.orderInWaitToPickUpComponent.refresh();
    } else if(event === 2){
      this.orderPickedUpComponent.refresh();
    }else if(event === 3){
      this.orderShippedComponent.refresh();
    }else if(event === 4){
      this.orderInDistributionComponent.refresh();
    }else if(event === 5){
      this.orderRefusedOrCanceledComponent.refresh();
    }else if(event === 6){
      this.orderValidatedComponent.refresh();
    }else if(event === 7){
      this.historyComponent.refresh();
    }else if(event === 8){
      this.orderReturnedComponent.refresh();
    }
  }

}
