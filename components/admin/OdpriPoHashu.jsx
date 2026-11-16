"use client";

import { useEffect } from "react";

// Če povezava kaže na zaprto nit (#p-12), jo odpre in pomakne do nje — tudi če je 12 starejše povpraševanje v niti.
export default function OdpriPoHashu() {
  useEffect(() => {
    const id = window.location.hash.replace("#p-", "");
    if (!id) return;
    let el = document.getElementById(`p-${id}`);
    if (!el) el = [...document.querySelectorAll("details[data-ids]")].find((d) => d.dataset.ids.split(",").includes(id));
    if (el?.tagName === "DETAILS") el.open = true;
    el?.scrollIntoView({ block: "start" });
  }, []);
  return null;
}
