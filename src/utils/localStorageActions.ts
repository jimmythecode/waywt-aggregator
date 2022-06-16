import { Timestamps } from '../Context/GlobalContext';
import { PostObject } from './dataObjects';

const emptyTimestampsObject: Timestamps = {
  fetchPosts: null,
};

export function getTimestampsFromLocalStorage(): Timestamps {
  return JSON.parse(
    localStorage.getItem('timestamps') || JSON.stringify(emptyTimestampsObject)
  ) as Timestamps;
}

export function getPostsArrayFromLocalStorage(): PostObject[] {
  return JSON.parse(localStorage.getItem('postsArray') || JSON.stringify([])) as PostObject[];
}

export function setPostsArrayFromLocalStorage(postsArray: PostObject[]): void {
  localStorage.setItem('postsArray', JSON.stringify(postsArray));
}
