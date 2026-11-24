import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/(management)/staff/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>จัดการบุคลากร</div>;
}
