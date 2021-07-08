import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// Importar Firebase Guards
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

// Define redirecionadores
const toLogin = () => redirectUnauthorizedTo(['/login']); // Usuário  não logado
const isLogged = () => redirectLoggedInTo(['/profile']); // Usuário logado

const routes: Routes = [

  // Rota da página inicial
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  // Página modelo do ionic (REMOVER)
  {
    path: 'folder/:id',
    loadChildren: () =>
      import('./folder/folder.module').then((m) => m.FolderPageModule),
  },

  // Página inicial
  {
    path: 'home',
    loadChildren: () =>
      import('./page/home/home.module').then((m) => m.HomePageModule),
  },

  // Página de contatos
  {
    path: 'contacts',
    loadChildren: () =>
      import('./page/contacts/contacts.module').then(
        (m) => m.ContactsPageModule
      ),
  },

  // Página sobre
  {
    path: 'about',
    loadChildren: () =>
      import('./page/about/about.module').then((m) => m.AboutPageModule),
  },

  // Página para exibir artigo único
  {
    path: 'view/:id',
    loadChildren: () =>
      import('./page/view/view.module').then((m) => m.ViewPageModule),

    // Só acessa se estiver logado
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: toLogin },
  },

  // Página de login de usuário
  {
    path: 'login',
    loadChildren: () =>
      import('./user/login/login.module').then((m) => m.LoginPageModule),

      // Somente se não está logado
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: isLogged },
  },

  // Página de logout de usuário
  {
    path: 'logout',
    loadChildren: () =>
      import('./user/logout/logout.module').then((m) => m.LogoutPageModule),

      // Só acessa se estiver logado
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: toLogin },
  },

  // Página de perfil do usuário
  {
    path: 'profile',
    loadChildren: () =>
      import('./user/profile/profile.module').then((m) => m.ProfilePageModule),

      // Só acessa se estiver logado
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: toLogin },
  },

  // Rota curinga (rotas inexistentes)
  // TEM QUE SER SEMPRE A ÚLTIMA ROTA
  {
    path: '**',
    loadChildren: () =>
      import('./page/e404/e404.module').then((m) => m.E404PageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
