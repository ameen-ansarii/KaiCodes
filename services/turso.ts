import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserAccount {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarPose: string;
  createdAt: number;
}

export interface UserProfile {
  userId: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  dailyGoalMinutes: number;
  prioritySubjects: string[];
  targetGoal: string;
  completedOnboarding: boolean;
  updatedAt: number;
}

export interface UserProgress {
  userId: string;
  xp: number;
  streakCount: number;
  lastActiveDate: string;
  completedLessons: string[];
  unlockedNodes: string[];
}

const DEFAULT_TURSO_URL = 'https://kaicodes-lolopolo.aws-ap-south-1.turso.io';
const DEFAULT_TURSO_AUTH_TOKEN =
  'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTA5NTMxNzUsImlkIjoiMDFhMGZkMWYtZTYwMS03MWY3LWE4ZWEtOTgzOGU1ZjBiOGMxIiwia2lkIjoicS1fSklfbFBTZVpSN1gtSDVsRzNIMnUxMmdVQlI0cmw3NHBwNTNNSTVqOCIsInJpZCI6ImNhNDFiMTM5LTJlYzMtNDZiOS1hNWNjLWI1Y2U2ODJiMzI5YiJ9.lY2nM9WwXC-_MBxYOTFs6x2lgE00UYOh7BMUP66BgBXhcLev-2h6pPCRlNVpux4yAaa-HTMQWsfw4Mf_730yBg';

const rawUrl = process.env.EXPO_PUBLIC_TURSO_DATABASE_URL || DEFAULT_TURSO_URL;
const TURSO_URL = rawUrl.startsWith('libsql://') ? rawUrl.replace('libsql://', 'https://') : rawUrl;
const TURSO_AUTH_TOKEN = process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN || DEFAULT_TURSO_AUTH_TOKEN;

const isTursoConfigured = Boolean(TURSO_URL && TURSO_AUTH_TOKEN);

function toTursoValue(v: any): { type: string; value?: any } {
  if (v === null || v === undefined) {
    return { type: 'null' };
  }
  if (typeof v === 'number') {
    return Number.isInteger(v) ? { type: 'integer', value: String(v) } : { type: 'float', value: v };
  }
  return { type: 'text', value: String(v) };
}

