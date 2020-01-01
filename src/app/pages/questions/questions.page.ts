import { Component, OnInit } from "@angular/core";
import { AccessProviders } from "src/app/providors/access-providers";
import {
  ToastController,
  LoadingController,
  NavController,
  AlertController
} from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-questions",
  templateUrl: "./questions.page.html",
  styleUrls: ["./questions.page.scss"]
})
export class QuestionsPage implements OnInit {
  datastorage: any;
  user_id: string;

  /**
    Boolean values that will help show/hide the cards.
    Syntax: *ngIf="boolVar; else #nameOfNgTemplate"
    We used it in questions.page.html
    see link: https://ultimatecourses.com/blog/angular-ngif-else-then
  **/

  questionCardIsVisible: boolean = false;
  videoCardIsVisible: boolean = false;

  //boolean for [disabled] attr
  answerDisabled: boolean = false;

  codeTyped: string = "";

  //We use an array because it can handle multiple values
  choices: any = [];

  /**
    Typescript objects, it's a useful way of structuring data.
    When we use it in html, we --> {{question.img_url}}
    see link: https://www.tutorialspoint.com/typescript/typescript_objects.htm
  **/
  question = {
    question_id: "",
    img_url: "",
    video_url: "",
    text: "",
    created_at: ""
  };


  //the selected answer of the user,
  //we get the id to be saved to the database as reference
  chosen_choice_id: string;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders,
    private storage: Storage,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.storage.get("storage_xxx").then(res => {
      this.datastorage = res;
      this.user_id = this.datastorage.id_user;
    });
  }
  hideVideoCard() {
    this.videoCardIsVisible = false;
  }
  async getQuestion() {
    if (this.codeTyped == "") {
      this.presentToast("Code is required.");
    } else {

      const loader = await this.loadingCtrl.create({
        message: "Please wait........"
      });
      loader.present();

      return new Promise(resolve => {
        //We pass the process to be done to fetch question by id
        let body = {
          aksi: "get_question",
          code: this.codeTyped,
          user_id: this.user_id
        };

        this.accsPrvds.postData(body, "proses_api.php").subscribe(
          (res: any) => {
            if (res.success == true) {
              loader.dismiss();

              //I save the result to the question object
              this.question.img_url = res.result.question.img_url;
              this.question.video_url = res.result.question.video_url;
              if (this.question.video_url) {
                this.videoCardIsVisible = true;
              }
              this.question.text = res.result.question.text;
              this.question.question_id = res.result.question.question_id;
              this.choices = res.result.choices;

              //then display
              this.questionCardIsVisible = true;
            } else {
              loader.dismiss();
              this.presentToast("Code may already be used or incorrect.");
            }
          },
          err => {
            loader.dismiss();
            this.presentToast("Timeout");
          }
        );
      });
    }
  }

  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500
    });
    toast.present();
  }

  onAnswer() {
    this.tryAnswer();
  }
  //same model of code, only different process. Here we try to save the answer
  async tryAnswer() {
    if (this.chosen_choice_id == "" || this.chosen_choice_id == undefined) {
      this.presentToast("Please choose an answer");
    } else {
      //while the process runs, we disable the button to prevent another process to run
      //it may cause conflict or even replace previous data sent. 
      this.answerDisabled = true;

      const loader = await this.loadingCtrl.create({
        message: "Please wait........"
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: "proses_answer",
          choice_id: this.chosen_choice_id,
          user_id: this.user_id,
          question_id: this.question.question_id
        };

        this.accsPrvds.postData(body, "proses_api.php").subscribe(
          (res: any) => {
            if (res.success == true) {
              loader.dismiss();
              this.presentAlert("Saved!", "", res.msg);
            } else {
              loader.dismiss();
              this.presentToast(res.msg);
              //The server returns a false, we allow the user to try again
              this.answerDisabled = false;
            }
          },
          err => {
            loader.dismiss();
            this.presentToast("Timeout");
            this.answerDisabled = false;
          }
        );
      });
    }
  }
  //I modifed it so that when user presses ok on the alert, it pops back to home.
  async presentAlert(header, subheader, msg) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subheader,
      message: msg,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.navCtrl.navigateRoot(["/home"]);
          }
        }
      ]
    });

    await alert.present();
  }
}
