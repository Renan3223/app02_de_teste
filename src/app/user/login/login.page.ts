import { Component, OnInit } from '@angular/core';

// Importa dependênias
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    // Injeta dependências
    public auth: AngularFireAuth,
    public alertController: AlertController,
    public router: Router
  ) {}

  ngOnInit() { }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((uData) => {
      this.presentAlertConfirm(uData.user.displayName);
    })
    .catch((error) => {
      console.error('Erro de login: ' + error);
    });
  }

  async presentAlertConfirm(userName: string) {
    const alert = await this.alertController.create({
      header: `Olá ${userName}!`,
      message: 'Você já pode usar todos os recursos do aplicativo!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }
}
