import { UiLayout } from "@/components/ui/ui-layout";
import { lazy } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";

// const DashboardFeature = lazy(() => import("../components/dashboard/dashboard-feature"));

const links: { label: string; path: string }[] = [{ label: "Party", path: "/party" }];

const routes: RouteObject[] = [{ path: "/party", element: <AccountListFeature /> }];

export function AppRoutes() {
  const router = useRoutes([
    { index: true, element: <Navigate to={"/"} replace={true} /> },
    { path: "/", element: <DashboardFeature /> },
    ...routes,
    { path: "*", element: <Navigate to={"/"} replace={true} /> },
  ]);
  return <UiLayout links={links}>{router}</UiLayout>;
}
