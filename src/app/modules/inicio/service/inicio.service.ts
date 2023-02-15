import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InicioService {
  public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  public toggle() {
    console.log('Toogle service: ' + this.sideNavToggleSubject.next(null))
    return this.sideNavToggleSubject.next(null);
  }
}
