// Role-based permissions system for multi-agent CRM

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  AGENT: 'agent'
}

export const PERMISSIONS = {
  // Lead permissions
  VIEW_ALL_LEADS: 'view_all_leads',
  VIEW_ASSIGNED_LEADS: 'view_assigned_leads',
  CREATE_LEADS: 'create_leads',
  EDIT_ALL_LEADS: 'edit_all_leads',
  EDIT_ASSIGNED_LEADS: 'edit_assigned_leads',
  DELETE_LEADS: 'delete_leads',
  
  // User permissions
  VIEW_ALL_USERS: 'view_all_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  
  // Team permissions
  VIEW_ALL_TEAMS: 'view_all_teams',
  MANAGE_TEAMS: 'manage_teams',
  
  // Reports permissions
  VIEW_REPORTS: 'view_reports',
  EXPORT_DATA: 'export_data',
  
  // Settings permissions
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_INTEGRATIONS: 'manage_integrations'
}

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_ALL_LEADS,
    PERMISSIONS.CREATE_LEADS,
    PERMISSIONS.EDIT_ALL_LEADS,
    PERMISSIONS.DELETE_LEADS,
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.VIEW_ALL_TEAMS,
    PERMISSIONS.MANAGE_TEAMS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_INTEGRATIONS
  ],
  
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_ALL_LEADS,
    PERMISSIONS.CREATE_LEADS,
    PERMISSIONS.EDIT_ALL_LEADS,
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.VIEW_ALL_TEAMS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_DATA
  ],
  
  [ROLES.AGENT]: [
    PERMISSIONS.VIEW_ASSIGNED_LEADS,
    PERMISSIONS.CREATE_LEADS,
    PERMISSIONS.EDIT_ASSIGNED_LEADS
  ]
}

// Permission checking functions
export class PermissionService {
  constructor(user) {
    this.user = user
    this.userPermissions = user?.permissions || []
    this.userRole = user?.role || ROLES.AGENT
  }

  // Check if user has specific permission
  hasPermission(permission) {
    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[this.userRole] || []
    if (rolePermissions.includes(permission)) {
      return true
    }

    // Check custom permissions
    return this.userPermissions.includes(permission)
  }

  // Check if user can view all leads
  canViewAllLeads() {
    return this.hasPermission(PERMISSIONS.VIEW_ALL_LEADS)
  }

  // Check if user can view assigned leads only
  canViewAssignedLeads() {
    return this.hasPermission(PERMISSIONS.VIEW_ASSIGNED_LEADS)
  }

  // Check if user can create leads
  canCreateLeads() {
    return this.hasPermission(PERMISSIONS.CREATE_LEADS)
  }

  // Check if user can edit all leads
  canEditAllLeads() {
    return this.hasPermission(PERMISSIONS.EDIT_ALL_LEADS)
  }

  // Check if user can edit assigned leads only
  canEditAssignedLeads() {
    return this.hasPermission(PERMISSIONS.EDIT_ASSIGNED_LEADS)
  }

  // Check if user can delete leads
  canDeleteLeads() {
    return this.hasPermission(PERMISSIONS.DELETE_LEADS)
  }

  // Check if user can manage users
  canManageUsers() {
    return this.hasPermission(PERMISSIONS.VIEW_ALL_USERS) || 
           this.hasPermission(PERMISSIONS.CREATE_USERS)
  }

  // Check if user can view reports
  canViewReports() {
    return this.hasPermission(PERMISSIONS.VIEW_REPORTS)
  }

  // Check if user can export data
  canExportData() {
    return this.hasPermission(PERMISSIONS.EXPORT_DATA)
  }

  // Check if user can manage settings
  canManageSettings() {
    return this.hasPermission(PERMISSIONS.MANAGE_SETTINGS)
  }

  // Get user's accessible lead filters
  getLeadFilters() {
    if (this.canViewAllLeads()) {
      return {} // No restrictions
    } else if (this.canViewAssignedLeads()) {
      return { assigned_to: this.user.id } // Only assigned leads
    }
    return { id: null } // No access
  }

  // Check if user can access specific lead
  canAccessLead(lead) {
    if (this.canViewAllLeads()) {
      return true
    }
    if (this.canViewAssignedLeads()) {
      return lead.assigned_to === this.user.id
    }
    return false
  }

  // Check if user can edit specific lead
  canEditLead(lead) {
    if (this.canEditAllLeads()) {
      return true
    }
    if (this.canEditAssignedLeads()) {
      return lead.assigned_to === this.user.id
    }
    return false
  }
}

// Hook for using permissions in React components
export function usePermissions(user) {
  return new PermissionService(user)
}

export default PermissionService
