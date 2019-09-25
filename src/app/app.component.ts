import { Component } from '@angular/core';
import {SessionTransportMock} from './shared.interfaces';
import {BrowserActivityHeartbeatService} from './heartbeat.service';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  svc:BrowserActivityHeartbeatService = new BrowserActivityHeartbeatService(5,new SessionTransportMock('test'))
  constructor(){
    
  }
  ngOnInit(){
    this.svc.startWatcher(window).subscribe(e=>console.log(e));
  }
  name = 'Angular';
}
