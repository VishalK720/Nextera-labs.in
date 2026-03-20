import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getRazorpayInstance } from "@/lib/razorpay";

const ORIGINAL_PRICE = 4999;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, couponCode } = body as {
      applicationId: string;
      couponCode?: string;
    };

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Verify application exists and is accepted
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("id, email, full_name, status")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "accepted") {
      return NextResponse.json(
        { error: "Application has not been accepted yet" },
        { status: 400 }
      );
    }

    let finalAmount = ORIGINAL_PRICE;
    let couponId: string | null = null;

    // Validate coupon if provided
    if (couponCode) {
      const { data: coupon, error: couponError } = await supabase
        .from("coupons")
        .select("*")
        .ilike("code", couponCode.trim())
        .single();

      if (couponError || !coupon) {
        return NextResponse.json(
          { error: "Invalid coupon code" },
          { status: 400 }
        );
      }

      if (!coupon.is_active) {
        return NextResponse.json(
          { error: "Coupon is no longer active" },
          { status: 400 }
        );
      }

      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        return NextResponse.json(
          { error: "Coupon usage limit reached" },
          { status: 400 }
        );
      }

      const now = new Date();
      if (coupon.valid_from && new Date(coupon.valid_from) > now) {
        return NextResponse.json(
          { error: "Coupon is not yet valid" },
          { status: 400 }
        );
      }
      if (coupon.valid_until && new Date(coupon.valid_until) < now) {
        return NextResponse.json(
          { error: "Coupon has expired" },
          { status: 400 }
        );
      }

      const discountAmount = coupon.discount_amount ?? 500;
      finalAmount = Math.max(0, ORIGINAL_PRICE - discountAmount);
      couponId = coupon.id;
    }

    // Create Razorpay order (amount in paise)
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: finalAmount * 100,
      currency: "INR",
      receipt: `app_${applicationId}`,
      notes: {
        application_id: applicationId,
        email: application.email,
        full_name: application.full_name,
      },
    });

    // Save payment record
    const { error: paymentError } = await supabase.from("payments").insert({
      application_id: applicationId,
      razorpay_order_id: order.id,
      amount: finalAmount,
      currency: "INR",
      status: "pending",
      coupon_id: couponId,
    });

    if (paymentError) {
      console.error("Payment insert error:", paymentError);
      return NextResponse.json(
        { error: "Failed to create payment record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      amount: finalAmount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID!,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
