import AsyncStorage from '@react-native-async-storage/async-storage';

const K_PATH = '@clp/dailyPathIndex';
const K_DONE = '@clp/completedActivityIds';
const K_ATTEMPTS = '@clp/attemptCounts';

export async function getDailyPathIndex(): Promise<number> {
  const v = await AsyncStorage.getItem(K_PATH);
  return v == null ? 0 : Math.max(0, parseInt(v, 10) || 0);
}

export async function setDailyPathIndex(index: number): Promise<void> {
  await AsyncStorage.setItem(K_PATH, String(Math.max(0, index)));
}

export async function getCompletedIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(K_DONE);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addCompletedId(id: string): Promise<void> {
  const cur = await getCompletedIds();
  if (!cur.includes(id)) {
    cur.push(id);
    await AsyncStorage.setItem(K_DONE, JSON.stringify(cur));
  }
}

export async function bumpAttempt(activityId: string): Promise<void> {
  const raw = await AsyncStorage.getItem(K_ATTEMPTS);
  let map: Record<string, number> = {};
  if (raw) {
    try {
      map = JSON.parse(raw) || {};
    } catch {
      map = {};
    }
  }
  map[activityId] = (map[activityId] ?? 0) + 1;
  await AsyncStorage.setItem(K_ATTEMPTS, JSON.stringify(map));
}

/** Testing / adult reset */
export async function clearAllProgress(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(K_PATH),
    AsyncStorage.removeItem(K_DONE),
    AsyncStorage.removeItem(K_ATTEMPTS),
  ]);
}
