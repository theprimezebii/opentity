"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200),
  category: z.string().default("general"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long (max 2000 characters)"),
});

export async function submitContact(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const rawData = Object.fromEntries(formData.entries());
  const parsed = ContactSchema.safeParse(rawData);
  
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, formData: rawData };
  }

  const { error } = await supabase.from("contact_messages").insert(parsed.data);

  if (error) return { error: "Failed to send message. Please try again." };

  return { success: "Thank you! Your message has been sent. We'll get back to you within 24-48 hours." };
}
