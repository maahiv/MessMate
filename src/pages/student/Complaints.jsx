import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, ShieldCheck, Plus } from "lucide-react";

import SectionTitle from "../../components/SectionTitle/SectionTitle.jsx";
import ComplaintCard from "../../components/ComplaintCard/ComplaintCard.jsx";
import { addComplaint } from "../../redux/slices/complaintsSlice.js";
import { saveComplaint } from "../../firebase/data.js";
import { useAuth } from "../../context/AuthContext.jsx";

import "./Complaints.css";

export default function Complaints() {
  const [show, setShow] = useState(false);
  const [photo, setPhoto] = useState(false);

  const [form, setForm] = useState({
    meal: "Lunch",
    type: "Foreign object",
    text: "",
    privacy: "anonymous"
  });

  const dispatch = useDispatch();
  const complaints = useSelector((state) => state.complaints);
  const { user } = useAuth();

  const file = useRef();

  async function submit(e) {
    e.preventDefault();

    const ticketId = `#MM-${Math.floor(1000 + Math.random() * 8999)}`;

    const complaint = {
      ticketId,
      type: form.type,
      text: form.text || "Food issue reported.",
      date: new Date().toLocaleString(),
      status: "Under Review",
      user:
        form.privacy === "anonymous"
          ? "Anonymous"
          : user.name,
      userId: user.uid,
      meal: form.meal,
      privacy: form.privacy,
      photo: photo,
      createdAt: new Date().toISOString()
    };

    try {
      const savedComplaint = await saveComplaint(complaint);

      dispatch(
        addComplaint({
          ...complaint,
          id: savedComplaint.id
        })
      );

      setShow(false);

      setForm({
        meal: "Lunch",
        type: "Foreign object",
        text: "",
        privacy: "anonymous"
      });

      setPhoto(false);
    } catch (error) {
      console.error("Complaint save error:", error);
      alert("Complaint submit nahi hui. Please try again.");
    }
  }

  return (
    <div>
      <SectionTitle
        title="Food Complaints"
        subtitle="Report food safety or quality issues with photo evidence."
        action={
          <button
            className="primary-btn"
            onClick={() => setShow(!show)}
          >
            <Plus size={16} />
            Report issue
          </button>
        }
      />

      <div className="privacy-note">
        <ShieldCheck size={16} />
        <span>
          <b>Transparency with privacy:</b> your identity can stay hidden
          from other students.
        </span>
      </div>

      {show && (
        <form className="card report-form" onSubmit={submit}>
          <h3>New food issue</h3>

          <div className="report-grid">
            <label>
              Meal
              <select
                value={form.meal}
                onChange={(e) =>
                  setForm({
                    ...form,
                    meal: e.target.value
                  })
                }
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Snacks</option>
                <option>Dinner</option>
              </select>
            </label>

            <label>
              Issue type
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value
                  })
                }
              >
                <option>Foreign object</option>
                <option>Food quality</option>
                <option>Hygiene</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <label>
            Description
            <textarea
              value={form.text}
              onChange={(e) =>
                setForm({
                  ...form,
                  text: e.target.value
                })
              }
              placeholder="What happened?"
            />
          </label>

          <div className="privacy-options">
            <span>Who can see your identity?</span>

            {["everyone", "committee", "anonymous"].map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="privacy"
                  checked={form.privacy === item}
                  onChange={() =>
                    setForm({
                      ...form,
                      privacy: item
                    })
                  }
                />

                {item === "everyone"
                  ? "Everyone"
                  : item === "committee"
                  ? "Committee only"
                  : "Anonymous"}
              </label>
            ))}
          </div>

          <button
            type="button"
            className="upload-box"
            onClick={() => file.current?.click()}
          >
            <Camera size={18} />

            <span>
              {photo ? "Photo selected" : "Upload a photo"}
              <small>JPG / PNG</small>
            </span>

            <input
              ref={file}
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPhoto(Boolean(e.target.files?.[0]))
              }
            />
          </button>

          <button className="primary-btn">
            Submit complaint
          </button>
        </form>
      )}

      <div className="complaint-grid">
        {complaints.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
          />
        ))}
      </div>
    </div>
  );
}