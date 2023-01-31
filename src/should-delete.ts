import snoowrap from 'snoowrap';

// ***
// Edit this to decide which comments to keep
// ***
export const shouldDelete = (comment: snoowrap.Comment): boolean => {
  // const created = new Date(comment.created * 1000);
  const sub = comment.subreddit_name_prefixed;

  // keep all gilded, inspect these later
  if (comment.gilded) return false;

  // keep high scoring comments, inspect these later
  if (comment.score > 100) return false;
  if (comment.score > 20 && sub === 'r/surfing') return false;

  // delete anything older than 2020
  // if (created.getFullYear() < 2020) return true;

  return true;
}
