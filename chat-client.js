(function (root) {
  'use strict';
  // A static preview or an interrupted connection must not disable the planner.
  async function request(payload, { fetchImpl = (...args) => fetch(...args), protocol = location.protocol, fallback } = {}) {
    const local = reason => ({ ...fallback(), source: 'local', connectionNotice: reason });
    if (protocol === 'file:') return local('Modo local · Abre INICIAR-RUMBO.cmd para conversar con IA.');
    let response;
    try {
      response = await fetchImpl(new URL('api/chat', location.href), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(35000), body: JSON.stringify(payload)
      });
    } catch {
      return local('Modo local · La IA no está disponible; sigo con el catálogo de Rumbo.');
    }
    if ([404, 405].includes(response.status)) return local('Modo local · Esta vista no tiene el servidor de IA conectado.');
    if (response.status >= 500) return local('Modo local · La IA no está disponible; sigo con el catálogo de Rumbo.');
    const isJson = response.headers.get('content-type')?.includes('application/json');
    if (!isJson) {
      if (response.ok) return local('Modo local · Esta vista no tiene el servidor de IA conectado.');
      throw new Error('No se pudo enviar el mensaje. Inténtalo más tarde.');
    }
    let result;
    try { result = await response.json(); }
    catch { return local('Modo local · La respuesta de IA no llegó correctamente.'); }
    if (!response.ok) throw new Error(result.error || 'No se pudo enviar el mensaje. Inténtalo más tarde.');
    if (typeof result.reply !== 'string' || !result.reply.trim()) return local('Modo local · La respuesta de IA no llegó correctamente.');
    return result;
  }
  root.RumboChatClient = { request };
})(typeof window === 'undefined' ? globalThis : window);
