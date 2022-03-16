import React, { useContext, useState } from 'react';
import {
  FilterAction,
  FilterObjectCheckbox,
  filterReducer,
  FilterState,
} from '../Reducers/filterReducer';
import { PostObject, postsObjects } from '../utils/dataObjects';
import { LoggingContext } from './LoggingContext';

function getStringOfIds(postsObject: PostObject[]): string {
  return postsObject
    .map((thisObj) => thisObj.postId)
    .sort()
    .toString();
}

export type FilterLabel = 'any' | 'styleTags' | 'updateResults';

interface SearchContextInterface {
  initialFilteredPostsObjects: PostObject[];
  // filteredPostsInternal: PostObject[];
  // setFilteredPostsInternal: React.Dispatch<React.SetStateAction<PostObject[]>>;
  // filteredPosts: PostObject[];
  // setFilteredPosts: React.Dispatch<React.SetStateAction<PostObject[]>>;
  // styleFilterObject: FilterObject;
  // setStyleFilterObject: React.Dispatch<React.SetStateAction<FilterObject>>;
  updateResults: () => void;
  resultsUpToDate: boolean;
  // updateFilterUpdateTimestamps: (filterLabel: FilterLabel) => void;
  filterState: FilterState;
  dispatchFilter: React.Dispatch<FilterAction>;
}

export const SearchContext = React.createContext<SearchContextInterface>(
  {} as SearchContextInterface
);

export default function SearchContextProvider(props: { children: React.ReactNode }) {
  // USECONTEXT
  const { addLog } = useContext(LoggingContext);
  // USESTATE
  const initialFilteredPostsObjects = postsObjects;
  const [filteredPostsInternal, setFilteredPostsInternal] = useState(initialFilteredPostsObjects);
  const [filteredPosts, setFilteredPosts] = useState(initialFilteredPostsObjects);
  const [resultsUpToDate, setResultsUpToDate] = useState(false);

  // Take all of the tag string labels from each post object and create an array of unique, sorted labels for the filter checkboxes
  const reducedUniqueStyles = React.useMemo(
    () =>
      [
        ...new Set(
          initialFilteredPostsObjects.reduce<string[]>((prev, cur) => cur.tags.concat(prev), [])
        ),
      ].sort(),
    []
  );
  const initialStyleFilterObject = React.useMemo(
    () =>
      reducedUniqueStyles.reduce<FilterObjectCheckbox>((prev, cur) => {
        const returnObj = { ...prev };
        returnObj[cur] = { checked: false, disabled: false };
        return returnObj;
      }, {}),
    []
  );

  // Create filter object for users from the array of posts.
  const initialUsersFilterObject = React.useMemo(
    () =>
      [...new Set(initialFilteredPostsObjects.map((thisPost) => thisPost.username))]
        .sort()
        .reduce<FilterObjectCheckbox>((prev, cur) => {
          const returnObj = { ...prev };
          returnObj[cur] = { checked: false, disabled: false };
          return returnObj;
        }, {}),
    []
  );

  // Create filter object for colorSeasons from the array of posts.
  const initialColorSeasonsFilterObject = React.useMemo(
    () =>
      [...new Set(initialFilteredPostsObjects.map((thisPost) => thisPost.season))]
        .sort()
        .reduce<FilterObjectCheckbox>((prev, cur) => {
          const returnObj = { ...prev };
          returnObj[cur] = { checked: false, disabled: false };
          return returnObj;
        }, {}),
    []
  );

  const initialPostsArrayIds = React.useMemo(
    () => initialFilteredPostsObjects.map((x) => x.postId),
    initialFilteredPostsObjects
  );

  const initialReducerState: FilterState = {
    initialArrayOfPosts: initialFilteredPostsObjects,
    internalFilteredPosts: initialFilteredPostsObjects,
    externalFilteredPosts: initialFilteredPostsObjects,
    filterCheckboxObjects: {
      styles: initialStyleFilterObject,
      users: initialUsersFilterObject,
      colorSeasons: initialColorSeasonsFilterObject,
    },
    filterSliderObjects: {
      height: {
        min: 0,
        max: 0,
        disabled: false,
      },
      chest: {
        min: 0,
        max: 0,
        disabled: false,
      },
      waist: {
        min: 0,
        max: 0,
        disabled: false,
      },
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
      styles: new Date().toUTCString(),
      users: new Date().toUTCString(),
      height: new Date().toUTCString(),
      chest: new Date().toUTCString(),
      waist: new Date().toUTCString(),
      colorSeasons: new Date().toUTCString(),
      internalFilteredPosts: new Date().toUTCString(),
      externalFilteredPosts: new Date().toUTCString(),
    },
  };

  const [filterState, dispatchFilter] = React.useReducer(filterReducer, initialReducerState);

  function updateResults(): void {
    addLog('Clicked Update Results Button');
    dispatchFilter({ type: 'update external' });
    // setFilteredPosts(filteredPostsInternal);
  }

  const value = React.useMemo(
    () => ({
      initialFilteredPostsObjects,
      updateResults,
      resultsUpToDate,
      filterState,
      dispatchFilter,
    }),
    [resultsUpToDate, filterState]
  );

  return <SearchContext.Provider value={value} {...props} />;
}
