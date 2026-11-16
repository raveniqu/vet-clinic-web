import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/(reception)/pets/$petId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_private/(reception)/pets/$petId"!</div>;
}
