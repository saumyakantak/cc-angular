import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MqttSubscribeComponent } from './mqtt-subscribe/mqtt-subscribe.component';
import { IotDevicesComponent } from './iot-devices/iot-devices.component';
import { CanvasComponent } from './canvas/canvas.component';
import { FormComponent } from './form/form.component';

@NgModule({
  declarations: [
    AppComponent,
    MqttSubscribeComponent,
    IotDevicesComponent,
    CanvasComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
