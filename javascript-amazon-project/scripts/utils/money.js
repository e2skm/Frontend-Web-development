// Money related Utilityies
export function formatCurrency(priceInCents){
  return (priceInCents / 100).toFixed(2);
}