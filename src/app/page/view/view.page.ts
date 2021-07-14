import { Component, OnInit } from '@angular/core';

// Importa dependências
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  // Id do artigo será armazenado aqui
  public id: string;

  // O artigo completo será armazenado aqui
  item: Observable<any>;

  public comment: any;
  public uId: string;
  public uName: string;
  public uEmail: string;
  public uComment: string;
  public uDate: string;

  public pipe = new DatePipe('en_US'); // Formatar as datas

  public comments: any;

  constructor(
    // Injeção de dependências
    public activatedRoute: ActivatedRoute,
    private afs: AngularFirestore,
    public auth: AngularFireAuth,
    public alert: AlertController
  ) {
    this.auth.onAuthStateChanged((userData) => {
      if (userData) {
        this.uId = userData.uid.trim();
        this.uName = userData.displayName.trim();
        this.uEmail = userData.email.trim();
        this.uComment = '';
      }
    });
  }

  ngOnInit() {
    // Obter o ID da rota e armazena em id
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    // Obter o artigo do firestore à partir do ID
    this.item = this.afs.doc(`articles/${this.id}`).valueChanges();

    // Obter os comentários deste artigo
    this.comments = this.afs
      .collection('comments', (ref) =>
        ref.where('article', '==', this.id).where('status', '==', 'ativo').orderBy('date', 'desc')
      )
      .valueChanges();
  }

  sendComment() {
    // Cria e formata a data do cometário
    this.uDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss').trim();

    // Remove espaços do comentário
    var tempComment = this.uComment.trim();

    // Cria comentário se ele não esta vazio
    if (tempComment !== '') {
      this.comment = {
        date: this.uDate,
        article: this.id,
        uid: this.uId,
        name: this.uName,
        email: this.uEmail,
        comment: this.uComment,
        status: 'ativo',
      };

      // Salva comentário no banco de dados
      this.afs
        .collection('comments')
        .add(this.comment)
        .then(() => {
          // Mostra feedback
          this.presentAlert();
        })
        .catch(
          (error) => {
            console.error(`Erro ao comentar: ${error}`)
          }
        );
    } else {
      this.uComment = '';
      return false;
    }
  }

  // Feedback
  // Exibe feedback
  async presentAlert() {
    var name = this.uName;
    var fName = name.split(' ');

    const alert = await this.alert.create({
      header: `Oba ${fName[0]}!`,
      message: 'Comentário enviado com sucesso!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // Reset do formulário
            this.uComment = '';
          },
        },
      ],
    });

    await alert.present();
  }
}
