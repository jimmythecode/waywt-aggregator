import { FilterObjectCheckbox } from '../Reducers/filterReducer';
import { PostObject } from '../utils/dataObjects';

// Take all of the tag string labels from each post object and create an array of unique, sorted labels for the filter checkboxes
export function reducedUniqueStyles(fetchedPosts: PostObject[]): string[] {
  if (fetchedPosts.length === 0) return [];
  return [
    ...new Set(
      fetchedPosts.reduce<string[]>((prev, cur) => {
        if (cur.tags === undefined) return prev;
        return cur.tags.concat(prev);
      }, [])
    ),
  ].sort();
}

export function getInitialStyleFilterObject(reducedUniqueStylesParam: string[]): FilterObjectCheckbox {
  return reducedUniqueStylesParam.reduce<FilterObjectCheckbox>((prev, cur) => {
    const returnObj = { ...prev };
    returnObj[cur] = { checked: false, disabled: false };
    return returnObj;
  }, {});
}

// Create filter object for users from the array of posts.
export function getInitialUsersFilterObject(fetchedPosts: PostObject[]): FilterObjectCheckbox {
  return [...new Set(fetchedPosts.map((thisPost) => thisPost.author))]
    .sort()
    .reduce<FilterObjectCheckbox>((prev, cur) => {
      const returnObj = { ...prev };
      returnObj[cur] = { checked: false, disabled: false };
      return returnObj;
    }, {});
}

// Create filter object for colorSeasons from the array of posts.
export function getInitialColorSeasonsFilterObject(fetchedPosts: PostObject[]): FilterObjectCheckbox {
  return [...new Set(fetchedPosts.map((thisPost) => thisPost.season))]
    .sort()
    .reduce<FilterObjectCheckbox>((prev, cur) => {
      if (cur === undefined) return prev;
      const returnObj = { ...prev };
      returnObj[cur] = { checked: false, disabled: false };
      return returnObj;
    }, {});
}

export function getInitialPostsArrayIds(fetchedPosts: PostObject[]): string[] {
  return fetchedPosts.map((x) => x.commentId);
};