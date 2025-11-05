/**
 * Blog Filter & Pagination Script
 * ---------------------------------------
 * Open Source under the MIT License
 * 
 * This script automatically adds:
 *  - A dynamic year-based filter for blog posts
 *  - Client-side pagination with customizable limits
 * 
 * Features:
 *  - Detects post years from common HTML structures (<time>, <span>, etc.)
 *  - Generates a "Year Filter" dropdown and "Clear" button
 *  - Paginates visible posts after filtering
 *  - Supports deep linking via URL hash (#page=n)
 *  - Accessible UI (ARIA roles and labels included)
 * 
 * Configuration:
 *  - POSTS_PER_PAGE: number of posts per page (default: 20)
 *  - Compatible with list containers like:
 *      .blog-posts, ul.blog-posts, .posts, ul.posts
 */

document.addEventListener('DOMContentLoaded', () => {
  const POSTS_PER_PAGE = 20;
  const LIST_SELECTORS = [".blog-posts", "ul.blog-posts", ".posts", "ul.posts"];
  const CSS = {
    YF_HIDDEN: "yf-hidden",
    PG_HIDDEN: "pg-hidden"
  };
  const UI_ID = "year-filter";
  const DATE_SELECTORS_PER_LI = ["time[datetime]", "time", "span", ".date"];

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  const list = LIST_SELECTORS.map(s => $(s)).find(Boolean);
  if (!list) {
    console.warn("Blog filter/pagination: post list not found.");
    return;
  }

  const allItems = $$('li', list);
  if (!allItems.length) {
    console.warn("Blog filter/pagination: the list has no <li> elements.");
    return;
  }

  const getYearFromLi = (li) => {
    for (const sel of DATE_SELECTORS_PER_LI) {
      const el = $(sel, li);
      if (!el) continue;

      const dt = el.getAttribute && el.getAttribute('datetime');
      if (dt) {
        const m = /^(\d{4})/.exec(dt);
        if (m) return m[1];
      }

      const txt = (el.textContent || "").trim();
      const m2 = /(?:20|19)\d{2}/.exec(txt);
      if (m2) return m2[0];
    }

    const full = li.textContent || "";
    const m3 = /(?:20|19)\d{2}/.exec(full);
    if (m3) return m3[0];

    console.warn("Blog filter: could not extract year for:", li);
    return null;
  };

  const yearsSet = new Set();
  for (const li of allItems) {
    const y = getYearFromLi(li);
    if (y) {
      li.dataset.year = y;
      yearsSet.add(y);
    }
  }

  let onYearChange;

  if (yearsSet.size) {
    const frag = document.createDocumentFragment();
    const wrap = document.createElement("div");
    wrap.id = UI_ID;
    wrap.className = "year-filter";
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", "Year filter");

    const select = document.createElement("select");
    select.className = "yf-select";
    select.setAttribute("aria-label", "Select year");

    const optAll = new Option("All years", "all");
    select.append(optAll);
    [...yearsSet].sort((a, b) => parseInt(b, 10) - parseInt(a, 10))
      .forEach(y => select.append(new Option(y, y)));

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "yf-btn";
    btn.textContent = "Clear";
    btn.setAttribute("aria-label", "Clear year filter");

    const spacer = document.createElement("span");
    spacer.className = "yf-spacer";
    spacer.setAttribute("aria-hidden", "true");

    const badge = document.createElement("span");
    badge.className = "yf-badge";
    badge.textContent = `${allItems.length} posts`;

    wrap.append(select, btn, spacer, badge);
    frag.append(wrap);

    const emptyMsg = document.createElement("p");
    emptyMsg.id = `${UI_ID}-empty`;
    emptyMsg.className = "yf-empty";
    emptyMsg.textContent = "No posts for this year";
    emptyMsg.style.display = "none";
    frag.append(emptyMsg);

    list.parentNode.insertBefore(frag, list);

    const applyFilter = (year) => {
      let visible = 0;
      const showAll = year === "all";

      for (const li of allItems) {
        const show = showAll || li.dataset.year === year;
        if (show) visible++;
        li.classList.toggle(CSS.YF_HIDDEN, !show);
      }

      badge.textContent = `${visible} of ${allItems.length} posts`;
      emptyMsg.style.display = visible === 0 ? "" : "none";

      list.dispatchEvent(new CustomEvent("yearfilter:applied", { detail: { year } }));
    };

    select.addEventListener("change", () => applyFilter(select.value));
    btn.addEventListener("click", () => {
      if (select.value !== "all") {
        select.value = "all";
        applyFilter("all");
      }
    });

    onYearChange = (year) => {
      if (select.value !== year) select.value = year;
      applyFilter(year);
    };
  }

  let postsForPagination = [];
  let totalPages = 1;
  let currentPage = 1;

  const nav = document.createElement("nav");
  nav.className = "pagination";
  nav.setAttribute("aria-label", "Post pagination");
  nav.innerHTML = `
    <button type="button" id="prevPage" aria-label="Previous page">Previous</button>
    <span id="pageInfo" aria-live="polite"></span>
    <button type="button" id="nextPage" aria-label="Next page">Next</button>
  `;
  list.insertAdjacentElement("afterend", nav);

  const prevBtn = $("#prevPage", nav);
  const nextBtn = $("#nextPage", nav);
  const pageInfo = $("#pageInfo", nav);

  const rebuildPosts = () => {
    postsForPagination = allItems.filter(li => !li.classList.contains(CSS.YF_HIDDEN));
    totalPages = Math.max(1, Math.ceil(postsForPagination.length / POSTS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
  };

  const renderPageInfo = () => {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    nav.style.display = totalPages <= 1 ? "none" : "flex";
  };

  const showPage = (page) => {
    currentPage = page;
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    for (let i = 0; i < postsForPagination.length; i++) {
      const li = postsForPagination[i];
      const hide = !(i >= start && i < end);
      li.classList.toggle(CSS.PG_HIDDEN, hide);
    }

    const setVisible = new Set(postsForPagination.slice(start, end));
    for (const li of allItems) {
      if (!setVisible.has(li)) li.classList.add(CSS.PG_HIDDEN);
    }

    renderPageInfo();
  };

  const updateHash = () => {
    history.replaceState(null, "", `#page=${currentPage}`);
  };

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      showPage(currentPage - 1);
      updateHash();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      showPage(currentPage + 1);
      updateHash();
    }
  });

  list.addEventListener("yearfilter:applied", () => {
    rebuildPosts();
    showPage(1);
    updateHash();
  });

  const hash = location.hash || "";
  const pageMatch = /page=(\d+)/.exec(hash);
  const startPageFromHash = pageMatch ? Math.max(1, parseInt(pageMatch[1], 10)) : 1;

  if (onYearChange) onYearChange("all");
  rebuildPosts();
  const startPage = Math.min(totalPages, startPageFromHash);
  showPage(startPage);
});
