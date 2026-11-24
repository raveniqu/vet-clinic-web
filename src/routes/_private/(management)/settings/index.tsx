import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/(management)/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>ตั้งค่าระบบ</div>;
}
