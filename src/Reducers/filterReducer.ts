import { PostObject } from '../utils/dataObjects';
import { logAdminExternal } from '../utils/logging';

export type FilterTypeLabelsCheckbox = 'styles' | 'users' | 'colorSeasons';
export type FilterTypeLabelsSlider = 'height' | 'chest' | 'waist';
export type FilterObjectCheckbox = Record<string, { checked: boolean; disabled: boolean }>;
export interface FilterObjectSlider {
  min: number;
  max: number;
  disabled: boolean;
}

export type TimestampsObject = Record<
  | FilterTypeLabelsCheckbox
  | FilterTypeLabelsSlider
  | 'internalFilteredPosts'
  | 'externalFilteredPosts'
  | 'initialFilteredPosts',
  string
>;

type PostIdArrays = Record<FilterTypeLabelsCheckbox | FilterTypeLabelsSlider, string[]>;

export interface FilterState {
  initialArrayOfPosts: PostObject[];
  internalFilteredPosts: PostObject[];
  filterCheckboxObjects: Record<FilterTypeLabelsCheckbox, FilterObjectCheckbox>;
  filterSliderObjects: Record<FilterTypeLabelsSlider, FilterObjectSlider>;
  externalFilteredPosts: PostObject[];
  postIdArrays: PostIdArrays;
  timestamps: TimestampsObject;
}

export interface FilterActionCheckboxBase {
  filterLabel: FilterTypeLabelsCheckbox;
  checked: boolean;
}

export interface FilterActionCheckboxAll extends FilterActionCheckboxBase {
  type: 'click select all checkbox';
}

export interface FilterActionCheckboxSingle extends FilterActionCheckboxBase {
  type: 'click single checkbox';
  checkboxLabel: string;
}

export interface FilterActionSlider {
  type: 'update slider';
  filterLabel: FilterTypeLabelsSlider;
  min: number;
  max: number;
}

export interface FilterActionDisableSlider {
  type: 'disable slider';
  filterLabel: FilterTypeLabelsSlider;
}

export type FilterAction =
  | FilterActionCheckboxAll
  | FilterActionCheckboxSingle
  | FilterActionSlider
  | FilterActionDisableSlider
  | { type: 'update external' }
  | { type: 'update from fetch request'; newArray: PostObject[] };

export function filterByOtherMemoisedIds(
  initialFilteredPosts: PostObject[],
  arraysOfPostIds: PostIdArrays,
  thisLabel: FilterTypeLabelsCheckbox | FilterTypeLabelsSlider
): PostObject[] {
  let returnArray = [...initialFilteredPosts];
  // Filter down initialArrayOfPostsIds by the memoised arrays of post IDs
  // Ignore the current label and any arrays that are the same length as the initial array (since they don't have any filters applied). Also ignore any filter than has no values (length === 0), as this could be checkboxes with nothing clicked.
  const arraysOfArraysToIterate = Object.keys(arraysOfPostIds).reduce<string[][]>(
    (acc, curFilterLabel) => {
      if (curFilterLabel === thisLabel) return acc;
      const thisArray = arraysOfPostIds[curFilterLabel as FilterTypeLabelsCheckbox];
      if (thisArray.length === initialFilteredPosts.length || thisArray.length === 0) return acc;
      acc.push(thisArray);
      return acc;
    },
    [] as string[][]
  );

  // Order arrays by smallest first. Then filter initialArrayOfPostIds against each one.
  if (arraysOfArraysToIterate.length > 0) {
    arraysOfArraysToIterate
      .sort((a, b) => a.length - b.length)
      .forEach((thisArray) => {
        returnArray = returnArray.filter((thisPost) => thisArray.includes(thisPost.commentId));
      });
  }
  return returnArray;
}

