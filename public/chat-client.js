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
    const noServer = 'Modo local · Esta página está abierta sin el servidor de IA. En tu equipo, abre INICIAR-RUMBO.cmd y entra en http://localhost:3000. Si es un sitio publicado, necesita un servidor con /api/chat.';
    if ([404, 405].includes(response.status)) return local(noServer);
    const isJson = response.headers.get('content-type')?.includes('application/json');
    if (!isJson) {
      if (response.ok) return local(noServer);
      if (response.status >= 500) return local('Modo local · El servidor de IA no está disponible temporalmente.');
      throw new Error('No se pudo enviar el mensaje. Inténtalo más tarde.');
    }
    let result;
    try { result = await response.json(); }
    catch { return local('Modo local · La respuesta de IA no llegó correctamente.'); }
    if (!response.ok) {
      if (response.status >= 500) return local(`Modo local · ${result.error || 'El servidor de IA no está disponible temporalmente.'}`);
      throw new Error(result.error || 'No se pudo enviar el mensaje. Inténtalo más tarde.');
    }
    if (typeof result.reply !== 'string' || !result.reply.trim()) return local('Modo local · La respuesta de IA no llegó correctamente.');
    return result;
  }
  root.RumboChatClient = { request };
})(typeof window === 'undefined' ? globalThis : window);
