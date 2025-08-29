import { Outlet } from "react-router-dom";

export default function PublicShell() {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
}
