import { PostObject } from '../utils/dataObjects';
import { logAdminExternal } from '../utils/logging';

export type FilterTypeLabelsCheckbox = "styles" | "users" | "colorSeasons";
export type FilterTypeLabelsSlider = "height" | "chest" | "waist";
export type FilterObjectCheckbox = Record<string, { checked: boolean; disabled: boolean }>;
export interface FilterObjectSlider {
    min: number;
    max: number;
    disabled: boolean
}

export interface FilterState {
    initialArrayOfPosts: PostObject[],
    internalFilteredPosts: PostObject[],
    filterCheckboxObjects: Record<FilterTypeLabelsCheckbox, FilterObjectCheckbox>;
    filterSliderObjects: Record<FilterTypeLabelsSlider, FilterObjectSlider>;
    externalFilteredPosts: PostObject[];
    postIdArrays: Record<FilterTypeLabelsCheckbox | FilterTypeLabelsSlider, number[]>;
    timestamps: Record<FilterTypeLabelsCheckbox | FilterTypeLabelsSlider | "internalFilteredPosts" | "externalFilteredPosts", string>;
}

export interface FilterActionCheckboxBase {
    filterLabel: FilterTypeLabelsCheckbox,
    checked: boolean;
}

export interface FilterActionCheckboxAll extends FilterActionCheckboxBase {
    type: "click select all checkbox",
}

export interface FilterActionCheckboxSingle extends FilterActionCheckboxBase {
    type: "click single checkbox",
    checkboxLabel: string;
}

export interface FilterActionSlider {
    type: 'update slider',
    filterLabel: FilterTypeLabelsSlider,
    min: number,
    max: number,
}

export interface FilterActionDisableSlider {
    type: 'disable slider',
    filterLabel: FilterTypeLabelsSlider,
}

export type FilterAction = FilterActionCheckboxAll | FilterActionCheckboxSingle | FilterActionSlider | FilterActionDisableSlider | { type: "update external" }

export function filterByOtherMemoisedIds(initialFilteredPosts: PostObject[], arraysOfPostIds: Record<FilterTypeLabelsCheckbox | FilterTypeLabelsSlider, number[]>, thisLabel: FilterTypeLabelsCheckbox | FilterTypeLabelsSlider): PostObject[] {
    let returnArray = [...initialFilteredPosts];
    // Filter down initialArrayOfPostsIds by the memoised arrays of post IDs
    // Ignore the current label and any arrays that are the same length as the initial array (since they don't have any filters applied). Also ignore any filter than has no values (length === 0), as this could be checkboxes with nothing clicked.
    const arraysOfArraysToIterate = Object.keys(arraysOfPostIds).reduce<number[][]>((acc, curFilterLabel) => {
        if (curFilterLabel === thisLabel) return acc;
        const thisArray = arraysOfPostIds[curFilterLabel as FilterTypeLabelsCheckbox];
        if (thisArray.length === initialFilteredPosts.length || thisArray.length === 0) return acc;
        acc.push(thisArray)
        return acc;
    }, [] as number[][])

    // Order arrays by smallest first. Then filter initialArrayOfPostIds against each one.
    if (arraysOfArraysToIterate.length > 0) {
        arraysOfArraysToIterate.sort((a, b) => a.length - b.length).forEach(thisArray => {
            returnArray = returnArray.filter(thisPost => thisArray.includes(thisPost.postId))
        })
    }
    return returnArray;
}

