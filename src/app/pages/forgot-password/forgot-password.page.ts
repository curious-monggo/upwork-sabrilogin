import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AccessProviders } from 'src/app/providors/access-providers';
import { Storage } from "@ionic/storage";


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  /*
  * Asks user to enter password 2 times
  * Aksi: proses_send_email, proses_code
  */

  datastorage: any;
  user_id: string;


  showEnterEmailCard:boolean = true;
  email:string = "";
  code:string = "";
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
  openChangePassword(){
  	this.router.navigate(['/change-password']);
  }

  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500
    });
    toast.present();
  }
  async trySendMail() {
    if (this.email == "" || this.email == undefined) {
      this.presentToast("Please enter your email");
    } else {
      // this.answerDisabled = true;

      const loader = await this.loadingCtrl.create({
        message: "Please wait........"
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: "proses_send_email",
          email: this.email,
        };

        this.accsPrvds.postData(body, "proses_api.php").subscribe(
          (res: any) => {
            if (res.success == true) {
              loader.dismiss();
              this.presentToast(res.msg);
              this.showEnterEmailCard = false;
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
          }
        );
      });
    }
  }
  async trySendCode() {
    if (this.code == "" || this.code == undefined) {
      this.presentToast("Please enter the code");
    } else {
      // this.answerDisabled = true;

      const loader = await this.loadingCtrl.create({
        message: "Please wait........"
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: "proses_code",
          code: this.code,
          email: this.email
        };

        this.accsPrvds.postData(body, "proses_api.php").subscribe(
          (res: any) => {
            if (res.success == true) {
              loader.dismiss();
              this.storage.set("pw_info", body); // create storage session
              this.presentToast(res.msg);
              this.openChangePassword();
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
          }
        );
      });
    }
  }
}
