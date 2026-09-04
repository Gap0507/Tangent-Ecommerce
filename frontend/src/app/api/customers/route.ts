import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Customer } from "@/models/Customer";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: customers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
