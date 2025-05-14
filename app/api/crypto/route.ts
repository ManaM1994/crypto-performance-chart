import { NextRequest, NextResponse } from "next/server";
import {
  generateFullCryptoData,
  paginateData,
  simulateApiDelay,
} from "@/mocks/cryptoData";

let fullData = generateFullCryptoData(5000);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "100");

  if (size > 100) {
    return NextResponse.json(
      { error: "Size cannot exceed 100 items per page" },
      { status: 400 }
    );
  }

  try {
    await simulateApiDelay();

    const paginatedData = paginateData(fullData, page, size);

    return NextResponse.json(paginatedData);
  } catch (error) {
    console.error("Error in crypto API:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
