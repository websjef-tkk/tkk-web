import type { CurrentUser } from "sanity";

// Rollene settes per bruker i Sanity Manage (Members). Sperrene som bygger på
// denne sjekken er et gjerde mot uhell i Studio, ikke en tilgangskontroll:
// Sanitys API lar fortsatt en Editor skrive til alle dokumenttyper.
export const isAdministrator = (user: Pick<CurrentUser, "roles"> | null | undefined) =>
  user?.roles.some((role) => role.name === "administrator") ?? false;

// Brukes som `readOnly` på dokumenttyper som bare administratorer skal endre.
export const readOnlyUnlessAdministrator = ({
  currentUser,
}: {
  currentUser: Pick<CurrentUser, "roles"> | null;
}) => !isAdministrator(currentUser);
