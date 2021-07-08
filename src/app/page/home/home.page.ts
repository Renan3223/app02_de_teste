import { Component, OnInit } from '@angular/core';

// 1) Importa dependências
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // 3) Atributos do script
  private itemsCollection: AngularFirestoreCollection;
  public items: Observable<any>;

  constructor(
    // 2) Injeta dependências
    private afs: AngularFirestore,
    public auth: AngularFireAuth
  ) {

    // 4) Acessa e obtém dados da coleção
    this.itemsCollection = afs.collection(
      'articles', // Coleção a ser consultada
      ref => ref // Aplica filtros
        .where('status', '==', 'ativo') // Somente com 'status'='ativo'
        .orderBy('date', 'desc') // Ordena por 'date' na ordem decrescente

      /*
        ATENÇÃO!
          Será necessário gerar um índice no Firestore para que esta query funcione.
          O link para gerar o índice aparece no console.
          Logue-se no Firebase.com e clique no link do console.
      */
     );
    this.items = this.itemsCollection.valueChanges({ idField: 'id' });

  }

  ngOnInit() { }

}
