import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AccessProviders } from '../../providors/access-providers';




@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


	first_name: string = "";
	last_name: string = "";
	phone: string = "";
	occupation: string = "";
	address: string = "";
	city: string = "";
	gender: string = "";
	email: string = "";
	password: string = "";
	confirm_password: string = "";

	disabledButton;



	constructor(
	  private router: Router,
	  private toastCtrl: ToastController,
	  private loadingCtrl: LoadingController,
	  private alertCtrl: AlertController,
	  private accsPrvds: AccessProviders
	) { }

	  ngOnInit() {
	  }

	ionViewDidEnter(){
	  }

	async tryRegister(){
	  if(this.first_name==""){

	  	this.presentToast("First name is required");
	  } else if(this.last_name==""){

	  	this.presentToast("Last name is required");
		} else if(this.phone==""){

	  	this.presentToast("Phone number is required");
		} else if(this.occupation==""){

	  	this.presentToast("Occupation is required");
		} else if(this.address==""){

	  	this.presentToast("Address is required");
		} else if(this.city==""){

	  	this.presentToast("City is required");
		} else if(this.gender==""){

	  	this.presentToast("Gender is required");
		} else if(this.email==""){

	  	this.presentToast("Email is required");
		} else if(this.password==""){

	  	this.presentToast("Password is required");
		} else if(this.confirm_password!==this.password){

	  	this.presentToast("Password are not the same");
		} else {
		
			this.disabledButton = true;
			const loader = await this.loadingCtrl.create({
				message: 'Please wait........'
			});
			loader.present();

			return new Promise(resolve => {
				let body = {
					aksi: 'proses_register',
					first_name: this.first_name,
					last_name: this.last_name,
					phone: this.phone,
					occupation: this.occupation,
					address: this.address,
					city: this.city,
					gender: this.gender,
					email: this.email,
					password: this.password
				}

				this.accsPrvds.postData(body, 'proses_api.php').subscribe((res:any)=>{

					if(res.success==true){
						loader.dismiss();
						this.disabledButton = false;
						this.presentToast(res.msg);
						this.router.navigate(['/login']);
					}else{
						loader.dismiss();
						this.disabledButton = false;
						this.presentToast(res.msg);

					}

				},(err)=>{
						loader.dismiss();
						this.disabledButton = false;
						this.presentAlert('Timeout');
				});
			});
		}

	 }

	async presentToast(a){
		const toast = await this.toastCtrl.create({
			message:a,
			duration: 1500,
			position: 'top'
		});
		toast.present();
		}

	async presentAlert(a){
		    const alert = await this.alertCtrl.create({
		      header: a,
		      backdropDismiss: false,
		      buttons: [
		        {
		          text: 'Close',
		          handler: (blah) => {
		            console.log('Confirm Cancel: blah');
		            // action
		          }
		        }, {
		          text: 'Try Again',
		          handler: () => {
		          	this.tryRegister();		    
		           }
		        }
		      ]
		    });

		    await alert.present();
		  }
	}

 