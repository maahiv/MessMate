import React from "react";
import "./MealCard.css";

const icons = { breakfast:"🌅", lunch:"🍛", snacks:"☕", dinner:"🌙" };

export default function MealCard({ meal, value, options, onChoose, editable=false }) {
  return <div className="meal-card">
    <span className="meal-icon">{icons[meal]}</span>
    <div className="meal-content">
      <small>{meal[0].toUpperCase()+meal.slice(1)}</small>
      {editable ? (
        <select value={value} onChange={(e)=>onChoose(e.target.value)}>
          {options.map((x)=><option key={x}>{x}</option>)}
        </select>
      ) : <b>{value}</b>}
      <div className="alt-row">
        {options.filter(x=>x!==value).slice(0,2).map(x=><button key={x} onClick={()=>onChoose?.(x)} disabled={!onChoose}>{x}</button>)}
      </div>
    </div>
  </div>;
}