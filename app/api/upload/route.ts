import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

// Hàm làm sạch tên file tiếng Việt và ký tự đặc biệt
function makeUrlSafe(fileName: string) {
  // Tách riêng phần tên và phần đuôi file (.jpg, .png...)
  const lastDotIndex = fileName.lastIndexOf(".");
  const name = fileName.substring(0, lastDotIndex);
  const ext = fileName.substring(lastDotIndex);

  const safeName = name
    .normalize("NFD") // Tách các dấu thanh ra khỏi chữ cái tiếng Việt
    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu thanh
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D") // Xử lý riêng ký tự đ/Đ
    .toLowerCase() // Chuyển toàn bộ thành chữ thường
    .replace(/[^a-z0-9]/g, "-") // Biến mọi ký tự không phải chữ và số thành dấu gạch ngang (-)
    .replace(/-+/g, "-") // Gộp nhiều gạch ngang liên tiếp thành 1 gạch ngang duy nhất
    .replace(/^-+|-+$/g, ""); // Xóa gạch ngang bị thừa ở đầu hoặc cuối chuỗi

  return `${safeName}${ext}`;
}

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

    // Sử dụng hàm đã viết để tạo tên file an toàn cho URL
    const fileName = makeUrlSafe(file.name);

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
