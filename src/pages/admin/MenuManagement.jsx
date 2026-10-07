import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateMeal } from "../../redux/slices/menuSlice.js";
import SectionTitle from "../../components/SectionTitle/SectionTitle.jsx";
import {
  saveMenuDay,
  seedMenu
} from "../../firebase/data.js";

import "./MenuManagement.css";

const mealLabels = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snacks: "Snacks",
  dinner: "Dinner"
};

export default function MenuManagement() {
  const menu = useSelector((s) => s.menu);
  const dispatch = useDispatch();

  const [dayName, setDayName] = useState(menu[0].day);

  const selected =
    menu.find((d) => d.day === dayName) || menu[0];

  const [draft, setDraft] = useState(() => ({
    breakfast: {
      value: selected.breakfast,
      options: [...selected.options.breakfast]
    },
    lunch: {
      value: selected.lunch,
      options: [...selected.options.lunch]
    },
    snacks: {
      value: selected.snacks,
      options: [...selected.options.snacks]
    },
    dinner: {
      value: selected.dinner,
      options: [...selected.options.dinner]
    }
  }));

  // Create Monday-Sunday in Firestore if missing
  useEffect(() => {
    seedMenu().catch((error) => {
      console.error("Menu seeding failed:", error);
    });
  }, []);

  function selectDay(day) {
    const next = menu.find((d) => d.day === day);

    setDayName(day);

    setDraft({
      breakfast: {
        value: next.breakfast,
        options: [...next.options.breakfast]
      },
      lunch: {
        value: next.lunch,
        options: [...next.options.lunch]
      },
      snacks: {
        value: next.snacks,
        options: [...next.options.snacks]
      },
      dinner: {
        value: next.dinner,
        options: [...next.options.dinner]
      }
    });
  }

  function changeDraft(meal, field, value, index) {
    setDraft((prev) => {
      const next = {
        ...prev,
        [meal]: {
          ...prev[meal],
          options: [...prev[meal].options]
        }
      };

      if (field === "value") {
        next[meal].value = value;
      } else {
        next[meal].options[index] = value;
      }

      return next;
    });
  }

  async function saveMeal(meal) {
    const data = draft[meal];

    const value = data.value.trim();

    const options = data.options
      .map((item) => item.trim())
      .filter(Boolean);

    if (!value) return;

    dispatch(
      updateMeal({
        day: selected.day,
        meal,
        value,
        options
      })
    );

    await saveMenuDay(selected.day, {
      [meal]: value,
      [`${meal}Options`]: options
    });
  }

  return (
    <div>
      <SectionTitle
        title="Menu Management"
        subtitle="Edit the current meal and type your own 2–3 alternatives."
      />
      <button
  className="save-meal"
  onClick={async () => {
    try {
      await seedMenu();
      alert("7-day menu synced successfully!");
    } catch (error) {
      console.error(error);
      alert("Menu sync failed.");
    }
  }}
>
  Sync 7-Day Menu
</button>

      <div className="manager-days">
        {menu.map((day) => (
          <button
            key={day.day}
            className={
              day.day === selected.day ? "active" : ""
            }
            onClick={() => selectDay(day.day)}
          >
            {day.day}
          </button>
        ))}
      </div>

      <section className="card manager-card">
        <div className="manager-head">
          <div>
            <span>{selected.day}</span>
            <h2>Edit meals</h2>
          </div>

          <small>
            You can type completely new meals and alternatives.
          </small>
        </div>

        <div className="manager-grid">
          {Object.keys(mealLabels).map((meal) => (
            <div
              className="menu-editor"
              key={meal}
            >
              <div className="menu-editor-title">
                {mealLabels[meal]}
              </div>

              <label>
                Current meal

                <input
                  value={draft[meal].value}
                  onChange={(e) =>
                    changeDraft(
                      meal,
                      "value",
                      e.target.value
                    )
                  }
                  placeholder="Type current meal"
                />
              </label>

              <div className="alternative-label">
                Change options
              </div>

              {draft[meal].options
                .slice(0, 3)
                .map((option, index) => (
                  <input
                    key={index}
                    value={option}
                    onChange={(e) =>
                      changeDraft(
                        meal,
                        "option",
                        e.target.value,
                        index
                      )
                    }
                    placeholder={`Option ${index + 1}`}
                  />
                ))}

              <button
                className="save-meal"
                onClick={() => saveMeal(meal)}
              >
                Save {mealLabels[meal]}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}