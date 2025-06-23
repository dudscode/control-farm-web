import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, UserCredential } from '@angular/fire/auth';
import { from, Observable, switchMap } from 'rxjs';
import {
  Firestore,
  doc,
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

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    sessionStorage.removeItem('uuid_farm');
    localStorage.removeItem('uuid_farm');
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
  }): Observable<void> {
    return this.user$.pipe(
      switchMap((user) => {
        if (!user) throw new Error('Usuário não autenticado.');
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        return from(updateDoc(userDocRef, dados));
      })
    );
  }


}
