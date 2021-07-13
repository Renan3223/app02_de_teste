import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

// 1) Importa dependências
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

// Alert Controller
import { AlertController } from '@ionic/angular';

// 6) Não permite somente espaços nos campos
export function removeSpaces(control: AbstractControl) {
  if (control && control.value && !control.value.replace(/\s/g, '').length) {
    control.setValue('');
  }
  return null;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  // 3) Atributos
  public contactForm: FormGroup; // Contém o formulário de contatos
  public pipe = new DatePipe('en_US'); // Formatar as datas

  constructor(
    // 2) Injeta dependências

    public auth: AngularFireAuth,
    public form: FormBuilder,
    public afs: AngularFirestore,

    // Alert Controller
    public alert: AlertController
  ) {}

  ionViewWillEnter() {
    // Reset do formulário
    this.contactForm.reset();

    // Preenche nome e email se usuário está logado
    if (this.contactForm) {
      this.auth.onAuthStateChanged((userData) => {
        if (userData) {
          this.contactForm.controls.name.setValue(userData.displayName.trim());
          this.contactForm.controls.email.setValue(userData.email.trim());
        }
      });
    }
  }

  ngOnInit() {
    // 4) Cria o formulário de contatos
    this.contactFormCreate();
  }

  // 5) Cria o formulário de contatos
  contactFormCreate() {
    // 'contactForm' contém o formulário
    // Um formulário é um 'agrupamento' (group) de campos...
    this.contactForm = this.form.group({
      date: [''],
      name: [
        '', // Valor inicial
        Validators.compose([
          // Validação do campo
          Validators.required, // Obrigatório
          Validators.minLength(3), // Pelo menos 3 caracteres
          removeSpaces, // Não permite somente espaços
        ]),
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          removeSpaces,
        ]),
      ],
      subject: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          removeSpaces,
        ]),
      ],
      message: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          removeSpaces,
        ]),
      ],
    });
  }

  // Processa o envio do formulário
  contactSend() {
    // Cria e formata a data
    this.contactForm.controls.date.setValue(
      this.pipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss').trim()
    );

    // Salva em um novo documento do Firebase Firestore
    this.afs
      .collection('contacts')
      .add(this.contactForm.value)
      .then(() => {
        // Mostra feedback
        this.presentAlert();
      })
      .catch();
  }

  // Feedback
  // Exibe feedback
  async presentAlert() {
    var name = this.contactForm.controls.name.value;
    var fName = name.split(' ');

    const alert = await this.alert.create({
      header: `Oba ${fName[0]}!`,
      message: 'Contato enviado com sucesso!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // Reset do formulário
            this.contactForm.reset({
              name: this.contactForm.controls.name.value,
              email: this.contactForm.controls.email.value,
              subject: '',
              message: '',
              date: '',
            });
          },
        },
      ],
    });

    await alert.present();
  }
}
