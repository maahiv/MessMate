import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPoll } from "../../redux/slices/pollsSlice.js";
import {
  savePoll,
  subscribeToAllVoteCounts,
  subscribeToPolls,
} from "../../firebase/data.js";
import SectionTitle from "../../components/SectionTitle/SectionTitle.jsx";
import "./PollManagement.css";

export default function PollManagement() {
  const polls = useSelector((state) => state.polls);
  const dispatch = useDispatch();

  const [q, setQ] = useState("");
  const [opts, setOpts] = useState([
    "Chole Bhature",
    "Veg Biryani",
    "Paneer Rice",
  ]);

  const [voteStats, setVoteStats] = useState({});

  // Live poll data
  useEffect(() => {
    const unsubscribePolls = subscribeToPolls(() => {});

    const unsubscribeVotes = subscribeToAllVoteCounts((data) => {
      setVoteStats(data);
    });

    return () => {
      if (unsubscribePolls) unsubscribePolls();
      if (unsubscribeVotes) unsubscribeVotes();
    };
  }, []);

  async function create() {
    if (!q.trim()) return;

    const poll = {
      id: `P-${Date.now()}`,
      question: q,
      ends: "7 days left",
      total: 0,
      options: opts.map((name) => ({
        name,
        votes: 0,
      })),
    };

    dispatch(addPoll(poll));
    await savePoll(poll);

    setQ("");
  }

  function getPollResult(poll) {
    const stats = voteStats[poll.id] || {
      total: 0,
      counts: {},
    };

    const totalVotes = stats.total;

    const results = poll.options.map((option) => {
      const votes = stats.counts[option.name] || 0;

      const percentage =
        totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

      return {
        name: option.name,
        votes,
        percentage,
      };
    });

    const maxVotes =
      results.length > 0
        ? Math.max(...results.map((item) => item.votes))
        : 0;

    const winners =
      maxVotes > 0
        ? results.filter((item) => item.votes === maxVotes)
        : [];

    return {
      totalVotes,
      results,
      winners,
    };
  }

  return (
    <div>
      <SectionTitle
        title="Poll Management"
        subtitle="Create fair, time-bound food choices for students."
      />

      <section className="card create-poll">
        <h3>Create a new menu poll</h3>

        <label>
          Question
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Which item should replace Friday lunch?"
          />
        </label>

        <div className="poll-inputs">
          {opts.map((x, i) => (
            <label key={i}>
              Option {i + 1}
              <input
                value={x}
                onChange={(e) =>
                  setOpts(
                    opts.map((a, j) =>
                      j === i ? e.target.value : a
                    )
                  )
                }
              />
            </label>
          ))}
        </div>

        <button className="primary-btn" onClick={create}>
          Create Poll
        </button>
      </section>

      <div className="admin-polls">
        {polls.map((p) => {
          const { totalVotes, results, winners } = getPollResult(p);

          return (
            <article className="card admin-poll" key={p.id}>
              <div>
                <span>🗳️ Active Poll</span>

                <h3>{p.question}</h3>

                <small>
                  {totalVotes} votes · {p.ends}
                </small>
              </div>

              <div>
                {results.map((o) => (
                  <div className="result-row" key={o.name}>
                    <span>{o.name}</span>

                    <b>
                      {o.votes} votes · {o.percentage}%
                    </b>
                  </div>
                ))}

                {winners.length === 1 && (
                  <div className="current-vote">
                    🏆 Most Voted: <b>{winners[0].name}</b>
                  </div>
                )}

                {winners.length > 1 && (
                  <div className="current-vote">
                    🤝 Tie:{" "}
                    <b>
                      {winners.map((item) => item.name).join(" & ")}
                    </b>
                  </div>
                )}

                {totalVotes === 0 && (
                  <div className="current-vote">
                    No votes yet
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}