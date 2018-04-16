import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AlertePage } from '../alerte/alerte'
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Header } from 'ionic-angular/components/toolbar/toolbar-header';
//import { Headers } from '@angular/http/src/headers';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  relance: FormGroup;
  urls = "http://alertes-electricite.ci/Api/";
  //urls="http://192.168.43.249:80/Plaintes/api/";
  constructor(public navCtrl: NavController, public altCtrl: AlertController, public http: Http, public toast: ToastController, private network: Network) {


  }


  frmAlerte() {
    this.navCtrl.push(AlertePage);
  }
  frmRelance() {
    let prompt = this.altCtrl.create({
      title: 'RELANCE',
      message: "Entrer le code de votre alerte",
      inputs: [
        {
          name: 'CODE',
          placeholder: 'Votre code'
        },
      ],
      buttons: [
        {
          text: 'ANNULER',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'ENVOYER',
          handler: data => {
            let d = {
              'code': data.CODE
            }

            if (d.code != '') {
              this.http.post(this.urls + 'recu.php', d)
                .toPromise()
                .then(rep => {
                  if (rep.json() == 1) {
                    this.presentToast("Alerte relancée avec succès")
                  } else if (rep.json() == 0) {
                    this.presentToast("Code non valide")
                  } else {
                    this.presentToast("Merci de patienter jusqu'au " + String(rep.json()) + " pour relancer votre alerte")
                  }
                  //console.log(rep.json());
                })
                .catch(error => {
                  this.presentToast("Impossible de joindre le serveur, merci de vérifier votre connexion internet")
                })
            } else {
              this.presentToast("Merci de renseigner un code")
            }
          }
        }
      ]
    });
    prompt.present();
  }

  presentToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 5000,
      position: 'top',
    });
    toast.present();
  }

}
