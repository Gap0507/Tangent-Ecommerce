import { Product } from "@/models/Product";

function normalizeString(str: string): string {
  return (str || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/gi, "");
}

export function findMatchingProduct(cleanFlavor: string, products: any[]) {
  const normInput = normalizeString(cleanFlavor);
  if (!normInput) return null;

  return products.find((p: any) => {
    const normName = normalizeString(p.name);
    const normSku = normalizeString(p.sku);
    const normId = normalizeString(String(p._id));

    return (
      normName.includes(normInput) ||
      normInput.includes(normName) ||
      normSku === normInput ||
      normId === normInput ||
      (normInput.includes("watermelon") && normInput.includes("mint") && normName.includes("watermelon") && normName.includes("mint")) ||
      (normInput.includes("watermelon") && normInput.includes("cranberry") && normName.includes("watermelon") && normName.includes("cranberry")) ||
      (normInput.includes("yuzu") && normName.includes("yuzu")) ||
      (normInput.includes("guava") && normName.includes("guava"))
    );
  });
}

export async function deductInventoryForOrder(items: any[]) {
  try {
    const allProducts = await Product.find({});

    for (const item of items) {
      const itemSize = item.size || "";
      const itemQuantity = item.quantity || 1;

      // Case 1: Custom Variety Pack or item containing flavor breakdown (e.g. "4 Cans: 1 x Watermelon Mint, ...")
      if (
        itemSize.includes("Cans:") ||
        item.name.toLowerCase().includes("variety pack") ||
        (itemSize.includes("x ") && !itemSize.startsWith("Pack of"))
      ) {
        const breakdownPart = itemSize.includes("Cans:") ? itemSize.split("Cans:")[1] : itemSize;
        const regex = /(\d+)\s*x\s*([^,()]+)/gi;
        let match;
        let processedBreakdown = false;

        while ((match = regex.exec(breakdownPart)) !== null) {
          processedBreakdown = true;
          const cansQty = parseInt(match[1], 10);
          const flavorName = match[2].trim();
          const totalCansToDeduct = cansQty * itemQuantity;

          const matchedProd = findMatchingProduct(flavorName, allProducts);
          if (matchedProd) {
            const currentStock = typeof matchedProd.stock === "number" ? matchedProd.stock : 0;
            const newStock = Math.max(0, currentStock - totalCansToDeduct);
            await Product.findByIdAndUpdate(matchedProd._id, { stock: newStock });
            matchedProd.stock = newStock;
            console.log(`[Inventory] Deducted ${totalCansToDeduct} cans from ${matchedProd.name}. New stock: ${newStock}`);
          } else {
            console.error(`[Inventory] Variety pack flavor match not found for: "${flavorName}"`);
          }
        }

        if (processedBreakdown) continue;
      }

      // Case 2: Standard Single-Flavor Pack (Pack of 4, Pack of 8, Pack of 24)
      let cansPerPack = 1;
      const packMatch = itemSize.match(/Pack of (\d+)/i) || itemSize.match(/(\d+)\s*cans?/i);
      if (packMatch && packMatch[1]) {
        cansPerPack = parseInt(packMatch[1], 10);
      }

      const totalCansToDeduct = cansPerPack * itemQuantity;
      let matchedProd = null;

      // 1. Try finding by MongoDB _id first
      const prodIdStr = String(item.productId || "");
      if (prodIdStr && prodIdStr.match(/^[0-9a-fA-F]{24}$/) && prodIdStr !== "650000000000000000000001") {
        matchedProd = allProducts.find((p: any) => String(p._id) === prodIdStr);
      }

      // 2. Try by SKU or Name fallback
      if (!matchedProd) {
        matchedProd = findMatchingProduct(item.sku || item.name, allProducts);
      }
      if (!matchedProd) {
        matchedProd = findMatchingProduct(item.name, allProducts);
      }

      if (matchedProd) {
        const currentStock = typeof matchedProd.stock === "number" ? matchedProd.stock : 0;
        const newStock = Math.max(0, currentStock - totalCansToDeduct);
        await Product.findByIdAndUpdate(matchedProd._id, { stock: newStock });
        matchedProd.stock = newStock;
        console.log(`[Inventory] Deducted ${totalCansToDeduct} cans from ${matchedProd.name}. New stock: ${newStock}`);
      } else {
        console.error(`[Inventory] Product not found for inventory deduction: ${item.name} (${item.sku})`);
      }
    }
  } catch (e) {
    console.error("[Inventory] Failed to deduct inventory for order:", e);
  }
}
