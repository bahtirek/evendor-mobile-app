import { LocationService } from './../../service/location.service';
import { StorageService } from './../../service/storage.service';
import { Item } from './../data/item.interface';
import { SettingsPage } from './../settings/settings';

import { listService } from './../../service/list.service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  listsCollection: any[];
  listsCollection1:{ location: string,  list: { vendorName: string, vendorId: number, show: boolean, items: Item[] }[] }[];;
  done: { hash: string, vendorId: number, itemId: number}[] = [];
  settingsPage = SettingsPage;
  locations = [];
  updating = false;
  collectionExist = false;

  constructor(public navCtrl: NavController, private listServ: listService, private storageService: StorageService, private locationService: LocationService) {

  }

  ionViewWillEnter(){
    this.loadCollection();
  }

  async loadCollection(){
    this.locations = await this.storageService.getLocations();
    
        this.locationService.getCollection(this.locations)
        .subscribe(
          result => {
            this.listsCollection = result;
            if(result.length == 0) {
              this.goToSettings();
            }else{
              this.isListExist();
            }
            
            console.log(result)
          },
          error => {
    
          }
        );
  }

  
  goToSettings(){
    this.navCtrl.push(SettingsPage)
  }

  onItemChecked(collectionIndex, listIndex, itemIndex){
    this.listsCollection[collectionIndex].list[listIndex].items[itemIndex].checked = !this.listsCollection[collectionIndex].list[listIndex].items[itemIndex].checked;
    let items = this.listsCollection[collectionIndex].list[listIndex].items;
    if(items[itemIndex].checked){
      if(items.length > 1){
        let item = this.listsCollection[collectionIndex].list[listIndex].items.splice(itemIndex, 1);
        this.listsCollection[collectionIndex].list[listIndex].items.push(item[0]);
      }
    }else{
      if(items.length > 1){
        let item = this.listsCollection[collectionIndex].list[listIndex].items.splice(itemIndex, 1);
        this.listsCollection[collectionIndex].list[listIndex].items.unshift(item[0]);
      }
    }
   }


  
  onDone(){
    let d = [];
    let x = 1;
    for (var c = 0; c < this.listsCollection.length; c++) {
      var coll = this.listsCollection[c];
      for (var l = 0; l < coll.list.length; l++) {
        var list = coll.list[l];
        for (var i = 0; i < list.items.length; i++) {
          var item = list.items[i];
          if(item.checked == true){
           
            let collPosition = d.findIndex((el)=>{ return el.location == coll.location });

            if(collPosition == -1){
              d.push({location: coll.location, hash: coll.hash, list: []});
              collPosition = d.findIndex((el)=>{return el.location == coll.location });
            }

            let listPosition = d[collPosition].list.findIndex((el)=>{ return el.vendorId == list.vendorId });

            if(listPosition == -1){
              d[collPosition]['list'].push({vendorId: list.vendorId, itemsId: []});
              listPosition = d[collPosition].list.findIndex((el)=>{ return el.vendorId == list.vendorId });
            }
            
            d[collPosition]['list'][listPosition]['itemsId'].push(item.id)
          }
          
          if(c == this.listsCollection.length - 1 && l == coll.list.length - 1 && i == list.items.length - 1){
            this.doneShopping(d)
            console.log(d)
          }
        }
        if(list.items.length == 0){
          if(c == this.listsCollection.length - 1 && l == coll.list.length - 1){
            this.doneShopping(d)
            console.log(d)
          }
        }
      }
    }
  }

  doneShopping(shoplist){
    this.updating = true;
    this.locationService.updateShopList(shoplist)
     .subscribe(
      result => {
        if(result)
        this.loadCollection();
        this.updating = false;
        this.isListExist();
      },
      error => {

      }
     )
  }

 async doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    await this.loadCollection();
    refresher.complete();
  }

  isListExist(){
    for(let coll of this.listsCollection){
      console.log(coll)
      for(let list of coll.list){
        console.log(list)
        if(list.items.length > 0) {
          console.log(list)
          this.collectionExist = true;
          break;
        }else{
          this.collectionExist = false;
        }
      }
    }

    
  }
}
