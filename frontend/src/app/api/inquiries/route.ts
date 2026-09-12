import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Inquiry } from "@/models/Inquiry";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDB();
    const data = await request.json();

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const newInquiry = await Inquiry.create({
      name: data.name,
      email: data.email,
      subject: data.subject || "No Subject",
      message: data.message,
    });

    return NextResponse.json({ success: true, data: newInquiry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    
    // Fetch all inquiries, sorted by newest first
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
