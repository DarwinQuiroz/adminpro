import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/RX';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy
{
  subscription: Subscription;

  constructor() 
  {
    // this.subscription = this.regresaObservable().subscribe(
    //   numero => console.log('Subs ' + numero),
    //   error => console.error('Error (2 veces): ' + error),
    //   () => console.log('El observador terminó')
    // );
  }

  ngOnInit() { }
  
  ngOnDestroy() 
  {
    // this.subscription.unsubscribe();
  }


  regresaObservable():Observable<any>
  {
    return new Observable(observer => {
      let contador = 0;

      let intervalo = setInterval(() => {
        contador++;
        let salida = {
          valor: contador
        };

        observer.next(salida);

        // if(contador === 3)
        // {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }
        // if(contador === 2) 
        // {
        //   observer.error('Auxilio.!');
        // }
      },500);
    })
    .retry(2)
    .map((res: any) => {return res.valor})
    .filter((valor, index) => { 
      if((valor % 2) === 1) return true;
      else return false;
    });
  }
}
