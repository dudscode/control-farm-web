import { inject, Injectable, signal } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, updatePassword, EmailAuthProvider, reauthenticateWithCredential, UserCredential } from '@angular/fire/auth';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import { collection, getDocs, query, where } from 'firebase/firestore';
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

  updateUserProfilePictureStorage(file: File): Observable<void> {
    const storage = getStorage();
    return this.user$.pipe(
      switchMap((user) => {
        if (!user) throw new Error('Usuário não autenticado.');
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        const storageRef = ref(storage, `${user.uid}/profile`);
        return from(uploadBytes(storageRef, file)).pipe(
          switchMap(() => getDownloadURL(storageRef)),
          switchMap((downloadURL) => {
            console.log('URL da foto de perfil:', downloadURL);
            return from(updateDoc(userDocRef, { urlFotoPerfil: downloadURL }));
          })
        );
      })
    );
  }



  reauthenticate$(user: User, currentPassword: string): Observable<UserCredential> {
    const credential = EmailAuthProvider.credential(user.email!, currentPassword);
    return from(reauthenticateWithCredential(user, credential));
  }

  updateUserPassword(currentPassword: string, newPassword: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }

    return this.reauthenticate$(user, currentPassword).pipe(
      switchMap(() => from(updatePassword(user, newPassword))),
      catchError(err => throwError(() => err))
    );
  }

  getNotifications(): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }

    const notificationCollectionRef = collection(this.firestore, 'notification');
    const q = query(notificationCollectionRef, where('uid', '==', user.uid));

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
      catchError(error => throwError(() => new Error(`Erro ao buscar notificações: ${error.message}`)))
    );
  }
  
  markAllNotificationsAsRead(): Observable<void> {
  const user = this.auth.currentUser;
  if (!user) {
    return throwError(() => new Error('Usuário não autenticado.'));
  }

  const notificationCollectionRef = collection(this.firestore, 'notification');
  const q = query(notificationCollectionRef, where('uid', '==', user.uid));

  return from(getDocs(q)).pipe(
    switchMap(snapshot => {
      const updates: Promise<any>[] = [];

      snapshot.forEach(docSnap => {
        const docRef = doc(this.firestore, 'notification', docSnap.id);
        updates.push(updateDoc(docRef, { read: true }));
      });

      return from(Promise.all(updates)).pipe(map(() => void 0));
    }),
    catchError(error => throwError(() => new Error(`Erro ao marcar notificações como lidas: ${error.message}`)))
  );
}

}
