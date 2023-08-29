import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
    static instance: SharedService;

    private storage: any;

    constructor() { 
        return SharedService.instance = SharedService.instance || this;
    }

    setStorage(strg: any) {
        this.storage = strg;
    }

    getStorage() {
        return this.storage;
    }

    clearStorage() {
        this.storage = {};
    }

}
