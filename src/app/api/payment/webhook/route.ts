import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify Razorpay webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const supabase = createAdminClient();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      // Update payment status
      const { data: paymentRecord, error: paymentError } = await supabase
        .from("payments")
        .update({
          status: "captured",
          razorpay_payment_id: payment.id,
          paid_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", orderId)
        .select("application_id, coupon_id")
        .single();

      if (paymentError || !paymentRecord) {
        console.error("Payment update error:", paymentError);
        return NextResponse.json(
          { error: "Payment record not found" },
          { status: 404 }
        );
      }

      // Increment coupon used_count if coupon was used
      if (paymentRecord.coupon_id) {
        await supabase.rpc("increment_coupon_usage", {
          coupon_id: paymentRecord.coupon_id,
        }).then(({ error }) => {
          if (error) {
            // Fallback: manual increment
            return supabase
              .from("coupons")
              .update({ used_count: supabase.rpc ? undefined : 0 })
              .eq("id", paymentRecord.coupon_id);
          }
        }).catch(async () => {
          // Fallback: fetch and increment manually
          const { data: coupon } = await supabase
            .from("coupons")
            .select("used_count")
            .eq("id", paymentRecord.coupon_id!)
            .single();
          if (coupon) {
            await supabase
              .from("coupons")
              .update({ used_count: (coupon.used_count ?? 0) + 1 })
              .eq("id", paymentRecord.coupon_id!);
          }
        });
      }

      // Update application status to enrolled
      const { data: application } = await supabase
        .from("applications")
        .update({ status: "enrolled" })
        .eq("id", paymentRecord.application_id)
        .select("cohort_id")
        .single();

      // Increment cohort enrolled_count
      if (application?.cohort_id) {
        const { data: cohort } = await supabase
          .from("cohorts")
          .select("enrolled_count")
          .eq("id", application.cohort_id)
          .single();

        if (cohort) {
          await supabase
            .from("cohorts")
            .update({ enrolled_count: (cohort.enrolled_count ?? 0) + 1 })
            .eq("id", application.cohort_id);
        }
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
