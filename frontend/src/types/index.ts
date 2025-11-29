export interface User {
    _id: string;
    email: string;
    name: string;
    profileImage?: string;
    googleId?: string;
    aiRequestsToday: number;
    lastAiRequestDate?: string;
  }
  
  export interface Team {
    _id: string;
    name: string;
    ownerId: string;
    members: TeamMember[];
    invites: TeamInvite[];
    activities: TeamActivity[];
    isDeleted: boolean;
    deletedAt?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface TeamMember {
    userId: string | User;
    role: TeamRole;
    joinedAt: string;
  }
  
  export interface TeamInvite {
    email: string;
    role: TeamRole;
    token: string;
    expiresAt: string;
    invitedBy: string;
  }
  
  export interface TeamActivity {
    action: string;
    performedBy: string | User;
    metadata?: any;
    timestamp: string;
  }
  
  export enum TeamRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
  }
  
  export interface Project {
    _id: string;
    name: string;
    description?: string;
    teamId: string;
    ownerId: string;
    isArchived: boolean;
    isDeleted: boolean;
    deletedAt?: string;
    favorites: ProjectFavorite[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProjectFavorite {
    userId: string;
    favoritedAt: string;
  }
  
  export interface Issue {
    _id: string;
    title: string;
    description?: string;
    status: IssueStatus;
    priority: IssuePriority;
    assigneeId?: string | User;
    dueDate?: string;
    projectId: string;
    ownerId: string;
    subtasks: Subtask[];
    labels: Label[];
    changeHistory: IssueChangeHistory[];
    order: number;
    aiCache?: AiCache;
    isDeleted: boolean;
    deletedAt?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Subtask {
    title: string;
    isCompleted: boolean;
    order: number;
    createdAt: string;
  }
  
  export interface Label {
    name: string;
    color: string;
    createdAt: string;
  }
  
  export interface CustomStatus {
    name: string;
    color?: string;
    order: number;
    wipLimit?: number;
  }
  
  export interface IssueChangeHistory {
    field: string;
    oldValue?: any;
    newValue?: any;
    changedBy: string | User;
    changedAt: string;
  }
  
  export interface AiCache {
    summary?: string;
    solutionSuggestion?: string;
    commentSummary?: string;
    lastUpdated: string;
  }
  
  export enum IssueStatus {
    BACKLOG = 'BACKLOG',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
  }
  
  export enum IssuePriority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
  }
  
  export interface Comment {
    _id: string;
    content: string;
    issueId: string;
    authorId: string | User;
    isDeleted: boolean;
    deletedAt?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Notification {
    _id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message?: string;
    metadata?: any;
    isRead: boolean;
    readAt?: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export enum NotificationType {
    ISSUE_ASSIGNED = 'ISSUE_ASSIGNED',
    COMMENT_ADDED = 'COMMENT_ADDED',
    DUE_DATE_SOON = 'DUE_DATE_SOON',
    DUE_DATE_TODAY = 'DUE_DATE_TODAY',
    TEAM_INVITE = 'TEAM_INVITE',
    ROLE_CHANGED = 'ROLE_CHANGED',
  }
  
  export interface DashboardStats {
    projectCount: number;
    issueCount: number;
    completedIssues: number;
    overdueIssues: number;
    issueStatusDistribution: { status: string; count: number }[];
    issuePriorityDistribution: { priority: string; count: number }[];
    recentActivities: any[];
    assignedIssues: Issue[];
    dueSoonIssues: Issue[];
  }