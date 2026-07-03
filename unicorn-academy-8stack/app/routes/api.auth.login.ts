import type { ActionFunctionArgs } from "react-router";
import { createServiceSupabase } from "@/lib/supabase-server";

// Helper to authenticate credentials with UGL Platform
async function verifyUglCredentials(username: string, password: string): Promise<{ success: boolean; fullName?: string }> {
  try {
    // 1. GET request to fetch login page (to get request token & ASP.NET cookies)
    const getRes = await fetch("https://www.uglplatform.com/Account/Login", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!getRes.ok) {
      console.error(`UGL GET request failed with status: ${getRes.status}`);
      return { success: false };
    }

    const html = await getRes.text();
    const tokenMatch = html.match(/name="__RequestVerificationToken" type="hidden" value="([^"]+)"/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      console.error("UGL Anti-forgery token not found in GET HTML");
      return { success: false };
    }

    // Get cookies set by the GET request
    const getCookies = getRes.headers.getSetCookie();
    const cookiesStr = getCookies.map(c => c.split(";")[0]).join("; ");

    // 2. Perform the POST login request
    const bodyParams = new URLSearchParams();
    bodyParams.set("__RequestVerificationToken", token);
    bodyParams.set("Username", username);
    bodyParams.set("Password", password);
    bodyParams.set("Remember", "0");

    const postRes = await fetch("https://www.uglplatform.com/Account/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": cookiesStr,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.uglplatform.com/Account/Login"
      },
      body: bodyParams.toString(),
      redirect: "manual" // Stop redirect to inspect response status
    });

    // UGL returns 302 redirect on successful login
    if (postRes.status === 302) {
      const redirectLocation = postRes.headers.get("location") || "";
      const postCookies = postRes.headers.getSetCookie();
      const mergedCookies = [...getCookies, ...postCookies].map(c => c.split(";")[0]).join("; ");

      let fullName = "";

      // Fetch redirected dashboard to extract full name
      try {
        const targetUrl = redirectLocation.startsWith("http")
          ? redirectLocation
          : `https://www.uglplatform.com${redirectLocation}`;

        const dashboardRes = await fetch(targetUrl, {
          headers: {
            "Cookie": mergedCookies,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        });

        if (dashboardRes.ok) {
          const dbHtml = await dashboardRes.text();
          // Look for common Thai name structures shown on the UGL dashboard
          const nameMatch = dbHtml.match(/(?:ยินดีต้อนรับคุณ|ยินดีต้อนรับ คุณ|สวัสดีคุณ|สวัสดี คุณ)\s*([ก-๙a-zA-Z\s]+?)(?:\s*<|\s*\r|\s*\n)/);
          if (nameMatch && nameMatch[1]) {
            fullName = nameMatch[1].trim();
          }
        }
      } catch (err) {
        console.error("Failed to parse full name from dashboard:", err);
      }

      return { success: true, fullName };
    }

    console.warn(`UGL POST request failed with status: ${postRes.status}`);
    return { success: false };
  } catch (err) {
    console.error("verifyUglCredentials network error:", err);
    return { success: false };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "กรุณากรอก Username และรหัสผ่าน" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cleanUsername = username.toLowerCase().trim().replace(/\s+/g, "");
    const email = `${cleanUsername}@unicorn.systems`;

    // 1. Authenticate with UGL Platform
    const uglAuth = await verifyUglCredentials(cleanUsername, password);
    if (!uglAuth.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "ชื่อผู้ใช้งานหรือรหัสผ่าน UGL ไม่ถูกต้อง หรือบัญชีของท่านไม่ใช่สมาชิก UGL"
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 2. Sync credentials with Supabase Database
    const supabaseAdmin = createServiceSupabase();

    // Check if profile already exists in public.profiles by username
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (profileError) {
      console.error("Supabase profile check error:", profileError);
      throw new Error("ระบบฐานข้อมูลขัดข้อง กรุณาลองใหม่อีกครั้ง");
    }

    if (existingProfile) {
      // User exists — sync password in auth.users
      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
        existingProfile.id,
        { password: password }
      );

      if (updateAuthError) {
        console.error("Supabase password sync error:", updateAuthError);
        throw new Error("ไม่สามารถเชื่อมโยงบัญชีได้ กรุณาลองใหม่อีกครั้ง");
      }
    } else {
      // User doesn't exist — provision new user
      // Parse referral cookie if available
      const cookieHeader = request.headers.get("Cookie") || "";
      const cookies: Record<string, string> = {};
      cookieHeader.split(";").forEach(c => {
        const parts = c.split("=");
        const key = parts[0]?.trim();
        const val = parts.slice(1).join("=").trim();
        if (key) cookies[key] = val;
      });
      const referrerId = cookies["unicorn_referrer"] || null;

      // Create new user in auth.users
      const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: uglAuth.fullName || cleanUsername,
          username: cleanUsername,
        }
      });

      if (createUserError || !authData.user) {
        console.error("Supabase user creation error:", createUserError);
        throw new Error("ไม่สามารถสร้างบัญชีสมาชิกในระบบได้ กรุณาลองใหม่อีกครั้ง");
      }

      // Update the automatically created profile record
      const updatePayload: Record<string, any> = {
        username: cleanUsername,
        full_name: uglAuth.fullName || cleanUsername,
      };

      if (referrerId) {
        updatePayload.referred_by = referrerId;
      }

      const { error: updateProfileError } = await supabaseAdmin
        .from("profiles")
        .update(updatePayload)
        .eq("id", authData.user.id);

      if (updateProfileError) {
        console.error("Supabase profile update error:", updateProfileError);
      }

      // Trigger referral conversions increment RPC on the referrer if present
      if (referrerId) {
        const { error: rpcError } = await supabaseAdmin.rpc("increment_referral_conversions", {
          profile_id: referrerId
        });
        if (rpcError) {
          console.error("Referral increment RPC error:", rpcError);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("api/auth/login error:", err);
    return new Response(JSON.stringify({ error: err.message || "เกิดข้อผิดพลาดในการตรวจสอบบัญชี" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
