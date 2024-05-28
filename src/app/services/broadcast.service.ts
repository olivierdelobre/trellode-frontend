import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BroadcastService {
    public loggedUserInfoSource = new BehaviorSubject<any>(0);
    public loggedUserInfo = this.loggedUserInfoSource.asObservable();

    public refreshBoardSource = new BehaviorSubject<any>(0);
    public refreshBoard = this.refreshBoardSource.asObservable();

    public updateLoggedUserInfo(newValue: any) {
        this.loggedUserInfoSource.next(newValue);
    }

    public updateRefreshBoard(newValue: any) {
        this.refreshBoardSource.next(newValue);
    }
}