"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

/* ---------- schemas ---------- */

const step1Schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15, "Enter a valid phone number"),
  classLevel: z.enum(["11", "12"], {
    message: "Select your class",
  }),
  city: z.string().min(2, "City is required"),
  school: z.string().min(2, "School name is required"),
});

const step2Schema = z.object({
  whyNextera: z
    .string()
    .min(50, "Tell us more — at least 50 characters"),
  builtBefore: z.string().optional(),
  dreamProject: z.string().optional(),
  heardFrom: z.string().min(1, "Please select an option"),
});

const fullSchema = step1Schema.merge(step2Schema);
type FormData = z.infer<typeof fullSchema>;

/* ---------- constants ---------- */

const HEARD_FROM_OPTIONS = [
  "Instagram",
  "LinkedIn",
  "Twitter / X",
  "YouTube",
  "Friend / Word of Mouth",
  "Google Search",
  "Other",
] as const;

/* ---------- animations ---------- */

const fadeSlide = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: "easeInOut" as const },
};

/* ---------- component ---------- */

export default function ApplySection() {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      classLevel: undefined,
      city: "",
      school: "",
      whyNextera: "",
      builtBefore: "",
      dreamProject: "",
      heardFrom: "",
    },
  });

  const handleNext = async () => {
    const valid = await trigger([
      "fullName",
      "email",
      "phone",
      "classLevel",
      "city",
      "school",
    ]);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  /* ---------- shared input styles ---------- */

  const inputClass = cn(
    "w-full rounded-xl bg-background-elevated border border-border px-4 py-3 text-sm text-text-primary",
    "placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/40",
    "transition-all duration-200"
  );

  const labelClass = "block text-sm font-medium text-text-primary mb-1.5";
  const errorClass = "text-xs text-danger mt-1";

  return (
    <section
      id="apply"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(245,166,35,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-heading font-[800] text-text-primary">
            Ready to build?
          </h2>
          <p className="mt-4 text-text-muted text-base leading-relaxed max-w-lg mx-auto">
            Apply in 3 minutes. Get selected over a free Google Meet. Pay only
            after acceptance.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-2xl bg-background-card border border-border overflow-hidden">
            {/* Step Indicator */}
            {!submitted && (
              <div className="flex items-center gap-3 px-8 pt-8">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                      step >= 1
                        ? "bg-amber text-background"
                        : "bg-background-elevated text-text-muted border border-border"
                    )}
                  >
                    1
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      step >= 1 ? "text-text-primary" : "text-text-muted"
                    )}
                  >
                    Personal Info
                  </span>
                </div>
                <div
                  className={cn(
                    "h-px flex-1 transition-colors",
                    step >= 2 ? "bg-amber" : "bg-border"
                  )}
                />
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                      step >= 2
                        ? "bg-amber text-background"
                        : "bg-background-elevated text-text-muted border border-border"
                    )}
                  >
                    2
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      step >= 2 ? "text-text-primary" : "text-text-muted"
                    )}
                  >
                    Builder Mindset
                  </span>
                </div>
              </div>
            )}

            <div className="p-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  /* ---------- Success State ---------- */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2,
                      }}
                    >
                      <CheckCircle2 className="h-20 w-20 text-success mb-6" />
                    </motion.div>
                    <h3 className="text-2xl font-heading font-[800] text-text-primary">
                      Application received! 🎉
                    </h3>
                    <p className="mt-3 text-text-muted text-base leading-relaxed max-w-sm">
                      We&apos;ll schedule your Google Meet within 48 hours.
                      Check your email.
                    </p>
                  </motion.div>
                ) : step === 1 ? (
                  /* ---------- Step 1: Personal Info ---------- */
                  <motion.div key="step1" {...fadeSlide}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleNext();
                      }}
                      className="space-y-5"
                    >
                      {/* Full Name */}
                      <div>
                        <label htmlFor="fullName" className={labelClass}>
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          placeholder="e.g. Priya Sharma"
                          className={inputClass}
                          {...register("fullName")}
                        />
                        {errors.fullName && (
                          <p className={errorClass}>{errors.fullName.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className={labelClass}>
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="priya@example.com"
                          className={inputClass}
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className={errorClass}>{errors.email.message}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className={labelClass}>
                          Phone
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          className={inputClass}
                          {...register("phone")}
                        />
                        {errors.phone && (
                          <p className={errorClass}>{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Class & City row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="classLevel" className={labelClass}>
                            Class
                          </label>
                          <select
                            id="classLevel"
                            className={cn(inputClass, "appearance-none")}
                            {...register("classLevel")}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Select
                            </option>
                            <option value="11">Class 11</option>
                            <option value="12">Class 12</option>
                          </select>
                          {errors.classLevel && (
                            <p className={errorClass}>
                              {errors.classLevel.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="city" className={labelClass}>
                            City
                          </label>
                          <input
                            id="city"
                            type="text"
                            placeholder="Mumbai"
                            className={inputClass}
                            {...register("city")}
                          />
                          {errors.city && (
                            <p className={errorClass}>{errors.city.message}</p>
                          )}
                        </div>
                      </div>

                      {/* School */}
                      <div>
                        <label htmlFor="school" className={labelClass}>
                          School
                        </label>
                        <input
                          id="school"
                          type="text"
                          placeholder="Your school name"
                          className={inputClass}
                          {...register("school")}
                        />
                        {errors.school && (
                          <p className={errorClass}>{errors.school.message}</p>
                        )}
                      </div>

                      {/* Next Button */}
                      <Button
                        type="submit"
                        variant="amber"
                        size="lg"
                        className="w-full mt-2"
                      >
                        Next <ArrowRight className="h-4 w-4" />
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  /* ---------- Step 2: Builder Mindset ---------- */
                  <motion.div key="step2" {...fadeSlide}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      {/* Why Nextera */}
                      <div>
                        <label htmlFor="whyNextera" className={labelClass}>
                          Why Nextera?{" "}
                          <span className="text-text-muted font-normal">
                            (min 50 chars)
                          </span>
                        </label>
                        <textarea
                          id="whyNextera"
                          rows={4}
                          placeholder="Tell us why you want to join Nextera Labs..."
                          className={cn(inputClass, "resize-none")}
                          {...register("whyNextera")}
                        />
                        {errors.whyNextera && (
                          <p className={errorClass}>
                            {errors.whyNextera.message}
                          </p>
                        )}
                      </div>

                      {/* Built Before */}
                      <div>
                        <label htmlFor="builtBefore" className={labelClass}>
                          Have you built anything before?{" "}
                          <span className="text-text-muted font-normal">
                            (optional)
                          </span>
                        </label>
                        <textarea
                          id="builtBefore"
                          rows={3}
                          placeholder="Websites, apps, bots, scripts — anything counts..."
                          className={cn(inputClass, "resize-none")}
                          {...register("builtBefore")}
                        />
                      </div>

                      {/* Dream Project */}
                      <div>
                        <label htmlFor="dreamProject" className={labelClass}>
                          Dream project?{" "}
                          <span className="text-text-muted font-normal">
                            (optional)
                          </span>
                        </label>
                        <textarea
                          id="dreamProject"
                          rows={3}
                          placeholder="If you could build anything with AI, what would it be?"
                          className={cn(inputClass, "resize-none")}
                          {...register("dreamProject")}
                        />
                      </div>

                      {/* How did you hear about us */}
                      <div>
                        <label htmlFor="heardFrom" className={labelClass}>
                          How did you hear about us?
                        </label>
                        <select
                          id="heardFrom"
                          className={cn(inputClass, "appearance-none")}
                          {...register("heardFrom")}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {HEARD_FROM_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {errors.heardFrom && (
                          <p className={errorClass}>
                            {errors.heardFrom.message}
                          </p>
                        )}
                      </div>

                      {/* Error toast */}
                      {submitError && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl bg-danger/10 border border-danger/20 p-4 text-sm text-danger"
                        >
                          {submitError}
                        </motion.div>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-3 pt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="lg"
                          className="flex-1"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          variant="amber"
                          size="lg"
                          className="flex-1"
                          loading={isSubmitting}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Application <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
