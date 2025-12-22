import { ref, get, child } from 'firebase/database';
import { rtdb } from '../firebase';

// Fetch all questions from Realtime Database, sorted by numeric id
export async function fetchQuestions() {
  const rootRef = ref(rtdb);
  const snapshot = await get(child(rootRef, 'questions'));
  if (!snapshot.exists()) return [];

  const value = snapshot.val();
  const list = Object.values(value || {});
  return list.sort((a, b) => (a.id || 0) - (b.id || 0));
}

// Fetch a single question by id (number or string)
export async function fetchQuestionById(id) {
  const rootRef = ref(rtdb);
  const snapshot = await get(child(rootRef, `questions/${id}`));
  return snapshot.exists() ? snapshot.val() : null;
}
