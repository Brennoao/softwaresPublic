'use strict';

/**
 * Router minimalista, sem dependências externas.
 * Suporta segmentos dinâmicos no formato /api/personagens/:id
 */
class Router {
  constructor() {
    this.routes = [];
  }

  add(method, routePath, handler) {
    const segments = routePath.split('/').filter(Boolean);
    this.routes.push({ method: method.toUpperCase(), segments, handler, routePath });
    return this;
  }

  get(routePath, handler) {
    return this.add('GET', routePath, handler);
  }

  post(routePath, handler) {
    return this.add('POST', routePath, handler);
  }

  /** Tenta casar um método + pathname com alguma rota registrada. */
  match(method, pathname) {
    const pathSegments = pathname.split('/').filter(Boolean);
    for (const route of this.routes) {
      if (route.method !== method.toUpperCase()) continue;
      if (route.segments.length !== pathSegments.length) continue;

      const params = {};
      let matched = true;
      for (let i = 0; i < route.segments.length; i++) {
        const routeSeg = route.segments[i];
        const pathSeg = decodeURIComponent(pathSegments[i]);
        if (routeSeg.startsWith(':')) {
          params[routeSeg.slice(1)] = pathSeg;
        } else if (routeSeg.toLowerCase() !== pathSeg.toLowerCase()) {
          matched = false;
          break;
        }
      }
      if (matched) return { handler: route.handler, params };
    }
    return null;
  }

  /** Retorna true se existe QUALQUER rota (de qualquer método) para esse pathname — útil para 405 vs 404. */
  pathExists(pathname) {
    const pathSegments = pathname.split('/').filter(Boolean);
    return this.routes.some((route) => {
      if (route.segments.length !== pathSegments.length) return false;
      return route.segments.every((seg, i) => seg.startsWith(':') || seg.toLowerCase() === decodeURIComponent(pathSegments[i]).toLowerCase());
    });
  }
}

module.exports = Router;
