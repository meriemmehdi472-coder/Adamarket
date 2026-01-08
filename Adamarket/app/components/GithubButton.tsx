"use client";

import { Github } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function GithubButton() {
  const onClick = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/", 
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Continue with GitHub"
      className="hover:bg-secondary active:bg-secondary/40 flex items-center justify-center rounded-lg border py-2.5 duration-150"
    >
      <Github size={24} />
    </button>
  );
}
