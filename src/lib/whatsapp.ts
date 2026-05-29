export function generateWhatsAppLink(
  phone: string,
  productName?: string
): string {
  const cleaned = phone.replace(/\D/g, "");
  const message = productName
    ? `Bonjour, je suis intéressé par le produit: ${productName} sur Mantouji.`
    : "Bonjour, je souhaite en savoir plus sur Mantouji.";
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
