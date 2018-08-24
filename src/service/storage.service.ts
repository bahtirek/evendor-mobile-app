import { Location } from './../pages/data/location.interface';
import { Storage } from '@ionic/Storage';

import { Injectable } from '@angular/core';

@Injectable()
export class StorageService{
    constructor(private storage: Storage) { }

    getLocations = async () => {
        const locations = await this.storage.get('locations');
        if(locations == null || locations == undefined){
            return [];
        }
        return locations;
      }




    setLocations(locations){
        console.log(locations)
        this.storage.set('locations', locations)
        .then(
          () => {
             return true; 
          }
        )
        .catch(
          err => {
            console.log(err)
          }
        );
    }
   }
