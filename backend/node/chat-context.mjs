const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Keep the provider request small enough for the free tier. The planner still
// uses the full catalogue; only the context sent to the language model is reduced.
export function chatContext(context, message, state = {}) {
  const words = normalize(message).split(/[^\p{L}\p{N}]+/u).filter(word => word.length >= 3);
  const score = item => {
    const name = normalize(`${item.id || ''} ${item.name}`);
    return (item.id && item.id === state.destination ? 100 : 0) + words.reduce((n, word) => n + (name.includes(word) ? 1 : 0), 0);
  };
  const select = (items, count) => [...items].sort((a, b) => score(b) - score(a)).slice(0, count);
  return JSON.stringify({
    destinations: select(context.trips, 6).map(d => ({
      id: d.id, name: d.name, description: String(d.description || '').slice(0, 160),
      budgetHNL: d.inspirationBudget, flightFromHNL: context.flights(d, 'Tegucigalpa')[0]?.economy
    })),
    products: select(context.products, 4).map(({name, price}) => ({name, priceHNL: price}))
  });
}

export function chatHistory(history, budget = 4000) {
  const recent = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const {role, content} = history[i];
    if (content.length > budget) break;
    recent.unshift({role, content});
    budget -= content.length;
  }
  return recent;
}
