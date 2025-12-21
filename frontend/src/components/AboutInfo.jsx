// File: src/components/public/AboutInfo.jsx
import React from "react";

export default function AboutInfo({ title, content }) {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
}
