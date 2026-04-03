import { Language } from "./types";

export const translations = {
  fr: {
    landing: {
      title: "SlimAI",
      subtitle: "Votre assistant intelligent personnel",
      heroTitle: "L'IA qui vous comprend vraiment.",
      heroSubtitle: "Une expérience conversationnelle fluide, sécurisée et magnifiquement conçue pour booster votre productivité quotidienne.",
      getStarted: "Commencer l'aventure",
      tryGuest: "Essayer en invité",
      login: "Connexion",
      signup: "Créer un compte",
      back: "Retour",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Adresse email",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      acceptCGU: "J'accepte les Conditions Générales d'Utilisation et la Politique de Confidentialité (RGPD).",
      alreadyAccount: "Déjà un compte ?",
      noAccount: "Pas encore de compte ?",
      stats: {
        users: "Utilisateurs actifs",
        messages: "Messages générés",
        rating: "Note moyenne"
      }
    },
    sidebar: {
      newChat: "Nouvelle discussion",
      chat: "Discussion",
      profile: "Profil",
      settings: "Paramètres",
      logout: "Déconnexion"
    },
    chat: {
      inputPlaceholder: "Posez votre question à SlimAI...",
      typing: "SlimAI réfléchit..."
    },
    profile: {
      title: "Mon Profil",
      subtitle: "Gérez vos informations personnelles et votre sécurité.",
      personalInfo: "Informations Personnelles",
      security: "Sécurité",
      connectedAccounts: "Comptes Connectés",
      changePassword: "Changer le mot de passe",
      disconnect: "Déconnecter"
    },
    settings: {
      title: "Paramètres",
      subtitle: "Personnalisez votre expérience SlimAI.",
      appearance: "Apparence",
      language: "Langue",
      theme: {
        title: "Thème",
        light: "Clair",
        dark: "Sombre",
        system: "Système"
      },
      aiPreferences: "Préférences IA",
      notifications: "Notifications",
      dataPrivacy: "Données & Confidentialité",
      exportData: "Exporter l'historique",
      deleteAccount: "Supprimer le compte",
      gdprCompliance: "Conformité RGPD",
      gdprText: "Vos données sont traitées conformément au Règlement Général sur la Protection des Données. Vous conservez un contrôle total sur vos informations personnelles."
    },
    gdpr: {
      title: "Protection de vos données",
      subtitle: "Votre vie privée est notre priorité absolue.",
      transparency: "Transparence",
      transparencyText: "Nous collectons uniquement les données nécessaires au bon fonctionnement de SlimAI (nom, email, historique de chat).",
      rightToForget: "Droit à l'oubli",
      rightToForgetText: "Vous pouvez à tout moment exporter ou supprimer l'intégralité de vos données depuis les paramètres de votre compte.",
      security: "Sécurité",
      securityText: "Vos conversations sont chiffrées et ne sont jamais vendues à des tiers.",
      understand: "J'ai compris"
    }
  },
  en: {
    landing: {
      title: "SlimAI",
      subtitle: "Your personal intelligent assistant",
      heroTitle: "AI that truly understands you.",
      heroSubtitle: "A fluid, secure, and beautifully designed conversational experience to boost your daily productivity.",
      getStarted: "Get Started",
      tryGuest: "Try as Guest",
      login: "Login",
      signup: "Sign Up",
      back: "Back",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      acceptCGU: "I accept the General Terms of Use and the Privacy Policy (GDPR).",
      alreadyAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      stats: {
        users: "Active Users",
        messages: "Messages Generated",
        rating: "Average Rating"
      }
    },
    sidebar: {
      newChat: "New Chat",
      chat: "Chat",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout"
    },
    chat: {
      inputPlaceholder: "Ask SlimAI anything...",
      typing: "SlimAI is thinking..."
    },
    profile: {
      title: "My Profile",
      subtitle: "Manage your personal information and security.",
      personalInfo: "Personal Information",
      security: "Security",
      connectedAccounts: "Connected Accounts",
      changePassword: "Change Password",
      disconnect: "Disconnect"
    },
    settings: {
      title: "Settings",
      subtitle: "Customize your SlimAI experience.",
      appearance: "Appearance",
      language: "Language",
      theme: {
        title: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System"
      },
      aiPreferences: "AI Preferences",
      notifications: "Notifications",
      dataPrivacy: "Data & Privacy",
      exportData: "Export Chat History",
      deleteAccount: "Delete Account",
      gdprCompliance: "GDPR Compliance",
      gdprText: "Your data is processed in accordance with the General Data Protection Regulation. You maintain full control over your personal information."
    },
    gdpr: {
      title: "Data Protection",
      subtitle: "Your privacy is our top priority.",
      transparency: "Transparency",
      transparencyText: "We only collect data necessary for SlimAI to function (name, email, chat history).",
      rightToForget: "Right to be forgotten",
      rightToForgetText: "You can export or delete all your data at any time from your account settings.",
      security: "Security",
      securityText: "Your conversations are encrypted and never sold to third parties.",
      understand: "I understand"
    }
  }
};

export type Translations = typeof translations.fr;

