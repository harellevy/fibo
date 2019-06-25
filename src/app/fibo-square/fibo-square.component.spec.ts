import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiboSquareComponent } from './fibo-square.component';

describe('FiboSquareComponent', () => {
  let component: FiboSquareComponent;
  let fixture: ComponentFixture<FiboSquareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiboSquareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiboSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
