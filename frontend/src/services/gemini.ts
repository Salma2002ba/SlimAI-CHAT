import { Message, Language } from "../types";

function apiBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (raw ?? "").trim().replace(/\/+$/, "");
}

export async function generateChatResponse(messages: Message[], language: Language = "fr") {
  const base = apiBase();
  if (!base) {
    return language === "fr"
      ? "Configuration manquante : définissez VITE_API_BASE_URL (URL de l’API, sans slash final)."
      : "Missing configuration: set VITE_API_BASE_URL to your API base URL (no trailing slash).";
  }

  const body = {
    language,
    messages: messages.map((m) => ({ role: m.role, text: m.text })),
  };

  try {
    const res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 503) {
      return language === "fr"
        ? "Le serveur n’a pas de clé Gemini configurée (GEMINI_API_KEY)."
        : "The server has no Gemini API key configured (GEMINI_API_KEY).";
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const detail =
        typeof err === "object" && err !== null && "detail" in err
          ? String((err as { detail: unknown }).detail)
          : res.statusText;
      console.error("Chat API error:", res.status, detail);
      return language === "fr"
        ? "Une erreur s’est produite lors de la communication avec SlimAI. Réessayez plus tard."
        : "Something went wrong talking to SlimAI. Please try again later.";
    }

    const data = (await res.json()) as { text?: string };
    const text = (data.text ?? "").trim();
    return (
      text ||
      (language === "fr"
        ? "Désolé, je n’ai pas pu générer de réponse."
        : "I'm sorry, I couldn't generate a response.")
    );
  } catch (error) {
    console.error("Chat API Error:", error);
    return language === "fr"
      ? "Impossible de joindre l’API. Vérifiez votre connexion et l’URL du backend (CORS / VITE_API_BASE_URL)."
      : "Could not reach the API. Check your connection and backend URL (CORS / VITE_API_BASE_URL).";
  }
}
