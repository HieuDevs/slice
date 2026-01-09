// Workshop logic - handles all workshop functionality

// Global flags to prevent duplicate calls
let workshopInitializing = false;
let loadingProposalsGlobal = false;

export function initWorkshop(config) {
  // Prevent multiple simultaneous initializations
  if (workshopInitializing) {
    console.log("Workshop already initializing, skipping...");
    return;
  }

  const {
    lang,
    username,
    translations: t,
  } = config;

  // Get JWT token from localStorage
  const token = localStorage.getItem("token");
  
  // Helper function to get auth headers
  function getAuthHeaders() {
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Check if elements exist
  const form = document.getElementById("proposal-form");
  const container = document.getElementById("proposals-list");
  const listTitle = document.getElementById("list-title");
  const cancelBtn = document.getElementById("cancel-btn");
  const submitBtn = document.getElementById("submit-btn");

  if (!form || !container || !listTitle || !submitBtn) {
    setTimeout(() => initWorkshop(config), 100);
    return;
  }

  // Ensure elements are visible
  if (container && listTitle) {
    container.style.display = "block";
  }

  let isEditing = false;
  let isGlobalLocked = false;
  let isAdmin = false;
  let currentProposals = [];

  // Load proposals
  async function loadProposals() {
    // Use global flag to prevent duplicate calls across all instances
    if (loadingProposalsGlobal) {
      console.log("loadProposals already in progress, skipping...");
      return;
    }
    loadingProposalsGlobal = true;

    try {
      if (listTitle) {
        listTitle.textContent = t.loading;
      }
      if (container) {
        container.innerHTML = `<div class="text-center py-8 text-dark-500 dark:text-dark-400">${t.loading}...</div>`;
      }

      const response = await fetch("/api/proposals", {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        window.location.href = `/${lang}/login`;
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const proposals = data.proposals || data;
      isAdmin = data.isAdmin || false;
      currentProposals = proposals;

      if (listTitle) {
        listTitle.textContent = t.yourProposals;
      }

      const subtitleEl = document.getElementById("list-subtitle");
      if (subtitleEl) {
        subtitleEl.textContent =
          proposals.length === 0 ? "" : `${proposals.length} ${t.proposals}`;
      }

      isGlobalLocked = proposals.some((p) => p.is_locked);

      const unlockBtn = document.getElementById("unlock-btn");
      const lockedIcon = document.getElementById("unlock-icon-locked");
      const unlockedIcon = document.getElementById("unlock-icon-unlocked");

      if (unlockBtn) {
        if (isAdmin) {
          unlockBtn.disabled = false;
          if (isGlobalLocked) {
            if (lockedIcon) lockedIcon.classList.remove("hidden");
            if (unlockedIcon) unlockedIcon.classList.add("hidden");
            unlockBtn.title = t.unlockWorkshop;
          } else {
            if (lockedIcon) lockedIcon.classList.add("hidden");
            if (unlockedIcon) unlockedIcon.classList.remove("hidden");
            unlockBtn.title = t.lockWorkshop;
          }
        } else {
          unlockBtn.disabled = true;
        }
      }

      const selectedProposal = proposals.find((p) => p.status === "selected");
      const selectedSection = document.getElementById("selected-app-section");
      
      if (selectedSection && selectedProposal) {
        selectedSection.classList.remove("hidden");
        selectedSection.innerHTML = renderSelectedProposal(selectedProposal, t, lang);
      } else if (selectedSection) {
        selectedSection.classList.add("hidden");
      }

      const inputs = document.querySelectorAll(
        "#proposal-form input, #proposal-form textarea, #proposal-form button"
      );
      inputs.forEach((el) => {
        if (isGlobalLocked) {
          el.disabled = true;
          if (el === submitBtn) el.textContent = t.locked;
        } else {
          el.disabled = false;
          if (el === submitBtn && !isEditing) el.textContent = t.save;
        }
      });

      if (proposals.length === 0) {
        container.innerHTML = renderEmptyState(t);
        return;
      }

      const sortedProposals = [...proposals].sort((a, b) => {
        if (a.status === "selected" && b.status !== "selected") return -1;
        if (a.status !== "selected" && b.status === "selected") return 1;
        return 0;
      });

      container.innerHTML = sortedProposals
        .map((p) => renderProposalCard(p, username, isAdmin, isGlobalLocked, t, lang))
        .join("");

      const animatedElements = document.querySelectorAll(".opacity-0");
      animatedElements.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    } catch (e) {
      console.error("Error loading proposals:", e);
      if (listTitle) {
        listTitle.textContent = t.error;
      }
      if (container) {
        container.innerHTML = renderErrorState(t, e.message);
      }
    } finally {
      loadingProposalsGlobal = false;
    }
  }

  // Handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("proposal-id").value;
    const app_name = document.getElementById("app_name").value;
    const description = document.getElementById("description").value;

    submitBtn.disabled = true;
    submitBtn.textContent = id ? t.updating : t.adding;

    try {
      const url = id ? `/api/proposals/${id}` : "/api/proposals";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({ app_name, description }),
      });

      if (response.ok) {
        resetForm();
        loadProposals();
      } else {
        const data = await response.json();
        alert(data.error || "Error");
      }
    } catch (e) {
      console.error(e);
      alert("Network error");
    } finally {
      submitBtn.disabled = false;
    }
  });

  // Delete proposal
  window.deleteProposal = async (id) => {
    const proposal = currentProposals.find((p) => p.id === id);
    if (proposal && proposal.status === "selected") {
      alert(t.cannotDeleteSelected);
      return;
    }

    if (!confirm(t.confirmDelete)) return;

    try {
      const response = await fetch(`/api/proposals/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        loadProposals();
        if (
          isEditing &&
          document.getElementById("proposal-id").value === id.toString()
        ) {
          resetForm();
        }
      } else {
        const data = await response.json();
        alert(data.error || "Error");
      }
    } catch (e) {
      console.error(e);
      alert("Network error");
    }
  };

  // Vote Proposal
  window.voteProposal = async (id) => {
    const input = document.getElementById(`vote-${id}`);
    const score = parseInt(input.value);

    if (isNaN(score) || score < 0 || score > 100) {
      alert(t.score);
      return;
    }

    try {
      const response = await fetch(`/api/proposals/${id}/vote`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ score }),
      });

      if (response.ok) {
        const btn = input.nextElementSibling;
        const originalText = btn.textContent;
        btn.textContent = "✓";
        setTimeout(() => {
          btn.textContent = originalText;
          loadProposals();
        }, 1000);
      } else {
        const data = await response.json();
        alert(data.error || "Error");
      }
    } catch (e) {
      console.error(e);
      alert("Network error");
    }
  };

  // Finalize Proposal (Admin)
  window.finalizeProposal = async (id) => {
    if (!confirm(t.confirmFinalize)) return;

    try {
      const response = await fetch(`/api/proposals/${id}/finalize`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        loadProposals();
      } else {
        const data = await response.json();
        alert(data.error || "Error");
      }
    } catch (e) {
      console.error(e);
      alert("Network error");
    }
  };

  // Toggle Workshop Lock (Admin only)
  window.toggleWorkshopLock = async () => {
    if (!isAdmin) {
      alert(t.onlyAdminToggle);
      return;
    }

    const action = isGlobalLocked ? t.unlockWorkshop : t.lockWorkshop;

    if (!confirm(`${action}?`)) {
      return;
    }

    try {
      const response = await fetch("/api/proposals/unlock", {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        loadProposals();
      } else {
        const data = await response.json();
        alert(data.error || "Error");
      }
    } catch (e) {
      console.error(e);
      alert("Network error");
    }
  };

  // Edit proposal
  window.editProposal = (id, validAppName, validDescription) => {
    if (isGlobalLocked) {
      alert(t.locked);
      return;
    }

    const proposal = currentProposals.find((p) => p.id === id);
    if (proposal && proposal.status === "selected") {
      alert(t.cannotEditSelected);
      return;
    }

    isEditing = true;
    document.getElementById("proposal-id").value = id;
    document.getElementById("app_name").value = validAppName;
    document.getElementById("description").value = validDescription;

    submitBtn.textContent = t.update;

    cancelBtn.classList.remove("hidden");
    const formTitle = document.getElementById("form-title");
    if (formTitle) {
      formTitle.textContent = t.editProposal;
    }
  };

  // Reset form
  function resetForm() {
    isEditing = false;
    form.reset();
    document.getElementById("proposal-id").value = "";
    submitBtn.textContent = t.save;
    cancelBtn.classList.add("hidden");
    const formTitle = document.getElementById("form-title");
    if (formTitle) {
      formTitle.textContent = t.add;
    }
  }

  cancelBtn.addEventListener("click", resetForm);

  // Initial load - simplified to avoid duplicate calls
  loadProposals().finally(() => {
    // Reset initialization flag after loadProposals completes
    workshopInitializing = false;
  });
}

// Helper functions
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

function renderSelectedProposal(proposal, t, lang) {
  return `
    <div class="card p-6 lg:p-8 border-2 border-slice-500 shadow-glow bg-linear-to-br from-slice-50 via-white to-slice-100 dark:from-slice-900/40 dark:via-dark-800 dark:to-slice-900/20 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-slice-200/20 dark:bg-slice-800/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl bg-linear-to-br from-slice-500 to-slice-600 flex items-center justify-center shadow-lg">
            <span class="text-2xl">🏆</span>
          </div>
          <div>
            <div class="text-xs font-semibold text-slice-600 dark:text-slice-400 uppercase tracking-wide">
              ${t.winner}
            </div>
            <h3 class="text-2xl md:text-3xl font-display font-bold text-dark-900 dark:text-cream-100 mt-1">
              ${escapeHtml(proposal.app_name)}
            </h3>
          </div>
        </div>
        ${
          proposal.description
            ? `
          <p class="text-dark-600 dark:text-dark-300 leading-relaxed mb-4">
            ${escapeHtml(proposal.description)}
          </p>
        `
            : ""
        }
        <div class="flex flex-wrap items-center gap-4 text-sm text-dark-500 dark:text-dark-400">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span>by ${escapeHtml(proposal.username)}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${new Date(proposal.created_at).toLocaleString(lang === "vi" ? "vi-VN" : "en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
          </div>
          ${
            proposal.average_score !== null
              ? `
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span class="font-bold text-slice-600 dark:text-slice-400">${proposal.average_score.toFixed(2)}</span>
              <span class="text-xs">${t.avgScore}</span>
            </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

function renderEmptyState(t) {
  return `
    <div class="card p-12 text-center border-2 border-dashed border-cream-300 dark:border-dark-700 bg-cream-50/50 dark:bg-dark-800/30">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slice-100 dark:bg-slice-900/30 flex items-center justify-center">
        <svg class="w-8 h-8 text-slice-500 dark:text-slice-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </div>
      <p class="text-lg font-medium text-dark-600 dark:text-dark-400">${t.noProposals}</p>
    </div>
  `;
}

function renderErrorState(t, message) {
  return `
    <div class="card p-8 text-center border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20">
      <div class="text-red-600 dark:text-red-400 font-semibold mb-2">${t.error}</div>
      <div class="text-sm text-dark-600 dark:text-dark-400">${message || "Failed to load proposals"}</div>
      <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-slice-500 hover:bg-slice-600 text-white rounded-xl font-medium transition-all">
        Retry
      </button>
    </div>
  `;
}

function renderProposalCard(p, username, isAdmin, isGlobalLocked, t, lang) {
  const isOwner = p.username === username;
  const isAdminView = Array.isArray(p.votes);
  const isSelected = p.status === "selected";

  let voteHtml = "";
  let finalizeBtn = "";

  if (isAdminView) {
    const votesList =
      p.votes.length > 0
        ? `<div class="mt-5 p-4 bg-linear-to-br from-cream-50 to-cream-100 dark:from-dark-800 dark:to-dark-700 rounded-xl border border-cream-200 dark:border-dark-600">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-slice-500 dark:text-slice-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-semibold text-dark-700 dark:text-dark-200">${t.votes} (${p.votes.length})</span>
            </div>
            <div class="space-y-2">
              ${p.votes
                .map(
                  (v) => `
                <div class="flex items-center justify-between p-2 bg-white dark:bg-dark-900 rounded-lg">
                  <span class="text-sm font-medium text-dark-700 dark:text-dark-300">${escapeHtml(v.username)}</span>
                  <span class="px-3 py-1 rounded-full bg-slice-100 dark:bg-slice-900/30 text-slice-700 dark:text-slice-300 font-bold text-sm">${v.score}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>`
        : `<div class="mt-5 p-4 text-center text-sm text-dark-400 dark:text-dark-500 italic bg-cream-50 dark:bg-dark-800 rounded-xl">${t.noVotesYet}</div>`;

    const averageScoreDisplay =
      p.all_members_voted && p.average_score !== null
        ? `<div class="mt-5 p-5 bg-linear-to-br from-slice-100 via-slice-50 to-slice-200 dark:from-slice-900/40 dark:via-slice-800/30 dark:to-slice-900/40 rounded-xl border-2 border-slice-300 dark:border-slice-700 shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-slice-600 dark:text-slice-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span class="font-semibold text-slice-700 dark:text-slice-300">${t.averageScore}</span>
              </div>
              <span class="text-3xl font-bold text-slice-600 dark:text-slice-400">${p.average_score.toFixed(2)}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slice-600 dark:text-slice-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>${t.allVoted} (${p.vote_count}/${p.total_members})</span>
            </div>
          </div>`
        : p.vote_count > 0
          ? `<div class="mt-5 p-3 bg-cream-50 dark:bg-dark-800 rounded-xl text-sm text-dark-600 dark:text-dark-400">
              <span class="font-medium">${p.vote_count}/${p.total_members}</span> ${t.membersVoted}
            </div>`
          : "";

    finalizeBtn = !isGlobalLocked
      ? `<button onclick="finalizeProposal(${p.id})" class="flex-1 btn-secondary text-sm py-2.5">${t.finalize}</button>`
      : isSelected
        ? `<div class="flex-1 bg-linear-to-r from-slice-500 to-slice-600 text-white text-center py-2.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
            <span>🏆</span>
            <span>${t.winner}</span>
          </div>`
        : `<div class="flex-1 text-center text-dark-400 dark:text-dark-500 text-sm py-2.5 bg-cream-100 dark:bg-dark-800 rounded-xl">${t.locked}</div>`;

    voteHtml = `<div>${votesList}${averageScoreDisplay}</div>`;
  } else {
    const currentScore = p.current_user_score !== null ? p.current_user_score : "";
    const lockedState = isGlobalLocked ? "disabled" : "";
    const lockedClass = isGlobalLocked ? "opacity-50 cursor-not-allowed" : "";

    if (isGlobalLocked && isSelected) {
      voteHtml = `<div class="mt-5 w-full bg-linear-to-r from-slice-500 to-slice-600 text-white text-center py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2">
        <span>🏆</span>
        <span>${t.winner}</span>
      </div>`;
    } else {
      const averageScoreDisplay =
        p.all_members_voted && p.average_score !== null
          ? `<div class="mt-5 p-5 bg-linear-to-br from-slice-100 via-slice-50 to-slice-200 dark:from-slice-900/40 dark:via-slice-800/30 dark:to-slice-900/40 rounded-xl border-2 border-slice-300 dark:border-slice-700 shadow-lg">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-slice-600 dark:text-slice-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <span class="font-semibold text-slice-700 dark:text-slice-300">${t.averageScore}</span>
                </div>
                <span class="text-3xl font-bold text-slice-600 dark:text-slice-400">${p.average_score.toFixed(2)}</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slice-600 dark:text-slice-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>${t.allVoted} (${p.vote_count}/${p.total_members})</span>
              </div>
            </div>`
          : "";

      voteHtml = `
        <div class="mt-5 p-4 bg-linear-to-br from-cream-50 to-cream-100 dark:from-dark-800 dark:to-dark-700 rounded-xl border border-cream-200 dark:border-dark-600">
          <div class="flex items-center gap-3">
            <input type="number" min="0" max="100" placeholder="${t.score}"
              value="${currentScore}" 
              id="vote-${p.id}"
              ${lockedState}
              class="flex-1 px-4 py-3 rounded-xl border-2 border-cream-300 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:ring-2 focus:ring-slice-500 dark:focus:ring-slice-400 focus:border-slice-500 dark:focus:border-slice-400 outline-none transition-all font-medium text-center ${lockedClass}"
            />
            <button onclick="voteProposal(${p.id})" 
              ${lockedState}
              class="px-6 py-3 bg-slice-500 hover:bg-slice-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${lockedClass}">
              ${t.vote}
            </button>
          </div>
        </div>
        ${averageScoreDisplay}
      `;
    }
  }

  const cardClass = isSelected
    ? "card p-6 lg:p-8 border-2 border-slice-500 shadow-glow bg-linear-to-br from-white to-slice-50/30 dark:from-dark-800 dark:to-slice-900/20"
    : "card p-6 lg:p-8 border border-cream-200 dark:border-dark-700/50 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm opacity-0 animate-fade-in hover:shadow-lg transition-all duration-300";

  let actionButtons = "";
  const cannotEditDelete = isGlobalLocked || isSelected;
  const ownerButtons = isOwner
    ? `
      <button onclick="editProposal(${p.id}, '${escapeHtml(p.app_name).replace(/'/g, "\\'")}', '${escapeHtml(p.description).replace(/'/g, "\\'")}')" 
        ${cannotEditDelete ? "disabled" : ""}
        class="flex-1 px-4 py-2.5 bg-slice-100 dark:bg-slice-900/30 hover:bg-slice-200 dark:hover:bg-slice-900/50 text-slice-700 dark:text-slice-300 rounded-xl font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2 ${cannotEditDelete ? "opacity-50 cursor-not-allowed" : ""}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        ${t.edit}
      </button>
      <button onclick="deleteProposal(${p.id})" 
        ${cannotEditDelete ? "disabled" : ""}
        class="flex-1 px-4 py-2.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-xl font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2 ${cannotEditDelete ? "opacity-50 cursor-not-allowed" : ""}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        ${t.delete}
      </button>
    `
    : "";

  if (isAdminView || isOwner) {
    actionButtons = `
      <div class="mt-6 pt-6 border-t border-cream-200 dark:border-dark-700">
        <div class="flex gap-3">
          ${isAdminView ? finalizeBtn : ""}
          ${ownerButtons}
        </div>
      </div>
    `;
  }

  return `
    <div class="${cardClass}" data-proposal-id="${p.id}">
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <h3 class="text-xl md:text-2xl font-display font-bold text-dark-900 dark:text-cream-100">${escapeHtml(p.app_name)}</h3>
          ${!isOwner ? `<span class="text-xs px-3 py-1 rounded-full bg-cream-200 dark:bg-dark-700 text-dark-600 dark:text-dark-300 font-medium">by ${escapeHtml(p.username)}</span>` : ""}
        </div>
        <p class="text-dark-600 dark:text-dark-300 whitespace-pre-wrap leading-relaxed mb-4">${escapeHtml(p.description)}</p>
        <div class="flex items-center gap-2 text-xs text-dark-400 dark:text-dark-500 mb-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>${new Date(p.created_at).toLocaleString(lang === "vi" ? "vi-VN" : "en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
        </div>
        
        <!-- Voting UI -->
        ${voteHtml}
      </div>
      
      <!-- Action Buttons at Bottom -->
      ${actionButtons}
    </div>
  `;
}

