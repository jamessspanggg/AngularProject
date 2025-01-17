import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    flyInOut(),
    expand()
  ],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  }
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  promotionErrMess: string;
  leaderErrMess: string;
  constructor(private dishService: DishService, private promotionService: PromotionService, private leaderService: LeaderService, @Inject('BaseURL') public BaseURL) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish().subscribe((dish) => this.dish = dish, errMess => this.dishErrMess = <any>errMess);
    this.promotionService.getFeaturedPromotion().subscribe((promotion) => this.promotion = promotion, errMess => this.promotionErrMess = <any>errMess);
    this.leaderService.getFeaturedLeader().subscribe((leader) => this.leader = leader, errMess => this.leaderErrMess = <any>errMess);
  }

}
