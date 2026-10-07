import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  onSnapshot,
  writeBatch
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

import {
  db,
  storage,
  firebaseReady
} from "./firebase.js";

import {
  demoMenu,
  demoPolls
} from "../data/demoData.js";


// =========================
// COMPLAINTS
// =========================

export async function saveComplaint(data) {
  if (!firebaseReady) {
    return {
      id: `MM-DEMO-${Date.now().toString().slice(-4)}`,
      ...data
    };
  }

  const complaintRef = await addDoc(
    collection(db, "complaints"),
    data
  );

  return {
    id: complaintRef.id,
    ...data
  };
}

export async function getComplaints() {
  if (!firebaseReady) return [];

  const snapshot = await getDocs(
    collection(db, "complaints")
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  }));
}

export async function updateComplaint(id, data) {
  if (!firebaseReady) return;

  await updateDoc(
    doc(db, "complaints", id),
    data
  );
}


// =========================
// PHOTO UPLOAD
// =========================

export async function uploadComplaintPhoto(
  file,
  userId
) {
  if (!firebaseReady || !file) return "";

  const fileRef = ref(
    storage,
    `complaint-images/${userId}/${Date.now()}-${file.name}`
  );

  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);
}


// =========================
// MENU
// =========================

export async function saveMenuDay(day, data) {
  if (!firebaseReady) return;

  await setDoc(
    doc(db, "menu", day),
    data,
    {
      merge: true
    }
  );
}

export async function seedMenu() {
  if (!firebaseReady) return;

  const snapshot = await getDocs(
    collection(db, "menu")
  );

  const existingDays = snapshot.docs.map(
    (item) => item.id
  );

  const batch = writeBatch(db);

  demoMenu.forEach((day) => {
    if (!existingDays.includes(day.day)) {
      const dayRef = doc(
        db,
        "menu",
        day.day
      );

      batch.set(dayRef, {
        breakfast: day.breakfast,
        lunch: day.lunch,
        snacks: day.snacks,
        dinner: day.dinner,

        breakfastOptions:
          day.options.breakfast,

        lunchOptions:
          day.options.lunch,

        snacksOptions:
          day.options.snacks,

        dinnerOptions:
          day.options.dinner
      });
    }
  });

  await batch.commit();

  console.log("7-day menu sync complete");
}

export function subscribeToMenu(callback) {
  if (!firebaseReady) {
    return () => {};
  }

  return onSnapshot(
    collection(db, "menu"),
    (snapshot) => {
      const data = snapshot.docs.map(
        (item) => ({
          day: item.id,
          ...item.data()
        })
      );

      callback(data);
    },
    (error) => {
      console.error(
        "Menu listener error:",
        error
      );
    }
  );
}


// =========================
// POLLS
// =========================

export async function seedPolls() {
  if (!firebaseReady) return;

  const batch = writeBatch(db);

  for (const poll of demoPolls) {
    const pollRef = doc(
      db,
      "polls",
      poll.id
    );

    const existing = await getDoc(
      pollRef
    );

    if (!existing.exists()) {
      batch.set(pollRef, {
        ...poll,
        id: poll.id
      });
    }
  }

  await batch.commit();

  console.log("Polls synced");
}

export function subscribeToPolls(callback) {
  if (!firebaseReady) {
    return () => {};
  }

  return onSnapshot(
    collection(db, "polls"),
    (snapshot) => {
      const data = snapshot.docs.map(
        (item) => ({
          ...item.data(),
          id: item.id
        })
      );

      callback(data);
    },
    (error) => {
      console.error(
        "Poll listener error:",
        error
      );
    }
  );
}


// =========================
// USER VOTES
// =========================

// Get one student's vote for one poll
export async function getUserVote(
  pollId,
  userId
) {
  if (!firebaseReady || !userId) {
    return null;
  }

  const voteRef = doc(
    db,
    "users",
    userId,
    "votes",
    pollId
  );

  const snapshot = await getDoc(
    voteRef
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data().option || null;
}


// Get all votes of one student
export async function getUserVotes(
  userId
) {
  if (!firebaseReady || !userId) {
    return {};
  }

  const snapshot = await getDocs(
    collection(
      db,
      "users",
      userId,
      "votes"
    )
  );

  const votes = {};

  snapshot.docs.forEach((item) => {
    votes[item.id] =
      item.data().option;
  });

  return votes;
}


// Save/change student's own vote
export async function saveUserVote(
  pollId,
  option,
  userId
) {
  if (!firebaseReady || !userId) {
    return;
  }

  await setDoc(
    doc(
      db,
      "users",
      userId,
      "votes",
      pollId
    ),
    {
      option,
      updatedAt:
        new Date().toISOString()
    },
    {
      merge: true
    }
  );
}


// =========================
// GLOBAL VOTE COUNTS
// =========================

// Reads all users/*/votes documents
// and calculates counts for each poll.
export function subscribeToAllVoteCounts(
  callback
) {
  if (!firebaseReady) {
    return () => {};
  }

  return onSnapshot(
    collectionGroup(db, "votes"),
    (snapshot) => {
      const result = {};

      snapshot.docs.forEach(
        (item) => {
          const pollId = item.id;
          const option =
            item.data().option;

          if (!result[pollId]) {
            result[pollId] = {
              total: 0,
              counts: {}
            };
          }

          if (option) {
            result[pollId].total += 1;

            result[pollId].counts[option] =
              (result[pollId].counts[
                option
              ] || 0) + 1;
          }
        }
      );

      callback(result);
    },
    (error) => {
      console.error(
        "Global vote count error:",
        error
      );
    }
  );
}


// =========================
// ADMIN POLLS
// =========================

export async function savePoll(data) {
  if (!firebaseReady) {
    return {
      id:
        data.id ||
        `POLL-${Date.now()}`,
      ...data
    };
  }

  const pollId =
    data.id ||
    `POLL-${Date.now()}`;

  await setDoc(
    doc(db, "polls", pollId),
    {
      ...data,
      id: pollId
    },
    {
      merge: true
    }
  );

  return {
    ...data,
    id: pollId
  };
}