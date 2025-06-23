import { inject, Injectable, signal } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);

  user = signal<any>({});



  
  getUserProfile(uid: string): Observable<any> {
   const userDocRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          this.user.set({ id: docSnap.id, ...docSnap.data() });
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          return null;
        }
      })
    );
  }
}
