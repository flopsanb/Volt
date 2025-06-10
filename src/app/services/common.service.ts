import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private cookieService: CookieService) {}

  get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  public static divideEvenly(numerator: number, minPartSize: number): number[] {
    if (numerator / minPartSize < 2) {
      return [numerator];
    }
    return [minPartSize].concat(this.divideEvenly(numerator - minPartSize, minPartSize));
  }

  public static divideCurrencyEvenly(numerator: number, divisor: number): string[] {
    const minPartSize = +(numerator / divisor).toFixed(2);
    return this.divideEvenly(numerator * 100, minPartSize * 100).map((v: number) => {
      return (v / 100).toFixed(2);
    });
  }

  public static fechaFormateada(inputDeFecha: string): string {
    return new Date(new Date(inputDeFecha).getTime() - (new Date(inputDeFecha).getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0];
  }

  public static fill(n: number, x: any): any[] {
    return Array(n).fill(x);
  }

  public static concat(xs: any[], ys: any[]): any[] {
    return xs.concat(ys);
  }

  public static quotrem(n: number, d: number): number[] {
    return [Math.floor(n / d), Math.floor(n % d)];
  }

  public static distribute(p: number, d: number, n: number): number[] {
    const e = Math.pow(10, p);
    const [q, r] = CommonService.quotrem(n * e, d);

    return CommonService.concat(
      CommonService.fill(r, (q + 1) / e),
      CommonService.fill(d - r, q / e)
    );
  }

  base64toPDF(data: string, id: string): void {
    const bufferArray = this.base64ToArrayBuffer(data);
    const blobStore = new Blob([bufferArray], { type: 'application/pdf' });

    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(blobStore, `${id}.pdf`);
      return;
    }

    const url = window.URL.createObjectURL(blobStore);
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = url;
    link.download = `${id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
    }

  base64ToArrayBuffer(data: string): Uint8Array {
    const bString = window.atob(data);
    const bLength = bString.length;
    const bytes = new Uint8Array(bLength);

    for (let i = 0; i < bLength; i++) {
      bytes[i] = bString.charCodeAt(i);
    }
    return bytes;
  }

  fechaFormateada(inputDeFecha: string | null): string | null {
    if (inputDeFecha) {
      return new Date(new Date(inputDeFecha).getTime() - (new Date(inputDeFecha).getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];
    } else {
      return null;
    }
  }
  
}
