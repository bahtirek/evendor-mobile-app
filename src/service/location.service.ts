import { Location } from './../pages/data/location.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LocationService{

    constructor(private http: HttpClient){}

    result: Location;
    getLocation(credentials){
        let params = new HttpParams();
        params = params.append('email', credentials.email);
        params = params.append('password', credentials.password);

        return this.http.get<Location>('http://evendors.host/api/mobileapp', {params :params});
    }

    getCollection(locations: Location[]){
        let params = new HttpParams().set('locations', JSON.stringify(locations));
        return this.http.get<any[]>('http://evendors.host/api/mobileappshoplist', {params: params});
    }

    updateShopList(shoplist){
        return this.http.put<any>('http://evendors.host/api/mobileappshoplist', {shoplist: shoplist})
    }
}