export function filterReducer(state: FilterState, action: FilterAction) {
    const returnState = { ...state };
    switch (action.type) {
        case "click select all checkbox": {
            // Will need to update: timestamps, internalFilterObject, postIdArrays, internalFilteredPosts
            // Update timestamp for memo comparisons
            returnState.timestamps[action.filterLabel] = new Date().toUTCString();
            // Update filterObjects to update inputs (checkboxes, sliders, etc)
            // Iterate through all unique labels and check/uncheck all boxes depending on whether 'select all' checkbox is checked.
            Object.keys(returnState.filterCheckboxObjects[action.filterLabel]).forEach(thisLabel => {
                returnState.filterCheckboxObjects[action.filterLabel][thisLabel].checked = action.checked
            })
            // Get filtered array of Id's from memoised other filters.
            const arrayOfPostObjectsFromOtherFilters = filterByOtherMemoisedIds(returnState.initialArrayOfPosts, returnState.postIdArrays, action.filterLabel);
            const arrayOfPostIdsFromOtherFilters = arrayOfPostObjectsFromOtherFilters.map(x => x.postId);
            // Update internal postIdArrays and internalFilteredPosts
            if (action.checked === false) {
                // if all unchecked then no filter applied (it's a bit unintuitive but makes more sense with text input filter).
                returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts.map(x => x.postId);
                // internalFilteredPosts will be initialArrayOfPosts filtered by the other memoised postIdArrays.
                returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters
            } else if (action.checked === true) {
                // Update internal postIdArrays and internalFilteredPosts if all checkboxes are checked.
                if (action.filterLabel === "users" || action.filterLabel === "colorSeasons") {
                    // There will be a username associated with all posts. So since we've selected all checkboxes, the postIdArrays will be all values
                    returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts.map(x => x.postId);
                    // internalFilteredPosts will not need filtering any further since we aren't filtereing any values.
                    returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters
                }
                // Update interal postIdArray if checkboxes all true. So most of the initial posts array will be included.
                // This is probably going to be a different function for styles than for users, so if() it.
                if (action.filterLabel === "styles") {
                    returnState.postIdArrays[action.filterLabel] = [];
                    returnState.internalFilteredPosts = [];
                    returnState.initialArrayOfPosts.forEach((thisPost) => {
                        // If any of the tags array of this PostObject include any of the checked labels (ie all of them), then make the array from that.
                        if (thisPost.tags.length > 0) {
                            returnState.postIdArrays[action.filterLabel].push(thisPost.postId);
                            // Update internal filtered posts. If this post object contains style tag in the checkbox labels, then concat this object to internalfilterposts if its postId is included in the array of posts from other filters.
                            if (arrayOfPostIdsFromOtherFilters.includes(thisPost.postId)) {
                                returnState.internalFilteredPosts.push(thisPost)
                            }
                        }
                    }) // forEach block
                }
            }
            break;
        }
        case "click single checkbox": {
            // Will need to update: timestamps, internalFilterObject, postIdArrays, internalFilteredPosts
            // Update timestamp for memo comparisons
            returnState.timestamps[action.filterLabel] = new Date().toUTCString();
            // Update filterObjects to update inputs (checkboxes, sliders, etc)
            Object.keys(returnState.filterCheckboxObjects[action.filterLabel])
            returnState.filterCheckboxObjects[action.filterLabel][action.checkboxLabel].checked = action.checked;
            // Update postIdArrays. 
            if (action.filterLabel === "styles") {
                // Filter only posts that include a style tag that has .checked === true
                returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts.filter(thisPostObj =>
                    thisPostObj.tags.some(thisTagLabel =>
                        returnState.filterCheckboxObjects[action.filterLabel][thisTagLabel].checked
                    )
                ).map(x => x.postId) // This would probably be better iterating once in a reduce function.
            }
            if (action.filterLabel === "users" || action.filterLabel === "colorSeasons") {
                // Filter only posts where user has .checked === true
                returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts.filter(thisPostObj => {
                    if (action.filterLabel === "users") return returnState.filterCheckboxObjects[action.filterLabel][thisPostObj.username].checked;
                    if (action.filterLabel === "colorSeasons") return returnState.filterCheckboxObjects[action.filterLabel][thisPostObj.season].checked;
                    throw new Error("error trying to filter returnState.initialArrayOfPosts.filter(thisPostObj...")
                }
                ).map(x => x.postId) // This would probably be better iterating once in a reduce function.
            }
            // Update internalFilteredPosts
            // Get filtered array from memoised postId arrays
            const arrayOfPostObjectsFromOtherFilters = filterByOtherMemoisedIds(returnState.initialArrayOfPosts, returnState.postIdArrays, action.filterLabel);
            if (action.filterLabel === "styles") {
                returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters.filter(thisPostObj =>
                    // Filter only posts where the updated postIdArray is included
                    thisPostObj.tags.some(thisTagLabel =>
                        returnState.filterCheckboxObjects[action.filterLabel][thisTagLabel].checked
                    )
                )
            }
            if (action.filterLabel === "users" || action.filterLabel === "colorSeasons") {
                returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters.filter(thisPostObj => {
                    // Filter only posts where the updated postIdArray is included
                    if (action.filterLabel === "users") return returnState.filterCheckboxObjects[action.filterLabel][thisPostObj.username].checked;
                    if (action.filterLabel === "colorSeasons") return returnState.filterCheckboxObjects[action.filterLabel][thisPostObj.season].checked;
                    throw new Error("error trying to filter returnState.initialArrayOfPosts.filter(thisPostObj...")
                })
            }
            break;
        }
        case 'update slider': {
            // Will need to update: timestamps, internalFilterObject, postIdArrays, internalFilteredPosts
            // Update timestamp for memo comparisons
            returnState.timestamps[action.filterLabel] = new Date().toUTCString();
            // Update filterObjects to update inputs (checkboxes, sliders, etc)
            returnState.filterSliderObjects[action.filterLabel] = { ...returnState.filterSliderObjects[action.filterLabel], min: action.min, max: action.max, disabled: false }
            // Update postIdArray
            returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts.filter(thisPostObj => (thisPostObj[action.filterLabel] >= action.min && thisPostObj[action.filterLabel] <= action.max)).map(x => x.postId);
            // Update internalFilteredPosts
            const arrayOfPostObjectsFromOtherFilters = filterByOtherMemoisedIds(returnState.initialArrayOfPosts, returnState.postIdArrays, action.filterLabel);
            returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters.filter(thisObjFromOtherFilters => returnState.postIdArrays[action.filterLabel].includes(thisObjFromOtherFilters.postId))
            break;
        }
        case 'disable slider': {
            // Will need to update: timestamps, internalFilterObject, postIdArrays, internalFilteredPosts
            // Update timestamp for memo comparisons
            returnState.timestamps[action.filterLabel] = new Date().toUTCString();
            // Update filterObjects to update inputs (checkboxes, sliders, etc)
            returnState.filterSliderObjects[action.filterLabel] = { ...returnState.filterSliderObjects[action.filterLabel], disabled: true }
            // Update postIdArray
            returnState.postIdArrays[action.filterLabel] = returnState.initialArrayOfPosts.map(x => x.postId);
            // Update internalFilteredPosts
            const arrayOfPostObjectsFromOtherFilters = filterByOtherMemoisedIds(returnState.initialArrayOfPosts, returnState.postIdArrays, action.filterLabel);

            returnState.internalFilteredPosts = arrayOfPostObjectsFromOtherFilters;
            break;
        }
        case "update external": {
            returnState.timestamps.externalFilteredPosts = new Date().toUTCString();
            returnState.externalFilteredPosts = returnState.internalFilteredPosts;
            break;
        }
        default:
            logAdminExternal({
                status: "filterReducer returning default value"
            })
            return state

    }
    return returnState
}