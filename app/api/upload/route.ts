import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Không tìm thấy file" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Tạo tên file an toàn (tránh lỗi font chữ tiếng Việt)
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await r2.send(command);

    return NextResponse.json({
      success: true,
      url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload thất bại" }, { status: 500 });
  }
}
