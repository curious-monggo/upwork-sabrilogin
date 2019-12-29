import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from '../../providors/access-providers';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  email: string = "";
  password: string = "";

  disabledButton;


  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders, 
    private storage: Storage,
    public navCtrl: NavController,

  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.disabledButton = false;
    }


 async tryLogin(){
     if(this.email==""){

      this.presentToast("Email is required");
    } else if(this.password==""){

      this.presentToast("Password is required");
    } else {
      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Please wait........'
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: 'proses_login',
          email: this.email,
          password: this.password
        }

        this.accsPrvds.postData(body, 'proses_api.php').subscribe((res:any)=>{

          if(res.success==true){
            loader.dismiss();
            this.disabledButton = false;
            this.presentToast('Login successfuly');
            this.storage.set('storage_xxx', res.result); // create storage session
            this.navCtrl.navigateRoot(['/home']);
          }else{
            loader.dismiss();
            this.disabledButton = false;
            this.presentToastWithOptions('Email or password is incorrect');

          }

        },(err)=>{
            loader.dismiss();
            this.disabledButton = false;
            this.presentToast('Timeout');
            console.log(err)
        });
      });
    }

   }

  async presentToast(a){
    const toast = await this.toastCtrl.create({
      message:a,
      duration: 1500,
    });
    toast.present();
    }

    async presentToastWithOptions(a) {
      const toast = await this.toastCtrl.create({
        message: a,
        duration: 2500,
        buttons: [
          {
            side: 'end',
            // icon: 'star',
            text: 'Reset password',
            handler: () => {
              console.log('Reset Password');
              this.openForgotPassword();
            }
          }, 
        ]
      });
      toast.present();
    }
  openRegister(){
  	this.router.navigate(['/register']);
  }
  openForgotPassword(){
    this.router.navigate(['/forgot-password']);
  }
}
