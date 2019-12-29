import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {
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
  constructor() { }

  ngOnInit() {
  }

}
