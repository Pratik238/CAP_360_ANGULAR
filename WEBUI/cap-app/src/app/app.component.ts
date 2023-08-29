import { Component, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

export let browserRefresh = false;
// tslint:disable-next-line: component-selector
@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnDestroy {

    subscription: Subscription;

    constructor(private router: Router) {
        this.subscription = router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
              browserRefresh = !router.navigated;
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
      }
}
