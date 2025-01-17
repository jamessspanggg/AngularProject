  
import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { OrderService } from '../services/order.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { Order } from '../shared/order';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    }
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;

  commentForm: FormGroup;
  comment: Comment;

  addOrderForm: FormGroup;
  order: Order;
  addToOrderQty: number;
  addOrderSuccessful: boolean;

  dishcopy: Dish;
  visibility = 'shown';

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minLength':     'Author Name must be at least 2 characters long.',
      'maxLength':     'Author Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minLength':     'Comment must be at least 1 characters long.'
    }
  };

  constructor(private dishService: DishService, private orderService: OrderService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL) {
      this.createForm();
      this.createOrderForm();
    }

  ngOnInit() {
    this.addOrderSuccessful = false;
    this.dishService.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params
        .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
        .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errMess => this.errMess = <any>errMess);
  }

  setPrevNext(dishIds: string) {
    const index = this.dishIds.indexOf(dishIds);
    this.prev = this.dishIds[(this.dishIds.length + index - 1 ) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1 ) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      comment: ['', [Validators.required, Validators.minLength(1)] ],
      rating: 5
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  createOrderForm() {
    this.addOrderForm = this.fb.group({
      quantity: 1,
      tableNumber: 1,
    })
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors ) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }


  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    this.comment = null;
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5
    });
  }

  addToOrder() {
    this.order = this.addOrderForm.value;
    this.order.dishName = this.dish.name;
    this.orderService.addOrder(this.order).subscribe(order => this.order = order);
    this.addOrderSuccessful = true;
    this.addOrderForm.reset({
      quantity: 1,
      tableNumber: 1,
    })
  }
}