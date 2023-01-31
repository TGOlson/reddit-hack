import snoowrap from 'snoowrap';

import {loadCredentials, loadState, persistState} from './setup';
import { shouldDelete } from './should-delete';

async function makeSnoowrap(): Promise<snoowrap> {
  const {username, password, clientId, clientSecret} = await loadCredentials();
  const userAgent = `User-Agent: mac:localscript.account-cleanup:v0.0.0 (by /u/${username})`;

  const r = new snoowrap({
    userAgent,
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
