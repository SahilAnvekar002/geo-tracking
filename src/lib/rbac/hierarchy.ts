import { TRoleLiteral } from "./roles";

export interface RoleHierarchy {
  role: TRoleLiteral;
  level: number;
  category: "system" | "functional";
  overrides?: TRoleLiteral[]; // Roles that this role overrides/includes
  conflictsWith?: TRoleLiteral[]; // Roles that cannot coexist
  baseUrl: string;
}

export function setupHierarchy(): RoleHierarchy[] {
  return [
    {
      role: "developer",
      level: 100,
      category: "system",
      overrides: [
        "owner",
        "admin",
        "user",
      ],
      baseUrl: "/",
    },
    {
      role: "owner",
      level: 90,
      category: "system",
      overrides: [
        "admin",
        "user",
      ],
      baseUrl: "/",
    },
    {
      role: "admin",
      level: 80,
      category: "system",
      overrides: [
        "user",
      ],
      baseUrl: "/",
    },
    // User roles (lowest level)
    {
      role: "user",
      level: 0,
      category: "functional",
      baseUrl: "/",
    },
  ];
}

export class RoleHierarchyManager {
  private hierarchy: Map<TRoleLiteral, RoleHierarchy>;

  constructor() {
    this.hierarchy = new Map();
    setupHierarchy().forEach((role) => this.hierarchy.set(role.role, role));
  }

  getRoleInfo(role: TRoleLiteral): RoleHierarchy | undefined {
    return this.hierarchy.get(role);
  }

  doesOverride(role1: TRoleLiteral, role2: TRoleLiteral): boolean {
    const roleInfo = this.hierarchy.get(role1);
    return roleInfo?.overrides?.includes(role2) || false;
  }

  // Check if a user can assign a specific role
  canAssignRole(highestRole: TRoleLiteral, targetRole: TRoleLiteral): boolean {
    const userMaxLevelRoleInfo = this.getRoleInfo(highestRole);
    const targetRoleInfo = this.getRoleInfo(targetRole);
    if (!userMaxLevelRoleInfo) return false;

    // Users can only assign roles that are lower level than their highest role
    return targetRoleInfo
      ? targetRoleInfo.level < userMaxLevelRoleInfo.level
      : false;
  }

  // Get roles that should be automatically removed when a new role is added
  getRolesToRemove(
    newRole: TRoleLiteral,
    currentRoles: TRoleLiteral[],
  ): TRoleLiteral[] {
    const toRemove = new Set<TRoleLiteral>();
    const newRoleInfo = this.getRoleInfo(newRole);

    // Remove roles that the new role overrides
    if (newRoleInfo?.overrides) {
      newRoleInfo.overrides.forEach((overriddenRole) => {
        if (currentRoles.includes(overriddenRole)) {
          toRemove.add(overriddenRole);
        }
      });
    }

    // Remove conflicting roles
    if (newRoleInfo?.conflictsWith) {
      newRoleInfo.conflictsWith.forEach((conflictingRole) => {
        if (currentRoles.includes(conflictingRole)) {
          toRemove.add(conflictingRole);
        }
      });
    }

    // Remove system roles that are lower than the new role (if new role is system)
    if (newRoleInfo?.category === "system") {
      currentRoles.forEach((currentRole) => {
        const currentRoleInfo = this.getRoleInfo(currentRole);
        if (
          currentRoleInfo?.category === "system" &&
          currentRoleInfo.level < newRoleInfo.level
        ) {
          toRemove.add(currentRole);
        }
      });
    }

    return Array.from(toRemove);
  }

  // Clean up roles array by removing redundant roles
  cleanupRoles(roles: TRoleLiteral[]): TRoleLiteral[] {
    const cleaned = new Set(roles);
    const toRemove = new Set<TRoleLiteral>();

    roles.forEach((role) => {
      const roleInfo = this.getRoleInfo(role);
      if (roleInfo?.overrides) {
        roleInfo.overrides.forEach((overriddenRole) => {
          if (cleaned.has(overriddenRole)) {
            toRemove.add(overriddenRole);
          }
        });
      }
    });

    toRemove.forEach((role) => cleaned.delete(role));
    return Array.from(cleaned);
  }

  // Get role display order for UI
  getRoleDisplayOrder(): TRoleLiteral[] {
    return Array.from(this.hierarchy.values())
      .sort((a, b) => b.level - a.level)
      .map((role) => role.role);
  }

  getHighestRole(roles: string): TRoleLiteral {
    const rolesArray = roles.split(",");
    const highestRole = rolesArray.reduce((acc, role) => {
      const roleInfo = this.getRoleInfo(role as TRoleLiteral);
      if (roleInfo && roleInfo.level > acc.level) {
        return roleInfo;
      }
      return acc;
    }, this.getRoleInfo("user")!);
    return highestRole.role;
  }

  getBaseUrl(roles: string): string {
    const rolesArray = roles.split(",");
    const highestRole = rolesArray.reduce((acc, role) => {
      const roleInfo = this.getRoleInfo(role as TRoleLiteral);
      if (roleInfo && roleInfo.level > acc.level) {
        return roleInfo;
      }
      return acc;
    }, this.getRoleInfo("user")!);
    return highestRole.baseUrl;
  }
}

// Export singleton instance
export const roleHierarchyManager = new RoleHierarchyManager();

// Utility function to get role display label
export function getRoleDisplayLabel(role: TRoleLiteral): string {
  const labels: Record<TRoleLiteral, string> = {
    developer: "Developer",
    owner: "Owner",
    admin: "Admin",
    user: "User",
  };
  return labels[role] || role;
}

// Utility function to get role description
export function getRoleDescription(role: TRoleLiteral): string {
  const descriptions: Record<TRoleLiteral, string> = {
    developer: "Full system access and development privileges",
    owner: "Complete system ownership and management",
    admin: "System administration and user management",
    user: "Basic user access",
  };
  return descriptions[role] || `${role} role`;
}
