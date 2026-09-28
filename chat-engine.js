(function (root) {
  "use strict";
  const normalize = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const money = value => `L ${new Intl.NumberFormat("es-HN", { maximumFractionDigits: 2 }).format(value)}`;
  const words = { uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12 };
  const number = value => words[value] || Number(value);
  const defaults = ["Crear mi pase", "Recomiéndame un destino", "Ver hoteles", "Qué llevar"];
  const questions = {
    company: ["Primero, el equipo de esta aventura: ¿viajas solo, en pareja, con familia o con amigos?", ["Viajo solo", "En pareja", "Con familia", "Con amigos"]],
    people: ["¿Cuántos viajeros se apuntan? Cuenta a todos, incluidos los niños (de 1 a 12).", ["Somos dos", "Somos tres", "Somos cuatro"]],
    style: ["Ahora sí, imaginemos el escenario: ¿mar y descanso, naturaleza y aventura, o cultura y ciudad?", ["Playa", "Naturaleza", "Cultura", "Sin preferencia"]],
    budget: ["¿Con cuánto contamos en total para el grupo? Dímelo en lempiras; por ejemplo, «20 mil» o «10000 por persona».", ["15000 en total", "25000 en total", "50000 en total"]]
  };
  function amount(value) {
    let cleaned = value.trim();
    if (/^\d{1,3}(?:[.,]\d{3})+$/.test(cleaned)) cleaned = cleaned.replace(/[.,]/g, "");
    else if (/^\d+,\d{1,2}$/.test(cleaned)) cleaned = cleaned.replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  function respond(text, previous, context, state) {
    const q = normalize(text);
    const plan = { ...previous };
    const trips = context.trips?.length ? context.trips : context.catalog;
    const products = context.products || root.RumboProducts || [];
    const mentioned = trips.filter(t => q.includes(normalize(t.name)) || new RegExp(`\\b${t.id}\\b`).test(q));
    if (mentioned.length) state.destination = mentioned[0].id;
    const trip = trips.find(t => t.id === state.destination);
    const answer = (reply, options = defaults, actions = [], changed = false) => ({ reply, options, actions, plan: changed ? plan : null, step: state.step || "" });
    const link = (label, view = "destinos", destination = trip?.id) => ({ label, href: `viajes.html?${new URLSearchParams({ pantalla: view, ...(destination ? { destino: destination } : {}) })}` });
    if (/^(hola|buenas|buenos dias|buenas tardes|hey)[!. ]*$/.test(q)) return answer("¡Hola! Soy Rumbito, tu compañero de aventuras. ¿Vamos tras una playa tranquila, una escapada cultural o un poco de montaña? Cuéntame tu idea y buscamos una opción para ti.");
    if (/^(gracias|muchas gracias|genial|perfecto|ok)[!. ]*$/.test(q)) return answer("¡Con gusto! Me quedo por aquí para afinar los detalles. Un buen viaje también deja espacio para improvisar.", state.step ? questions[state.step][1] : defaults);
    if (/quien eres|eres una ia|como funcionas|eres chatgpt/.test(q)) return answer("Soy Rumbito, el asistente virtual de Rumbo. Trabajo con la información y las opciones de esta página para ayudarte a elegir, comparar y preparar tu pase. No consulto Internet ni hago reservas.");
    if (/cancelar|salir del pase|dejemos el pase/.test(q)) { state.active = false; state.step = ""; return answer("Dejamos el pase en pausa. Tus datos siguen aquí mientras la página esté abierta. ¿Vemos algún destino?"); }
    if (/contacto|telefono|correo|hablar.*(persona|humano)|soporte/.test(q)) return answer("El equipo de Rumbo puede orientarte por estos contactos publicados:\n" + context.contacts.join("\n"));
    if (/reservar|reserva|pagar|pago|cancelacion|reembolso/.test(q)) return answer("Aquí puedes explorar y guardar una idea de viaje, pero no contratarla. Rumbo es una demostración: los precios, vuelos, hoteles y el carrito son de muestra. No se cobran pagos ni se emiten boletos.", ["Crear mi pase", "Contactos"]);
    if (/visa|pasaporte|documento|requisito|vacuna/.test(q)) return answer("Antes de cerrar las maletas: revisa la vigencia de tu documento, los requisitos del destino y de las escalas, y las condiciones de la aerolínea. Dependen de tu nacionalidad y fecha de viaje; confírmalos con el consulado correspondiente. No compartas documentos personales en el chat.", ["Qué llevar", "Crear mi pase"], [{ label: "Guía de documentos", href: "#guia-documentos" }]);
    if (/clima|temperatura|llover|lluvia|mejor epoca/.test(q)) return answer("No tengo pronóstico en tiempo real. Revisa el clima de tu destino cerca de la salida y deja una actividad bajo techo como plan B. Si vas a montaña, confirma también las condiciones de las rutas.", ["Qué llevar", "Ver destinos"]);
    if (/seguro|traslado|guia local|experiencias/.test(q)) return answer("El inicio presenta seguros, traslados y experiencias, pero todavía no permite contratarlos. En viajes puedes explorar las propuestas de destinos. Para traslados, revisa la ciudad de llegada: algunos recorridos terrestres no están incluidos.", ["Ver vuelos", "Ver destinos"], [link("Explorar viajes")]);
    const shortFollowup = mentioned.some(t => q === normalize(t.name) || q === `y ${normalize(t.name)}` || q === `y en ${normalize(t.name)}`);
    const hotelsIntent = /hotel|hospedaje|alojamiento/.test(q) || (state.topic === "hotels" && (shortFollowup || /mas barato|mas economico/.test(q)));
    if (hotelsIntent) {
      state.topic = "hotels";
      if (!trip) return answer("Busquemos un lugar para descansar. ¿En qué destino quieres ver hoteles?", trips.map(t => `Hoteles en ${t.name}`));
      const hotels = [...(trip.hotels || [])].sort((a, b) => a.rate - b.rate);
      return answer(`En ${trip.name} estas son las opciones de muestra, de menor a mayor tarifa base:\n${hotels.map(h => `• ${h.name}: ${money(h.rate)} por noche, habitación estándar. ${h.stars} estrellas; ${h.amenities.join(", ")}.`).join("\n")}\nEl total cambia con las noches, habitaciones y categoría. No es el precio del pase ni confirma disponibilidad.`, ["Ver vuelos", "Crear mi pase", `Itinerario de ${trip.name}`], [link("Explorar estos hoteles", "hoteles")]);
    }
    if (/vuelo|avion|volar|aeropuerto/.test(q) || (state.topic === "flights" && shortFollowup)) {
      state.topic = "flights";
      if (!trip) return answer("¿A dónde volamos? El simulador sale de Tegucigalpa o San Pedro Sula. Elige el destino y te cuento las opciones.", trips.map(t => `Vuelos a ${t.name}`));
      const origin = /san pedro/.test(q) ? "San Pedro Sula" : "Tegucigalpa";
      const flights = context.flights?.(trip, origin) || [];
      return answer(flights.length ? `Para ${trip.name}, desde ${origin}, el simulador muestra:\n${flights.map(f => `• ${f.departure}: ${money(f.economy)} por viajero en económica (${f.stops.toLowerCase()}).`).join("\n")}\nLlegada: ${trip.arrival}. ${trip.transfer || ""}\nSon vuelos ficticios; elige fechas y viajeros en la página para explorar el cálculo.` : "No hay un vuelo de muestra para ese origen y llegada. Puedes cambiar el origen en el explorador.", ["Ver hoteles", "Crear mi pase"], [link("Explorar vuelos", "vuelos")]);
    }
    if (/itinerario|que (hacer|visitar)|actividades|plan de.*dias/.test(q)) {
      if (!trip) return answer("¡Hagamos espacio para disfrutar! ¿Para qué destino armamos una idea de itinerario?", trips.map(t => `Itinerario de ${t.name}`));
      return answer(`Una escapada sin correr por ${trip.name}:\n• Al llegar: acomódate y da un paseo corto para ubicarte.\n${(trip.highlights || [trip.description]).map((h, i) => `• Momento ${i + 1}: ${h.toLowerCase()}.`).join("\n")}\n• Antes de volver: deja margen para el traslado y una última comida tranquila.\n${trip.tip || ""}\nEs inspiración: no incluye entradas, horarios ni servicios reservados.`, ["Qué llevar", "Ver hoteles", "Crear mi pase"], [link("Ver destino")]);
    }
    const productMatches = products.filter(p => normalize(p.name).split(/\s+/).filter(w => w.length > 3).some(w => q.includes(w)));
    if (/tienda|comprar|accesorio|carrito|precio.*(mochila|maleta)/.test(q) || productMatches.length) {
      const selected = productMatches.length ? productMatches.slice(0, 5) : products.slice(0, 4);
      return answer(`Para tu equipo de viaje, la tienda tiene estas opciones:\n${selected.map(p => `• ${p.name}: ${money(p.price)}. ${p.description}`).join("\n")}\nPuedes comparar artículos y preparar un carrito de muestra. No hay cobros ni pedidos reales.`, ["Qué llevar", "Crear mi pase"], [{ label: "Abrir tienda", href: "tienda.html" }]);
    }
    if (/que llevar|empacar|equipaje|maletas|checklist/.test(q)) return answer(`Mi lista para viajar ligero${trip ? ` a ${trip.name}` : ""}:\n• Documento vigente y copias guardadas de forma segura.\n• Ropa combinable, calzado cómodo y artículos de higiene.\n• Cargador, batería portátil y adaptador si corresponde.\n• ${trip?.type === "playa" || plan.style === "playa" ? "Traje de baño, protección solar y bolsa para ropa mojada." : trip?.type === "naturaleza" || plan.style === "naturaleza" ? "Capas de ropa, impermeable y calzado apropiado para senderos." : "Una capa ligera y una mochila pequeña para pasear."}\nConfirma medidas y peso del equipaje con tu aerolínea.`, ["Ver accesorios", "Documentos", "Crear mi pase"], [{ label: "Explorar accesorios", href: "tienda.html" }, { label: "Guía de equipaje", href: "#guia-equipaje" }]);
    if (/compar|diferencia|\bvs\b/.test(q)) {
      const selected = mentioned.length > 1 ? mentioned : trips.slice(0, 3);
      return answer("Pongamos las opciones lado a lado:\n" + selected.map(t => {
        const base = context.catalog.find(c => c.id === t.id);
        return `• ${t.name}: ${t.tag || t.style}. ${base ? `${base.duration}; base del pase ${money(base.price)} por persona.` : "Disponible en el explorador, sin pase en el inicio."}`;
      }).join("\n") + "\nTodos son importes de muestra. ¿Qué estilo te apetece más?", ["Playa", "Naturaleza", "Cultura", "Crear mi pase"]);
    }
    const start = /pase|planifica|planea|organiza.*viaje|quiero (ir|viajar)|recom|presupuesto|somos|viajamos|en pareja|viajo sol|con (familia|amigos)|(?:tengo|tenemos|cuento con|contamos con)\s+\d|cambiar.*viajeros/.test(q);
    const style = /\b(playa|mar|descanso)\b/.test(q) ? "playa" : /naturaleza|montana|aventura|senderismo/.test(q) ? "naturaleza" : /cultura|ciudad|historia/.test(q) ? "cultura" : /sin preferencia|cualquiera/.test(q) ? "all" : "";
    if (start || style || state.active || /^\d/.test(q)) {
      state.active = true;
      if (/cambiar (el )?presupuesto/.test(q)) { plan.budget = 0; delete state.perPerson; }
      if (/cambiar (los )?viajeros/.test(q)) plan.people = 0;
      if (/\b(dolar|dolares|usd|euro|euros)\b|\$/.test(q)) return answer("Para comparar con el catálogo necesito el presupuesto en lempiras (HNL). No tengo un tipo de cambio actualizado. ¿Qué importe en HNL quieres usar?", questions.budget[1]);
      if (/sol[oa]\b/.test(q)) { plan.company = "Solo"; plan.people = 1; }
      else if (/pareja/.test(q)) { plan.company = "Pareja"; if (!plan.people) plan.people = 2; }
      else if (/familia/.test(q)) plan.company = "Familia";
      else if (/amigos/.test(q)) plan.company = "Amigos";
      const count = q.match(/(?:somos|viajamos|iremos|vamos|personas somos)\s+(\d+|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)\b/) || q.match(/\b(\d+|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)\s+(?:personas|viajeros|adultos)\b/);
      const bare = /^(\d+|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)$/.test(q);
      const people = count ? number(count[1]) : state.step === "people" && bare ? number(q) : null;
      if (people !== null) {
        if (people < 1 || people > 12) return answer("El pase admite de 1 a 12 viajeros. ¿Cuántos incluimos?", questions.people[1]);
        plan.people = people;
      }
      if (style) plan.style = style;
      const budget = q.match(/(?:presupuesto(?:\s+(?:de|es))?|tengo|tenemos|cuento con|contamos con|hnl|l\s)\s*(\d[\d.,]*)(?:\s*(mil|k))?/) || q.match(/(\d[\d.,]*)\s*(mil|k|lempiras|hnl|en total|por persona)\b/) || (state.step === "budget" ? q.match(/^(\d[\d.,]*)$/) : null);
      if (budget) {
        const n = amount(budget[1]) * (/^(mil|k)$/.test(budget[2] || "") ? 1000 : 1);
        if (!n || n > 100000000) return answer("Ese importe no me permite hacer una comparación. Prueba con un presupuesto positivo en HNL, por ejemplo 20000.", questions.budget[1]);
        if (/por persona/.test(q)) { state.perPerson = n; plan.budget = plan.people ? n * plan.people : 0; }
        else { plan.budget = n; delete state.perPerson; }
      }
      if (state.perPerson && plan.people) plan.budget = state.perPerson * plan.people;
      if (mentioned.length && /pase|quiero|elegir|prefiero/.test(q)) state.wanted = mentioned[0].id;
      if (/otro destino|cualquier destino|alternativas/.test(q)) state.wanted = null;
      state.step = ["company", "people", "style", "budget"].find(field => !plan[field]) || "";
      if (state.step) {
        const intro = mentioned.length ? `${mentioned[0].name} suena a una buena aventura. ` : budget || count || style ? "¡Voy tomando nota! " : "";
        return answer(intro + questions[state.step][0], questions[state.step][1], [], true);
      }
      const affordable = context.catalog.filter(t => t.price * plan.people <= plan.budget).sort((a, b) => a.price - b.price);
      const matching = affordable.filter(t => plan.style === "all" || t.style === plan.style);
      let choices = matching.length ? matching : affordable;
      if (state.wanted) {
        plan.destination = state.wanted;
        const wanted = context.catalog.find(t => t.id === state.wanted);
        if (!wanted) return answer("Ese destino está en el explorador de viajes, pero todavía no forma parte del pase del inicio. Podemos explorar sus servicios o elegir otro destino para el pase.", ["Otro destino", "Ver hoteles"], [link("Explorar destino")], true);
        if (wanted.price * plan.people > plan.budget) return answer(`Para ${wanted.name}, la base del grupo sería ${money(wanted.price * plan.people)} y tu presupuesto es ${money(plan.budget)}. ¿Ajustamos el importe o buscamos otro destino?`, ["Otro destino", "25000 en total", "50000 en total"], [], true);
        choices = [wanted];
      }
      if (!choices.length) {
        state.step = "budget";
        return answer(`Con ${money(plan.budget)} para ${plan.people} viajeros no hay un pase dentro del presupuesto. La base más baja del grupo es ${money(Math.min(...context.catalog.map(t => t.price)) * plan.people)}. Podemos cambiar el importe o el número de viajeros.`, ["15000 en total", "25000 en total", "Cancelar"], [], true);
      }
      state.active = false; state.topic = ""; state.destination = choices[0].id;
      plan.destination = choices[0].id;
      return answer(`¡Ya tenemos rumbo! ${choices[0].name} encaja en tu presupuesto.\n${choices.map(t => `• ${t.name}: ${money(t.price)} por persona × ${plan.people} = ${money(t.price * plan.people)} de base para el grupo.`).join("\n")}\n${!matching.length || (state.wanted && plan.style !== "all" && choices[0].style !== plan.style) ? "Ten en cuenta que esta opción es de otro estilo al que indicaste. " : ""}Tu pase está preparado para guardar o compartir. Estos importes son de muestra, no cotizaciones; vuelos y hoteles se exploran por separado.`, ["Ver hoteles", "Ver vuelos", `Itinerario de ${choices[0].name}`, "Qué llevar"], [{ label: "Ver mi pase", href: "#mi-pase" }], true);
    }
    if (trip && mentioned.length) return answer(`${trip.name}: ${trip.description}\n${trip.tip || ""}\n¿Te imaginas ahí? Podemos explorar dónde dormir, qué hacer o preparar un pase.`, [`Hoteles en ${trip.name}`, `Itinerario de ${trip.name}`, `Quiero un pase para ${trip.name}`], [link("Explorar destino")]);
    if (/destino|opciones|donde|barato|economico/.test(q)) return answer("Tenemos seis rumbos para imaginar:\n" + trips.map(t => `• ${t.name}: ${t.tag || t.style}.`).join("\n") + "\nEn el pase del inicio, Copán Ruinas tiene la base más baja: L 4,500 por persona. ¿Lo comparamos con tus gustos y presupuesto?", ["Crear mi pase", "Comparar destinos", "Hoteles en La Ceiba"]);
    return answer("Quiero ayudarte bien: puedo comparar destinos de Rumbo, buscar sus hoteles y vuelos de muestra, sugerir equipaje o armar tu pase. Prueba con «hoteles en Bali» o «viajo con amigos, somos 3 y tenemos 30 mil». ¿Por dónde empezamos?");
  }
  root.RumboChat = { respond, normalize, amount, defaults };
})(typeof window === "undefined" ? globalThis : window);
