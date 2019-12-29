import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccessProviders } from 'src/app/providors/access-providers';
import { ToastController, LoadingController } from '@ionic/angular';



@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {

  hasCode:boolean = false;
  codeTyped:string = "";

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private accsPrvds: AccessProviders
    ) { }

  ngOnInit() {
  }

  showQuestion(){
    this.hasCode = true;
  }
  async getQuestion(){
    if(this.codeTyped == ""){
      this.presentToast('Code is required.');
    } else {
      console.log(this.codeTyped);
      return new Promise(resolve => {
        let body = {
          aksi: 'get_question',
          code: this.codeTyped
          // email: this.email,
          // password: this.password
        }
  
        this.accsPrvds.postData(body, 'proses_api.php').subscribe((res:any)=>{
          console.log(res.success);
          console.log(res.result);
          if(res.success==true){
         
            this.showQuestion();
            // this.presentToast('Login successfuly');
            // this.storage.set('storage_xxx', res.result); // create storage session
            // this.navCtrl.navigateRoot(['/home']);
          }else{
         
            this.presentToast('Code incorrect');
            // this.presentToastWithOptions('Email or password is incorrect');
  
          }
  
        },(err)=>{
          
          
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
}
