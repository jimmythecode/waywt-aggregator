import React, { useContext, useEffect, useState } from 'react';
import { PostObject, postsObjects } from '../utils/dataObjects';
import { logAdminExternal } from '../utils/logging';
import { LoggingContext } from './LoggingContext';

export type FilterObject = Record<string, { checked: boolean; disabled: boolean }>;

function getStringOfIds(postsObject: PostObject[]): string {
  return postsObject
    .map((thisObj) => thisObj.postId)
    .sort()
    .toString();
}

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
}

export const SearchContext = React.createContext<SearchContextInterface>(
  {} as SearchContextInterface
);

export default function SearchContextProvider(props: { children: React.ReactNode }) {
  const initialFilteredPostsObjects = postsObjects;
  const [filteredPostsInternal, setFilteredPostsInternal] = useState(initialFilteredPostsObjects);
  const [filteredPosts, setFilteredPosts] = useState(initialFilteredPostsObjects);
  const { updateLog } = useContext(LoggingContext);


  // Take all of the tag string labels from each post object and create an array of unique, sorted labels for the filter checkboxes
  const reducedUniqueStyles = [
    ...new Set(postsObjects.reduce<string[]>((prev, cur) => cur.tags.concat(prev), [])),
  ].sort();
  const initialStyleFilterObject = reducedUniqueStyles.reduce<FilterObject>((prev, cur) => {
    const returnObj = { ...prev };
    returnObj[cur] = { checked: false, disabled: false };
    return returnObj;
  }, {});
  const [styleFilterObject, setStyleFilterObject] = useState(initialStyleFilterObject);

  function updateResults(): void {
    updateLog("Clicked Update Results Button")
    setFilteredPosts(filteredPostsInternal);
  }

  const initialPostsSimplifiedToIdsforCheck = getStringOfIds(initialFilteredPostsObjects);
  const filteredPostsSimplifiedForDependencyCheck = getStringOfIds(filteredPosts);
  const filteredPostsInternalSimplifiedForDependencyCheck = getStringOfIds(filteredPostsInternal);

  const resultsUpToDate =
    filteredPostsInternalSimplifiedForDependencyCheck === filteredPostsSimplifiedForDependencyCheck;

  const tagLabelsCheckedLabelsFiltered = Object.keys(styleFilterObject).filter(
    (thisLabel) => styleFilterObject[thisLabel].checked === false
  );
  useEffect(() => {
    // If all of the boxes are unchecked, then don't filter anything
    if (Object.keys(styleFilterObject).length === tagLabelsCheckedLabelsFiltered.length) {
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
  }, [JSON.stringify(styleFilterObject)]);

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
    }),
    [
      filteredPostsSimplifiedForDependencyCheck,
      JSON.stringify(styleFilterObject),
      filteredPostsInternalSimplifiedForDependencyCheck,
    ]
  );

  return <SearchContext.Provider value={value} {...props} />;
}