export async function executeTurso(stmt: string | { sql: string; args?: any[] }): Promise<{
  rows: Record<string, any>[];
  cols: string[];
  affectedRows: number;
}> {
  if (!isTursoConfigured) {
    throw new Error('Turso credentials are not configured');
  }

  const sql = typeof stmt === 'string' ? stmt : stmt.sql;
  const rawArgs = typeof stmt === 'string' ? [] : stmt.args || [];
  const args = rawArgs.map(toTursoValue);

  const res = await fetch(`${TURSO_URL}/v2/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TURSO_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{ type: 'execute', stmt: { sql, args } }],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Turso HTTP error ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const first = data.results?.[0];
  if (first?.type === 'error') {
    throw new Error(first.error?.message || 'Turso query failed');
  }

  const result = first?.response?.result;
  const cols: string[] = result?.cols?.map((c: any) => c.name) || [];
  const rows: Record<string, any>[] = (result?.rows || []).map((row: any[]) => {
    const obj: Record<string, any> = {};
    cols.forEach((col, i) => {
      obj[col] = row[i]?.value;
    });
    return obj;
  });

  return {
    rows,
    cols,
    affectedRows: result?.affected_row_count || 0,
  };
}

let tablesInitialized = false;

export async function initTursoTables() {
  if (!isTursoConfigured || tablesInitialized) return;
  try {
    await executeTurso(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password_hash TEXT,
        username TEXT UNIQUE,
        display_name TEXT,
        avatar_pose TEXT,
        created_at INTEGER
      );
    `);

    await executeTurso(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id TEXT PRIMARY KEY,
        experience_level TEXT,
        daily_goal_minutes INTEGER,
        priority_subjects TEXT,
        target_goal TEXT,
        completed_onboarding INTEGER DEFAULT 0,
        updated_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    await executeTurso(`
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id TEXT PRIMARY KEY,
        xp INTEGER DEFAULT 0,
        streak_count INTEGER DEFAULT 1,
        last_active_date TEXT,
        completed_lessons TEXT,
        unlocked_nodes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    tablesInitialized = true;
  } catch (error) {
    console.warn('Turso table initialization warning:', error);
  }
}

// Session keys for fast local cache and offline access
const AUTH_SESSION_KEY = '@kaicode_session_user';
const USERS_LOCAL_STORAGE_KEY = '@kaicode_local_users';
const PROFILES_LOCAL_STORAGE_KEY = '@kaicode_local_profiles';
const PROGRESS_LOCAL_STORAGE_KEY = '@kaicode_local_progress';

export async function getStoredSession(): Promise<UserAccount | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveSession(user: UserAccount | null) {
  try {
    if (user) {
      await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(AUTH_SESSION_KEY);
    }
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}`;
}

export async function registerUser({
  email,
  password,
  username,
  displayName,
  avatarPose = 'accepted',
}: {
  email: string;
  password: string;
  username: string;
  displayName?: string;
  avatarPose?: string;
}): Promise<{ user: UserAccount; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  const finalDisplayName = displayName?.trim() || cleanUsername;
  const userId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const passwordHash = simpleHash(password);
  const now = Date.now();

  const newUser: UserAccount = {
    id: userId,
    email: cleanEmail,
    username: cleanUsername,
    displayName: finalDisplayName,
    avatarPose,
    createdAt: now,
  };

  if (isTursoConfigured) {
    try {
      await initTursoTables();
      await executeTurso({
        sql: `INSERT INTO users (id, email, password_hash, username, display_name, avatar_pose, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [userId, cleanEmail, passwordHash, cleanUsername, finalDisplayName, avatarPose, now],
      });

      await executeTurso({
        sql: `INSERT INTO user_progress (user_id, xp, streak_count, last_active_date, completed_lessons, unlocked_nodes)
              VALUES (?, 0, 1, ?, '[]', '["arrays-1"]')`,
        args: [userId, new Date().toISOString().split('T')[0]],
      });
    } catch (err: any) {
      if (err?.message?.includes('UNIQUE')) {
        return { user: newUser, error: 'An account with that email or username already exists.' };
      }
      console.warn('Turso insert warning:', err);
    }
  }

  try {
    const rawUsers = await AsyncStorage.getItem(USERS_LOCAL_STORAGE_KEY);
    const usersMap: Record<string, { user: UserAccount; passwordHash: string }> = rawUsers ? JSON.parse(rawUsers) : {};
    usersMap[cleanEmail] = { user: newUser, passwordHash };
    await AsyncStorage.setItem(USERS_LOCAL_STORAGE_KEY, JSON.stringify(usersMap));
    await saveSession(newUser);
  } catch (storageErr) {
    console.error('Storage error:', storageErr);
  }

  return { user: newUser };
}

export async function loginUser({
  emailOrUsername,
  password,
}: {
  emailOrUsername: string;
  password: string;
}): Promise<{ user?: UserAccount; error?: string }> {
  const query = emailOrUsername.trim().toLowerCase();
  const passwordHash = simpleHash(password);

  if (isTursoConfigured) {
    try {
      await initTursoTables();
      const result = await executeTurso({
        sql: `SELECT id, email, username, display_name, avatar_pose, created_at, password_hash 
              FROM users 
              WHERE email = ? OR username = ? 
              LIMIT 1`,
        args: [query, query],
      });

      if (result.rows.length > 0) {
        const row = result.rows[0];
        if (row.password_hash === passwordHash) {
          const user: UserAccount = {
            id: String(row.id),
            email: String(row.email),
            username: String(row.username),
            displayName: String(row.display_name),
            avatarPose: String(row.avatar_pose || 'accepted'),
            createdAt: Number(row.created_at),
          };
          await saveSession(user);
          return { user };
        } else {
          return { error: 'Incorrect password. Please try again.' };
        }
      }
    } catch (err) {
      console.warn('Turso query failed, falling back to local storage:', err);
    }
  }

  try {
    const rawUsers = await AsyncStorage.getItem(USERS_LOCAL_STORAGE_KEY);
    const usersMap: Record<string, { user: UserAccount; passwordHash: string }> = rawUsers ? JSON.parse(rawUsers) : {};

    const matched = Object.values(usersMap).find(
      (entry) => entry.user.email === query || entry.user.username === query
    );

    if (matched) {
      if (matched.passwordHash === passwordHash) {
        await saveSession(matched.user);
        return { user: matched.user };
      } else {
        return { error: 'Incorrect password. Please try again.' };
      }
    }
  } catch (err) {
    console.error('Local login check error:', err);
  }

  return { error: 'No account found with that email or username.' };
}

export async function saveOnboardingProfile({
  userId,
  experienceLevel,
  dailyGoalMinutes,
  prioritySubjects,
  targetGoal,
}: {
  userId: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  dailyGoalMinutes: number;
  prioritySubjects: string[];
  targetGoal: string;
}): Promise<{ success: boolean; error?: string }> {
  const now = Date.now();
  const profile: UserProfile = {
    userId,
    experienceLevel,
    dailyGoalMinutes,
    prioritySubjects,
    targetGoal,
    completedOnboarding: true,
    updatedAt: now,
  };

  if (isTursoConfigured) {
    try {
      await initTursoTables();
      await executeTurso({
        sql: `INSERT OR REPLACE INTO user_profiles 
              (user_id, experience_level, daily_goal_minutes, priority_subjects, target_goal, completed_onboarding, updated_at)
              VALUES (?, ?, ?, ?, ?, 1, ?)`,
        args: [userId, experienceLevel, dailyGoalMinutes, JSON.stringify(prioritySubjects), targetGoal, now],
      });
    } catch (err) {
      console.warn('Turso profile update failed, writing to local storage fallback:', err);
    }
  }

  try {
    const raw = await AsyncStorage.getItem(PROFILES_LOCAL_STORAGE_KEY);
    const profiles = raw ? JSON.parse(raw) : {};
    profiles[userId] = profile;
    await AsyncStorage.setItem(PROFILES_LOCAL_STORAGE_KEY, JSON.stringify(profiles));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (isTursoConfigured) {
    try {
      await initTursoTables();
      const res = await executeTurso({
        sql: `SELECT user_id, experience_level, daily_goal_minutes, priority_subjects, target_goal, completed_onboarding, updated_at
              FROM user_profiles WHERE user_id = ? LIMIT 1`,
        args: [userId],
      });
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          userId: String(row.user_id),
          experienceLevel: String(row.experience_level) as any,
          dailyGoalMinutes: Number(row.daily_goal_minutes),
          prioritySubjects: JSON.parse(String(row.priority_subjects || '[]')),
          targetGoal: String(row.target_goal),
          completedOnboarding: Boolean(Number(row.completed_onboarding)),
          updatedAt: Number(row.updated_at),
        };
      }
    } catch (err) {
      console.warn('Turso fetch profile failed, checking local storage:', err);
    }
  }

  try {
    const raw = await AsyncStorage.getItem(PROFILES_LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const profiles = JSON.parse(raw);
    return profiles[userId] || null;
  } catch {
    return null;
  }
}

export async function getUserProgress(userId: string): Promise<UserProgress> {
  const defaultProgress: UserProgress = {
    userId,
    xp: 250,
    streakCount: 7,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessons: ['arrays-1', 'arrays-2'],
    unlockedNodes: ['arrays-1', 'arrays-2', 'arrays-3'],
  };

  if (isTursoConfigured) {
    try {
      await initTursoTables();
      const res = await executeTurso({
        sql: `SELECT user_id, xp, streak_count, last_active_date, completed_lessons, unlocked_nodes
              FROM user_progress WHERE user_id = ? LIMIT 1`,
        args: [userId],
      });
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          userId: String(row.user_id),
          xp: Number(row.xp),
          streakCount: Number(row.streak_count),
          lastActiveDate: String(row.last_active_date),
          completedLessons: JSON.parse(String(row.completed_lessons || '[]')),
          unlockedNodes: JSON.parse(String(row.unlocked_nodes || '[]')),
        };
      }
    } catch (err) {
      console.warn('Turso fetch progress failed:', err);
    }
  }

  try {
    const raw = await AsyncStorage.getItem(PROGRESS_LOCAL_STORAGE_KEY);
    if (raw) {
      const all = JSON.parse(raw);
      if (all[userId]) return all[userId];
    }
  } catch {}

  return defaultProgress;
}

export async function saveUserProgress(progress: UserProgress): Promise<boolean> {
  if (isTursoConfigured) {
    try {
      await initTursoTables();
      await executeTurso({
        sql: `INSERT OR REPLACE INTO user_progress 
              (user_id, xp, streak_count, last_active_date, completed_lessons, unlocked_nodes)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          progress.userId,
          progress.xp,
          progress.streakCount,
          progress.lastActiveDate,
          JSON.stringify(progress.completedLessons),
          JSON.stringify(progress.unlockedNodes),
        ],
      });
    } catch (err) {
      console.warn('Failed to save progress to Turso:', err);
    }
  }

  try {
    const raw = await AsyncStorage.getItem(PROGRESS_LOCAL_STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[progress.userId] = progress;
    await AsyncStorage.setItem(PROGRESS_LOCAL_STORAGE_KEY, JSON.stringify(all));
    return true;
  } catch (err) {
    console.error('Failed to save progress locally:', err);
    return false;
  }
}

export async function recordLessonCompleted(
  userId: string,
  lessonId: string,
  xpGained: number = 40
): Promise<UserProgress> {
  const current = await getUserProgress(userId);
  const alreadyDone = current.completedLessons.includes(lessonId);
  const now = new Date().toISOString().split('T')[0];

  const updatedLessons = alreadyDone
    ? current.completedLessons
    : [...current.completedLessons, lessonId];

  // Calculate streak increment if active today vs yesterday
  let updatedStreak = current.streakCount;
  if (current.lastActiveDate !== now) {
    updatedStreak = (current.streakCount || 0) + 1;
  }

  const updatedProgress: UserProgress = {
    ...current,
    xp: current.xp + xpGained,
    streakCount: updatedStreak,
    lastActiveDate: now,
    completedLessons: updatedLessons,
  };

  await saveUserProgress(updatedProgress);
  return updatedProgress;
}

export interface LeaderboardRank {
  rank: number;
  userId: string;
  name: string;
  username: string;
  xp: number;
  streak: number;
  avatarPose: string;
  isUser: boolean;
  badge?: string;
}

const DEFAULT_LEADERBOARD_SEED: LeaderboardRank[] = [
  { rank: 1, userId: 'u_1', name: 'Priya Sharma', username: 'priya_code', xp: 2140, streak: 14, isUser: false, avatarPose: 'speedrun', badge: '🥇' },
  { rank: 2, userId: 'u_2', name: 'Rohan Kumar', username: 'rohan_dev', xp: 1820, streak: 21, isUser: false, avatarPose: 'whisper', badge: '🥈' },
  { rank: 3, userId: 'u_3', name: 'David Lee', username: 'david_algo', xp: 1490, streak: 8, isUser: false, avatarPose: 'coding', badge: '🥉' },
  { rank: 4, userId: 'u_4', name: 'Sarah Chen', username: 'sarah_c', xp: 1110, streak: 12, isUser: false, avatarPose: 'eureka' },
  { rank: 5, userId: 'u_5', name: 'Marcus Bell', username: 'marcus_b', xp: 950, streak: 5, isUser: false, avatarPose: 'coding' },
  { rank: 6, userId: 'u_6', name: 'Ananya Mehta', username: 'ananya_m', xp: 820, streak: 9, isUser: false, avatarPose: 'speedrun' },
  { rank: 7, userId: 'u_7', name: 'Liam Garcia', username: 'liam_g', xp: 710, streak: 4, isUser: false, avatarPose: 'whisper' },
  { rank: 8, userId: 'u_8', name: 'Elena Rostova', username: 'elena_r', xp: 640, streak: 3, isUser: false, avatarPose: 'coding' },
  { rank: 9, userId: 'u_9', name: 'Kenji Sato', username: 'kenji_s', xp: 580, streak: 6, isUser: false, avatarPose: 'eureka' },
  { rank: 10, userId: 'u_10', name: 'Maya Patel', username: 'maya_p', xp: 420, streak: 2, isUser: false, avatarPose: 'facepalm' },
];

export async function getGlobalLeaderboard(currentUserId?: string): Promise<LeaderboardRank[]> {
  if (isTursoConfigured) {
    try {
      await initTursoTables();
      const res = await executeTurso(`
        SELECT u.id, u.username, u.display_name, u.avatar_pose,
               COALESCE(p.xp, 0) as xp,
               COALESCE(p.streak_count, 1) as streak_count
        FROM users u
        LEFT JOIN user_progress p ON u.id = p.user_id
        ORDER BY COALESCE(p.xp, 0) DESC
        LIMIT 30
      `);

      if (res.rows && res.rows.length > 0) {
        const liveUsers: LeaderboardRank[] = res.rows.map((row) => ({
          rank: 0,
          userId: String(row.id),
          name: String(row.display_name || row.username || 'Coder'),
          username: String(row.username || 'coder'),
          xp: Number(row.xp || 0),
          streak: Number(row.streak_count || 1),
          avatarPose: String(row.avatar_pose || 'accepted'),
          isUser: row.id === currentUserId,
        }));

        // If fewer than 8 live users, fill with mock classmates so the league stays engaging
        let pool = [...liveUsers];
        if (pool.length < 8) {
          const liveUserIds = new Set(pool.map((u) => u.userId));
          for (const seed of DEFAULT_LEADERBOARD_SEED) {
            if (!liveUserIds.has(seed.userId)) {
              pool.push({ ...seed });
            }
          }
        }

        // Sort by XP descending
        pool.sort((a, b) => b.xp - a.xp);

        // Assign rank numbers and medals
        return pool.map((item, idx) => {
          const rank = idx + 1;
          let badge: string | undefined = undefined;
          if (rank === 1) badge = '🥇';
          else if (rank === 2) badge = '🥈';
          else if (rank === 3) badge = '🥉';
          else if (item.isUser) badge = '🚀';

          return {
            ...item,
            rank,
            badge,
          };
        });
      }
    } catch (err) {
      console.warn('Failed to load live leaderboard from Turso:', err);
    }
  }

  // Fallback to local user + seeds
  let pool = [...DEFAULT_LEADERBOARD_SEED];
  if (currentUserId) {
    try {
      const userProgress = await getUserProgress(currentUserId);
      const userSession = await getStoredSession();
      if (userSession) {
        pool.push({
          rank: 0,
          userId: currentUserId,
          name: `${userSession.displayName} (You)`,
          username: userSession.username,
          xp: userProgress.xp,
          streak: userProgress.streakCount,
          avatarPose: userSession.avatarPose || 'accepted',
          isUser: true,
        });
      }
    } catch (_) {}
  }

  pool.sort((a, b) => b.xp - a.xp);
  return pool.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    badge: idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : item.isUser ? '🚀' : undefined,
  }));
}
