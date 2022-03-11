import React, { useContext, useEffect, useState } from 'react';
import { PostObject, postsObjects } from '../utils/dataObjects';
import { LoggingContext } from './LoggingContext';

export type FilterObject = Record<string, { checked: boolean; disabled: boolean }>;

function getStringOfIds(postsObject: PostObject[]): string {
  return postsObject
    .map((thisObj) => thisObj.postId)
    .sort()
    .toString();
}

export type FilterLabel = 'any' | 'styleTags' | 'updateResults';

interface SearchContextInterface {
  initialFilteredPostsObjects: PostObject[];
  filteredPostsInternal: PostObject[];
  setFilteredPostsInternal: React.Dispatch<React.SetStateAction<PostObject[]>>;
  filteredPosts: PostObject[];
  setFilteredPosts: React.Dispatch<React.SetStateAction<PostObject[]>>;
  styleFilterObject: FilterObject;
  setStyleFilterObject: React.Dispatch<React.SetStateAction<FilterObject>>;
  updateResults: () => void;
  resultsUpToDate: boolean;
  updateFilterUpdateTimestamps: (filterLabel: FilterLabel) => void;
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
  const [filterUpdateTimestamps, setFilterUpdateTimestamps] = useState<Record<FilterLabel, string>>(
    {
      styleTags: new Date().toUTCString(),
      any: new Date().toUTCString(),
      updateResults: new Date().toUTCString(),
    }
  );
  const [resultsUpToDate, setResultsUpToDate] = useState(false);

  function updateFilterUpdateTimestamps(filterLabel: FilterLabel): void {
    setFilterUpdateTimestamps((prev) => ({
      ...prev,
      [filterLabel]: new Date().toUTCString(),
      any: new Date().toUTCString(),
    }));
  }

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
      reducedUniqueStyles.reduce<FilterObject>((prev, cur) => {
        const returnObj = { ...prev };
        returnObj[cur] = { checked: false, disabled: false };
        return returnObj;
      }, {}),
    []
  );
  const [styleFilterObject, setStyleFilterObject] = useState(initialStyleFilterObject);

  function updateResults(): void {
    addLog('Clicked Update Results Button');
    updateFilterUpdateTimestamps('updateResults');
    setFilteredPosts(filteredPostsInternal);
  }

  // const initialPostsSimplifiedToIdsforCheck = getStringOfIds(initialFilteredPostsObjects);
  useEffect(() => {
      const filteredPostsSimplifiedForDependencyCheck = getStringOfIds(filteredPosts);
      const filteredPostsInternalSimplifiedForDependencyCheck = getStringOfIds(
        filteredPostsInternal
      );
      setResultsUpToDate(
        filteredPostsInternalSimplifiedForDependencyCheck ===
          filteredPostsSimplifiedForDependencyCheck
      );
  }, [
    // styleFilterObject, 
    // filterUpdateTimestamps, 
    filteredPostsInternal, filteredPosts
  ]);

  // const tagLabelsCheckedOnly = Object.keys(styleFilterObject).filter(
  //   (thisLabel) => styleFilterObject[thisLabel].checked === true
  // );

  // TODO: I've saved this original working code here while I look at async alternatives.
  // useEffect(() => {
  //   // If all of the boxes are unchecked, then don't filter anything
  //   if (tagLabelsCheckedOnly.length === 0) {
  //     setFilteredPostsInternal(() => initialFilteredPostsObjects);
  //   } else {
  //     // Else if some boxes are checked
  //     setFilteredPostsInternal(() => {
  //       const arrayOfUncheckedStyleTagLabels = Object.keys(styleFilterObject).filter(
  //         (thisLabel) => styleFilterObject[thisLabel].checked
  //       );
  //       const returnArr = initialFilteredPostsObjects.filter((thisPostObj) =>
  //         thisPostObj.tags.some((thisTagLabel) =>
  //           arrayOfUncheckedStyleTagLabels.includes(thisTagLabel)
  //         )
  //       );
  //       return returnArr;
  //     });
  //   }
  // }, [filterUpdateTimestamps.styleTags, styleFilterObject]);

  useEffect(() => {
    // If all of the boxes are unchecked, then don't filter anything
    if (
      Object.keys(styleFilterObject).filter(
        (thisLabel) => styleFilterObject[thisLabel].checked === true
      ).length === 0
    ) {
      setFilteredPostsInternal(() => initialFilteredPostsObjects);
    } else {
      // Else if some boxes are checked
      setFilteredPostsInternal(() => {
        const arrayOfUncheckedStyleTagLabels = Object.keys(styleFilterObject).filter(
          (thisLabel) => styleFilterObject[thisLabel].checked
        );
        const returnArr = initialFilteredPostsObjects.filter((thisPostObj) =>
          thisPostObj.tags.some((thisTagLabel) =>
            arrayOfUncheckedStyleTagLabels.includes(thisTagLabel)
          )
        );
        return returnArr;
      });
    }
  }, [filterUpdateTimestamps.styleTags, styleFilterObject]);

  const value = React.useMemo(
    () => ({
      initialFilteredPostsObjects,
      filteredPostsInternal,
      setFilteredPostsInternal,
      filteredPosts,
      setFilteredPosts,
      styleFilterObject,
      setStyleFilterObject,
      updateResults,
      resultsUpToDate,
      updateFilterUpdateTimestamps,
    }),
    [styleFilterObject, filteredPostsInternal, filteredPosts, resultsUpToDate]
  );

  return <SearchContext.Provider value={value} {...props} />;
}
