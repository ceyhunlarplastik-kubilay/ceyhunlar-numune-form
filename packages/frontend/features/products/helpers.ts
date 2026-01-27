import { Assignment } from "./types";

export function getValidAssignments(assignments: Assignment[]) {
  return assignments.filter(
    (a) => a.sectorId && a.productionGroupId
  );
}
