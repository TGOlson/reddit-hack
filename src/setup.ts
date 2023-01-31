import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export type Credentials = {
  username: string,
  password: string,
  clientId: string,
  clientSecret: string,
}

export type State = {
  lastId: string | null,
  kept: number,
  deleted: number,
}

const STATE_PATH = path.resolve(__dirname, '../state.json'); 
const EMPTY_STATE = {lastId: null, kept: 0, deleted: 0};

async function readJSON<T> (p: string): Promise<T> {
  const res = await readFile(p, 'utf8');
  return JSON.parse(res) as T;
}

export async function loadCredentials(): Promise<Credentials> {
  return readJSON(path.resolve(__dirname, '../.env.json'));
}

export async function loadState(): Promise<State> {
  const read: Promise<State> = readJSON(STATE_PATH);
  
  return read.catch(() => {
    console.log('No state file found, returning empty state');
    return EMPTY_STATE;
  });
}

export async function persistState(state: State): Promise<void> {
  return writeFile(STATE_PATH, JSON.stringify(state));
}
