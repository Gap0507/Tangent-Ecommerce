import { Product } from "@/models/Product";

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function deductInventoryForOrder(items: any[]) {
  for (const item of items) {
    try {
      const itemSize = item.size || "";
      const itemQuantity = item.quantity || 1;

      // Case 1: Custom Variety Pack or item containing flavor breakdown like "8 Cans: 2 x Watermelon Mint, ..."
      if (itemSize.includes("Cans:") || item.name.toLowerCase().includes("variety pack") || (itemSize.includes("x ") && !itemSize.includes("Pack of"))) {
        const breakdownPart = itemSize.includes("Cans:") ? itemSize.split("Cans:")[1] : itemSize;
        const regex = /(\d+)\s*x\s*([^,()]+)/gi;
        let match;
        let processedBreakdown = false;

        while ((match = regex.exec(breakdownPart)) !== null) {
          processedBreakdown = true;
          const cansQty = parseInt(match[1], 10);
          const flavorName = match[2].trim();
          const totalCansToDeduct = cansQty * itemQuantity;

          const cleanFlavor = flavorName.replace(/\s*\([^)]*\)/g, "").trim();

          await Product.findOneAndUpdate(
            {
              $or: [
                { name: { $regex: new RegExp(`^${escapeRegExp(cleanFlavor)}$`, "i") } },
                { name: { $regex: new RegExp(escapeRegExp(cleanFlavor), "i") } },
                { sku: { $regex: new RegExp(escapeRegExp(cleanFlavor.replace(/\s+/g, "-")), "i") } },
              ],
            },
            { $inc: { stock: -totalCansToDeduct } }
          );
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
      let updated = false;

      // Try updating by MongoDB _id first if valid ObjectId
      const prodIdStr = String(item.productId || "");
      if (prodIdStr && prodIdStr.match(/^[0-9a-fA-F]{24}$/) && prodIdStr !== "650000000000000000000001") {
        const updatedDoc = await Product.findByIdAndUpdate(prodIdStr, {
          $inc: { stock: -totalCansToDeduct },
        });
        if (updatedDoc) updated = true;
      }

      // Fallback: search by SKU or Name if ID lookup didn't update any document
      if (!updated) {
        const cleanName = item.name ? item.name.replace(/\s*\([^)]*\)/g, "").trim() : "";
        await Product.findOneAndUpdate(
          {
            $or: [
              { sku: item.sku },
              { name: { $regex: new RegExp(`^${escapeRegExp(cleanName)}$`, "i") } },
              { name: { $regex: new RegExp(escapeRegExp(cleanName), "i") } },
              { sku: { $regex: new RegExp(escapeRegExp(cleanName.replace(/\s+/g, "-")), "i") } },
            ],
          },
          { $inc: { stock: -totalCansToDeduct } }
        );
      }
    } catch (e) {
      console.error(`Failed to deduct inventory for item ${item.name}:`, e);
    }
  }
}
