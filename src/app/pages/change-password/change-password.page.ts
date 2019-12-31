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
      // console.log(this.chosen_choice_id);

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
              this.presentToast(res.msg);
              this.storage.clear();
              this.openLogin();
              // this.openChangePassword();
              // this.presentToast("Go to change pass page");
              // this.showEnterEmailCard = false;
              // this.showQuestion();

              // this.question.img_url = res.result.question.img_url;
              // this.question.text = res.result.question.text;
              // this.choices = res.result.choices;
              // this.hasCode = true;
              // this.presentAlert("Saved!", "", res.msg);
              //  this.presentToast(res.msg);
              // this.storage.set('storage_xxx', res.result); // create storage session
            } else {
              loader.dismiss();
              this.presentToast(res.msg);
              // this.answerDisabled = false;
              // this.presentToast(res.msg);
              // this.presentToastWithOptions('Email or password is incorrect');
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
