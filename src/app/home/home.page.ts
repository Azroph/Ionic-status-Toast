import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

const { Network } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  apiData : any;
  limit = 2;

  constructor(private http: HttpClient, public toastController: ToastController) {}

  async toastOffline(message: string) {
    const toast = await this.toastController.create({
      message: message,
      // duration: 2000
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async getData( event = undefined){

    let status = await Network.getStatus();
    if ( !status.connected ) {
      this.toastOffline( "Warning you are offline" );
      return;
    }

    const URL = "https://picsum.photos/v2/list?limit=" + this.limit;
    this.http.get( URL ).subscribe( (data)=>{
      this.apiData = data;
      this.apiData.reverse();
      if (event) event.target.complete();
        console.log('Données récupérées : ', data);
    });

  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.limit += 5;
    this.getData( event );
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  ionViewWillEnter(){

    this.getData();
    
    let handler = Network.addListener('networkStatusChange',(status) => {
      
      const message = !status.connected ? "Warning !! you are offline :'(" : "Yes !! you are online :)" ;
      this.toastOffline(message);
      console.log("Network status changed", status);
    });
  
  }
}
