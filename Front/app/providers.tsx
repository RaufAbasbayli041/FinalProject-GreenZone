"use client";
import React from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context-new";
import { NotificationProvider } from "@/components/ui/notification-center";
import { ConditionalCartProvider } from "@/components/layout/conditional-cart-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ConditionalCartProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ConditionalCartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}