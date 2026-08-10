import "server-only";
import { connectToDatabase } from "@/lib/db";
import { ALL_ROLES, ROLE_LABELS, type Role } from "@/lib/auth/roles";
import { scopedPermissionsForRole } from "@/lib/auth/permissions";
import { Role as RoleModel } from "@/models/Role";

/** Seed / refresh Role documents from the code-defined matrix (design §4). */
export async function seedRoles(): Promise<{ upserted: number }> {
  await connectToDatabase();
  let upserted = 0;

  for (const name of ALL_ROLES) {
    const role = name as Role;
    const defs = scopedPermissionsForRole(role);
    await RoleModel.findOneAndUpdate(
      { name: role },
      {
        $set: {
          displayName: ROLE_LABELS[role],
          permissions: defs.map((d) => ({
            permission: d.permission,
            scope: d.scope,
          })),
          permissionKeys: defs.map((d) => d.permission),
          defaultScope: defs[0]?.scope ?? "OWN",
          active: true,
        },
      },
      { upsert: true, new: true }
    );
    upserted += 1;
  }

  return { upserted };
}
