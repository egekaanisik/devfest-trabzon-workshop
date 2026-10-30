import { GENERAL, DEVFEST, WEB_AI, TRABZON } from "@/lib/prompts";

export async function initLlm() {
  return {
    async generate(prompt) {
      return GENERAL + "\n\n" + prompt;
    },
  };
}
