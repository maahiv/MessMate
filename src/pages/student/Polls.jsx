import React, {
  useEffect,
  useState
} from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  setPolls
} from "../../redux/slices/pollsSlice.js";

import {
  subscribeToPolls,
  getUserVote,
  saveUserVote,
  subscribeToAllVoteCounts
} from "../../firebase/data.js";

import {
  useAuth
} from "../../context/AuthContext.jsx";

import SectionTitle from "../../components/SectionTitle/SectionTitle.jsx";

import "./Polls.css";

export default function Polls() {
  const polls = useSelector(
    (state) => state.polls
  );

  const dispatch = useDispatch();

  const { user } = useAuth();

  const [voted, setVoted] = useState({});
  const [voteStats, setVoteStats] =
    useState({});


  // =========================
  // REAL-TIME POLLS
  // =========================

  useEffect(() => {
    const unsubscribe =
      subscribeToPolls((data) => {
        if (data.length > 0) {
          dispatch(setPolls(data));
        }
      });

    return () => unsubscribe();
  }, [dispatch]);


  // =========================
  // LOAD USER'S VOTES
  // =========================

  useEffect(() => {
    if (
      !user?.uid ||
      polls.length === 0
    ) {
      return;
    }

    let cancelled = false;

    async function loadVotes() {
      const result = {};

      for (const poll of polls) {
        const option =
          await getUserVote(
            poll.id,
            user.uid
          );

        if (option) {
          result[poll.id] =
            option;
        }
      }

      if (!cancelled) {
        setVoted(result);
      }
    }

    loadVotes();

    return () => {
      cancelled = true;
    };
  }, [polls, user]);


  // =========================
  // REAL-TIME VOTE COUNTS
  // =========================

  useEffect(() => {
    const unsubscribe =
      subscribeToAllVoteCounts(
        (data) => {
          setVoteStats(data);
        }
      );

    return () => unsubscribe();
  }, []);


  // =========================
  // SAVE / CHANGE VOTE
  // =========================

  async function choose(
    pollId,
    option
  ) {
    if (!user?.uid) {
      return;
    }

    const previousOption =
      voted[pollId] || null;

    if (previousOption === option) {
      return;
    }

    try {
      await saveUserVote(
        pollId,
        option,
        user.uid
      );

      setVoted((prev) => ({
        ...prev,
        [pollId]: option
      }));
    } catch (error) {
      console.error(
        "Vote failed:",
        error
      );

      alert(
        "Vote could not be saved. Please try again."
      );
    }
  }


  return (
    <div>
      <SectionTitle
        title="Food Polls"
        subtitle="You can change your vote anytime before the poll closes."
      />

      <div className="poll-grid">

        {polls.map((poll) => {

          const stats =
            voteStats[poll.id] || {
              total: 0,
              counts: {}
            };

          const maxVotes =
            Math.max(
              ...poll.options.map(
                (option) =>
                  stats.counts[
                    option.name
                  ] || 0
              ),
              1
            );

          return (
            <article
              className="card big-poll"
              key={poll.id}
            >

              <div className="poll-top">
                <span>🗳️</span>

                <small>
                  {poll.ends}
                </small>
              </div>


              <h3>
                {poll.question}
              </h3>


              {poll.options.map(
                (option) => {

                  const count =
                    stats.counts[
                      option.name
                    ] || 0;

                  const percentage =
                    stats.total > 0
                      ? Math.round(
                          (count /
                            stats.total) *
                            100
                        )
                      : 0;

                  return (
                    <button
                      key={option.name}
                      className={`poll-option ${
                        voted[poll.id] ===
                        option.name
                          ? "chosen"
                          : ""
                      }`}
                      onClick={() =>
                        choose(
                          poll.id,
                          option.name
                        )
                      }
                    >

                      <i
                        style={{
                          width:
                            `${
                              count > 0
                                ? Math.max(
                                    percentage,
                                    8
                                  )
                                : 0
                            }%`
                        }}
                      />

                      <span>
                        {option.name}
                      </span>

                      <b>
                        {percentage}%
                      </b>

                    </button>
                  );
                }
              )}


              <p>
                {stats.total} student votes
              </p>


              {voted[poll.id] && (
                <div className="current-vote">

                  ✓ Your current vote:{" "}

                  <strong>
                    {voted[poll.id]}
                  </strong>

                  <br />

                  <small>
                    Click another option to
                    change your vote.
                  </small>

                </div>
              )}

            </article>
          );
        })}

      </div>
    </div>
  );
}