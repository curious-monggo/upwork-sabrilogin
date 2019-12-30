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
  choices:any = [];
  question = {
    img_url: '',
    text: ''
  };
  answer:string;
  // choice = {
  //   choice_id: '',
  //   img_url: '',
  //   text: ''
  // }
  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private accsPrvds: AccessProviders
    ) { }

  ngOnInit() {
  }

  showQuestion(){
    // this.question.img_url
    // this.hasCode = true;
  }
  async getQuestion(){
    if(this.codeTyped == ""){
      this.presentToast('Code is required.');
    } else {
      console.log(this.codeTyped);

      const loader = await this.loadingCtrl.create({
        message: 'Please wait........'
      });
      loader.present();

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
            loader.dismiss();
         
            // this.showQuestion();

            this.question.img_url = res.result.question.img_url;
            this.question.text = res.result.question.text;
            this.choices = res.result.choices;
            this.hasCode = true;
            // this.presentToast('Login successfuly');
            // this.storage.set('storage_xxx', res.result); // create storage session
            // this.navCtrl.navigateRoot(['/home']);
          }else{
            loader.dismiss();
            this.presentToast('Code incorrect');
            // this.presentToastWithOptions('Email or password is incorrect');
  
          }
  
        },(err)=>{
          
            loader.dismiss();
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

    onAnswer(){
      console.log(this.answer);
    }
}
