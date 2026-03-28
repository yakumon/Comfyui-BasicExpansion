import { app } from "../../scripts/app.js";

// Version: 1.4.3 (Robust Rendering Edition)
console.log("[BasicExpansion] JS File Loaded. Version: 1.4.3");

function setupBasicExpansionUI() {
    console.log("[BasicExpansion] setupBasicExpansionUI() initializing...");
    
    // 0. Google Fonts の追加
    if (!document.getElementById("be-fonts")) {
        const link = document.createElement("link");
        link.id = "be-fonts";
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@300;400;600;800&display=swap";
        document.head.appendChild(link);
    }

    // 1. スタイルの追加 (CSS)
    if (!document.getElementById("be-ui-style")) {
        const style = document.createElement("style");
        style.id = "be-ui-style";
        style.textContent = `
            :root {
                --be-bg: rgba(13, 13, 15, 0.95);
                --be-accent: #0084ff;
                --be-accent-rgb: 0, 132, 255;
                --be-border: rgba(255, 255, 255, 0.08);
                --be-text-main: #ffffff;
                --be-text-dim: #94a3b8;
                --be-font-sans: 'Inter', system-ui, sans-serif;
                --be-font-display: 'Outfit', sans-serif;
            }

            #be-bottom-panel {
                position: fixed;
                bottom: -460px;
                left: 10px;
                right: 10px;
                height: 440px;
                background: var(--be-bg);
                backdrop-filter: blur(30px) saturate(180%);
                -webkit-backdrop-filter: blur(30px) saturate(180%);
                border: 1px solid var(--be-border);
                border-radius: 20px 20px 0 0;
                z-index: 5000;
                transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                display: flex;
                flex-direction: column;
                box-shadow: 0 -20px 50px rgba(0,0,0,0.5);
                color: var(--be-text-main);
                font-family: var(--be-font-sans);
                overflow: hidden;
            }
            #be-bottom-panel.open { transform: translateY(-460px); }

            .be-panel-header {
                padding: 12px 24px;
                background: linear-gradient(to right, rgba(255,255,255,0.03), transparent);
                border-bottom: 1px solid var(--be-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 50px;
                flex-shrink: 0;
            }
            .be-panel-header h2 { 
                margin: 0; 
                font-family: var(--be-font-display);
                font-size: 13px; 
                color: var(--be-text-dim); 
                font-weight: 800; 
                text-transform: uppercase; 
                letter-spacing: 3px; 
            }
            .be-close-btn { 
                background: rgba(255,255,255,0.05); 
                border: none; 
                color: var(--be-text-dim); 
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px; 
                cursor: pointer; 
                transition: all 0.2s; 
            }
            .be-close-btn:hover { background: rgba(255,255,255,0.1); color: #fff; transform: rotate(90deg); }

            .be-tab-bar { 
                display: flex; 
                gap: 8px; 
                padding: 0 20px; 
                background: rgba(0,0,0,0.2); 
                border-bottom: 1px solid var(--be-border); 
                height: 44px; 
                align-items: center; 
            }
            .be-tab { 
                padding: 6px 16px; 
                font-size: 12px; 
                font-weight: 600; 
                color: var(--be-text-dim); 
                cursor: pointer; 
                border-radius: 8px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                text-transform: capitalize; 
                position: relative;
            }
            .be-tab:hover { color: #fff; background: rgba(255,255,255,0.05); }
            .be-tab.active { 
                color: #fff; 
                background: rgba(var(--be-accent-rgb), 0.15); 
                box-shadow: inset 0 0 0 1px rgba(var(--be-accent-rgb), 0.3);
            }
            .be-tab.active::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 20%;
                right: 20%;
                height: 2px;
                background: var(--be-accent);
                box-shadow: 0 0 10px var(--be-accent);
                border-radius: 2px;
            }

            .be-panel-content { flex: 1; display: flex; overflow: hidden; background: radial-gradient(circle at 50% 0%, rgba(var(--be-accent-rgb), 0.05), transparent 70%); }
            
            .be-two-pane { display: flex; width: 100%; height: 100%; }
            .be-sidebar { 
                width: 220px; 
                border-right: 1px solid var(--be-border); 
                background: rgba(0,0,0,0.1); 
                overflow-y: auto; 
                padding: 15px; 
                flex-shrink: 0; 
            }
            .be-main { flex: 1; overflow-y: auto; padding: 24px; }

            /* フォルダツリー */
            .be-tree-item { 
                padding: 8px 12px; 
                font-size: 13px; 
                color: #cbd5e1; 
                cursor: pointer; 
                border-radius: 10px; 
                transition: 0.2s; 
                display: flex; 
                align-items: center; 
                gap: 10px;
                margin-bottom: 2px;
            }
            .be-tree-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
            .be-tree-item.active { 
                background: rgba(var(--be-accent-rgb), 0.1); 
                color: var(--be-accent); 
                font-weight: 700; 
            }
            .be-tree-item::before { content: '󰉋'; font-family: 'Material Symbols Outlined'; font-size: 16px; opacity: 0.7; }

            /* モデルグリッド */
            .be-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; width: 100%; }
            
            /* モデルカード */
            .be-card { 
                position: relative; 
                aspect-ratio: 2/3; 
                border-radius: 16px; 
                overflow: hidden; 
                background: #111; 
                border: 1px solid var(--be-border); 
                cursor: pointer; 
                transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1); 
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                display: block;
            }
            .be-card:hover { 
                transform: translateY(-8px) scale(1.02); 
                border-color: rgba(var(--be-accent-rgb), 0.4); 
                box-shadow: 0 15px 35px rgba(0,0,0,0.6), 0 0 15px rgba(var(--be-accent-rgb), 0.2); 
            }
            .be-card-img { 
                width: 100%; 
                height: 100%; 
                object-fit: cover; 
                opacity: 0.6; 
                transition: all 0.5s ease; 
                filter: grayscale(20%);
            }
            .be-card:hover .be-card-img { opacity: 0.9; transform: scale(1.1); filter: grayscale(0%); }
            
            /* カードオーバーレイ */
            .be-card-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                padding: 20px 15px 15px;
                background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
                display: flex;
                flex-direction: column;
                gap: 6px;
                pointer-events: none;
            }
            .be-card-name { 
                font-size: 13px; 
                font-weight: 700; 
                color: #fff; 
                white-space: nowrap; 
                overflow: hidden; 
                text-overflow: ellipsis; 
                text-shadow: 0 2px 4px rgba(0,0,0,0.5); 
                font-family: var(--be-font-display);
            }
            .be-card-meta { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: flex; justify-content: space-between; align-items: center; }
            .be-badge { 
                background: rgba(var(--be-accent-rgb), 0.15); 
                color: var(--be-accent);
                padding: 2px 8px; 
                border-radius: 6px; 
                border: 1px solid rgba(var(--be-accent-rgb), 0.2); 
                font-weight: 700;
                font-size: 9px;
            }

            /* トップバーボタン */
            .be-topbar-btn { 
                background: rgba(255,255,255,0.03); 
                border: 1px solid var(--be-border); 
                color: #94a3b8; 
                cursor: pointer; 
                padding: 8px 16px; 
                font-size: 12px; 
                font-weight: 700; 
                border-radius: 10px; 
                transition: all 0.3s; 
                font-family: var(--be-font-display);
                letter-spacing: 1px; 
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .be-topbar-btn:hover { 
                color: #fff; 
                background: rgba(var(--be-accent-rgb), 0.1); 
                border-color: rgba(var(--be-accent-rgb), 0.3);
                transform: translateY(-1px);
            }
            .be-topbar-btn.active { 
                color: #fff; 
                background: var(--be-accent); 
                border-color: var(--be-accent);
                box-shadow: 0 4px 15px rgba(var(--be-accent-rgb), 0.4);
            }

            /* スクロールバー */
            ::-webkit-scrollbar { width: 5px; height: 5px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(var(--be-accent-rgb), 0.3); }

            /* プロンプト入力 */
            #prompt-filename {
                transition: all 0.3s;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            }
            #prompt-filename:focus {
                outline: none;
                border-color: var(--be-accent);
                background: #000;
                box-shadow: 0 0 0 4px rgba(var(--be-accent-rgb), 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    // 2. パネル要素の作成
    const panel = document.createElement("div");
    panel.id = "be-bottom-panel";
    panel.innerHTML = `
        <div class="be-panel-header">
            <h2>Basic Expansion Hub</h2>
            <button class="be-close-btn">&times;</button>
        </div>
        <div class="be-tab-bar">
            <div class="be-tab active" data-tab="checkpoints">Checkpoints</div>
            <div class="be-tab" data-tab="loras">Loras</div>
            <div class="be-tab" data-tab="prompts">Prompts</div>
            <div class="be-tab" data-tab="images">Images</div>
        </div>
        <div class="be-panel-content">
            <div id="tab-container" class="be-two-pane">
                <div id="be-sidebar" class="be-sidebar"></div>
                <div id="be-main" class="be-main">
                    <div id="be-grid" class="be-grid"></div>
                </div>
            </div>
            <div id="tab-prompts" class="be-main" style="display:none; width:100%; padding: 20px;">
                <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid #333;">
                    <input id="prompt-filename" type="text" placeholder="Prompt filename (e.g. masterpiece.yaml)" style="flex: 1; background: #111; border: 1px solid #444; color: #fff; padding: 8px 12px; border-radius: 4px; font-size: 13px;">
                    <button id="prompt-save-btn" class="be-topbar-btn" style="background: #222; border: 1px solid #444; padding: 8px 20px;">Save YAML</button>
                    <button id="prompt-refresh-btn" class="be-topbar-btn" style="background: transparent; border: none; font-size: 18px;">🔄</button>
                </div>
                <div id="be-prompts-grid" class="be-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));"></div>
            </div>
            <!-- Images用コンテナ -->
            <div id="tab-images" class="be-main" style="display:none; width:100%;">
                <div id="be-images-grid" class="be-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));"></div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // 3. 状態管理
    const state = {
        activeTab: "checkpoints",
        currentFolder: "",
        currentRoot: "",
        roots: { checkpoints: [], loras: [] },
        folders: { checkpoints: [], loras: [] },
        models: { checkpoints: [], loras: [] },
        images: []
    };

    // 4. API連携
    const LM_API = "/api/lm";

    async function fetchRoots(type) {
        try {
            const resp = await fetch(`${LM_API}/${type}/roots`);
            if (!resp.ok) return [];
            const data = await resp.json();
            return data.roots || [];
        } catch (e) { return []; }
    }

    async function fetchFolderTree(type, root) {
        if (!root) return [{ name: "ROOT", path: "" }];
        console.log(`[BasicExpansion] Fetching tree: type=${type}, root=${root}`);
        try {
            const resp = await fetch(`${LM_API}/${type}/folder-tree?model_root=${encodeURIComponent(root)}`);
            if (!resp.ok) return [{ name: "ROOT", path: "" }];
            const data = await resp.json();
            
            let list = [{ name: "ROOT", path: "" }];
            if (data && data.tree) {
                const traverse = (obj, currentPath = "") => {
                    Object.keys(obj).forEach(name => {
                        const fullPath = currentPath ? `${currentPath}/${name}` : name;
                        list.push({ name: name, path: fullPath });
                        if (obj[name] && typeof obj[name] === 'object' && Object.keys(obj[name]).length > 0) {
                            traverse(obj[name], fullPath);
                        }
                    });
                };
                traverse(data.tree);
            }
            return list;
        } catch (e) { return [{ name: "ROOT", path: "" }]; }
    }

    async function fetchModels(type, root, folder = "") {
        if (!root) return [];
        console.log(`[BasicExpansion] Fetching models: type=${type}, root=${root}, folder=${folder}`);
        try {
            const url = `${LM_API}/${type}/list?model_root=${encodeURIComponent(root)}&folder=${encodeURIComponent(folder)}&page_size=100&limit=100`;
            const resp = await fetch(url);
            if (!resp.ok) return [];
            const data = await resp.json();
            console.log(`[BasicExpansion] Received data for ${type}:`, data);
            
            let rawItems = [];
            if (data.items && Array.isArray(data.items)) {
                rawItems = data.items;
            } else if (data.models && Array.isArray(data.models)) {
                rawItems = data.models;
            } else if (Array.isArray(data)) {
                rawItems = data;
            }

            // データのマッピング (サーバー側の model_name/file_path -> name/path)
            const models = rawItems.map(m => ({
                name: m.model_name || m.file_name || m.name || "Unknown",
                path: m.file_path || m.path || m.name || "",
                preview_url: m.preview_url || "",
                base_model: m.base_model || "N/A"
            }));

            console.log(`[BasicExpansion] Parsed models length: ${models.length}`);
            return models;
        } catch (e) { 
            console.error(`[BasicExpansion] Fetch error:`, e);
            return []; 
        }
    }

    // 5. 描画ロジック
    function renderSidebar(type) {
        const sidebar = panel.querySelector("#be-sidebar");
        sidebar.innerHTML = "";
        
        // ルート選択
        if (state.roots[type] && state.roots[type].length > 1) {
            const rootSelector = document.createElement("select");
            rootSelector.style.width = "100%";
            rootSelector.style.marginBottom = "15px";
            rootSelector.style.background = "#222";
            rootSelector.style.color = "#eee";
            rootSelector.style.border = "1px solid #444";
            rootSelector.style.padding = "5px";
            rootSelector.style.fontSize = "11px";
            state.roots[type].forEach(r => {
                const opt = document.createElement("option");
                opt.value = r;
                opt.textContent = r.split("/").pop() || r;
                opt.selected = r === state.currentRoot;
                rootSelector.appendChild(opt);
            });
            rootSelector.onchange = async () => {
                state.currentRoot = rootSelector.value;
                state.currentFolder = "";
                state.folders[type] = await fetchFolderTree(type, state.currentRoot);
                renderSidebar(type);
                const models = await fetchModels(type, state.currentRoot);
                renderModelGrid(type, models);
            };
            sidebar.appendChild(rootSelector);
        }

        const folders = state.folders[type];
        folders.forEach(f => {
            const el = document.createElement("div");
            el.className = `be-tree-item ${state.currentFolder === f.path ? "active" : ""}`;
            el.textContent = f.name;
            el.onclick = async () => {
                state.currentFolder = f.path;
                renderSidebar(type);
                const models = await fetchModels(type, state.currentRoot, f.path);
                renderModelGrid(type, models);
            };
            sidebar.appendChild(el);
        });
    }

    function renderModelGrid(type, models) {
        console.log(`[BasicExpansion] renderModelGrid: type=${type}, count=${models ? models.length : 'NULL'}`);
        const grid = panel.querySelector("#be-grid");
        grid.innerHTML = "";
        
        if (!models || models.length === 0) {
            grid.innerHTML = `<div style="color:#666; font-size:12px; grid-column:1/-1; text-align:center; padding-top:40px;">No models found in this folder.</div>`;
            return;
        }

        models.forEach(m => {
            const card = document.createElement("div");
            card.className = "be-card";
            
            // プレビューURL生成
            let previewUrl = m.preview_url;
            if (!previewUrl) {
                previewUrl = `${LM_API}/${type}/preview-url?name=${encodeURIComponent(m.path || m.name)}`;
            }
            if (previewUrl && !previewUrl.startsWith("http") && !previewUrl.startsWith("/")) {
                previewUrl = "/" + previewUrl; // 念のため補正
            }

            card.innerHTML = `
                <img class="be-card-img" src="${previewUrl}" loading="lazy" onerror="this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='">
                <div class="be-card-overlay">
                    <div class="be-card-name">${(m.name || "Unknown").replace(/\.[^/.]+$/, "")}</div>
                    <div class="be-card-meta">
                        <span class="be-badge">${m.base_model || "N/A"}</span>
                        <span>${type === "loras" ? "LoRA" : "CKPT"}</span>
                    </div>
                </div>
            `;
            card.onclick = () => updateHubNode(type === "checkpoints" ? "ckpt_name" : "lora_name", m.path || m.name);
            grid.appendChild(card);
        });
    }

    // 6. タブ切り替え
    const tabs = panel.querySelectorAll(".be-tab");
    tabs.forEach(tab => {
        tab.onclick = async () => {
            const target = tab.dataset.tab;
            console.log(`[BasicExpansion] Tab clicked: ${target}`);
            state.activeTab = target;
            state.currentFolder = "";
            tabs.forEach(t => t.classList.toggle("active", t === tab));
            
            if (target === "prompts") {
                panel.querySelector("#tab-container").style.display = "none";
                panel.querySelector("#tab-prompts").style.display = "block";
                panel.querySelector("#tab-images").style.display = "none";
                renderPrompts();
            } else if (target === "images") {
                panel.querySelector("#tab-container").style.display = "none";
                panel.querySelector("#tab-prompts").style.display = "none";
                panel.querySelector("#tab-images").style.display = "block";
                renderImages();
            } else {
                panel.querySelector("#tab-container").style.display = "flex";
                panel.querySelector("#tab-prompts").style.display = "none";
                panel.querySelector("#tab-images").style.display = "none";
                
                // 初期化
                state.roots[target] = await fetchRoots(target);
                state.currentRoot = state.roots[target][0] || "";
                
                state.folders[target] = await fetchFolderTree(target, state.currentRoot);
                const initialModels = await fetchModels(target, state.currentRoot);
                state.models[target] = initialModels;
                
                renderSidebar(target);
                renderModelGrid(target, initialModels);
            }
        };
    });

    async function renderPrompts() {
        const grid = panel.querySelector("#be-prompts-grid");
        grid.innerHTML = `<div style="color:#666; text-align:center; padding:20px;">Fetching prompts...</div>`;
        
        // イベントリスナーの初期化（一度だけ）
        const saveBtn = panel.querySelector("#prompt-save-btn");
        const refreshBtn = panel.querySelector("#prompt-refresh-btn");
        if (saveBtn && !saveBtn.dataset.init) {
            saveBtn.dataset.init = "true";
            saveBtn.onclick = async () => {
                const filename = panel.querySelector("#prompt-filename").value;
                if (!filename) { alert("Please enter a filename."); return; }
                
                // Hubノードから現在の値を取得
                const hubNodes = app.graph.findNodesByType("BasicExpansion Hub");
                if (hubNodes.length === 0) { alert("No Hub Node found in workspace."); return; }
                const promptValue = hubNodes[0].widgets.find(w => w.name === "positive_prompt")?.value || "";
                
                const resp = await fetch("/basic-expansion/prompts/save", {
                    method: "POST",
                    body: JSON.stringify({ filename, content: promptValue })
                });
                const result = await resp.json();
                if (result.status === "success") {
                    alert("Prompt saved!");
                    renderPrompts();
                } else {
                    alert("Error: " + result.message);
                }
            };
            refreshBtn.onclick = () => renderPrompts();
        }

        const presets = [
            { title: "Masterpiece", text: "Masterpiece, 8k, highly detailed, realistic, sharp focus" },
            { title: "Cyberpunk", text: "Cyberpunk city, rainy night, neon signs, blade runner style" },
            { title: "Fantasy", text: "Fantasy landscape, floating mountains, epic scale, sunset" }
        ];

        try {
            const resp = await fetch("/basic-expansion/prompts/list");
            const files = await resp.json();
            
            grid.innerHTML = "";
            
            // プリセット（静的）を表示
            presets.forEach(p => {
                const btn = createPromptCard(p.title, p.text, "📦 Preset");
                grid.appendChild(btn);
            });

            // ユーザー定義（YAML）を表示
            if (Array.isArray(files)) {
                for (const file of files) {
                    const loadResp = await fetch(`/basic-expansion/prompts/load?filename=${file}`);
                    const data = await loadResp.json();
                    if (data.content) {
                        const btn = createPromptCard(file.replace(/\.yaml$/, ""), data.content, "📂 YAML");
                        grid.appendChild(btn);
                    }
                }
            }

        } catch (e) {
            console.error("Error fetching prompts:", e);
            grid.innerHTML = `<div style="color:#ff4444; padding:20px;">Failed to load prompts.</div>`;
        }
    }

    function createPromptCard(title, text, badge) {
        const btn = document.createElement("button");
        btn.className = "be-card";
        btn.style.height = "auto";
        btn.style.padding = "20px";
        btn.style.textAlign = "left";
        btn.style.display = "flex";
        btn.style.flexDirection = "column";
        btn.style.gap = "8px";
        btn.innerHTML = `
            <div style="font-size:12px; font-weight:800; color:#fff; display:flex; justify-content:space-between;">
                ${title} <span style="font-size:9px; opacity:0.5;">${badge}</span>
            </div>
            <div style="font-size:11px; opacity:0.8; line-height:1.4; white-space: normal; word-break: break-all;">${text}</div>
        `;
        btn.onclick = () => {
            updateHubNode("positive_prompt", text);
            // ファイル名欄を自動入力補完
            const input = panel.querySelector("#prompt-filename");
            if (input) input.value = title + (badge.includes("YAML") ? "" : ".yaml");
        };
        return btn;
    }

    async function renderImages() {
        const grid = panel.querySelector("#be-images-grid");
        grid.innerHTML = `<div style="color:#666; text-align:center; padding:20px;">Loading images...</div>`;
        
        try {
            const resp = await fetch("/basic-expansion/images/list");
            if (!resp.ok) throw new Error("API Error");
            const images = await resp.json();
            
            grid.innerHTML = "";
            if (images.length === 0) {
                grid.innerHTML = `<div style="color:#666; text-align:center; padding:20px;">No images found in output folder.</div>`;
                return;
            }

            images.forEach(img => {
                const card = document.createElement("div");
                card.className = "be-card";
                card.style.aspectRatio = "1/1";
                card.innerHTML = `
                    <img class="be-card-img" src="${img.url}" loading="lazy" style="opacity:1;">
                    <div class="be-card-overlay">
                        <div class="be-card-name" style="font-size:10px;">${img.filename}</div>
                    </div>
                `;
                card.onclick = () => {
                   console.log("[BasicExpansion] Image selected:", img.filename);
                };
                grid.appendChild(card);
            });
        } catch (e) {
            grid.innerHTML = `<div style="color:#ff4444; text-align:center; padding:20px;">Error loading images.</div>`;
        }
    }

    // 7. トップバーボタン
    let topbarBtn = null;
    const addTopbarButton = () => {
        const group = document.querySelector(".comfyui-button-group");
        if (group && !document.getElementById("be-topbar-trigger")) {
            topbarBtn = document.createElement("button");
            topbarBtn.id = "be-topbar-trigger";
            topbarBtn.className = "be-topbar-btn";
            topbarBtn.textContent = "📦 BASIC";
            group.insertBefore(topbarBtn, group.firstChild);
            topbarBtn.onclick = togglePanel;
        } else if (!group) setTimeout(addTopbarButton, 1000);
    };
    addTopbarButton();

    const togglePanel = () => {
        const isOpen = panel.classList.toggle("open");
        if (topbarBtn) topbarBtn.classList.toggle("active", isOpen);
        if (isOpen) {
            tabs[0].click();
        }
    };

    panel.querySelector(".be-close-btn").onclick = togglePanel;

    window.addEventListener("keydown", (e) => {
        if (e.altKey && e.code === "KeyB") {
            e.preventDefault();
            togglePanel();
        }
    });
}

function updateHubNode(widgetName, value) {
    const hubNodes = app.graph.findNodesByType("BasicExpansion Hub");
    if (hubNodes.length === 0) return;
    hubNodes.forEach(node => {
        const widget = node.widgets.find(w => w.name === widgetName);
        if (widget) {
            widget.value = value;
            node.setDirtyCanvas(true, true);
        }
    });
}

const ext = {
    name: "Comfy.BasicExpansion",
    async setup() {
        console.log("[BasicExpansion] Version 1.4.3 initialising.");
        if (!document.getElementById("be-bottom-panel")) {
            setupBasicExpansionUI();
        }
    }
};

app.registerExtension(ext);
