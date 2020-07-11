import { Component, OnInit, Inject } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../shared/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: Order[];
  displayedColumns: string[] = ['id', 'dishName', 'tableNumber', 'quantity'];
  constructor(private orderService: OrderService, @Inject('BaseURL') public BaseURL) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((orders) => {
      console.log(orders)
      this.orders = orders
    });
  }
}

