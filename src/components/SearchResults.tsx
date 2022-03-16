import { Box } from '@mui/material';
import React, { PropsWithChildren, useContext } from 'react';
import { SearchContext } from '../Context/SearchContext';
import { PostObject } from '../utils/dataObjects';
import { logAdminExternal } from '../utils/logging';
import ResultCard from './ResultCard';

function BaseSearchResults({ filteredPosts }: { filteredPosts: PostObject[] }) {
  return (
    <Box>
      {filteredPosts.map((thisResult) => (
        <ResultCard key={thisResult.postId} postObject={thisResult} />
      ))}
    </Box>
  );
}

function comparisonFunction(
  prevProps: Readonly<PropsWithChildren<{ filteredPosts: PostObject[] }>>,
  nextProps: Readonly<PropsWithChildren<{ filteredPosts: PostObject[] }>>
) {
  // Check if array lengths have changed length and if postId props are all the same. If true then don't render change`
  const arrayIdsAreSame = prevProps.filteredPosts.length === nextProps.filteredPosts.length && 
    prevProps.filteredPosts.filter(
      (thisPrevObj, index) => thisPrevObj.postId !== nextProps.filteredPosts[index].postId
    ).length === 0;
  return  arrayIdsAreSame;
}

const MemoisedSearchResults = React.memo(BaseSearchResults, comparisonFunction);

function SearchResults() {
  const { filterState } = useContext(SearchContext);
  return (
    <MemoisedSearchResults filteredPosts={filterState.externalFilteredPosts} />
    // <Box>
    //   {filteredPosts.map((thisResult) => (
    //     <ResultCard key={thisResult.postId} postObject={thisResult} />
    //   ))}
    // </Box>
  );
}

export default SearchResults;
