import { inject, Injectable, signal } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, UserCredential } from '@angular/fire/auth';
import { from, map, Observable, switchMap } from 'rxjs';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  user$: Observable<User | null> = authState(this.auth);
  userDados = signal<any>({});

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
  register(email: string, password: string, nome: string): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => {
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        const userData = {
          uid: user.uid,
          email: user.email,
          nome: nome,
          sobrenome: '',
          dataNascimento: '',
          logradouro: '',
          numero: '',
          urlFotoPerfil: '',
          criadoEm: new Date().toISOString()
        };
        return from(setDoc(userDocRef, userData));
      })
    );
  }

  updateUserProfile(dados: {
    sobrenome?: string;
    dataNascimento?: string;
    logradouro?: string;
    numero?: string;
    urlFotoPerfil?: string;
    nome?: string;
  }): Observable<void> {
    return this.user$.pipe(
      switchMap((user) => {
        if (!user) throw new Error('Usuário não autenticado.');
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        return from(updateDoc(userDocRef, dados));
      })
    );
  }

  getUserProfile(): Observable<any> {
    return this.user$.pipe(
      switchMap((user) => {
        if (!user) throw new Error('Usuário não autenticado.');
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        return from(getDoc(userDocRef)).pipe(
          map(docSnap => {
            if (docSnap.exists()) {
              this.userDados.set({ id: docSnap.id, ...docSnap.data() });
              return { id: docSnap.id, ...docSnap.data() };
            } else {
              return null;
            }
          })
        );
      })
    );
  }


}
