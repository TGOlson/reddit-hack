import snoowrap from 'snoowrap';

import {loadCredentials, loadState, persistState} from './setup';

async function makeSnoowrap(): Promise<snoowrap> {
  const {username, password, clientId, clientSecret} = await loadCredentials();
  
  const r = new snoowrap({
    userAgent: USER_AGENT,
    username,
    password,
    clientId,
    clientSecret,
  });

  r.config({
    requestDelay: 1000,
    debug: true,
  });

  return r;
}

const shouldDelete = (comment: snoowrap.Comment): boolean => {
  // const created = new Date(comment.created * 1000);
  const sub = comment.subreddit_name_prefixed;
    
  // // TODO: filter subs
  // const releventSubs = ['r/nba', 'r/fantasyfootball', 'r/surfing'];
  // if (!releventSubs.includes(comment.subreddit_name_prefixed)) {
  //   console.log('Found comment in irrelevant sub:', comment.subreddit_name_prefixed);
  // }

  // keep all gilded, inspect these later
  if (comment.gilded) return false;

  // keep high scoring comments, inspect these later
  if (comment.score > 100) return false;
  if (comment.score > 20 && sub === 'r/surfing') return false;

  // delete anything older than 2020
  // if (created.getFullYear() < 2020) return true;

  return true;
}

const USER_AGENT = 'User-Agent: mac:localscript.account-cleanup:v0.0.0 (by /u/tdotgdot)';

async function main(): Promise<void> {
  const r = await makeSnoowrap();
  const state = await loadState();

  console.log('Using state:', state);
  
  const limit = 500;
  const baseConfig = {limit, t: 'all', sort: 'top'};
  const config = state.lastId ? {...baseConfig, after: `t1_${state.lastId}`} : baseConfig;
  const comments = await r.getUser(r.username).getComments(config);

  console.log('found num comments:', comments.length)

  for (const comment of comments) {
    const del = shouldDelete(comment);

    if (del) {
      console.log('Deleting comment', comment.id, comment.permalink);

      // @ts-ignore (ignore incorrect typing from library, functionality still works correctly)
      await comment.delete().catch(err => {
        console.log('Caught error, exiting...', err);
        throw new Error(err);
      });

      state.deleted += 1;
      persistState(state);
    } else {
      // only save last id for items we are keeping
      // otherwise it will reference a deleted comment
      console.log('Keeping comment', comment.id, comment.permalink);
  
      state.lastId = comment.id;
      state.kept += 1;

      persistState(state);
    }    
  }
}

main().catch(err => console.log('Error running main', err));
