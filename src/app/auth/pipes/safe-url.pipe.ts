import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Pipe personalizada que permite incrustar URLs en iframes o recursos externos de forma segura.
 * Angular bloquea por defecto URLs dinámicas en componentes como iframe por razones de seguridad.
 * Este pipe utiliza DomSanitizer para declarar explícitamente que una URL es confiable.
 */
@Pipe({
  name: 'safeUrl'
})

export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Recibe una URL en formato string y la transforma en un SafeResourceUrl.
   * Esto evita que Angular la bloquee al renderizarla en un iframe.
   */
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
