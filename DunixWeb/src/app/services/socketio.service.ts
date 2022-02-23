import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket: Socket;

  constructor() {
    this.socket = io('http://4rb1tr4ry.ddns.net:4805');
  }

  onResult(session_id: string): Observable<string> {
    return new Observable(observer => {
      this.socket.on(session_id + "_result", msg => {
        observer.next(msg);
      });
    });
  }
}
