import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Http } from '@angular/http';
import { NavController,NavParams,AlertController } from 'ionic-angular';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-alerte',
  templateUrl: 'alerte.html'
})
export class AlertePage {
  nom:string;
  prenom:string;
  phone:string;
  email:string;
  codeR:string;
  idCat:number;
  local:number;
  zone:number;
  cats:any;
  com:any;
  dist:any;
  ville:any;
  qtier:any;
  autre:boolean;
  urls="http://alertes-electricite.ci/Api/";
  //urls="http://192.168.0.136:80/Plaintes/api/";
  message:any;
  frmAlerte:FormGroup;
  

  constructor(public navCtrl: NavController,private http: Http,public formBuilder:FormBuilder,public ctrAlert:AlertController) {
    
    this.autre=false;
    this.frmAlerte=formBuilder.group({
      nom:['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(15)])],
      prenom:['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      phone:['', Validators.compose([Validators.required, Validators.pattern('[^2-3][0-9]*'),Validators.minLength(8), Validators.maxLength(8)])],
      message:['', Validators.compose([Validators.required, Validators.maxLength(160)])],
      email:'',
      ref:'',
      autreCat:'',
      zone:['', Validators.compose([Validators.required])],
      idCat:['', Validators.compose([Validators.required])],
      local:['', Validators.compose([Validators.required])]
     

    });
    
   
    //categorie alerte
  this.http.get(this.urls+'spinner.php')
    .toPromise()
    .then(response =>{
      this.cats=response.json()
    })
    .catch(error => console.log('erreur:'+error));

    //commune
  this.http.get(this.urls+'commune.php')
  .toPromise()
  .then(r=>{
    this.com=r.json();
  })
  .catch(er=>console.log(er));

   //commune
   this.http.get(this.urls+'district.php')
   .toPromise()
   .then(r=>{
     this.dist=r.json();
   })
   .catch(er=>console.log(er));

 

  }

  villeQtier($param,http:Http){
    let p;
     if($param !=''){
      p=$param.split(' ');
      if(p[0]=='D'){
        let param={
          'id':p[1]
        };
  
        this.http.post(this.urls+'ville.php',param)
        .toPromise()
        .then(rep =>{
          this.ville=rep.json();
          this.qtier=[];
         
        })
        .catch(erreur => console.log(erreur))
      }else{
        let param={
          'id':p[1]
        };
        this.http.post(this.urls+'recupQtier.php',param)
        .toPromise()
        .then(rep =>{
          this.qtier=rep.json()
          this.ville=[];
        })
        .catch(erreur => console.log(erreur))
      }
     }else{
      this.ville=[];
      this.qtier=[];
     }
  }
  //public iValue:string;
  onChange($event){
    if($event==27){
      this.autre=true;
    }else{
      this.autre=false;
    }
    
    
  }
//envoi du message

msgSend(){

  let data={
    'nom':this.nom,
    'prenom':this.prenom,
    'phone':this.phone,
    'local':this.local,
    'zone':this.zone,
    'idCat':this.idCat,
    'message':this.message,
    'email':this.email
  };

  this.http.post(this.urls+'traitMobile.php',data)
  .toPromise()
  .then(rep =>{
    this.qtier=rep.json()
    
  })
  .catch(erreur => console.log(erreur))

}
 
sendAlert(frmAlerte){
  let data={
    'nom':frmAlerte.nom,
    'prenom':frmAlerte.prenom,
    'phone':frmAlerte.phone,
    'local':frmAlerte.local,
    'zone':frmAlerte.zone,
    'idCat':frmAlerte.idCat,
    'message':frmAlerte.message,
    'email':frmAlerte.email,
    'ref':frmAlerte.ref,
    "autres":frmAlerte.autreCat
  };


 

  //frmAlerte.nom="";
  this.http.post(this.urls+'traitMobile.php',data)
  .toPromise()
  .then(rep =>{
    this.codeR=rep.json().code
     this.showAlert(this.codeR);
     this.frmAlerte.reset();
  })
  .catch(erreur => console.log(erreur))
  //console.log(data)

}



showAlert(msg) {
  let alert = this.ctrAlert.create({
    title: 'Code Alerte',
    subTitle: 'Merci de bien vouloir noter ce code :'+msg+'. Il vous sera utile dans les 72H pour une relance éventuelle de l\'alerte.MPEDER',
    buttons: ['OK']
  });
  alert.present();
}
}
