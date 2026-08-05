import { z } from "zod";

const appEnvSchema = z
  .object({
    VITE_API_BASE_URL: z.string().trim().min(1).url(),
    VITE_AUTH0_DOMAIN: z.string().trim().min(1),
    VITE_AUTH0_CLIENT_ID: z.string().trim().min(1),
    VITE_AUTH0_AUDIENCE: z.string().trim().min(1),
  })
  .transform((env) => ({
    apiBaseUrl: env.VITE_API_BASE_URL.replace(/\/+$/, ""),
    auth0Domain: env.VITE_AUTH0_DOMAIN,
    auth0ClientId: env.VITE_AUTH0_CLIENT_ID,
    auth0Audience: env.VITE_AUTH0_AUDIENCE,
  }));

export type AppEnv = z.infer<typeof appEnvSchema>;

export function getAppEnv(): AppEnv {
  const result = appEnvSchema.safeParse(import.meta.env);

  if (!result.success) {
    const invalidVariables = [
      ...new Set(
        result.error.issues
          .map((issue) => issue.path[0])
          .filter((name): name is string => typeof name === "string"),
      ),
    ];

    throw new Error(
      `Invalid or missing environment variables: ${invalidVariables.join(", ")}`,
    );
  }

  return result.data;
}
