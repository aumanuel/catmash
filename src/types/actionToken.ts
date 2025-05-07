export const ACTION_TOKEN_ACTIONS = [
  'create', 'read', 'update', 'delete', 'submit', 'confirm', 'choose', 'access', 'download'
] as const;
export type ActionTokenAction = typeof ACTION_TOKEN_ACTIONS[number];

export interface ActionTokenPayload {
  visitorId: string;
  action: ActionTokenAction;
  params?: Record<string, any>;
  exp: number;
}

export interface ActionTokenOptions {
  action: ActionTokenAction;
  visitorId: string;
  params?: Record<string, any>;
  expiresInSeconds?: number;
} 