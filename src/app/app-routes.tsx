// import { PartyFeature } from "@/components/party/party-feature";
import ParticipantsFeature from "@/components/participants/participants-feature";
import { UiLayout } from "@/components/ui/ui-layout";
import { lazy } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";

const HomeFeature = lazy(() => import("../components/home/home-feature"));
const PartiesFeature = lazy(() => import("../components/parties/parties-feature"));
const PartyEditFeature = lazy(() => import("../components/party/party-edit-feature"));

const links: { label: string; path: string }[] = [
  { label: "Parties", path: "/parties" },
  { label: "Participants", path: "/participants" },
];

const routes: RouteObject[] = [
  { path: "/", element: <HomeFeature /> },
  { path: "/parties", element: <PartiesFeature /> },
  { path: "/parties/:id", element: <PartyEditFeature /> },
  { path: "/participants", element: <ParticipantsFeature /> },
];

export function AppRoutes() {
  const router = useRoutes([...routes, { path: "*", element: <Navigate to={"/"} replace={true} /> }]);
  return <UiLayout links={links}>{router}</UiLayout>;
}
