"use strict";
// Giao diện chatbot thuần JS — gọi thẳng API FastAPI. Token JWT lưu ở localStorage.

const $ = (id) => document.getElementById(id);
const state = {
  token: localStorage.getItem("token") || null,
  user: null,
  convId: null,
  mode: "login",
  sending: false,
};

const esc = (s) =>
  (s == null ? "" : String(s)).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
const nl2br = (s) => esc(s).replace(/\n/g, "<br>");

// ===== API helper =====
async function api(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (state.token) headers["Authorization"] = "Bearer " + state.token;
  if (opts.body && !(opts.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const res = await fetch(path, { ...opts, headers });
  if (res.status === 401) {
    doLogout(false);
    throw new Error("Phiên đã hết hạn, hãy đăng nhập lại.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Lỗi " + res.status);
  return data;
}

// ===== Auth =====
function setMode(mode) {
  state.mode = mode;
  const isLogin = mode === "login";
  $("tab-login").classList.toggle("active", isLogin);
  $("tab-register").classList.toggle("active", !isLogin);
  $("name-field").hidden = isLogin;
  $("auth-submit").textContent = isLogin ? "Đăng nhập" : "Tạo tài khoản";
  $("password").autocomplete = isLogin ? "current-password" : "new-password";
  $("auth-error").textContent = "";
}

async function submitAuth(e) {
  e.preventDefault();
  $("auth-error").textContent = "";
  const email = $("email").value.trim();
  const password = $("password").value;
  const payload = { email, password };
  let path = "/api/auth/login";
  if (state.mode === "register") {
    path = "/api/auth/register";
    payload.display_name = $("display_name").value.trim() || null;
  }
  try {
    const d = await api(path, { method: "POST", body: JSON.stringify(payload) });
    state.token = d.access_token;
    state.user = d.user;
    localStorage.setItem("token", d.access_token);
    showApp();
  } catch (err) {
    $("auth-error").textContent = err.message;
  }
}

async function doLogout(callApi = true) {
  if (callApi) {
    try { await api("/api/auth/logout", { method: "POST" }); } catch (_) {}
  }
  state.token = null; state.user = null; state.convId = null;
  localStorage.removeItem("token");
  $("app-view").hidden = true;
  $("auth-view").hidden = false;
}

// ===== View switching =====
async function showApp() {
  $("auth-view").hidden = true;
  $("app-view").hidden = false;
  $("user-label").textContent = state.user?.email || "";
  const list = await loadConversations();
  if (list.length) openConversation(list[0].id, list[0].title); // tự mở hội thoại gần nhất
  else renderWelcome($("messages"));
}

// ===== Conversations =====
async function loadConversations() {
  const list = await api("/api/conversations");
  const box = $("conv-list");
  box.innerHTML = "";
  list.forEach((c) => {
    const item = document.createElement("div");
    item.className = "conv-item" + (c.id === state.convId ? " active" : "");
    item.innerHTML =
      '<span class="title">' + esc(c.title) + "</span>" +
      '<button class="del" title="Xoá">🗑</button>';
    item.querySelector(".title").onclick = () => openConversation(c.id, c.title);
    item.querySelector(".del").onclick = (e) => { e.stopPropagation(); deleteConversation(c.id); };
    box.appendChild(item);
  });
  return list;
}

async function newChat() {
  const c = await api("/api/conversations", { method: "POST", body: JSON.stringify({}) });
  state.convId = c.id;
  await loadConversations();
  openConversation(c.id, c.title);
  $("msg-input").focus();
}

async function openConversation(id, title) {
  state.convId = id;
  $("chat-title").textContent = title || "Cuộc trò chuyện";
  document.querySelectorAll(".conv-item").forEach((el) => el.classList.remove("active"));
  const d = await api("/api/conversations/" + id);
  const box = $("messages");
  box.innerHTML = "";
  if (!d.messages.length) {
    renderWelcome(box);
  }
  d.messages.forEach((m) => {
    if (m.role === "user") addUserBubble(m.content);
    else addAssistantBubble(m, null);
  });
  loadConversations();
  scrollDown();
}

async function deleteConversation(id) {
  if (!confirm("Xoá cuộc trò chuyện này?")) return;
  await api("/api/conversations/" + id, { method: "DELETE" });
  if (state.convId === id) {
    state.convId = null;
    $("chat-title").textContent = "Cuộc trò chuyện";
    renderWelcome($("messages"));
  }
  loadConversations();
}

// ===== Message rendering =====
function scrollDown() {
  const box = $("messages");
  box.scrollTop = box.scrollHeight;
}

function clearHint() {
  $("messages").querySelectorAll(".welcome, .empty-hint").forEach((e) => e.remove());
}

// Màn chào: câu hỏi mẫu bấm-là-chạy (không cần gõ, không cần nạp tài liệu).
const EXAMPLES = [
  "Cơ sở dữ liệu là gì?",
  "SQL và NoSQL khác nhau thế nào?",
  "Redis dùng để làm gì?",
  "Một RAG Chatbot nên lưu dữ liệu ở đâu?",
];

function renderWelcome(box) {
  box.innerHTML =
    '<div class="welcome">' +
    '<p class="empty-hint">Đã có sẵn tài liệu — bấm một câu hỏi mẫu để xem chatbot trả lời ngay:</p>' +
    '<div class="chips">' +
    EXAMPLES.map((q) => '<button type="button" class="chip">' + esc(q) + "</button>").join("") +
    "</div></div>";
  box.querySelectorAll(".chip").forEach((b) => {
    b.onclick = () => { $("msg-input").value = b.textContent; $("msg-form").requestSubmit(); };
  });
}

function addUserBubble(text) {
  clearHint();
  const el = document.createElement("div");
  el.className = "msg user";
  el.innerHTML = '<div class="bubble">' + nl2br(text) + "</div>";
  $("messages").appendChild(el);
  scrollDown();
  return el;
}

function citationsHtml(citations) {
  if (!citations || !citations.length) return "";
  let html = '<details class="sources"><summary>📎 Nguồn (' + citations.length + ")</summary>";
  citations.forEach((c) => {
    const pct = Math.round((c.score || 0) * 100);
    const label = c.source || c.title || ("Tài liệu " + String(c.document_id || "").slice(0, 8));
    html +=
      '<div class="cite"><div class="meta"><span class="src">' + esc(label) +
      "</span><span>tương đồng " + pct + "%</span></div>" +
      '<div class="bar"><span style="width:' + pct + '%"></span></div>' +
      "<p>" + esc(c.preview) + "</p></div>";
  });
  return html + "</details>";
}

function addAssistantBubble(msg, debug) {
  clearHint();
  const el = document.createElement("div");
  el.className = "msg assistant";
  el.innerHTML =
    '<div class="bubble">' + nl2br(msg.content) + "</div>" +
    citationsHtml(msg.citations) +
    feedbackHtml(msg.id, msg.feedback);
  $("messages").appendChild(el);
  wireFeedback(el, msg.id);
  scrollDown();
  return el;
}

function feedbackHtml(messageId, current) {
  if (!messageId) return "";
  return (
    '<div class="fb" data-mid="' + messageId + '">' +
    '<button class="up' + (current === "up" ? " active" : "") + '" data-r="up" title="Hữu ích">👍</button>' +
    '<button class="down' + (current === "down" ? " active" : "") + '" data-r="down" title="Chưa tốt">👎</button>' +
    "</div>"
  );
}

function wireFeedback(el, messageId) {
  el.querySelectorAll(".fb button").forEach((btn) => {
    btn.onclick = async () => {
      const rating = btn.dataset.r;
      try {
        await api("/api/messages/" + messageId + "/feedback", {
          method: "POST", body: JSON.stringify({ rating }),
        });
        el.querySelector(".fb .up").classList.toggle("active", rating === "up");
        el.querySelector(".fb .down").classList.toggle("active", rating === "down");
      } catch (err) { alert(err.message); }
    };
  });
}

// ===== Send message =====
function setSending(v) {
  state.sending = v;
  $("send-btn").disabled = v;
  $("send-btn").textContent = v ? "…" : "Gửi";
}

async function sendMessage(e) {
  e.preventDefault();
  const input = $("msg-input");
  const text = input.value.trim();
  if (!text || state.sending) return;

  if (!state.convId) {
    const c = await api("/api/conversations", { method: "POST", body: JSON.stringify({}) });
    state.convId = c.id;
  }

  addUserBubble(text);
  input.value = "";
  input.style.height = "auto";
  setSending(true);

  const pending = document.createElement("div");
  pending.className = "msg assistant";
  pending.innerHTML = '<div class="bubble">Đang tìm trong tài liệu…</div>';
  $("messages").appendChild(pending);
  scrollDown();

  try {
    const d = await api("/api/conversations/" + state.convId + "/messages", {
      method: "POST", body: JSON.stringify({ content: text }),
    });
    pending.remove();
    addAssistantBubble(d.message, d.debug);
    loadConversations();
  } catch (err) {
    pending.remove();
    const el = addAssistantBubble({ id: null, content: "⚠️ " + err.message }, null);
    el.querySelector(".bubble").style.color = "#b91c1c";
  } finally {
    setSending(false);
    $("msg-input").focus();
  }
}

// ===== Knowledge base =====
function openKb() { $("kb-modal").hidden = false; loadDocs(); }
function closeKb() { $("kb-modal").hidden = true; $("kb-msg").textContent = ""; }

async function ingestText() {
  const text = $("kb-text").value.trim();
  const title = $("kb-title").value.trim();
  if (!text) { $("kb-msg").textContent = "Hãy dán nội dung."; return; }
  $("kb-msg").textContent = "Đang xử lý tài liệu…";
  try {
    const d = await api("/api/documents", {
      method: "POST",
      body: JSON.stringify({ text, title: title || null, shared: $("kb-shared").checked }),
    });
    $("kb-msg").textContent = "✅ Đã nạp " + d.chunks + " chunk.";
    $("kb-text").value = ""; $("kb-title").value = "";
    loadDocs();
  } catch (err) { $("kb-msg").textContent = "Lỗi: " + err.message; }
}

async function ingestFile(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  $("kb-msg").textContent = "Đang nạp file " + file.name + "…";
  const fd = new FormData();
  fd.append("file", file);
  try {
    const d = await api("/api/documents/file?shared=" + ($("kb-shared").checked ? "true" : "false"), {
      method: "POST", body: fd,
    });
    $("kb-msg").textContent = "✅ Đã nạp " + d.chunks + " chunk từ " + file.name + ".";
    loadDocs();
  } catch (err) { $("kb-msg").textContent = "Lỗi: " + err.message; }
  ev.target.value = "";
}

async function loadDocs() {
  const docs = await api("/api/documents");
  const box = $("kb-list");
  if (!docs.length) { box.innerHTML = '<p class="muted">Chưa có tài liệu nào.</p>'; return; }
  box.innerHTML = "";
  docs.forEach((d) => {
    const row = document.createElement("div");
    row.className = "kb-doc";
    const shared = d.owner_id == null ? '<span class="badge-shared">dùng chung</span>' : "";
    row.innerHTML =
      "<span><b>" + esc(d.title) + "</b> · " + d.chunks + " chunk" + shared + "</span>" +
      "<button>Xoá</button>";
    row.querySelector("button").onclick = async () => {
      await api("/api/documents/" + d.id, { method: "DELETE" });
      loadDocs();
    };
    box.appendChild(row);
  });
}

// ===== Wire up =====
$("tab-login").onclick = () => setMode("login");
$("tab-register").onclick = () => setMode("register");
$("auth-form").onsubmit = submitAuth;
$("logout").onclick = () => doLogout(true);
$("new-chat").onclick = newChat;
$("msg-form").onsubmit = sendMessage;
$("kb-btn").onclick = openKb;
$("kb-close").onclick = closeKb;
$("kb-ingest").onclick = ingestText;
$("kb-file").onchange = ingestFile;

// Enter để gửi, Shift+Enter xuống dòng; tự giãn chiều cao.
$("msg-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("msg-form").requestSubmit(); }
});
$("msg-input").addEventListener("input", (e) => {
  e.target.style.height = "auto";
  e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
});

// ===== Init =====
(async function init() {
  if (state.token) {
    try {
      const d = await api("/api/auth/me");
      state.user = d.user;
      showApp();
      return;
    } catch (_) { /* token hỏng → về màn đăng nhập */ }
  }
  $("auth-view").hidden = false;
})();
