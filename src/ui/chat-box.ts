/**
 * Hộp trò chuyện trực tiếp sân Chùa Rắn:
 * - Nút viên thuốc nổi (`.chat-pill`) hiện số tin chưa đọc & xem trước dòng mới nhất.
 * - Ngăn kéo kính mờ (`.chat-panel`) hiển thị luồng tin nhắn thời gian thực, dải lời chào nhanh 1 chạm,
 *   và ô nhập văn bản tự do (tối đa 100 ký tự, lọc từ ngữ & chống spam).
 */
import type { AppContext, ChatMessage } from '@/core/contracts';
import { CHAT_MAX, validateChatText } from '@/core/profile';
import { esc } from './dom';
import { icon } from './icons';

const MAX_ITEMS = 60;
const CLIENT_COOLDOWN_MS = 1400;

const QUICK_CHIPS = [
  'A Di Đà Phật 🙏',
  'Chúc bình an 🌸',
  'Tùy hỷ công đức ✨',
  'Xin chào mọi người',
  'Mình cùng tụng kinh nhé',
];

export interface ChatBox {
  readonly pillEl: HTMLButtonElement;
  readonly panelEl: HTMLElement;
  isOpen(): boolean;
  open(focus?: boolean): void;
  close(): void;
  toggle(focus?: boolean): void;
  destroy(): void;
}

function fmtTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function createChatBox(
  ctx: AppContext,
  host: HTMLElement,
  opts: { onOpen?: () => void } = {},
): ChatBox {
  const pillEl = document.createElement('button');
  pillEl.type = 'button';
  pillEl.className = 'chat-pill glass';
  pillEl.id = 'hud-chat-btn';
  pillEl.setAttribute('aria-label', 'Mở trò chuyện sân chùa');
  pillEl.setAttribute('aria-expanded', 'false');
  pillEl.setAttribute('aria-controls', 'hud-chat-panel');
  pillEl.innerHTML = `
    ${icon('chat', { size: 19 })}
    <span class="chat-pill__text">Trò chuyện</span>
    <span class="chat-pill__badge" hidden>0</span>
    <kbd class="chat-pill__key" aria-hidden="true">Enter</kbd>
  `;

  const panelEl = document.createElement('section');
  panelEl.className = 'chat-panel glass glass--strong';
  panelEl.id = 'hud-chat-panel';
  panelEl.setAttribute('aria-label', 'Trò chuyện sân chùa');
  panelEl.inert = true;
  panelEl.innerHTML = `
    <header class="chat__head">
      <div class="chat__title">
        ${icon('chat', { size: 18 })}
        <span>Trò chuyện sân chùa</span>
      </div>
      <div class="chat__actions">
        <button type="button" class="chat__preset-btn" title="Chọn câu chào soạn sẵn">Lời chào</button>
        <button type="button" class="chat__close" aria-label="Thu gọn trò chuyện">${icon('chevron-down', { size: 19 })}</button>
      </div>
    </header>
    <div class="chat__solo" hidden>
      <span>Đang ở chế độ tịnh tâm một mình.</span>
      <button type="button" class="chat__solo-btn">Vào sân chung</button>
    </div>
    <div class="chat__list" role="log" aria-live="polite">
      <p class="chat__empty">Chưa có tin nhắn mới. Hãy gửi lời chào an lành tới mọi người tại Chùa Rắn nhé!</p>
    </div>
    <div class="chat__quick" aria-label="Lời chào nhanh">
      ${QUICK_CHIPS.map((t) => `<button type="button" class="chat__chip" data-chip="${esc(t)}">${esc(t)}</button>`).join('')}
    </div>
    <form class="chat__form" autocomplete="off">
      <input
        type="text"
        class="chat__input"
        maxlength="${CHAT_MAX}"
        enterkeyhint="send"
        autocomplete="off"
        autocapitalize="sentences"
        placeholder="Nhắn lời lành tới mọi người…"
        aria-label="Nhập lời nhắn trò chuyện"
      />
      <span class="chat__count" hidden>0/${CHAT_MAX}</span>
      <button type="submit" class="chat__send" aria-label="Gửi tin nhắn">${icon('send', { size: 17 })}</button>
    </form>
  `;

  host.append(pillEl, panelEl);

  const pillText = pillEl.querySelector('.chat-pill__text') as HTMLElement;
  const badgeEl = pillEl.querySelector('.chat-pill__badge') as HTMLElement;
  const presetBtn = panelEl.querySelector('.chat__preset-btn') as HTMLButtonElement;
  const closeBtn = panelEl.querySelector('.chat__close') as HTMLButtonElement;
  const soloBar = panelEl.querySelector('.chat__solo') as HTMLElement;
  const soloBtn = panelEl.querySelector('.chat__solo-btn') as HTMLButtonElement;
  const listEl = panelEl.querySelector('.chat__list') as HTMLElement;
  const emptyEl = panelEl.querySelector('.chat__empty') as HTMLElement;
  const quickEl = panelEl.querySelector('.chat__quick') as HTMLElement;
  const formEl = panelEl.querySelector('.chat__form') as HTMLFormElement;
  const inputEl = panelEl.querySelector('.chat__input') as HTMLInputElement;
  const countEl = panelEl.querySelector('.chat__count') as HTMLElement;

  let opened = false;
  let unread = 0;
  let lastSendAt = 0;
  let localSeq = 0;
  const seenIds = new Set<string>();
  const items: ChatMessage[] = [];

  function isMine(m: ChatMessage): boolean {
    if (m.senderId === 'me') return true;
    const myId = ctx.net.selfId?.();
    return !!myId && m.senderId === myId;
  }

  function updateBadge(): void {
    if (unread <= 0 || opened) {
      badgeEl.hidden = true;
      pillEl.classList.remove('has-unread');
      if (items.length === 0) pillText.textContent = 'Trò chuyện';
    } else {
      badgeEl.hidden = false;
      badgeEl.textContent = unread > 9 ? '9+' : String(unread);
      pillEl.classList.add('has-unread');
    }
  }

  function paintSolo(): void {
    const solo = ctx.isSolo?.() ?? false;
    soloBar.hidden = !solo;
  }

  function renderItem(m: ChatMessage): HTMLElement {
    const mine = isMine(m);
    const row = document.createElement('div');
    row.className = 'chat__msg' + (mine ? ' chat__msg--mine' : '');
    row.dataset.id = m.id;
    row.innerHTML = `
      <div class="chat__meta">
        <strong class="chat__author">${esc(mine ? `${m.name} (Bạn)` : m.name)}</strong>
        <span class="chat__lvl">Cấp ${Math.max(1, Math.floor(m.level || 1))}</span>
        <time class="chat__time">${fmtTime(m.ts || Date.now())}</time>
      </div>
      <div class="chat__bubble">${esc(m.text)}</div>
    `;
    return row;
  }

  function appendMessage(m: ChatMessage, fromHistory = false): void {
    if (!m || !m.id || seenIds.has(m.id)) return;
    seenIds.add(m.id);
    items.push(m);
    if (items.length > MAX_ITEMS) {
      const dropped = items.shift();
      if (dropped) {
        seenIds.delete(dropped.id);
        listEl.querySelector(`[data-id="${CSS.escape(dropped.id)}"]`)?.remove();
      }
    }
    emptyEl.hidden = true;
    const nearBottom = listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight < 72;
    listEl.append(renderItem(m));
    if (opened && (nearBottom || isMine(m) || fromHistory)) {
      listEl.scrollTop = listEl.scrollHeight;
    }
    if (!opened && !fromHistory && !isMine(m)) {
      unread++;
      const preview = m.text.length > 20 ? m.text.slice(0, 19) + '…' : m.text;
      pillText.textContent = `${m.name}: ${preview}`;
      updateBadge();
    }
  }

  function submitText(raw: string): boolean {
    const v = validateChatText(raw);
    if (!v.ok) {
      ctx.toast(v.error, { kind: 'warn' });
      return false;
    }
    const now = Date.now();
    if (now - lastSendAt < CLIENT_COOLDOWN_MS) {
      ctx.toast('Bạn nhắn hơi nhanh, xin chờ một chút nhé.');
      return false;
    }
    lastSendAt = now;
    ctx.world.say(v.text);
    ctx.progress.record('greet');

    if (ctx.net.isOnline()) {
      ctx.net.sendChat(v.text);
    } else {
      appendMessage({
        id: `local-${++localSeq}-${now}`,
        senderId: 'me',
        name: ctx.profile.name,
        level: ctx.progress.view().level,
        text: v.text,
        ts: now,
        kind: 'chat',
      });
    }
    return true;
  }

  function updateCounter(): void {
    const len = [...inputEl.value].length;
    if (len >= 72) {
      countEl.hidden = false;
      countEl.textContent = `${len}/${CHAT_MAX}`;
    } else {
      countEl.hidden = true;
    }
  }

  function syncViewport(): void {
    const vv = window.visualViewport;
    if (!vv || !opened) {
      panelEl.style.removeProperty('--kb-offset');
      panelEl.classList.remove('is-kb');
      return;
    }
    const kb = Math.max(0, Math.round(window.innerHeight - (vv.height + vv.offsetTop)));
    if (kb > 60) {
      panelEl.style.setProperty('--kb-offset', `${kb}px`);
      panelEl.classList.add('is-kb');
    } else {
      panelEl.style.removeProperty('--kb-offset');
      panelEl.classList.remove('is-kb');
    }
  }

  function open(focus = false): void {
    if (!opened) {
      opened = true;
      unread = 0;
      pillText.textContent = 'Trò chuyện';
      updateBadge();
      paintSolo();
      panelEl.inert = false;
      panelEl.classList.add('is-open');
      pillEl.classList.add('is-open');
      pillEl.setAttribute('aria-expanded', 'true');
      opts.onOpen?.();
      syncViewport();
      requestAnimationFrame(() => {
        listEl.scrollTop = listEl.scrollHeight;
      });
    }
    if (focus) {
      requestAnimationFrame(() => inputEl.focus());
    }
  }

  function close(): void {
    if (!opened) return;
    opened = false;
    panelEl.classList.remove('is-open', 'is-kb');
    panelEl.style.removeProperty('--kb-offset');
    panelEl.inert = true;
    pillEl.classList.remove('is-open');
    pillEl.setAttribute('aria-expanded', 'false');
    if (document.activeElement === inputEl) inputEl.blur();
    updateBadge();
  }

  function toggle(focus = false): void {
    if (opened) close();
    else open(focus);
  }

  // ── Sự kiện DOM ──
  pillEl.addEventListener('click', () => {
    const desktop = matchMedia('(hover: hover) and (pointer: fine)').matches;
    open(desktop);
  });
  closeBtn.addEventListener('click', () => close());
  presetBtn.addEventListener('click', () => {
    close();
    void ctx.openPanel('sayings');
  });
  soloBtn.addEventListener('click', () => {
    ctx.setSolo?.(false);
    paintSolo();
  });
  quickEl.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-chip]');
    if (!b || !b.dataset.chip) return;
    submitText(b.dataset.chip);
  });
  inputEl.addEventListener('input', updateCounter);
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!inputEl.value.trim()) return;
    if (submitText(inputEl.value)) {
      inputEl.value = '';
      updateCounter();
    }
  });
  listEl.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });

  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && opened) {
      e.stopPropagation();
      close();
    }
  };
  panelEl.addEventListener('keydown', onKeyDown);

  const vv = window.visualViewport;
  vv?.addEventListener('resize', syncViewport);
  vv?.addEventListener('scroll', syncViewport);

  // ── Sự kiện mạng & bus ──
  const offHistory = ctx.net.on('chatHistory', (list) => {
    for (const m of list) appendMessage(m, true);
  });
  const offChat = ctx.net.on('chat', (m) => {
    appendMessage(m, false);
  });
  const offSolo = ctx.bus.on('solo', () => paintSolo());
  const offPanel = ctx.bus.on('panel', ({ id }) => {
    if (id !== null) close();
  });
  const offToggle = ctx.bus.on('chatToggle', ({ open: wantOpen, focus }) => {
    if (wantOpen === false) close();
    else if (wantOpen === true) open(!!focus);
    else toggle(!!focus);
  });

  paintSolo();

  return {
    pillEl,
    panelEl,
    isOpen: () => opened,
    open,
    close,
    toggle,
    destroy() {
      offHistory();
      offChat();
      offSolo();
      offPanel();
      offToggle();
      vv?.removeEventListener('resize', syncViewport);
      vv?.removeEventListener('scroll', syncViewport);
      pillEl.remove();
      panelEl.remove();
    },
  };
}
