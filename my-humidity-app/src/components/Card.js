import React from "react";

export default function Card({ title, value, color }) {
  return (
    <div className={`card ${color || "blue"}`}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
