import { Component } from '@angular/core';
import { AccountInfosForm } from "../../../components/account-infos-form/account-infos-form";
import { AddressForm } from "../../../components/address-form/address-form";

@Component({
  selector: 'app-settings',
  imports: [AccountInfosForm, AddressForm],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {

}
