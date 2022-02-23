import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SocketioService } from './services/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  code: string = "";
  output: string = "";

  title = 'DunixWeb';

  constructor(private http: HttpClient, private socketio: SocketioService) {}

  ngOnInit(): void {
    this.http.get('http://4rb1tr4ry.ddns.net:4805/session').subscribe(
      (data: any) => {
        this.socketio.onResult(data['session']).subscribe(msg => {
          this.output = msg;
        });
      }
    );
  }

  runCode(): void {
    console.log(this.code);

    let params = new HttpParams();
    params = params.append('LANGUAGE', 'py');
    params = params.append('CODE', this.code);

    this.http.get('http://4rb1tr4ry.ddns.net:4805/compile', { params: params }).subscribe(
      (data: any) => {
        console.log(data);
      }
    );

  }

}
