import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AccessProviders } from 'src/app/providors/access-providers';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  /*
  * Asks user to enter password 2 times
  * Aksi: proses_change_password
  */

  datastorage: any;
  code: string;
  email: string;



  password: string;
  retypedPassword: string;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders,
    private storage: Storage,
  ) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.storage.get("pw_info").then(res => {
      console.log(res);
      this.datastorage = res;
      this.code = this.datastorage.code;
      this.email = this.datastorage.email;
      console.log("the user id is", this.email);
    });
  }
  async presentAlert(header, subheader, msg) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subheader,
      message: msg,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.openLogin();
          }
        }
      ]
    });

    await alert.present();
  }
  openLogin(){
  	this.router.navigate(['/login']);
  }
  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500
    });
    toast.present();
  }
  async tryChangePassword(){
    if (this.password == "" || this.password == undefined) {
      this.presentToast("Please type your password");
    } else if (this.retypedPassword == "" || this.retypedPassword == undefined) {
      this.presentToast("Please retype your password");
    }else if (this.password !=  this.retypedPassword ) {
      this.presentToast("Passwords did not match");
    } else {
      // this.answerDisabled = true;

      const loader = await this.loadingCtrl.create({
        message: "Please wait........"
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: "proses_change_password",
          password: this.password,
          code: this.code,
          email: this.email
        };

        this.accsPrvds.postData(body, "proses_api.php").subscribe(
          (res: any) => {
            console.log(res.success);
            console.log(res.result);
            if (res.success == true) {
              loader.dismiss();
              this.storage.clear();
              this.presentAlert('Success!', '' , res.msg);
            } else {
              loader.dismiss();
              this.presentToast(res.msg);
              // this.answerDisabled = false;
            }
          },
          err => {
            loader.dismiss();
            this.presentToast("Timeout");
            // this.answerDisabled = false;
            console.log(err);
          }
        );
      });
    }
  }
}
