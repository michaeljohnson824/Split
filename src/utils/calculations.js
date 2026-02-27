/**
 * Calculate each person's share of the bill.
 * people is an array of { name, venmo } objects.
 */
export function calculateSplit(items, people, assignments, tax, tip) {
  const personSubtotals = new Array(people.length).fill(0);

  items.forEach(item => {
    const assignedTo = assignments[item.id] || [];
    if (assignedTo.length > 0) {
      const sharePerPerson = item.price / assignedTo.length;
      assignedTo.forEach(personIdx => {
        if (personIdx >= 0 && personIdx < people.length) {
          personSubtotals[personIdx] += sharePerPerson;
        }
      });
    }
  });

  const totalSubtotal = personSubtotals.reduce((sum, s) => sum + s, 0);

  return people.map((person, idx) => {
    const name = typeof person === 'string' ? person : (person.name || '');
    const venmo = typeof person === 'string' ? '' : (person.venmo || '');

    const itemSubtotal = personSubtotals[idx];
    const ratio = totalSubtotal > 0 ? itemSubtotal / totalSubtotal : 1 / people.length;
    const personTax = (tax || 0) * ratio;
    const personTip = (tip || 0) * ratio;
    const total = itemSubtotal + personTax + personTip;

    const personItems = items
      .filter(item => (assignments[item.id] || []).includes(idx))
      .map(item => {
        const splitCount = (assignments[item.id] || []).length;
        return {
          id: item.id,
          name: item.name,
          fullPrice: item.price,
          share: item.price / splitCount,
          splitWith: splitCount > 1 ? splitCount : null,
        };
      });

    return {
      name,
      venmo,
      index: idx,
      items: personItems,
      itemSubtotal,
      tax: personTax,
      tip: personTip,
      total,
    };
  });
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount) {
  return `$${Math.abs(amount).toFixed(2)}`;
}

/**
 * Get list of unassigned items
 */
export function getUnassignedItems(items, assignments) {
  return items.filter(item => {
    const assigned = assignments[item.id] || [];
    return assigned.length === 0;
  });
}
