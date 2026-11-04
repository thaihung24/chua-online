/** Lưu trữ JSON đơn giản: data/db.json, ghi nguyên tử (file tạm rồi rename), debounce. */
import fs from 'node:fs/promises';
import { mkdirSync, writeFileSync, renameSync } from 'node:fs';
import path from 'node:path';
import type { Profile } from '../src/core/contracts';

export interface UserRec {
  email: string;
  salt: string;
  hash: string;
  profile: Profile;
  createdAt: number;
  /** Trạng thái tiến độ đồng bộ (JSON ≤ 16KB). */
  state?: unknown;
  stateAt?: number;
}
export interface SessionRec { email: string; created: number; expires: number }
export interface FriendRec { code: string; friends: string[]; incoming: string[]; outgoing: string[] }
export interface LeaderRec { name: string; level: number; streak: number; updatedAt: number }
export interface BanRec { id: string; ipHash: string; at: number }

export interface DbShape {
  users: Record<string, UserRec>;
  /** Khoá = SHA-256 của token phiên. */
  sessions: Record<string, SessionRec>;
  friends: Record<string, FriendRec>;
  leaderboard: Record<string, LeaderRec>;
  bans: BanRec[];
}

const empty = (): DbShape => ({ users: {}, sessions: {}, friends: {}, leaderboard: {}, bans: [] });

export class Db {
  data: DbShape = empty();
  private file: string;
  private timer: NodeJS.Timeout | null = null;
  private writing: Promise<void> = Promise.resolve();
  private dirty = false;

  constructor(private dir: string, private persist: boolean, private debounceMs = 400) {
    this.file = path.join(dir, 'db.json');
  }

  async load(): Promise<void> {
    if (!this.persist) return;
    await fs.mkdir(this.dir, { recursive: true });
    try {
      const raw = await fs.readFile(this.file, 'utf8');
      const j = JSON.parse(raw) as Partial<DbShape>;
      this.data = {
        users: j.users ?? {}, sessions: j.sessions ?? {}, friends: j.friends ?? {},
        leaderboard: j.leaderboard ?? {}, bans: Array.isArray(j.bans) ? j.bans : [],
      };
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
        // File hỏng: giữ bản sao để cứu dữ liệu rồi bắt đầu lại.
        try { await fs.rename(this.file, path.join(this.dir, `db.corrupt-${Date.now()}.json`)); } catch { /* bỏ qua */ }
      }
    }
  }

  /** Đánh dấu đã đổi → ghi sau `debounceMs`. */
  touch(): void {
    if (!this.persist) return;
    this.dirty = true;
    if (this.timer) return;
    this.timer = setTimeout(() => { this.timer = null; void this.flush(); }, this.debounceMs);
    this.timer.unref?.();
  }

  flush(): Promise<void> {
    if (!this.persist || !this.dirty) return this.writing;
    this.dirty = false;
    const json = JSON.stringify(this.data);
    this.writing = this.writing.then(async () => {
      const tmp = `${this.file}.${process.pid}.tmp`;
      try {
        await fs.writeFile(tmp, json, { mode: 0o600 });
        await fs.rename(tmp, this.file);
      } catch (e) {
        console.error('[db] ghi lỗi:', (e as Error).message);
      }
    });
    return this.writing;
  }

  /** Ghi đồng bộ lần cuối khi tắt máy. */
  async close(): Promise<void> {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    await this.flush();
    await this.writing;
  }

  /** Dùng khi tiến trình sắp thoát bất thường. */
  flushSync(): void {
    if (!this.persist || !this.dirty) return;
    try {
      mkdirSync(this.dir, { recursive: true });
      const tmp = `${this.file}.${process.pid}.tmp`;
      writeFileSync(tmp, JSON.stringify(this.data), { mode: 0o600 });
      renameSync(tmp, this.file);
      this.dirty = false;
    } catch { /* bỏ qua */ }
  }
}
