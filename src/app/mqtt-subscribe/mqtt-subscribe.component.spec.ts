import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttSubscribeComponent } from './mqtt-subscribe.component';

describe('MqttSubscribeComponent', () => {
  let component: MqttSubscribeComponent;
  let fixture: ComponentFixture<MqttSubscribeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MqttSubscribeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
