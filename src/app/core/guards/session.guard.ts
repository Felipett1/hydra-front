import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

  constructor(private cookieService: CookieService, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.validarCookies();
  }

  validarCookies() {
    try {
      const token = this.cookieService.check('token')
      const usuario = this.cookieService.check('usuario')
      const rol = this.cookieService.check('rol')
      if (!token || !usuario || !rol) {
        this.router.navigate(['/', 'login'])
      }
      return true
    } catch (error) {
      console.log('Se presento un error en el guardian: ' + error)
      return false
    }
  }

}
