/**
 * Trò chuyện sân chùa (HUD) — gồm 2 cơ chế rõ ràng:
 *  1. "Chat tổng" (scope: 'global'): lưu lịch sử ở khung Trò chuyện sân chùa + hiện bong bóng trên đầu nhân vật.
 *  2. "Chat tại chỗ" (scope: 'bubble'): chỉ hiện bong bóng lời nói trên đầu nhân vật, KHÔNG lưu lịch sử.
 * Giới hạn chung: 20 giây mới được chat 1 lần, có đồng hồ đếm ngược trực tiếp.
 */
import type { AppContext, ChatMessage, ChatScope } from '@/core/contracts';
import { CHAT_COOLDOWN_MS, CHAT_MAX, validateChatText } from '@/core/profile';
import { load, save } from '@/core/store';
import { esc } from './dom';
import { icon } from './icons';

const MAX_ITEMS = 60;

const QUICK_CHIPS = [
  'A Di Đà Phật 🙏',
  'Chúc bình an 🌸',
  'Tùy hỷ công đức ✨',
  'Xin chào mọi người',
  'Cùng tụng kinh nhé',
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
  let mode: ChatScope = load<ChatScope>('chat:mode', 'global') === 'bubble' ? 'bubble' : 'global';

  const pillEl = document.createElement('button');
  pillEl.type = 'button';
  pillEl.className = 'chat-pill glass';
  pillEl.id = 'hud-chat-btn';
  pillEl.setAttribute('aria-label', 'Mở Trò chuyện sân chùa');
  pillEl.setAttribute('aria-expanded', 'false');
  pillEl.setAttribute('aria-controls', 'hud-chat-panel');
  pillEl.innerHTML = `
    ${icon('chat', { size: 18 })}
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
      <div class="chat__top">
        <div class="chat__title-wrap">
          <span class="chat__dot" data-state="offline" aria-hidden="true"></span>
          <h2 class="chat__title">Trò chuyện sân chùa</h2>
        </div>
        <div class="chat__actions">
          <button type="button" class="chat__preset-btn" title="Chọn câu chào soạn sẵn" aria-label="Câu chào soạn sẵn">
            ${icon('hands', { size: 15 })}<span>Lời chào</span>
          </button>
          <button type="button" class="chat__close" title="Thu gọn (Esc)" aria-label="Thu gọn khung trò chuyện">
            ${icon('chevron-down', { size: 18 })}
          </button>
        </div>
      </div>
      <div class="chat__modes" role="tablist" aria-label="Chế độ trò chuyện">
        <button type="button" role="tab" class="chat__tab" data-mode="global" aria-selected="true">
          <span>Chat tổng</span>
          <span class="chat__tab-badge" hidden>0</span>
        </button>
        <button type="button" role="tab" class="chat__tab" data-mode="bubble" aria-selected="false">
          <span>Chat tại chỗ</span>
        </button>
      </div>
    </header>
    <div class="chat__solo" hidden>
      <span>Đang ở chế độ tịnh tâm một mình.</span>
      <button type="button" class="chat__solo-btn">Vào sân chung</button>
    </div>
    <div class="chat__list" role="log" aria-live="polite" aria-relevant="additions">
      <p class="chat__empty">Chưa có tin nhắn kể từ lúc bạn vào sân chùa. Gửi lời chào hoan hỷ nhé!</p>
    </div>
    <p class="chat__bubble-note" hidden>
      Chỉ hiện bong bóng lời nói tại chỗ đang đứng · <strong>không lưu</strong> vào lịch sử sân chùa.
    </p>
    <div class="chat__quick" aria-label="Gợi ý lời chào nhanh">
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
        placeholder="Nhắn Chat tổng (lưu lịch sử sân chùa)…"
        aria-label="Nội dung tin nhắn"
      />
      <span class="chat__count" hidden>0/${CHAT_MAX}</span>
      <button type="submit" class="chat__send" aria-label="Gửi tin nhắn">${icon('send', { size: 17 })}</button>
    </form>
  `;

  host.append(pillEl, panelEl);

  const pillText = pillEl.querySelector('.chat-pill__text') as HTMLElement;
  const pillBadge = pillEl.querySelector('.chat-pill__badge') as HTMLElement;
  const dotEl = panelEl.querySelector('.chat__dot') as HTMLElement;
  const presetBtn = panelEl.querySelector('.chat__preset-btn') as HTMLButtonElement;
  const closeBtn = panelEl.querySelector('.chat__close') as HTMLButtonElement;
  const tabGlobal = panelEl.querySelector('[data-mode="global"]') as HTMLButtonElement;
  const tabBubble = panelEl.querySelector('[data-mode="bubble"]') as HTMLButtonElement;
  const tabBadge = panelEl.querySelector('.chat__tab-badge') as HTMLElement;
  const soloBar = panelEl.querySelector('.chat__solo') as HTMLElement;
  const soloBtn = panelEl.querySelector('.chat__solo-btn') as HTMLButtonElement;
  const listEl = panelEl.querySelector('.chat__list') as HTMLElement;
  const emptyEl = panelEl.querySelector('.chat__empty') as HTMLElement;
  const bubbleNoteEl = panelEl.querySelector('.chat__bubble-note') as HTMLElement;
  const quickEl = panelEl.querySelector('.chat__quick') as HTMLElement;
  const formEl = panelEl.querySelector('.chat__form') as HTMLFormElement;
  const inputEl = panelEl.querySelector('.chat__input') as HTMLInputElement;
  const countEl = panelEl.querySelector('.chat__count') as HTMLElement;
  const sendBtn = panelEl.querySelector('.chat__send') as HTMLButtonElement;
  const sendIconHtml = sendBtn.innerHTML;

  let opened = false;
  let cdTimer = 0;
  let unread = 0;
  let lastPreview = '';
  let wasOnline = ctx.net.isOnline();
  let activeSessionId: string | null = ctx.net.selfId?.() ?? null;
  const messages: ChatMessage[] = [];
  const seenIds = new Set<string>();

  function clearMessages(): void {
    if (messages.length === 0 && unread === 0 && !lastPreview) return;
    messages.length = 0;
    seenIds.clear();
    unread = 0;
    lastPreview = '';
    listEl.querySelectorAll('.chat-msg').forEach((n) => n.remove());
    emptyEl.hidden = false;
    paintBadgesAndPill();
  }

  function isMineMsg(m: ChatMessage): boolean {
    if (m.senderId === 'local-me') return true;
    const myId = ctx.net.selfId?.();
    return Boolean(myId && m.senderId === myId);
  }

  function isNearBottom(): boolean {
    return listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight < 56;
  }

  function scrollToBottom(): void {
    listEl.scrollTop = listEl.scrollHeight;
  }

  function getLastSendAt(): number {
    const t = load<number>('chat:lastSendAt', 0);
    return t > Date.now() ? 0 : t;
  }

  function remainCooldownSec(now = Date.now()): number {
    const left = getLastSendAt() + CHAT_COOLDOWN_MS - now;
    return left > 0 ? Math.max(1, Math.ceil(left / 1000)) : 0;
  }

  function paintBadgesAndPill(sec = remainCooldownSec()): void {
    const badgeTxt = unread > 9 ? '9+' : String(unread);
    if (unread > 0) {
      pillBadge.hidden = false;
      pillBadge.textContent = badgeTxt;
      pillEl.classList.add('has-unread');
      pillText.textContent = lastPreview || 'Trò chuyện';
    } else {
      pillBadge.hidden = true;
      pillEl.classList.remove('has-unread');
      pillText.textContent = sec > 0 ? `Trò chuyện · ${sec}s` : 'Trò chuyện';
    }

    if (unread > 0 && mode === 'bubble') {
      tabBadge.hidden = false;
      tabBadge.textContent = badgeTxt;
    } else {
      tabBadge.hidden = true;
    }
  }

  function paintCooldown(): void {
    const sec = remainCooldownSec();
    if (sec > 0) {
      pillEl.classList.add('is-cooldown');
      sendBtn.classList.add('is-cooldown');
      sendBtn.setAttribute('aria-disabled', 'true');
      sendBtn.innerHTML = `<span class="chat__cd">${sec}s</span>`;
      if (!cdTimer) {
        cdTimer = window.setInterval(() => paintCooldown(), 300);
      }
    } else {
      if (cdTimer) {
        window.clearInterval(cdTimer);
        cdTimer = 0;
      }
      pillEl.classList.remove('is-cooldown');
      if (sendBtn.classList.contains('is-cooldown')) {
        sendBtn.classList.remove('is-cooldown');
        sendBtn.removeAttribute('aria-disabled');
        sendBtn.innerHTML = sendIconHtml;
      }
    }
    paintBadgesAndPill(sec);
  }

  function paintStatus(): void {
    const solo = ctx.isSolo?.() ?? false;
    const online = !solo && ctx.net.isOnline();
    dotEl.dataset.state = online ? 'online' : 'offline';
    soloBar.hidden = !solo || mode === 'bubble';
  }

  function applyMode(next: ChatScope, focusInput = false): void {
    mode = next;
    save('chat:mode', mode);
    const isBubble = mode === 'bubble';
    panelEl.classList.toggle('is-bubble-mode', isBubble);
    tabGlobal.classList.toggle('is-active', !isBubble);
    tabGlobal.setAttribute('aria-selected', String(!isBubble));
    tabBubble.classList.toggle('is-active', isBubble);
    tabBubble.setAttribute('aria-selected', String(isBubble));

    listEl.hidden = isBubble;
    quickEl.hidden = isBubble;
    bubbleNoteEl.hidden = !isBubble;

    inputEl.placeholder = isBubble
      ? 'Nhắn tại chỗ (chỉ hiện trên đầu, không lưu)…'
      : 'Nhắn Chat tổng (lưu lịch sử sân chùa)…';

    if (!isBubble && opened) {
      unread = 0;
      lastPreview = '';
      requestAnimationFrame(() => scrollToBottom());
    }
    paintStatus();
    paintBadgesAndPill();
    if (focusInput && opened) {
      requestAnimationFrame(() => inputEl.focus());
    }
  }

  function renderMsgEl(m: ChatMessage): HTMLElement {
    const mine = isMineMsg(m);
    const row = document.createElement('div');
    row.className = 'chat-msg' + (mine ? ' is-me' : '');
    row.dataset.id = m.id;
    row.innerHTML = `
      <div class="chat-msg__meta">
        <span class="chat-msg__name">${esc(mine ? 'Bạn' : m.name)}</span>
        <span class="chat-msg__lvl">Cấp ${Math.max(1, Math.floor(m.level || 1))}</span>
        <time class="chat-msg__time">${esc(fmtTime(m.ts))}</time>
      </div>
      <div class="chat-msg__bubble">${esc(m.text)}</div>
    `;
    return row;
  }

  function appendGlobalMessage(m: ChatMessage): void {
    if (m.scope === 'bubble') return;
    if (seenIds.has(m.id)) return;
    const stick = isNearBottom();
    seenIds.add(m.id);
    messages.push(m);
    if (messages.length > MAX_ITEMS) {
      const removed = messages.splice(0, messages.length - MAX_ITEMS);
      for (const r of removed) {
        seenIds.delete(r.id);
        listEl.querySelector(`.chat-msg[data-id="${CSS.escape(r.id)}"]`)?.remove();
      }
    }
    emptyEl.hidden = true;
    listEl.append(renderMsgEl(m));

    const mine = isMineMsg(m);
    if (opened && mode === 'global') {
      if (stick || mine) scrollToBottom();
    } else if (!mine) {
      unread = Math.min(99, unread + 1);
      lastPreview = `${m.name}: ${m.text}`;
      paintBadgesAndPill();
    }
  }

  function updateCounter(): void {
    const len = [...inputEl.value].length;
    if (len >= 70) {
      countEl.hidden = false;
      countEl.textContent = `${len}/${CHAT_MAX}`;
    } else {
      countEl.hidden = true;
    }
  }

  function submitText(raw: string): boolean {
    const v = validateChatText(raw);
    if (!v.ok) {
      ctx.toast(v.error, { kind: 'warn' });
      return false;
    }
    const sec = remainCooldownSec();
    if (sec > 0) {
      ctx.toast(`Mỗi 20 giây mới chat được 1 lần. Xin chờ ${sec}s nữa nhé.`);
      paintCooldown();
      return false;
    }
    const now = Date.now();
    save('chat:lastSendAt', now);
    paintCooldown();

    // Cả hai chế độ đều hiện bong bóng lời nói trên đầu nhân vật 3D
    ctx.world.say(v.text);
    ctx.progress.record('greet');

    if (ctx.net.isOnline()) {
      ctx.net.sendChat(v.text, mode);
    } else if (mode === 'global') {
      // Khi đang ngoại tuyến / một mình: "Chat tổng" vẫn lưu vào khung Trò chuyện sân chùa cục bộ
      appendGlobalMessage({
        id: `local-${now.toString(36)}`,
        senderId: 'local-me',
        name: ctx.profile.name,
        level: ctx.progress.view().level,
        text: v.text,
        ts: now,
        scope: 'global',
      });
    }
    return true;
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

  function onOutside(e: Event): void {
    const t = e.target as Node | null;
    if (!t || panelEl.contains(t) || pillEl.contains(t)) return;
    // Chỉ tự đóng khi chạm ngoài trên màn hình nhỏ hoặc khi đang ở chế độ gọn "Chat tại chỗ"
    if (mode === 'bubble' || window.innerWidth < 1180) {
      close();
    }
  }

  function open(focus = true): void {
    paintCooldown();
    paintStatus();
    if (!opened) {
      opened = true;
      panelEl.inert = false;
      panelEl.classList.add('is-open');
      pillEl.classList.add('is-open');
      pillEl.setAttribute('aria-expanded', 'true');
      if (mode === 'global') {
        unread = 0;
        lastPreview = '';
        paintBadgesAndPill();
        requestAnimationFrame(() => scrollToBottom());
      }
      opts.onOpen?.();
      syncViewport();
      document.addEventListener('pointerdown', onOutside, true);
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
    document.removeEventListener('pointerdown', onOutside, true);
    if (document.activeElement && panelEl.contains(document.activeElement)) {
      (document.activeElement as HTMLElement).blur();
    }
    paintCooldown();
  }

  function toggle(focus = true): void {
    if (opened) close();
    else open(focus);
  }

  pillEl.addEventListener('click', () => {
    // Nếu đang có tin nhắn mới ở Chat tổng thì khi bấm mở sẽ ưu tiên mở tab Chat tổng để đọc ngay
    if (unread > 0 && mode !== 'global') {
      applyMode('global', false);
    }
    open( !matchMedia('(pointer: coarse)').matches );
  });
  closeBtn.addEventListener('click', () => close());
  presetBtn.addEventListener('click', () => {
    close();
    void ctx.openPanel('sayings');
  });
  tabGlobal.addEventListener('click', () => applyMode('global', true));
  tabBubble.addEventListener('click', () => applyMode('bubble', true));
  soloBtn.addEventListener('click', () => {
    ctx.setSolo?.(false);
    paintStatus();
  });

  quickEl.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-chip]');
    if (!b?.dataset.chip) return;
    submitText(b.dataset.chip);
  });

  inputEl.addEventListener('input', updateCounter);
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!inputEl.value.trim()) {
      if (mode === 'bubble') close();
      return;
    }
    if (submitText(inputEl.value)) {
      inputEl.value = '';
      updateCounter();
      if (mode === 'bubble') {
        // Chế độ "Chat tại chỗ" không lưu lịch sử → đóng gọn ngay để thấy bong bóng trên đầu nhân vật
        close();
      }
    }
  });

  panelEl.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && opened) {
      e.stopPropagation();
      close();
    }
  });

  const vv = window.visualViewport;
  vv?.addEventListener('resize', syncViewport);
  vv?.addEventListener('scroll', syncViewport);

  const offChat = ctx.net.on('chat', (msg) => {
    // Chỉ lưu các tin "Chat tổng" kể từ lúc người chơi đang có mặt trong chùa; "Chat tại chỗ" bỏ qua hoàn toàn
    if (msg.scope === 'bubble') return;
    appendGlobalMessage(msg);
  });

  const offStatus = ctx.net.on('status', (s) => {
    if (s.state === 'online') {
      const sid = ctx.net.selfId?.() ?? null;
      // Mỗi phiên kết nối lại vào sân chùa (vd rời đi rồi quay lại lúc 15:30) đều bắt đầu khung chat mới tinh
      if (activeSessionId && sid && sid !== activeSessionId) {
        clearMessages();
      }
      activeSessionId = sid;
      wasOnline = true;
    } else if (wasOnline) {
      // Vừa rời phòng / mất kết nối → xoá lịch sử phiên cũ
      wasOnline = false;
      clearMessages();
    }
    paintStatus();
  });
  const offSolo = ctx.bus.on('solo', ({ solo }) => {
    if (solo) clearMessages();
    paintStatus();
  });
  const offPanel = ctx.bus.on('panel', ({ id }) => {
    if (id !== null) close();
    else paintCooldown();
  });
  const offToggle = ctx.bus.on('chatToggle', ({ open: wantOpen, focus }) => {
    if (wantOpen === false) close();
    else if (wantOpen === true) open(focus ?? true);
    else toggle(focus ?? true);
  });

  applyMode(mode, false);
  paintCooldown();

  return {
    pillEl,
    panelEl,
    isOpen: () => opened,
    open,
    close,
    toggle,
    destroy() {
      if (cdTimer) window.clearInterval(cdTimer);
      offChat();
      offStatus();
      offSolo();
      offPanel();
      offToggle();
      document.removeEventListener('pointerdown', onOutside, true);
      vv?.removeEventListener('resize', syncViewport);
      vv?.removeEventListener('scroll', syncViewport);
      pillEl.remove();
      panelEl.remove();
    },
  };
}
