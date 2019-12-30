import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AccessProviders } from "src/app/providors/access-providers";
import {
  ToastController,
  LoadingController,
  AlertController
} from "@ionic/angular";

@Component({
  selector: "app-update-profile",
  templateUrl: "./update-profile.page.html",
  styleUrls: ["./update-profile.page.scss"]
})
export class UpdateProfilePage implements OnInit {
  datastorage: any;
  user_id: string = "";
  first_name: string = "";
  last_name: string = "";
  phone: string = "";
  occupation: string = "";
  address: string = "";
  city: string = "";
  gender: string = "";

  disabledButton = false;
  constructor(
    private storage: Storage,
    private accsPrvds: AccessProviders,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}
  ionViewDidEnter() {
    this.storage.get("storage_xxx").then(res => {
      console.log(res);
      this.datastorage = res;
      this.user_id = this.datastorage.id_user;
      this.first_name = this.datastorage.first_name;
      this.last_name = this.datastorage.last_name;
      this.phone = this.datastorage.phone;
      this.occupation = this.datastorage.occupation;
      this.address = this.datastorage.address;
      this.city = this.datastorage.city;
      this.gender = this.datastorage.gender;
      console.log("the user records are", this.datastorage);
    });
  }

  async tryUpdateInfo() {
    if (this.first_name == "") {
      this.presentToast("First name is required");
    } else if (this.last_name == "") {
      this.presentToast("Last name is required");
    } else if (this.phone == "") {
      this.presentToast("Phone number is required");
    } else if (this.occupation == "") {
      this.presentToast("Occupation is required");
    } else if (this.address == "") {
      this.presentToast("Address is required");
    } else if (this.city == "") {
      this.presentToast("City is required");
    } else if (this.gender == "") {
      this.presentToast("Gender is required");
    } else {
      this.disabledButton = true;

      const loader = await this.loadingCtrl.create({
        message: "Please wait........"
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: "proses_update_info",
          user_id: this.user_id,
          first_name: this.first_name,
          last_name: this.last_name,
          phone: this.phone,
          occupation: this.occupation,
          address: this.address,
          city: this.city,
          gender: this.gender
        };

        this.accsPrvds.postData(body, "proses_api.php").subscribe(
          (res: any) => {
            console.log(res.success);
            console.log(res.result);
            if (res.success == true) {
              loader.dismiss();

              // this.showQuestion();

              // this.question.img_url = res.result.question.img_url;
              // this.question.text = res.result.question.text;
              // this.choices = res.result.choices;
              // this.hasCode = true;
              // this.presentAlert('Saved!','',res.msg);
              this.presentAlert("Updated!", res.msg);
              this.storage.clear();
              this.storage.set("storage_xxx", res.result); // create storage session
              this.disabledButton = false;
            } else {
              loader.dismiss();
              this.presentToast(res.msg);
              this.disabledButton = false;
              // this.presentToast(res.msg);
              // this.presentToastWithOptions('Email or password is incorrect');
            }
          },
          err => {
            loader.dismiss();
            this.presentToast("Timeout");
            this.disabledButton = false;
            console.log(err);
          }
        );
      });
    }
  }
  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
      position: "top"
    });
    toast.present();
  }
  async presentAlert(a, b) {
    const alert = await this.alertCtrl.create({
      header: a,
      subHeader: b,
      backdropDismiss: false,
      buttons: ["Ok"]
    });

    await alert.present();
  }
}
