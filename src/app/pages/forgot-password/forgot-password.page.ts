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
  ionViewDidEnter() {
    // this.storage.get("storage_xxx").then(res => {
    //   console.log(res);
    //   this.datastorage = res;
    //   this.user_id = this.datastorage.id_user;
    //   console.log("the user id is", this.user_id);
    // });
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
      // console.log(this.chosen_choice_id);

      const loader = await this.loadingCtrl.create({
        message: "Please wait........"
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: "proses_send_email",
          email: this.email,
          // user_id: this.user_id,
          // question_id: this.question.question_id
          // email: this.email,
          // password: this.password
        };

        this.accsPrvds.postData(body, "proses_api.php").subscribe(
          (res: any) => {
            console.log(res.success);
            console.log(res.result);
            if (res.success == true) {
              loader.dismiss();
              this.presentToast(res.msg);
              this.showEnterEmailCard = false;
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
  async trySendCode() {
    if (this.code == "" || this.code == undefined) {
      this.presentToast("Please enter the code");
    } else {
      // this.answerDisabled = true;
      // console.log(this.chosen_choice_id);

      const loader = await this.loadingCtrl.create({
        message: "Please wait........"
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: "proses_code",
          code: this.code,
          email: this.email
          // user_id: this.user_id,
          // question_id: this.question.question_id
          // email: this.email,
          // password: this.password
        };

        this.accsPrvds.postData(body, "proses_api.php").subscribe(
          (res: any) => {
            console.log(res.success);
            console.log(res.result);
            if (res.success == true) {
              loader.dismiss();
              this.presentToast(res.msg);
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
  log(){
    console.info(this.email);
  }
}
