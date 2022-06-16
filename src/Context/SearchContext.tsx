import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FilterAction,
  filterReducer,
  FilterState,
  getInitialReducerState,
} from '../Reducers/filterReducer';
import { PostObject } from '../utils/dataObjects';
import { fetchGetBackEnd } from '../utils/fetchRequests';
import {
  getPostsArrayFromLocalStorage,
  setPostsArrayFromLocalStorage,
} from '../utils/localStorageActions';
import { getSecondsDifference } from '../utils/timeFunctions';
import { GlobalContext } from './GlobalContext';
import { LoggingContext } from './LoggingContext/LoggingContext';
import {
  getInitialColorSeasonsFilterObject,
  getInitialPostsArrayIds,
  getInitialStyleFilterObject,
  getInitialUsersFilterObject,
  reducedUniqueStyles,
} from './searchContextFunctions';

export type FilterLabel = 'any' | 'styleTags' | 'updateResults';

interface SearchContextInterface {
  fetchedPosts: PostObject[];
  updateResults: () => void;
  filterState: FilterState;
  dispatchFilter: React.Dispatch<FilterAction>;
}

export const SearchContext = React.createContext<SearchContextInterface>(
  {} as SearchContextInterface
);

export default function SearchContextProvider(props: { children: React.ReactNode }) {
  const { enqueueSnackbar } = useSnackbar();
  // USECONTEXT
  const { addLog } = useContext(LoggingContext);
  const { timestamps, setTimestamps } = useContext(GlobalContext);
  // USESTATE
  const [fetchedPosts, setFetchedPosts] = useState<PostObject[]>(getPostsArrayFromLocalStorage());
  const [filterState, dispatchFilter] = React.useReducer(
    filterReducer,
    {
      fetchedPosts,
      initialColorSeasonsFilterObject: getInitialColorSeasonsFilterObject(fetchedPosts),
      initialPostsArrayIds: getInitialPostsArrayIds(fetchedPosts),
      initialStyleFilterObject: getInitialStyleFilterObject(reducedUniqueStyles(fetchedPosts)),
      initialUsersFilterObject: getInitialUsersFilterObject(fetchedPosts),
    },
    getInitialReducerState
  );
  const { filterMobileOpen, setFilterMobileOpen } = React.useContext(GlobalContext);
  const location = useLocation();

  // On Page load, fetch posts from back end.
  useEffect(() => {
    // Only fetch if there are no posts, or we haven't fetched in the last 10 mins.
    console.log({
      length: fetchedPosts.length === 0,
      timestamps: timestamps.fetchPosts === null,
      getSecondsDifference:
        timestamps.fetchPosts === null
          ? "cn't perform"
          : getSecondsDifference(timestamps.fetchPosts, new Date().toUTCString()) / 60 / 10 > 10,
    });

    if (
      fetchedPosts.length === 0 ||
      timestamps.fetchPosts === null ||
      getSecondsDifference(timestamps.fetchPosts, new Date().toUTCString()) / 60 / 10 > 10
    ) {
      fetchGetBackEnd('/posts')
        .then((response) => {
          if (response.status < 200 || response.status > 299) {
            enqueueSnackbar(
              `Response status ${response.status} when trying to retrieve WAYWT posts`,
              { variant: 'error' }
            );
            return { success: false };
          }
          return response.json();
        })
        .then((parsed) => {
          if (parsed.success === false) return;
          setFetchedPosts(parsed.waywtComments);
          setPostsArrayFromLocalStorage(parsed.waywtComments);
          setTimestamps((prev) => ({ ...prev, fetchPosts: new Date().toUTCString() }));
          dispatchFilter({ type: 'update from fetch request', newArray: parsed.waywtComments });
          enqueueSnackbar(`Latest posts have been updated from the database`, {
            variant: 'success',
          });
        });
    }
  }, []);

  function updateResults(): void {
    addLog('Clicked Update Results Button', location.pathname);
    dispatchFilter({ type: 'update external' });
    if (filterMobileOpen) {
      setFilterMobileOpen(false);
    }
    // setFilteredPosts(filteredPostsInternal);
  }

  const value = React.useMemo(
    () => ({
      fetchedPosts,
      updateResults,
      // resultsUpToDate,
      filterState,
      dispatchFilter,
    }),
    [
      // resultsUpToDate,
      filterState,
    ]
  );

  return <SearchContext.Provider value={value} {...props} />;
}
