import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const ORIGINAL_PRICE = 4999;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body as { code: string };

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, error: "Coupon code is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", code.trim())
      .single();

    if (error || !coupon) {
      return NextResponse.json(
        { valid: false, error: "Invalid or expired code" },
        { status: 200 }
      );
    }

    // Check if coupon is active
    if (!coupon.is_active) {
      return NextResponse.json(
        { valid: false, error: "Invalid or expired code" },
        { status: 200 }
      );
    }

    // Check usage limit
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json(
        { valid: false, error: "Invalid or expired code" },
        { status: 200 }
      );
    }

    // Check valid dates
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return NextResponse.json(
        { valid: false, error: "Invalid or expired code" },
        { status: 200 }
      );
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return NextResponse.json(
        { valid: false, error: "Invalid or expired code" },
        { status: 200 }
      );
    }

    const discountAmount = coupon.discount_amount ?? 500;
    const finalPrice = Math.max(0, ORIGINAL_PRICE - discountAmount);

    return NextResponse.json({
      valid: true,
      originalPrice: ORIGINAL_PRICE,
      finalPrice,
      discountAmount,
      message: `You save ₹${discountAmount} 🎉`,
    });
  } catch (error) {
    console.error("Coupon validate error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