export const emptyFilterState: FilterState = {
  initialArrayOfPosts: [],
  internalFilteredPosts: [],
  externalFilteredPosts: [],
  filterCheckboxObjects: {
    styles: {},
    users: {},
    colorSeasons: {},
  },
  filterSliderObjects: {
    height: {
      min: 140,
      max: 240,
      disabled: false,
    },
    chest: {
      min: 40,
      max: 160,
      disabled: false,
    },
    waist: {
      min: 40,
      max: 160,
      disabled: false,
    },
  },
  postIdArrays: {
    styles: [],
    users: [],
    height: [],
    chest: [],
    waist: [],
    colorSeasons: [],
  },
  timestamps: {
    styles: new Date().toUTCString(),
    users: new Date().toUTCString(),
    height: new Date().toUTCString(),
    chest: new Date().toUTCString(),
    waist: new Date().toUTCString(),
    colorSeasons: new Date().toUTCString(),
    internalFilteredPosts: new Date().toUTCString(),
    externalFilteredPosts: new Date().toUTCString(),
    initialFilteredPosts: new Date().toUTCString(),
  },
};

export function getInitialReducerState({
  fetchedPosts,
  initialStyleFilterObject,
  initialUsersFilterObject,
  initialColorSeasonsFilterObject,
  initialPostsArrayIds,
}: {
  fetchedPosts: PostObject[];
  initialStyleFilterObject: FilterObjectCheckbox;
  initialUsersFilterObject: FilterObjectCheckbox;
  initialColorSeasonsFilterObject: FilterObjectCheckbox;
  initialPostsArrayIds: string[];
}): FilterState {
  return {
    ...emptyFilterState,
    initialArrayOfPosts: fetchedPosts,
    internalFilteredPosts: fetchedPosts,
    externalFilteredPosts: fetchedPosts,
    filterCheckboxObjects: {
      styles: initialStyleFilterObject,
      users: initialUsersFilterObject,
      colorSeasons: initialColorSeasonsFilterObject,
    },
    postIdArrays: {
      styles: initialPostsArrayIds,
      users: initialPostsArrayIds,
      height: initialPostsArrayIds,
      chest: initialPostsArrayIds,
      waist: initialPostsArrayIds,
      colorSeasons: initialPostsArrayIds,
    },
    timestamps: {
      styles: new Date().toISOString(),
      users: new Date().toISOString(),
      height: new Date().toISOString(),
      chest: new Date().toISOString(),
      waist: new Date().toISOString(),
      colorSeasons: new Date().toISOString(),
      internalFilteredPosts: new Date().toISOString(),
      externalFilteredPosts: new Date().toISOString(),
      initialFilteredPosts: new Date().toISOString(),
    },
  };
}

