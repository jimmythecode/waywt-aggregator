import { Box } from '@mui/material';
import React, { PropsWithChildren, useContext } from 'react';
import { SearchContext } from '../Context/SearchContext';
import { TimestampsObject } from '../Reducers/filterReducer';
import { PostObject } from '../utils/dataObjects';
import ResultCard from './ResultCard';

function BaseSearchResults({
  externalFilteredPosts,
  internalFilteredPosts,
  timestamps,
}: {
  externalFilteredPosts: PostObject[];
  internalFilteredPosts: PostObject[];
  timestamps: TimestampsObject;
}) {
  console.log({ externalFilteredPosts: externalFilteredPosts.map((x) => x.imageUrls) });

  return (
    <Box>
      {externalFilteredPosts.map((thisResult) => (
        <ResultCard key={thisResult.commentId} postObject={thisResult} />
      ))}
    </Box>
  );
}

// If true then don't re-render
function comparisonFunction(
  prevProps: Readonly<
    PropsWithChildren<{
      externalFilteredPosts: PostObject[];
      internalFilteredPosts: PostObject[];
      timestamps: TimestampsObject;
    }>
  >,
  nextProps: Readonly<
    PropsWithChildren<{
      externalFilteredPosts: PostObject[];
      internalFilteredPosts: PostObject[];
      timestamps: TimestampsObject;
    }>
  >
) {
  // We only want to re-render if the external posts object is different from the previous posts object. This will only happen when the timestamp for the external posts update was the last to be clicked. So we'll return true whenever the external posts update isn't the most recent timestamp.
  // First check if timestamps suggest an internal update (ie, no re-render necessary)
  if (nextProps.timestamps.externalFilteredPosts < nextProps.timestamps.internalFilteredPosts)
    return true;
  // Second, check if the externalFilteredPosts are different. If they are the same, return true. Else return false.
  // Check if array lengths have changed length and if postId props are all the same. If true then don't render change`
  const arrayIdsAreSame =
    prevProps.externalFilteredPosts.length === nextProps.externalFilteredPosts.length &&
    prevProps.externalFilteredPosts.filter(
      (thisPrevObj, index) =>
        thisPrevObj.commentId !== nextProps.externalFilteredPosts[index].commentId
    ).length === 0;
  return arrayIdsAreSame;
}

const MemoisedSearchResults = React.memo(BaseSearchResults, comparisonFunction);

function SearchResults() {
  const { filterState } = useContext(SearchContext);

  return (
    <MemoisedSearchResults
      externalFilteredPosts={filterState.externalFilteredPosts}
      internalFilteredPosts={filterState.internalFilteredPosts}
      timestamps={filterState.timestamps}
    />
  );
}

export default SearchResults;
