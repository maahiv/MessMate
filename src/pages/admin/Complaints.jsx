import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateStatus,
  setComplaints
} from "../../redux/slices/complaintsSlice.js";

import {
  getComplaints,
  updateComplaint
} from "../../firebase/data.js";

import SectionTitle from "../../components/SectionTitle/SectionTitle.jsx";
import ComplaintCard from "../../components/ComplaintCard/ComplaintCard.jsx";

import "./Complaints.css";

export default function Complaints() {
  const dispatch = useDispatch();

  const all = useSelector(
    (state) => state.complaints
  );

  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComplaints() {
      try {
        const data = await getComplaints();

        if (data.length > 0) {
          dispatch(setComplaints(data));
        }
      } catch (error) {
        console.error(
          "Failed to load complaints:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadComplaints();
  }, [dispatch]);

  const list =
    filter === "All"
      ? all
      : all.filter(
          (item) => item.status === filter
        );

  async function change(id, status) {
    try {
      await updateComplaint(id, { status });

      dispatch(
        updateStatus({
          id,
          status
        })
      );
    } catch (error) {
      console.error(
        "Status update failed:",
        error
      );
      alert("Status update nahi hua.");
    }
  }

  return (
    <div>
      <SectionTitle
        title="Complaint Management"
        subtitle="Review food evidence and update actions transparently."
      />

      <div className="admin-filter">
        <span>Filter</span>

        {[
          "All",
          "Under Review",
          "Action Taken",
          "Resolved"
        ].map((item) => (
          <button
            key={item}
            className={
              filter === item ? "active" : ""
            }
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="muted">
          Loading complaints...
        </p>
      ) : list.length === 0 ? (
        <p className="muted">
          No complaints found.
        </p>
      ) : (
        <div className="admin-complaints">
          {list.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              admin
              onStatusChange={change}
            />
          ))}
        </div>
      )}
    </div>
  );
}