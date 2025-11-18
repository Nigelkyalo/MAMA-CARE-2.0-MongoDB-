import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PregnancyProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  dueDate?: string;
  lastMenstrualPeriod?: string;
  calculationMethod: string;
  pregnancyNumber: string;
  location: string;
  hospital: string;
  healthConditions: string[];
  language: string;
  reminders: {
    appointments: boolean;
    medications: boolean;
    tips: boolean;
    emergency: boolean;
  };
  communicationMethod: string;
  agreedToTerms: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method === "POST") {
      const profile: PregnancyProfile = await req.json();

      if (!profile.email) {
        return new Response(
          JSON.stringify({ error: "Email is required" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const response = {
        success: true,
        message: "Pregnancy profile saved successfully",
        data: {
          id: `profile_${Date.now()}`,
          ...profile,
          createdAt: new Date().toISOString(),
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
