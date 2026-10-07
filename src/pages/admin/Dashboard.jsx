import React, { useEffect } from "react";
import {
  ShieldAlert,
  Vote,
  CheckCircle,
  Utensils
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import StatCard from "../../components/StatCard/StatCard.jsx";
import SectionTitle from "../../components/SectionTitle/SectionTitle.jsx";

import {
  getComplaints,
  subscribeToPolls
} from "../../firebase/data.js";

import {
  setComplaints
} from "../../redux/slices/complaintsSlice.js";

import {
  setPolls
} from "../../redux/slices/pollsSlice.js";

import "./Dashboard.css";

export default function Dashboard() {
  const dispatch = useDispatch();

  const complaints = useSelector(
    (state) => state.complaints
  );

  const polls = useSelector(
    (state) => state.polls
  );

  useEffect(() => {
    async function loadComplaints() {
      try {
        const data = await getComplaints();

        if (data.length > 0) {
          dispatch(setComplaints(data));
        }
      } catch (error) {
        console.error(
          "Analytics complaints error:",
          error
        );
      }
    }

    loadComplaints();

    const unsubscribe =
      subscribeToPolls((data) => {
        if (data.length > 0) {
          dispatch(setPolls(data));
        }
      });

    return () => unsubscribe();
  }, [dispatch]);

  const pending = complaints.filter(
    (item) => item.status === "Under Review"
  ).length;

  const actionTaken = complaints.filter(
    (item) => item.status === "Action Taken"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const issues = {};

  complaints.forEach((complaint) => {
    issues[complaint.type] =
      (issues[complaint.type] || 0) + 1;
  });

  const top =
    Object.entries(issues).sort(
      (a, b) => b[1] - a[1]
    )[0];

  const totalVotes = polls.reduce(
    (sum, poll) => sum + (poll.total || 0),
    0
  );

  const mostVotedPoll = [...polls]
    .sort(
      (a, b) => (b.total || 0) - (a.total || 0)
    )[0];

  return (
    <div>
      <div className="admin-banner">
        <div>
          <span>MESS COMMITTEE</span>

          <h2>
            Keep the system transparent.
          </h2>

          <p>
            Review evidence, update complaint status,
            manage meals and publish fair polls.
          </p>
        </div>

        <div>🛡️</div>
      </div>

      <div className="admin-stats">
        <StatCard
          icon={<ShieldAlert />}
          label="Total complaints"
          value={complaints.length}
          note="All reported issues"
          tone="red"
        />

        <StatCard
          icon={<Vote />}
          label="Active polls"
          value={polls.length}
          note={`${totalVotes} total votes`}
          tone="purple"
        />

        <StatCard
          icon={<CheckCircle />}
          label="Resolved"
          value={resolved}
          note={`${actionTaken} action taken`}
          tone="green"
        />

        <StatCard
          icon={<Utensils />}
          label="Pending review"
          value={pending}
          note="Needs action"
          tone="yellow"
        />
      </div>

      <div className="admin-grid">
        <section className="card admin-card">
          <SectionTitle
            title="Issue breakdown"
            subtitle="Current food safety categories"
          />

          {Object.entries(issues).map(
            ([type, count]) => (
              <div className="bar-row" key={type}>
                <div>
                  <span>{type}</span>
                  <b>{count}</b>
                </div>

                <i>
                  <em
                    style={{
                      width: `${
                        complaints.length
                          ? (count /
                              complaints.length) *
                            100
                          : 0
                      }%`
                    }}
                  />
                </i>
              </div>
            )
          )}

          {complaints.length === 0 && (
            <p className="muted">
              No complaint data available.
            </p>
          )}
        </section>

        <section className="card admin-card">
          <SectionTitle
            title="Most reported issue"
            subtitle="Based on actual complaints"
          />

          <div className="top-issue">
            <span>⚠️</span>

            <div>
              <b>
                {top?.[0] || "No data"}
              </b>

              <small>
                {top?.[1] || 0} reports
              </small>

              <p>
                Use this data to decide where
                corrective action is needed first.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="admin-grid">
        <section className="card admin-card">
          <SectionTitle
            title="Poll activity"
            subtitle="Real student voting data"
          />

          <div className="top-issue">
            <span>🗳️</span>

            <div>
              <b>
                {mostVotedPoll?.question ||
                  "No polls available"}
              </b>

              <small>
                {mostVotedPoll?.total || 0} votes
              </small>

              <p>
                Total votes across all polls:{" "}
                {totalVotes}
              </p>
            </div>
          </div>
        </section>

        <section className="card admin-card">
          <SectionTitle
            title="Complaint status"
            subtitle="Current workflow"
          />

          <div className="status-summary">
            <div>
              <span>Under Review</span>
              <b>{pending}</b>
            </div>

            <div>
              <span>Action Taken</span>
              <b>{actionTaken}</b>
            </div>

            <div>
              <span>Resolved</span>
              <b>{resolved}</b>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}