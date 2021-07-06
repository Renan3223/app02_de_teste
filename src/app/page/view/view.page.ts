import { Component, OnInit } from '@angular/core';

// Importa dependências
import { ActivatedRoute } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

  constructor(
    // Injeção de dependências
    public activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {

    // Obter o ID da rota e armazena em id
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    // Obter o artigo do firestore à partir do ID
    this.item = this.afs.doc<any>(`articles/${this.id}`).valueChanges();
  }
}
