import { Routes } from '@angular/router';

import { MenuComponent } from '../menu/menu.component';
import { DishdetailComponent } from '../dishdetail/dishdetail.component';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { OrderComponent } from '../order/order.component';

export const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: 'menu',     component: MenuComponent },
  { path: 'about',     component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'contactus',     component: ContactComponent },
  { path: 'orders',     component: OrderComponent },
  { path: 'dishdetail/:id',     component: DishdetailComponent },
];
