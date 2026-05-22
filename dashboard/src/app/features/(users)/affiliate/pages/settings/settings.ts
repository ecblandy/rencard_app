import { Component } from '@angular/core';
import { AddressForm } from "../../../components/address-form/address-form";
import { AccountInfosForm } from "../../../components/account-infos-form/account-infos-form";

@Component({
  selector: 'app-settings',
  imports: [AddressForm, AccountInfosForm],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {

}
