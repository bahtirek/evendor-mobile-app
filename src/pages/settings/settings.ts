import { LocationService } from './../../service/location.service';
import { Storage } from '@ionic/Storage';
import { Location } from './../data/location.interface';
import { StorageService } from './../../service/storage.service';

import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage implements OnInit{

  locations: Location[] = [];

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private storageService: StorageService, private locationService: LocationService, private http: HttpClient) {
  }

  async ngOnInit(){
   this.locations = await this.storageService.getLocations();
  }

  onRemoveFromLocations(index){
    this.locations.splice(index, 1);
    this.storageService.setLocations(this.locations);
  }

  onAddLocation(form: NgForm){
    this.locationService.getLocation(form.value)
      .subscribe(
        result => {
          
          if(result.exist){
            console.log(result)
            let match;
            match = this.locations.findIndex((el)=>{ return el.name == result.name })
            console.log(match)
            if(match == -1){
              this.locations.push(result);
              this.storageService.setLocations(this.locations);
            }else{
             this.showAlert(); 
            }
          }else{
            this.locations.push(result);
            this.storageService.setLocations(this.locations);
          }
         
      },
      error => { 
          console.log(error)
      },
      () => {}
      );
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Sorry',
      subTitle: 'This location is exist in your list!',
      buttons: ['OK']
    });
    alert.present();
  }
  
}
