import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  auth$ = new Subscription();
  isAuth: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.auth$ = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  onClose() {
    this.closeSidenav.emit();
  }

  ngOnDestroy(): void {
    this.auth$.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
    this.onClose();
  }
}
