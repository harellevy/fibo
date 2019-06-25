import { Component, Input } from '@angular/core';
import { DIRECTION } from '../app.component';

export interface IFibo {
  data: {
    fibo: number;
    dir: DIRECTION;
  }
  children?: IFibo;
}

@Component({
  selector: 'app-fibo-square',
  templateUrl: './fibo-square.component.html',
  styleUrls: ['./fibo-square.component.scss']
})
export class FiboSquareComponent {
  @Input() fibo: IFibo;
  constructor() { }

}
