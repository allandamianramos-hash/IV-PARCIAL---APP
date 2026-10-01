import { test } from "node:test";
import assert from "node:assert/strict";
import "../public/chat-engine.js";
const context = {
  catalog: [{ id: "roatan", name: "Roatán", style: "playa", price: 8500, duration: "4 días" }, { id: "copan", name: "Copán Ruinas", style: "cultura", price: 4500, duration: "3 días" }],
  trips: [{ id: "roatan", name: "Roatán", description: "Playa", tag: "Playa", highlights: ["Explorar la isla"], hotels: [{ name: "Hotel Mar", rate: 1500, stars: 3, amenities: ["Wi-Fi"] }] }, { id: "copan", name: "Copán Ruinas", description: "Historia", hotels: [] }, { id: "la-ceiba", name: "La Ceiba", description: "Naturaleza", hotels: [] }],
  products: [{ name: "Power Bank", price: 350, description: "Batería portátil" }], contacts: ["contacto@ejemplo.test"]
};
function conversation() {
  let plan = {}; const state = {};
  return text => { const result = globalThis.RumboChat.respond(text, plan, context, state); if (result.plan) plan = result.plan; return result; };
}
test("conecta los nuevos servicios desde el chat", () => {
  for (const [text, section] of [["Quiero un seguro", "seguros"], ["Necesito traslados", "traslados"], ["Guías locales en Copán Ruinas", "guias"]]) {
    const result = conversation()(text);
    assert.match(result.actions[0].href, new RegExp(`servicios.html\\?seccion=${section}`));
    assert.equal(result.plan, null);
  }
});
test("recoge varias preferencias en lenguaje natural", () => {
  const send = conversation();
  const result = send("viajo con familia, somos dos, queremos playa y tenemos 20 mil");
  assert.equal(result.plan.people, 2); assert.equal(result.plan.budget, 20000);
  assert.equal(result.plan.destination, "roatan"); assert.match(result.reply, /resumen al finalizar tu plan/);
});
test("normaliza presupuestos habituales", () => {
  for (const text of ["20 mil", "20,000", "20.000", "20000"]) {
    const send = conversation(); send("Viajo solo"); send("Playa");
    assert.equal(send(text).plan.budget, 20000);
  }
});
test("importe por persona espera el numero y se recalcula", () => {
  const send = conversation();
  send("tengo 10000 por persona"); send("con amigos");
  const r = send("somos tres"); assert.equal(r.plan.budget, 30000);
  send("playa"); assert.equal(send("somos dos").plan.budget, 20000);
});
test("conversacion guiada completa", () => {
  const send = conversation();
  assert.equal(send("Crear mi pase").step, "company");
  assert.equal(send("Con familia").step, "people");
  assert.equal(send("cuatro").step, "style");
  assert.equal(send("Cultura").step, "budget");
  assert.equal(send("25000").plan.destination, "copan");
});
test("rechaza presupuesto insuficiente y cuenta fuera del rango", () => {
  const send = conversation();
  assert.match(send("somos 20").reply, /1 a 12/);
  send("con familia somos dos cultura");
  assert.match(send("tenemos 1000").reply, /no hay un plan/);
});
test("no convierte moneda extranjera arbitrariamente", () => {
  assert.match(conversation()("tengo 1000 dolares").reply, /tipo de cambio/);
});
test("hoteles conserva destino y permite cambiar a itinerario", () => {
  const send = conversation();
  send("Ver hoteles"); assert.match(send("Roatán").reply, /Hotel Mar/);
  assert.match(send("Itinerario de Roatán").reply, /Al llegar/);
});
test("consultar hoteles no regenera el pase", () => {
  const send = conversation(); send("viajo solo playa tengo 10000");
  assert.equal(send("Hoteles en Roatán").plan, null);
});
test("destino pedido no se sustituye por otro mas barato", () => {
  const send = conversation();
  const result = send("Quiero un pase para Roatán, viajo solo playa tengo 5000");
  assert.match(result.reply, /Ajustamos/); assert.equal(result.plan.destination, "roatan");
});
test("destino fuera del pase se explica", () => {
  assert.match(conversation()("Quiero un pase para La Ceiba, viajo solo naturaleza tengo 20000").reply, /no forma parte/);
});
test("productos especificos y contactos salen del catalogo", () => {
  const send = conversation();
  assert.match(send("precio de power bank").reply, /350/);
  assert.match(send("contactos").reply, /contacto@ejemplo.test/);
});
test("editar presupuesto conserva el resto y reinicia la pregunta", () => {
  const send = conversation(); send("viajo solo playa tengo 10000");
  assert.equal(send("cambiar presupuesto").step, "budget");
  assert.equal(send("20000").plan.destination, "roatan");
});
test("preguntas ajenas no inventan respuestas ni reservas", () => {
  assert.match(conversation()("escribe codigo python").reply, /puedo comparar/);
  assert.match(conversation()("quiero reservar").reply, /reunir tus selecciones en Mi viaje/);
});

