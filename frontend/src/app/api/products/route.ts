import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Product } from "@/models/Product";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDB();
    let products = await Product.find({}).sort({ createdAt: -1 });

    // Seed default products if DB is empty so inventory prices exist
    if (products.length === 0) {
      const initialProducts = [
        { sku: "WM-MINT-01", name: "Watermelon Mint", description: "Refreshing Hydration Drink", price: 149, stock: 150, isActive: true, image: "/can2.png" },
        { sku: "WM-CRAN-02", name: "Watermelon Cranberry", description: "Sweet & Tart Hydration", price: 149, stock: 60, isActive: true, image: "/can1.png" },
        { sku: "YZ-MINT-03", name: "Yuzu Mint", description: "Zesty & Cool Refreshment", price: 149, stock: 120, isActive: true, image: "/can4.png" },
        { sku: "GV-CHLI-04", name: "Guava Chilli", description: "Sweet with a Kick", price: 149, stock: 80, isActive: true, image: "/can3.png" },
      ];
      products = await Product.insertMany(initialProducts);
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const data = await request.json();
    const product = await Product.create(data);
    
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
