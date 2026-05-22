// Kanata to Stittsville Moving Checklist Application Logic

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE ---
  let tasks = [];
  let handoverDeal = {
    "pay-incentive": false,
    "pay-deposit": false,
    "pay-refund": false,
    "return-keys": false,
    "return-openers": false,
    "return-fobs": false
  };
  let activeTimeframe = "all";
  let searchNormalized = "";

  // Target handover datetime: June 15, 2026 @ 6:00 PM (Ottawa / Eastern Time)
  // Let's use the explicit ISO format with offset -04:00 (EDT)
  const handoverTargetDate = new Date("2026-06-15T18:00:00-04:00");

  // --- DOM SELECTORS ---
  const tasksContainer = document.getElementById("tasks-list");
  const progressPercentText = document.getElementById("progress-percentage");
  const progressCountText = document.getElementById("progress-count");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const countdownDaysText = document.getElementById("countdown-days");
  
  const searchInput = document.getElementById("task-search");
  const clearSearchBtn = document.getElementById("clear-search");
  const timeframeFiltersContainer = document.getElementById("timeframe-filters");
  const statusFilterSelect = document.getElementById("status-filter");
  const tagFilterSelect = document.getElementById("tag-filter");
  
  const themeToggleBtn = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  
  const addTaskForm = document.getElementById("add-task-form");
  const exportBtn = document.getElementById("export-btn");
  const importFileInput = document.getElementById("import-file");
  const resetBtn = document.getElementById("reset-btn");
  
  const dealCheckboxes = document.querySelectorAll(".deal-check");
  const dealStamp = document.getElementById("handover-deal-stamp");

  // Cloud Sync DOM Selectors
  const syncCodeInput = document.getElementById("sync-code-input");
  const copyLinkBtn = document.getElementById("copy-link-btn");
  const clearCodeBtn = document.getElementById("clear-code-btn");
  const cloudPushBtn = document.getElementById("cloud-push-btn");
  const cloudPullBtn = document.getElementById("cloud-pull-btn");
  const syncStatusText = document.getElementById("sync-status");

  // --- THEME INITIALIZATION ---
  const initTheme = () => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcons(savedTheme);
  };

  const updateThemeIcons = (theme) => {
    if (theme === "light") {
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    } else {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    }
  };

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcons(newTheme);
  });

  // --- SET LOCALTIME DISPLAY ---
  const initDateDisplay = () => {
    const dateText = document.getElementById("date-text");
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    
    // We mock/reference the user's local time: 2026-05-22
    const currentDate = new Date("2026-05-22T11:55:00-04:00");
    dateText.textContent = currentDate.toLocaleDateString('en-CA', options);
    
    // Calculate countdown from May 22, 2026 to June 15, 2026
    calculateCountdown(currentDate);
  };

  const calculateCountdown = (fromDate) => {
    const diffTime = handoverTargetDate - fromDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      countdownDaysText.textContent = diffDays;
      if (diffDays <= 7) {
        countdownDaysText.className = "stat-value countdown-urgent";
      } else {
        countdownDaysText.className = "stat-value";
      }
    } else if (diffDays === 0) {
      countdownDaysText.textContent = "Today!";
      countdownDaysText.className = "stat-value countdown-urgent";
    } else {
      countdownDaysText.textContent = "Passed";
      countdownDaysText.className = "stat-value";
    }
  };

  // --- DATA OPERATIONS (LOAD / SAVE) ---
  const loadData = () => {
    // Load tasks
    const savedTasks = localStorage.getItem("kanata_stittsville_checklist");
    if (savedTasks) {
      try {
        tasks = JSON.parse(savedTasks);
      } catch (e) {
        console.error("Failed to parse saved checklist. Loading default.", e);
        tasks = [...window.MOVING_CHECKLIST_DATA];
      }
    } else {
      tasks = [...window.MOVING_CHECKLIST_DATA];
    }

    // Load handover deal checklist
    const savedDeal = localStorage.getItem("kanata_stittsville_handover_deal");
    if (savedDeal) {
      try {
        handoverDeal = JSON.parse(savedDeal);
      } catch (e) {
        console.error("Failed to parse handover deal. Loading defaults.", e);
      }
    }
    
    // Sync checkboxes on sidebar with load state
    dealCheckboxes.forEach(checkbox => {
      const id = checkbox.id;
      if (handoverDeal[id] !== undefined) {
        checkbox.checked = handoverDeal[id];
      }
    });

    // Load sync code
    const savedSyncCode = localStorage.getItem("kanata_stittsville_sync_code");
    if (savedSyncCode && syncCodeInput) {
      syncCodeInput.value = savedSyncCode;
    }

    updateStats();
    updateHandoverDealStamp();
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("kanata_stittsville_checklist", JSON.stringify(tasks));
    localStorage.setItem("kanata_stittsville_handover_deal", JSON.stringify(handoverDeal));
  };

  // --- RENDERING TASKS ---
  const renderChecklist = () => {
    tasksContainer.innerHTML = "";
    
    const statusFilter = statusFilterSelect.value;
    const highlightFilter = tagFilterSelect.value;
    
    // Apply filters
    const filteredTasks = tasks.filter(task => {
      // 1. Timeframe filter
      if (activeTimeframe !== "all" && task.timeframe !== activeTimeframe) {
        return false;
      }
      
      // 2. Status filter
      if (statusFilter === "completed" && !task.completed) return false;
      if (statusFilter === "pending" && task.completed) return false;
      
      // 3. Highlight/Tag filter
      if (highlightFilter === "important" && !task.isImportant) return false;
      if (highlightFilter === "ottawa" && !task.isOttawaSpecific) return false;
      
      // 4. Fuzzy text search
      if (searchNormalized) {
        const titleMatch = task.title.toLowerCase().includes(searchNormalized);
        const descMatch = task.description && task.description.toLowerCase().includes(searchNormalized);
        const categoryMatch = task.category.toLowerCase().includes(searchNormalized);
        if (!titleMatch && !descMatch && !categoryMatch) return false;
      }
      
      return true;
    });

    if (filteredTasks.length === 0) {
      renderEmptyState();
      return;
    }

    filteredTasks.forEach(task => {
      const taskItem = document.createElement("div");
      taskItem.className = `task-item ${task.completed ? "checked" : ""}`;
      taskItem.id = `task-item-${task.id}`;
      
      // Category badge class
      const catClass = `badge-cat-${task.category}`;
      
      taskItem.innerHTML = `
        <label class="task-checkbox-wrapper" for="chk-${task.id}">
          <input type="checkbox" id="chk-${task.id}" ${task.completed ? "checked" : ""}>
          <span class="task-checkbox"></span>
        </label>
        
        <div class="task-info">
          <div class="task-title-row">
            <h4 class="task-title">${task.title}</h4>
            <div class="task-actions">
              <button class="action-btn edit-btn" data-id="${task.id}" title="Edit Task" aria-label="Edit task">
                <i data-lucide="edit-3"></i>
              </button>
              ${task.isCustom ? `
                <button class="action-btn delete-btn" data-id="${task.id}" title="Delete Task" aria-label="Delete task">
                  <i data-lucide="trash-2"></i>
                </button>
              ` : ''}
            </div>
          </div>
          <p class="task-desc">${task.description || ""}</p>
          <div class="task-badges">
            <span class="badge ${catClass}">${task.category.replace("_", " ")}</span>
            <span class="badge badge-timeframe">${formatTimeframe(task.timeframe)}</span>
            ${task.isImportant ? `<span class="badge badge-important"><i data-lucide="star" style="width:10px;height:10px;display:inline-block;margin-right:2px;"></i>Urgent</span>` : ""}
            ${task.isOttawaSpecific ? `<span class="badge badge-ottawa">Ottawa</span>` : ""}
          </div>
        </div>
      `;

      // Event listener for checking item
      const chk = taskItem.querySelector(`#chk-${task.id}`);
      chk.addEventListener("change", (e) => {
        task.completed = e.target.checked;
        if (task.completed) {
          taskItem.classList.add("checked");
        } else {
          taskItem.classList.remove("checked");
        }
        saveToLocalStorage();
        updateStats();
      });

      // Edit listener
      taskItem.querySelector(".edit-btn").addEventListener("click", () => {
        editTaskPrompt(task.id);
      });

      // Delete listener (if custom)
      if (task.isCustom) {
        taskItem.querySelector(".delete-btn").addEventListener("click", () => {
          deleteTask(task.id);
        });
      }

      tasksContainer.appendChild(taskItem);
    });

    lucide.createIcons();
  };

  const renderEmptyState = () => {
    tasksContainer.innerHTML = `
      <div class="empty-state">
        <i data-lucide="inbox"></i>
        <h4 class="empty-state-title">No matching tasks found</h4>
        <p class="empty-state-desc">Try clearing your filters, adjusting your search terms, or adding a new custom task.</p>
      </div>
    `;
    lucide.createIcons();
  };

  const formatTimeframe = (timeframe) => {
    switch (timeframe) {
      case "pre-move": return "Pre-Move";
      case "overlap": return "Overlap Period";
      case "handover": return "Handover Day";
      case "post-move": return "Post-Move";
      default: return timeframe;
    }
  };

  // --- STATS & COUNTERS ---
  const updateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    progressPercentText.textContent = `${percentage}%`;
    progressCountText.textContent = `${completed} / ${total}`;
    progressBarFill.style.width = `${percentage}%`;
  };

  const updateHandoverDealStamp = () => {
    const allChecked = Object.values(handoverDeal).every(status => status === true);
    
    if (allChecked) {
      dealStamp.textContent = "HANDOVER COMPLETED";
      dealStamp.className = "deal-stamp success";
    } else {
      dealStamp.textContent = "PENDING HANDOVER";
      dealStamp.className = "deal-stamp pending";
    }
  };

  // --- EVENT LISTENERS FOR FILTERS ---
  
  // Search fuzzy filter
  searchInput.addEventListener("input", (e) => {
    searchNormalized = e.target.value.toLowerCase().trim();
    if (searchNormalized.length > 0) {
      clearSearchBtn.style.display = "flex";
    } else {
      clearSearchBtn.style.display = "none";
    }
    renderChecklist();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchNormalized = "";
    clearSearchBtn.style.display = "none";
    renderChecklist();
  });

  // Timeframe buttons
  timeframeFiltersContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    
    // Remove active from others
    timeframeFiltersContainer.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.remove("active");
    });
    
    btn.classList.add("active");
    activeTimeframe = btn.dataset.timeframe;
    renderChecklist();
  });

  // Selector filters
  statusFilterSelect.addEventListener("change", renderChecklist);
  tagFilterSelect.addEventListener("change", renderChecklist);

  // Side check items (handover deal)
  dealCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", (e) => {
      const id = e.target.id;
      handoverDeal[id] = e.target.checked;
      saveToLocalStorage();
      updateHandoverDealStamp();
      
      // Auto-check corresponding tasks in the main checklist to stay in sync!
      if (id === "return-keys") {
        syncChecklistTask("handover-pack-access", e.target.checked);
        syncChecklistTask("handover-meet-landlords", e.target.checked);
      } else if (id === "pay-incentive" || id === "pay-deposit" || id === "pay-refund") {
        // If all financials are checked, sync the check
        const financialsChecked = handoverDeal["pay-incentive"] && handoverDeal["pay-deposit"] && handoverDeal["pay-refund"];
        syncChecklistTask("handover-receive-payment", financialsChecked);
      }
    });
  });

  const syncChecklistTask = (taskId, status) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = status;
      saveToLocalStorage();
      renderChecklist();
      updateStats();
    }
  };

  // --- TASK CRUD OPERATIONS ---

  // Add Task
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const title = document.getElementById("new-task-title").value.trim();
    const desc = document.getElementById("new-task-desc").value.trim();
    const timeframe = document.getElementById("new-task-timeframe").value;
    const category = document.getElementById("new-task-category").value;
    const isImportant = document.getElementById("new-task-important").checked;
    const isOttawaSpecific = document.getElementById("new-task-ottawa").checked;

    if (!title) return;

    const newTask = {
      id: "custom-" + Date.now(),
      title,
      description: desc,
      timeframe,
      category,
      isImportant,
      isOttawaSpecific,
      isCustom: true,
      completed: false
    };

    tasks.push(newTask);
    saveToLocalStorage();
    addTaskForm.reset();
    
    // Select timeframe filter to fit new task to show it
    activeTimeframe = "all";
    timeframeFiltersContainer.querySelectorAll(".filter-btn").forEach(b => {
      if (b.dataset.timeframe === "all") b.classList.add("active");
      else b.classList.remove("active");
    });
    
    renderChecklist();
    updateStats();
  });

  // Edit Task
  const editTaskPrompt = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newTitle = prompt("Edit Task Title:", task.title);
    if (newTitle === null) return; // cancelled
    
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      alert("Task title cannot be empty!");
      return;
    }

    const newDesc = prompt("Edit Task Description:", task.description || "");
    if (newDesc === null) return; // cancelled

    task.title = trimmedTitle;
    task.description = newDesc.trim();
    
    saveToLocalStorage();
    renderChecklist();
  };

  // Delete Task
  const deleteTask = (taskId) => {
    if (confirm("Are you sure you want to delete this custom task?")) {
      tasks = tasks.filter(t => t.id !== taskId);
      saveToLocalStorage();
      renderChecklist();
      updateStats();
    }
  };

  // --- DATA CONTROLS (EXPORT / IMPORT / RESET) ---

  // Export
  exportBtn.addEventListener("click", () => {
    const dataStr = JSON.stringify({ tasks, handoverDeal }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `kanata_to_stittsville_moving_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  });

  // Import
  importFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
          tasks = parsed.tasks;
          if (parsed.handoverDeal) {
            handoverDeal = parsed.handoverDeal;
          }
          saveToLocalStorage();
          loadData();
          renderChecklist();
          alert("Backup imported successfully!");
        } else {
          alert("Invalid backup format. Missing tasks array.");
        }
      } catch (err) {
        alert("Failed to parse JSON backup file.");
        console.error(err);
      }
    };
    reader.readAsText(file);
    // Reset file input
    importFileInput.value = "";
  });

  // Reset
  resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all tasks to default? This will delete all custom tasks and clear your checked progress!")) {
      localStorage.removeItem("kanata_stittsville_checklist");
      localStorage.removeItem("kanata_stittsville_handover_deal");
      loadData();
      renderChecklist();
    }
  });

  // --- CLOUD SYNC LOGIC ---
  const updateSyncStatus = (message, type = "normal") => {
    if (!syncStatusText) return;
    syncStatusText.textContent = message;
    if (type === "success") {
      syncStatusText.style.color = "var(--success)";
      syncStatusText.style.borderColor = "rgba(16, 185, 129, 0.2)";
    } else if (type === "error") {
      syncStatusText.style.color = "var(--danger)";
      syncStatusText.style.borderColor = "rgba(244, 63, 94, 0.2)";
    } else {
      syncStatusText.style.color = "var(--text-secondary)";
      syncStatusText.style.borderColor = "var(--input-border)";
    }
  };

  const updateUrlQueryParam = (binId) => {
    const url = new URL(window.location.href);
    if (binId) {
      url.searchParams.set("id", binId);
    } else {
      url.searchParams.delete("id");
    }
    window.history.replaceState({}, "", url.toString());
  };

  const pullFromCloud = async (binId, showAlert = true) => {
    if (!binId) return false;

    if (cloudPushBtn) cloudPushBtn.disabled = true;
    if (cloudPullBtn) cloudPullBtn.disabled = true;

    try {
      const response = await fetch(`https://kvdb.io/${binId}/checklist`);
      
      if (response.status === 404) {
        updateSyncStatus("No cloud data found.", "error");
        if (showAlert) {
          alert("No data was found for this Bin ID. Push first from your other device!");
        }
        return false;
      }

      if (!response.ok) {
        throw new Error("Failed response code: " + response.status);
      }

      const text = await response.text();
      const cloudData = JSON.parse(text);

      if (cloudData && cloudData.tasks && Array.isArray(cloudData.tasks)) {
        tasks = cloudData.tasks;
        if (cloudData.handoverDeal) {
          handoverDeal = cloudData.handoverDeal;
        }

        saveToLocalStorage();
        loadData();
        renderChecklist();
        updateSyncStatus("Synced from cloud!", "success");
        if (showAlert) {
          alert("Checklist successfully synced from cloud!");
        }
        return true;
      } else {
        updateSyncStatus("Invalid cloud data format.", "error");
        return false;
      }
    } catch (err) {
      console.error("Cloud pull failed:", err);
      updateSyncStatus("Pull failed. Check network.", "error");
      return false;
    } finally {
      if (cloudPushBtn) cloudPushBtn.disabled = false;
      if (cloudPullBtn) cloudPullBtn.disabled = false;
    }
  };

  const pushToCloud = async () => {
    let binId = syncCodeInput ? syncCodeInput.value.trim() : "";
    
    updateSyncStatus("Pushing to cloud...");
    if (cloudPushBtn) cloudPushBtn.disabled = true;
    if (cloudPullBtn) cloudPullBtn.disabled = true;

    try {
      if (!binId) {
        const response = await fetch("https://kvdb.io/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: "email=kanata-stittsville-sync%40example.com"
        });

        if (!response.ok) {
          throw new Error("Failed to create cloud sync bucket: " + response.status);
        }

        const rawId = await response.text();
        binId = rawId.trim();
        
        localStorage.setItem("kanata_stittsville_sync_code", binId);
        if (syncCodeInput) {
          syncCodeInput.value = binId;
        }
        updateUrlQueryParam(binId);
      }

      const payload = JSON.stringify({ tasks, handoverDeal });
      const putResponse = await fetch(`https://kvdb.io/${binId}/checklist`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: payload
      });

      if (!putResponse.ok) {
        if (putResponse.status === 404 || putResponse.status === 403 || putResponse.status === 401) {
          console.warn(`Sync failed (${putResponse.status}). Creating a new bin as fallback.`);
          const retryConfirm = confirm(
            "We couldn't update this cloud bin (it may have expired or is invalid).\n\n" +
            "Would you like to create a new cloud checklist bin instead?"
          );
          if (retryConfirm) {
            localStorage.removeItem("kanata_stittsville_sync_code");
            if (syncCodeInput) syncCodeInput.value = "";
            return await pushToCloud();
          } else {
            throw new Error(`Unauthorized or expired: ${putResponse.status}`);
          }
        }
        throw new Error("Failed response: " + putResponse.status);
      }

      updateSyncStatus("Cloud sync complete!", "success");
      
      const savedSyncCode = localStorage.getItem("kanata_stittsville_sync_code");
      if (savedSyncCode !== binId) {
        alert(`New cloud sync checklist created!\nYour Bin ID is: ${binId}\nShareable link added to address bar.`);
      }
      return true;
    } catch (err) {
      console.error("Cloud push failed:", err);
      updateSyncStatus("Sync failed. Check network.", "error");
      return false;
    } finally {
      if (cloudPushBtn) cloudPushBtn.disabled = false;
      if (cloudPullBtn) cloudPullBtn.disabled = false;
    }
  };

  const handleUrlSync = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlBinId = urlParams.get("id");
    const localBinId = localStorage.getItem("kanata_stittsville_sync_code") || "";

    if (urlBinId) {
      const cleanUrlBinId = urlBinId.trim();
      
      if (cleanUrlBinId !== localBinId) {
        const hasExistingProgress = tasks.some(t => t.completed) || Object.values(handoverDeal).some(v => v);
        
        let confirmLoad = true;
        if (hasExistingProgress) {
          confirmLoad = confirm("We found a shared checklist in the link. Do you want to load it and overwrite your local progress?");
        }
        
        if (confirmLoad) {
          updateSyncStatus("Loading shared checklist...");
          const success = await pullFromCloud(cleanUrlBinId, false);
          if (success) {
            localStorage.setItem("kanata_stittsville_sync_code", cleanUrlBinId);
            if (syncCodeInput) {
              syncCodeInput.value = cleanUrlBinId;
            }
            updateSyncStatus("Shared checklist loaded!", "success");
          } else {
            updateSyncStatus("Failed to load shared checklist.", "error");
          }
        } else {
          updateUrlQueryParam(localBinId);
        }
      } else {
        updateSyncStatus("Checking cloud updates...");
        await pullFromCloud(cleanUrlBinId, false);
      }
    } else if (localBinId) {
      updateUrlQueryParam(localBinId);
    }
  };

  if (syncCodeInput) {
    syncCodeInput.addEventListener("input", (e) => {
      const code = e.target.value.trim();
      localStorage.setItem("kanata_stittsville_sync_code", code);
      updateUrlQueryParam(code);
      if (code) {
        updateSyncStatus("ID updated. Click 'Pull' to load.");
      } else {
        updateSyncStatus("Disconnected from cloud sync.");
      }
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", () => {
      const binId = syncCodeInput ? syncCodeInput.value.trim() : "";
      if (!binId) {
        alert("No sync ID found! Please 'Push' your checklist first to generate one.");
        return;
      }
      
      const shareUrl = new URL(window.location.href);
      shareUrl.searchParams.set("id", binId);
      
      navigator.clipboard.writeText(shareUrl.toString()).then(() => {
        updateSyncStatus("Link copied to clipboard!", "success");
        setTimeout(() => {
          updateSyncStatus(syncCodeInput.value.trim() ? "Connected to cloud sync." : "Not connected to cloud sync.");
        }, 3000);
      }).catch(err => {
        console.error("Clipboard copy failed:", err);
        alert(`Shareable Link:\n${shareUrl.toString()}`);
      });
    });
  }

  if (clearCodeBtn) {
    clearCodeBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to disconnect from this cloud checklist? This will clear the Sync ID and URL link, but keeps your local progress.")) {
        localStorage.removeItem("kanata_stittsville_sync_code");
        if (syncCodeInput) {
          syncCodeInput.value = "";
        }
        updateUrlQueryParam("");
        updateSyncStatus("Disconnected from cloud sync.");
      }
    });
  }

  if (cloudPushBtn) {
    cloudPushBtn.addEventListener("click", pushToCloud);
  }

  if (cloudPullBtn) {
    cloudPullBtn.addEventListener("click", () => {
      const code = syncCodeInput ? syncCodeInput.value.trim() : "";
      if (!code) {
        alert("Please enter a Sync Bin ID first!");
        return;
      }
      pullFromCloud(code, true);
    });
  }

  // --- INITIAL RUN ---
  initTheme();
  initDateDisplay();
  loadData();
  renderChecklist();
  handleUrlSync();
});
