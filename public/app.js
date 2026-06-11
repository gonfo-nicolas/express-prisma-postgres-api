const apiBaseUrl = "";
const tokenStorageKey = "express-prisma-api-token";

const elements = {
  healthButton: document.querySelector("#health-button"),
  healthDot: document.querySelector("#health-dot"),
  healthLabel: document.querySelector("#health-label"),
  healthDetails: document.querySelector("#health-details"),
  loginForm: document.querySelector("#login-form"),
  postForm: document.querySelector("#post-form"),
  output: document.querySelector("#output"),
  tokenPreview: document.querySelector("#token-preview"),
  meButton: document.querySelector("#me-button"),
  logoutButton: document.querySelector("#logout-button"),
  refreshPostsButton: document.querySelector("#refresh-posts-button"),
  clearOutputButton: document.querySelector("#clear-output-button"),
  postsList: document.querySelector("#posts-list"),
};

const isHTMLElement = (value) => value instanceof HTMLElement;
const isHTMLFormElement = (value) => value instanceof HTMLFormElement;

const requireElement = (value, selector) => {
  if (!isHTMLElement(value)) {
    throw new Error(`Missing DOM element: ${selector}`);
  }

  return value;
};

const requireForm = (value, selector) => {
  if (!isHTMLFormElement(value)) {
    throw new Error(`Missing form element: ${selector}`);
  }

  return value;
};

const dom = {
  healthButton: requireElement(elements.healthButton, "#health-button"),
  healthDot: requireElement(elements.healthDot, "#health-dot"),
  healthLabel: requireElement(elements.healthLabel, "#health-label"),
  healthDetails: requireElement(elements.healthDetails, "#health-details"),
  loginForm: requireForm(elements.loginForm, "#login-form"),
  postForm: requireForm(elements.postForm, "#post-form"),
  output: requireElement(elements.output, "#output"),
  tokenPreview: requireElement(elements.tokenPreview, "#token-preview"),
  meButton: requireElement(elements.meButton, "#me-button"),
  logoutButton: requireElement(elements.logoutButton, "#logout-button"),
  refreshPostsButton: requireElement(elements.refreshPostsButton, "#refresh-posts-button"),
  clearOutputButton: requireElement(elements.clearOutputButton, "#clear-output-button"),
  postsList: requireElement(elements.postsList, "#posts-list"),
};

const getAccessToken = () => window.localStorage.getItem(tokenStorageKey);

const setAccessToken = (token) => {
  window.localStorage.setItem(tokenStorageKey, token);
  renderToken();
};

const clearAccessToken = () => {
  window.localStorage.removeItem(tokenStorageKey);
  renderToken();
};

const renderJson = (payload) => {
  dom.output.textContent = JSON.stringify(payload, null, 2);
};

const renderToken = () => {
  const token = getAccessToken();
  dom.tokenPreview.textContent = token ?? "Aucun token";
};

const requestJson = async (path, options = {}) => {
  const token = getAccessToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token !== null) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const payload = text.length > 0 ? JSON.parse(text) : null;

  if (!response.ok) {
    renderJson(payload);
    throw new Error(`HTTP ${response.status}`);
  }

  return payload;
};

const setHealthState = (state, label, details) => {
  dom.healthDot.classList.remove("is-ok", "is-error");

  if (state === "ok") {
    dom.healthDot.classList.add("is-ok");
  }

  if (state === "error") {
    dom.healthDot.classList.add("is-error");
  }

  dom.healthLabel.textContent = label;
  dom.healthDetails.textContent = details;
};

const checkHealth = async () => {
  try {
    const payload = await requestJson("/health");
    renderJson(payload);
    setHealthState("ok", "API en ligne", "Le serveur Express répond correctement.");
  } catch (error) {
    setHealthState("error", "API indisponible", "Vérifie que npm run dev est lancé.");
  }
};

const login = async (event) => {
  event.preventDefault();

  const formData = new FormData(dom.loginForm);
  const payload = await requestJson("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    }),
  });

  if (payload?.data?.accessToken !== undefined) {
    setAccessToken(String(payload.data.accessToken));
  }

  renderJson(payload);
};

const loadCurrentUser = async () => {
  const payload = await requestJson("/api/v1/users/me");
  renderJson(payload);
};

const renderPosts = (payload) => {
  const posts = Array.isArray(payload?.data) ? payload.data : [];

  if (posts.length === 0) {
    dom.postsList.innerHTML = '<p class="muted">Aucun post pour le moment.</p>';
    return;
  }

  dom.postsList.replaceChildren(
    ...posts.map((post) => {
      const article = document.createElement("article");
      article.className = "post-item";

      const title = document.createElement("h4");
      title.textContent = String(post.title);

      const content = document.createElement("p");
      content.textContent = String(post.content);

      const meta = document.createElement("p");
      meta.className = "muted";
      meta.textContent = post.published === true ? "Publié" : "Brouillon";

      article.append(title, content, meta);
      return article;
    })
  );
};

const loadPosts = async () => {
  const payload = await requestJson("/api/v1/posts?limit=10");
  renderPosts(payload);
  renderJson(payload);
};

const createPost = async (event) => {
  event.preventDefault();

  const formData = new FormData(dom.postForm);
  const payload = await requestJson("/api/v1/posts", {
    method: "POST",
    body: JSON.stringify({
      title: String(formData.get("title")),
      content: String(formData.get("content")),
      published: formData.get("published") === "on",
    }),
  });

  renderJson(payload);
  await loadPosts();
};

dom.healthButton.addEventListener("click", () => {
  void checkHealth();
});

dom.loginForm.addEventListener("submit", (event) => {
  void login(event).catch((error) => renderJson({ error: error.message }));
});

dom.meButton.addEventListener("click", () => {
  void loadCurrentUser().catch((error) => renderJson({ error: error.message }));
});

dom.logoutButton.addEventListener("click", () => {
  clearAccessToken();
  renderJson({ message: "Token supprimé." });
});

dom.refreshPostsButton.addEventListener("click", () => {
  void loadPosts().catch((error) => renderJson({ error: error.message }));
});

dom.postForm.addEventListener("submit", (event) => {
  void createPost(event).catch((error) => renderJson({ error: error.message }));
});

dom.clearOutputButton.addEventListener("click", () => {
  dom.output.textContent = "Prêt.";
});

renderToken();
void checkHealth();
void loadPosts().catch(() => undefined);