export function filterReducer(state: FilterState, action: FilterAction) {
  const returnState = { ...state };
  const currentTimestamp = new Date().toISOString();
  switch (action.type) {
    case 'update from fetch request': {
      returnState.initialArrayOfPosts = action.newArray;
      returnState.internalFilteredPosts = action.newArray;
      returnState.externalFilteredPosts = action.newArray;
      returnState.timestamps.initialFilteredPosts = currentTimestamp;
      returnState.timestamps.internalFilteredPosts = currentTimestamp;
      returnState.timestamps.externalFilteredPosts = currentTimestamp;
      break;
    }
    case 'click select all checkbox': {
      // Will need to update: timestamps, internalFilterObject, postIdArrays, internalFilteredPosts
      // Update timestamp for memo comparisons
      returnState.timestamps[action.filterLabel] = currentTimestamp;
      returnState.timestamps.internalFilteredPosts = currentTimestamp;
      // Update filterObjects to update inputs (checkboxes, sliders, etc)
      // Iterate through all unique labels and check/uncheck all boxes depending on whether 'select all' checkbox is checked.
      Object.keys(returnState.filterCheckboxObjects[action.filterLabel]).forEach((thisLabel) => {
        returnState.filterCheckboxObjects[action.filterLabel][thisLabel].checked = action.checked;
      });
      // Get filtered array of Id's from memoised other filters.
      const arrayOfPostObjectsFromOtherFilters = filterByOtherMemoisedIds(
        returnState.initialArrayOfPosts,
        returnState.postIdArrays,
        action.filterLabel
      );
      const arrayOfPostIdsFromOtherFilters = arrayOfPostObjectsFromOtherFilters.map(
        (x) => x.commentId
      );
      // Update internal postIdArrays and internalFilteredPosts
      if (action.checked === false) {
        // if all unchecked then no filter applied (it's a bit unintuitive but makes more sense with text input filter).
        returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts.map(
          (x) => x.commentId
        );
        // internalFilteredPosts will be initialArrayOfPosts filtered by the other memoised postIdArrays.
        returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters;
      } else if (action.checked === true) {
        // Update internal postIdArrays and internalFilteredPosts if all checkboxes are checked.
        if (action.filterLabel === 'users' || action.filterLabel === 'colorSeasons') {
          // There will be a username associated with all posts. So since we've selected all checkboxes, the postIdArrays will be all values
          returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts.map(
            (x) => x.commentId
          );
          // internalFilteredPosts will not need filtering any further since we aren't filtereing any values.
          returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters;
        }
        // Update interal postIdArray if checkboxes all true. So most of the initial posts array will be included.
        // This is probably going to be a different function for styles than for users, so if() it.
        if (action.filterLabel === 'styles') {
          returnState.postIdArrays[action.filterLabel] = [];
          returnState.internalFilteredPosts = [];
          returnState.initialArrayOfPosts.forEach((thisPost) => {
            // If any of the tags array of this PostObject include any of the checked labels (ie all of them), then make the array from that.
            if (thisPost.tags !== undefined && thisPost.tags.length > 0) {
              returnState.postIdArrays[action.filterLabel].push(thisPost.commentId);
              // Update internal filtered posts. If this post object contains style tag in the checkbox labels, then concat this object to internalfilterposts if its postId is included in the array of posts from other filters.
              if (arrayOfPostIdsFromOtherFilters.includes(thisPost.commentId)) {
                returnState.internalFilteredPosts.push(thisPost);
              }
            }
          }); // forEach block
        }
      }
      break;
    }
    case 'click single checkbox': {
      // Will need to update: timestamps, internalFilterObject, postIdArrays, internalFilteredPosts
      // Update timestamp for memo comparisons
      returnState.timestamps[action.filterLabel] = currentTimestamp;
      returnState.timestamps.internalFilteredPosts = currentTimestamp;
      // Update filterObjects to update inputs (checkboxes, sliders, etc)
      Object.keys(returnState.filterCheckboxObjects[action.filterLabel]);
      returnState.filterCheckboxObjects[action.filterLabel][action.checkboxLabel].checked =
        action.checked;
      // Update postIdArrays.
      if (action.filterLabel === 'styles') {
        // Filter only posts that include a style tag that has .checked === true
        returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts
          .filter((thisPostObj) => {
            // I think if the comment tags are undefined, then filter out this comment
            if (thisPostObj.tags === undefined) return false;
            return thisPostObj.tags.some(
              (thisTagLabel) =>
                returnState.filterCheckboxObjects[action.filterLabel][thisTagLabel].checked
            );
          })
          .map((x) => x.commentId); // This would probably be better iterating once in a reduce function.
      }
      if (action.filterLabel === 'users' || action.filterLabel === 'colorSeasons') {
        // Filter only posts where user has .checked === true
        returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts
          .filter((thisPostObj) => {
            if (action.filterLabel === 'users')
              return returnState.filterCheckboxObjects[action.filterLabel][thisPostObj.author]
                .checked;
            if (action.filterLabel === 'colorSeasons') {
              // if this post is undefined then filter out the post.
              if (thisPostObj.season === undefined) return false;
              // return post if .checked is true
              return returnState.filterCheckboxObjects[action.filterLabel][thisPostObj.season]
                .checked;
            }
            throw new Error(
              'error trying to filter returnState.initialArrayOfPosts.filter(thisPostObj...'
            );
          })
          .map((x) => x.commentId); // This would probably be better iterating once in a reduce function.
      }
      // Update internalFilteredPosts
      // Get filtered array from memoised postId arrays
      const arrayOfPostObjectsFromOtherFilters = filterByOtherMemoisedIds(
        returnState.initialArrayOfPosts,
        returnState.postIdArrays,
        action.filterLabel
      );
      if (action.filterLabel === 'styles') {
        returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters.filter(
          (thisPostObj) => {
            // Filter only posts where the updated postIdArray is included
            if (thisPostObj.tags === undefined) return false;
            return thisPostObj.tags.some(
              (thisTagLabel) =>
                returnState.filterCheckboxObjects[action.filterLabel][thisTagLabel].checked
            );
          }
        );
      }
      if (action.filterLabel === 'users' || action.filterLabel === 'colorSeasons') {
        returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters.filter(
          (thisPostObj) => {
            // Filter only posts where the updated postIdArray is included
            if (action.filterLabel === 'users')
              return returnState.filterCheckboxObjects[action.filterLabel][thisPostObj.author]
                .checked;
            if (action.filterLabel === 'colorSeasons') {
              if (thisPostObj.season === undefined) return false;
              return returnState.filterCheckboxObjects[action.filterLabel][thisPostObj.season]
                .checked;
            }
            throw new Error(
              'error trying to filter returnState.initialArrayOfPosts.filter(thisPostObj...'
            );
          }
        );
      }
      break;
    }
    case 'update slider': {
      // Will need to update: timestamps, internalFilterObject, postIdArrays, internalFilteredPosts
      // Update timestamp for memo comparisons
      returnState.timestamps[action.filterLabel] = currentTimestamp;
      // Update filterObjects to update inputs (checkboxes, sliders, etc)
      returnState.filterSliderObjects[action.filterLabel] = {
        ...returnState.filterSliderObjects[action.filterLabel],
        min: action.min,
        max: action.max,
        disabled: false,
      };
      // Update postIdArray
      returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts
        .filter(
          (thisPostObj) =>
            thisPostObj[action.filterLabel] >= action.min &&
            thisPostObj[action.filterLabel] <= action.max
        )
        .map((x) => x.commentId);
      // Update internalFilteredPosts
      const arrayOfPostObjectsFromOtherFilters = filterByOtherMemoisedIds(
        returnState.initialArrayOfPosts,
        returnState.postIdArrays,
        action.filterLabel
      );
      returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters.filter(
        (thisObjFromOtherFilters) =>
          returnState.postIdArrays[action.filterLabel].includes(thisObjFromOtherFilters.commentId)
      );
      break;
    }
    case 'disable slider': {
      // Will need to update: timestamps, internalFilterObject, postIdArrays, internalFilteredPosts
      // Update timestamp for memo comparisons
      returnState.timestamps[action.filterLabel] = currentTimestamp;
      returnState.timestamps.internalFilteredPosts = currentTimestamp;
      // Update filterObjects to update inputs (checkboxes, sliders, etc)
      returnState.filterSliderObjects[action.filterLabel] = {
        ...returnState.filterSliderObjects[action.filterLabel],
        disabled: true,
      };
      // Update postIdArray
      returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts.map(
        (x) => x.commentId
      );
      // Update internalFilteredPosts
      const arrayOfPostObjectsFromOtherFilters = filterByOtherMemoisedIds(
        returnState.initialArrayOfPosts,
        returnState.postIdArrays,
        action.filterLabel
      );

      returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters;
      break;
    }
    case 'update external': {
      returnState.timestamps.externalFilteredPosts = currentTimestamp;
      returnState.externalFilteredPosts = returnState.internalFilteredPosts;
      break;
    }
    default:
      logAdminExternal({
        status: 'filterReducer returning default value',
      });
      return state;
  }
  return returnState;
}
