import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SectionTitle from "../../components/SectionTitle/SectionTitle.jsx";
import MealCard from "../../components/MealCard/MealCard.jsx";
import { subscribeToMenu } from "../../firebase/data.js";
import { setMenu } from "../../redux/slices/menuSlice.js";
import { demoMenu } from "../../data/demoData.js";

import "./Menu.css";

export default function Menu() {
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();

  const [dayName, setDayName] = useState(menu[0]?.day || "Monday");

  useEffect(() => {
    const unsubscribe = subscribeToMenu((firebaseMenu) => {
      const mergedMenu = demoMenu.map((defaultDay) => {
        const savedDay = firebaseMenu.find(
          (item) => item.day === defaultDay.day
        );

        if (!savedDay) {
          return defaultDay;
        }

        return {
          ...defaultDay,
          ...savedDay,

          options: {
            ...defaultDay.options,

            ...(savedDay.breakfastOptions && {
              breakfast: savedDay.breakfastOptions
            }),

            ...(savedDay.lunchOptions && {
              lunch: savedDay.lunchOptions
            }),

            ...(savedDay.snacksOptions && {
              snacks: savedDay.snacksOptions
            }),

            ...(savedDay.dinnerOptions && {
              dinner: savedDay.dinnerOptions
            })
          }
        };
      });

      dispatch(setMenu(mergedMenu));
    });

    return () => unsubscribe();
  }, [dispatch]);

  const selected =
    menu.find((item) => item.day === dayName) || menu[0];

  return (
    <div>
      <SectionTitle
        title="7-Day Mess Menu"
        subtitle="Every meal is visible, with 2–3 alternatives prepared for proposed changes."
      />

      <div className="week-tabs">
        {menu.map((day) => (
          <button
            key={day.day}
            className={dayName === day.day ? "active" : ""}
            onClick={() => setDayName(day.day)}
          >
            {day.day.slice(0, 3)}
          </button>
        ))}
      </div>

      <section className="card week-card">
        <div className="week-head">
          <div>
            <span>{selected.day}</span>
            <h2>Meal Plan</h2>
          </div>

          <small>
            Tap an alternative to see what could replace the current meal.
          </small>
        </div>

        <div className="week-meals">
          {["breakfast", "lunch", "snacks", "dinner"].map((meal) => (
            <MealCard
              key={meal}
              meal={meal}
              value={selected[meal]}
              options={selected.options[meal]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}