import { createFileRoute } from "@tanstack/react-router";
import { SignInScreen } from "#/client/features/auth/screens/sign-in";

export const Route = createFileRoute("/_public/sign-in")({
	component: SignInScreen,
});
