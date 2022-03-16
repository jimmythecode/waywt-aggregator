import { FilterActionCheckboxAll, FilterActionCheckboxSingle, filterByOtherMemoisedIds, FilterObjectCheckbox, filterReducer, FilterState } from '../../Reducers/filterReducer';
import { PostObject } from '../../utils/dataObjects';
import { logAdminExternal } from '../../utils/logging';

// npm test // tests in watch mode
// jest my-test #or
// jest path/to/my-test.js
// jest --watch #runs jest -o by default
// jest --watchAll #runs all tests
// npm test filterReducer

const postsObjects1: PostObject[] = [
    {
        postId: 1,
        username: "meatwater",
        height: 180,
        chest: 100,
        waist: 80,
        season: "autumn",
        images: ["https://i.imgur.com/66JrARz.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/ssfeyk/comment/hwxsybi/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["snow day"],
        country: "US",
        postText: `Snow Day but also Going Out
        Tibi / Staud / Tibi / Birkenstock
        
        Drapey Zoom Top
        Joseph / Tibi / Vince`
    },
    {
        postId: 2,
        username: "sexymartian",
        height: 186,
        chest: 100,
        waist: 75,
        season: "autumn",
        images: ["https://i.imgur.com/wwVmljw.jpg"],
        postUrl: "",
        tags: ["linen", "button down", "chic", "light"],
        country: "US",
        postText: `post text not provided`
    },
    {
        postId: 3,
        username: "OldGuyWhoSitsInFront",
        height: 177,
        chest: 100,
        waist: 82,
        season: "autumn",
        images: ["https://i.imgur.com/ihCmAto.jpeg"],
        postUrl: "",
        tags: [],
        country: "US",
        postText: `post text not provided`

    },
    {
        postId: 4,
        username: "Purple_Skies",
        height: 177,
        chest: 100,
        waist: 82,
        season: "autumn",
        images: ["https://i.imgur.com/PwobPfO.jpeg"],
        postUrl: "",
        tags: ["casual", "workwear", "avant-garde", "military"],
        country: "US",
        postText: `post text not provided`

    },
    {
        postId: 5,
        username: "Ttucrabtree",
        height: 177,
        chest: 100,
        waist: 82,
        season: "autumn",
        images: ["https://i.imgur.com/n7Dyso0.jpg"],
        postUrl: "",
        tags: ["casual"],
        country: "US",
        postText: `post text not provided`

    },
    {
        postId: 6,
        username: "HalfTheGoldTreasure",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/icXQl3g.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/comment/hxuoyxz/?utm_source=share&utm_medium=web2x&context=3",
        tags: ['casual', 'workwear', 'streetwear', 'neo-prep', 'vintage', 'rugged Ivy', 'relaxed fit'],
        country: "US",
        postText: `EG/Wythe/Vintage Levi’s/Aldens
        Knickerbocker/Vintage/LWC/Vintage Levi’s/NB993`
    },
    {
        postId: 7,
        username: "narwhalspal",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://imgur.com/LIlYHwn"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/waywt_21_february_2022/hxv0uyn/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["casual", "workwear", "streetwear", "neo-prep", "vintage", "rugged Ivy", "relaxed fit"],
        country: "US",
        postText: `Casual Monday from Saturday I think
        stan ray/patagonia/levis/russell`
    },
    {
        postId: 8,
        username: "goonerdavid",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/FQiJIPx.jpeg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/comment/hxvgv4e/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["casual", "sports", "football/soccer"],
        country: "US",
        postText: `any gooners in here?
        vintage nike arsenal / uniqlo / veja
        
        ig: fratellifits`
    },
    {
        postId: 9,
        username: "pbarra96",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/jcncMaK.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/waywt_21_february_2022/hxutb4w/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["casual", "workwear", "japanese americana"],
        country: "US",
        postText: `ripple sole soul
        Kapital / Uniqlo / RRL / Unmarked`
    },
    {
        postId: 10,
        username: "Walter_Crunkite_",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/g2ExOUO.jpeg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/waywt_21_february_2022/hxuqwwh/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["casual", "americana", "loose fit", "cosy"],
        country: "US",
        postText: `https://imgur.com/a/DibFTXZ
        Stan Ray/Dickies/Converse`
    },
];

const reducedUniqueStyles = [...new Set(
    postsObjects1.reduce<string[]>((prev, cur) => cur.tags.concat(prev), [])
),
].sort();

const initialStyleFilterObject = reducedUniqueStyles.reduce<FilterObjectCheckbox>((prev, cur) => {
    const returnObj = { ...prev };
    returnObj[cur] = { checked: false, disabled: false };
    return returnObj;
}, {})

const initialUsersFilterObject = [...new Set(postsObjects1.map((thisPost) => thisPost.username))]
    .sort()
    .reduce<FilterObjectCheckbox>((prev, cur) => {
        const returnObj = { ...prev };
        returnObj[cur] = { checked: false, disabled: false };
        return returnObj;
    }, {})

const initialReducerState: FilterState = {
    initialArrayOfPosts: postsObjects1,
    internalFilteredPosts: postsObjects1,
    externalFilteredPosts: postsObjects1,
    filterCheckboxObjects: {
        styles: initialStyleFilterObject,
        users: initialUsersFilterObject,
        colorSeasons: {},
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
        styles: [1, 2, 3, 4, 5],
        users: [2, 3, 4, 5],
        height: [2, 3, 4, 5, 6, 7],
        chest: [1, 2, 3],
        waist: [1, 2, 3],
        colorSeasons: [1, 2, 3, 4],
    },
    timestamps: {
        styles: "Tue, 15 Mar 2022 06:42:43 GMT",
        users: "Tue, 15 Mar 2022 06:42:43 GMT",
        height: "Tue, 15 Mar 2022 06:42:43 GMT",
        chest: "Tue, 15 Mar 2022 06:42:43 GMT",
        waist: "Tue, 15 Mar 2022 06:42:43 GMT",
        colorSeasons: "Tue, 15 Mar 2022 06:42:43 GMT",
        internalFilteredPosts: "Tue, 15 Mar 2022 06:42:43 GMT",
        externalFilteredPosts: "Tue, 15 Mar 2022 06:42:43 GMT",
    },
};



describe("test filterReducer and associated functions", () => {
    describe("filterByOtherMemoisedIds()", () => {
        test("Simple test 1", async () => {
            const testResponse = filterByOtherMemoisedIds(postsObjects1, initialReducerState.postIdArrays, "styles")
            expect(testResponse.map(x => x.postId).sort()).toEqual([2, 3]);
        });
        test("Simple test 2", async () => {
            const postIdArrays = {
                styles: [1, 2, 3, 4, 5],
                users: [2, 3, 4, 5, 6],
                height: [2, 3, 4, 5, 6, 7],
                chest: [1, 2, 3, 6],
                waist: [1, 2, 3, 6],
                colorSeasons: [1, 2, 3, 4, 6],
            };
            const testResponse = filterByOtherMemoisedIds(postsObjects1, postIdArrays, "styles")
            expect(testResponse.map(x => x.postId).sort()).toEqual([2, 3, 6]);
        });
        test("filterByOtherMemoisedIds() where length is 0", async () => {
            const postIdArrays = {
                styles: [1, 2, 3, 4, 5],
                users: [],
                height: [],
                chest: [1, 2, 3, 6],
                waist: [1, 2, 3, 6],
                colorSeasons: [1, 2, 3, 4, 6],
            };
            const testResponse = filterByOtherMemoisedIds(postsObjects1, postIdArrays, "styles")
            expect(testResponse.map(x => x.postId).sort()).toEqual([1, 2, 3, 6]);
        });
    });
    describe("filterReducer() Styles Checkboxes", () => {
        test("Select all true, for styles checkboxes", async () => {
            const action: FilterActionCheckboxAll = {
                type: 'click select all checkbox',
                filterLabel: "styles",
                checked: true,
            }
            const testResponse = filterReducer(initialReducerState, action);
            expect(testResponse.timestamps.styles).not.toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(testResponse.timestamps.chest).toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(Object.keys(testResponse.filterCheckboxObjects.styles).length).toEqual(20);
            // Check all checkboxes true
            expect(Object.keys(testResponse.filterCheckboxObjects.styles).map(x => testResponse.filterCheckboxObjects.styles[x].checked).filter(x => x).length).toEqual(20);
            // Check postIdArray are filtered (we're only going to filter out 1/10, which is the one without any tags)
            expect(testResponse.postIdArrays.styles.length).toBe(9);
            // Check internalFilteredPosts are filtered
            expect(testResponse.internalFilteredPosts.length).toBe(1);
            expect(testResponse.internalFilteredPosts[0].postId
            ).toBe(2);

        });
        test("Select all false, for styles checkboxes", async () => {
            const action: FilterActionCheckboxAll = {
                type: 'click select all checkbox',
                filterLabel: "styles",
                checked: false,
            }
            const testResponse = filterReducer(initialReducerState, action);
            expect(testResponse.timestamps.styles).not.toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(testResponse.timestamps.chest).toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(Object.keys(testResponse.filterCheckboxObjects.styles).length).toEqual(20);
            // Check all checkboxes fa;se
            expect(Object.keys(testResponse.filterCheckboxObjects.styles).map(x => testResponse.filterCheckboxObjects.styles[x].checked).filter(x => x === false).length).toEqual(20);
            // Check postIdArray are filtered (we don't want to filter any when no checkboxes are checked)
            expect(testResponse.postIdArrays.styles.length).toBe(10);
            // Check internalFilteredPosts are filtered
            expect(testResponse.internalFilteredPosts.length).toBe(2);
            expect(testResponse.internalFilteredPosts[0].postId
            ).toBe(2);
        });
        test("Select 'casual' styles checkboxes === true", async () => {
            const action: FilterActionCheckboxSingle = {
                type: 'click single checkbox',
                filterLabel: "styles",
                checked: true,
                checkboxLabel: "casual",
            }
            const testResponse = filterReducer(initialReducerState, action);
            // Test timestamp updated
            expect(testResponse.timestamps.styles).not.toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(testResponse.timestamps.chest).toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            // Test internalFilterObject.styles updates 'casual'
            expect(20).toEqual(Object.keys(testResponse.filterCheckboxObjects.styles).length);
            expect(
                Object.keys(
                    testResponse.filterCheckboxObjects.styles)
                    .filter(thisLabel => testResponse.filterCheckboxObjects.styles[thisLabel].checked
                    )
                    .length
            ).toEqual(1);
            // Check all other checkboxes false
            expect(Object.keys(testResponse.filterCheckboxObjects.styles).map(x => testResponse.filterCheckboxObjects.styles[x].checked).filter(x => x === false).length).toEqual(19);
            // Check postIdArray are filtered (7 posts have 'casual' tags)
            expect(testResponse.postIdArrays.styles.length).toBe(7);
            // Check internalFilteredPosts are filtered (only 2,3 are filtered through other momoised filters. Only postId 2 has 'casual' tag)
            expect(testResponse.internalFilteredPosts.length).toBe(0);

            // Try with linen to confirm that filters return some/any posts
            const actionLinen: FilterActionCheckboxSingle = {
                type: 'click single checkbox',
                filterLabel: "styles",
                checked: true,
                checkboxLabel: "linen",
            }
            const testResponseLinen = filterReducer(initialReducerState, actionLinen);
            expect(testResponseLinen.internalFilteredPosts.length).toBe(1);
            expect(testResponseLinen.internalFilteredPosts[0].postId
            ).toBe(2);
        });
        test("Select 'casual' styles checkboxes === false", async () => {
            const action: FilterActionCheckboxSingle = {
                type: 'click single checkbox',
                filterLabel: "styles",
                checked: false,
                checkboxLabel: "casual",
            }
            const initialStyleFilterObjectCheckedTrue = reducedUniqueStyles.reduce<FilterObjectCheckbox>((prev, cur) => {
                const returnObj = { ...prev };
                returnObj[cur] = { checked: true, disabled: false };
                return returnObj;
            }, {})
            const initialReducerStateCheckedAllFalse: FilterState = {
                ...initialReducerState,
                filterCheckboxObjects: {
                    ...initialReducerState.filterCheckboxObjects, styles: initialStyleFilterObjectCheckedTrue
                }
            }
            const testResponse = filterReducer(initialReducerStateCheckedAllFalse, action);
            // Test timestamp updated
            expect(testResponse.timestamps.styles).not.toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(testResponse.timestamps.chest).toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            // Test internalFilterObject.styles updates 'casual'
            // Check includes the 20 unique styles
            expect(20).toEqual(Object.keys(testResponse.filterCheckboxObjects.styles).length);
            // There should be 1/20 unchecked and 19 checked
            expect(
                Object.keys(
                    testResponse.filterCheckboxObjects.styles)
                    .filter(thisLabel =>
                        testResponse.filterCheckboxObjects.styles[thisLabel].checked
                    )
                    .length
            ).toEqual(19);
            // Check all other checkboxes false
            expect(Object.keys(testResponse.filterCheckboxObjects.styles).map(x => testResponse.filterCheckboxObjects.styles[x].checked).filter(x => x === false).length).toEqual(1);
            // Check postIdArray are filtered (2 posts have 'casual' or no tags)
            expect(testResponse.postIdArrays.styles.length).toBe(8);
            // Check internalFilteredPosts are filtered (only 2,3 are filtered through other momoised filters. Only postId 2 has 'casual' tag)
            expect(testResponse.internalFilteredPosts.length).toBe(1);

            // Try with linen to confirm that filters return some/any posts
            const actionLinen: FilterActionCheckboxSingle = {
                type: 'click single checkbox',
                filterLabel: "styles",
                checked: true,
                checkboxLabel: "linen",
            }
            const testResponseLinen = filterReducer(initialReducerState, actionLinen);
            expect(testResponseLinen.internalFilteredPosts.length).toBe(1);
            expect(testResponseLinen.internalFilteredPosts[0].postId
            ).toBe(2);
        });
    });
    describe.only("filterReducer() Users Checkboxes", () => {
        test("Select all true, for users checkboxes", async () => {
            const action: FilterActionCheckboxAll = {
                type: 'click select all checkbox',
                filterLabel: "users",
                checked: true,
            }
            const testResponse = filterReducer(initialReducerState, action);
            expect(testResponse.timestamps.styles).toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(testResponse.timestamps.users).not.toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(testResponse.timestamps.chest).toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(Object.keys(testResponse.filterCheckboxObjects.users).length).toEqual(10);
            // Check all checkboxes true (10/10)
            expect(Object.keys(testResponse.filterCheckboxObjects.users).map(x => testResponse.filterCheckboxObjects.users[x].checked).filter(x => x).length).toEqual(10);
            // Check postIdArray are filtered (all posts have a user associated, so should be 10/10)
            expect(testResponse.postIdArrays.users.length).toBe(10);
            // Check internalFilteredPosts are filtered. (We're not filtering out any additional posts with the users filter, so should expect to be 2)
            expect(testResponse.internalFilteredPosts.length).toBe(2);
            expect(testResponse.internalFilteredPosts[0].postId
            ).toBe(2);
        });
        test("Select all false, for users checkboxes", async () => {
            const action: FilterActionCheckboxAll = {
                type: 'click select all checkbox',
                filterLabel: "users",
                checked: false,
            }
            const testResponse = filterReducer(initialReducerState, action);
            expect(testResponse.timestamps.users).not.toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(testResponse.timestamps.chest).toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            // The users filter object should be equal to the number of users (10)
            expect(Object.keys(testResponse.filterCheckboxObjects.users).length).toEqual(10);
            // Check all checkboxes false
            expect(Object.keys(testResponse.filterCheckboxObjects.users).map(x => testResponse.filterCheckboxObjects.users[x].checked).filter(x => x === false).length).toEqual(10);
            // Check postIdArray are filtered (we don't want to filter any when no checkboxes are checked)
            expect(testResponse.postIdArrays.users.length).toBe(10);
            // Check internalFilteredPosts are filtered
            expect(testResponse.internalFilteredPosts.length).toBe(2);
            expect(testResponse.internalFilteredPosts[0].postId
            ).toBe(2);
        });
        test("Select 'sexymartian' users checkboxes === true", async () => {
            const action: FilterActionCheckboxSingle = {
                type: 'click single checkbox',
                filterLabel: "users",
                checked: true,
                checkboxLabel: "sexymartian",
            }
            const testResponse = filterReducer(initialReducerState, action);
            // Test timestamp updated
            expect(testResponse.timestamps.users).not.toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(testResponse.timestamps.chest).toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            // Test internalFilterObject.users updates 'sexymartian'
            // Length of the users filterObject should be 10, as we've 10 different users in 10 different posts.
            expect(Object.keys(testResponse.filterCheckboxObjects.users).length).toEqual(10);
            // 1/10 checkboxes should be true.
            expect(
                Object.keys(
                    testResponse.filterCheckboxObjects.users)
                    .filter(thisLabel => testResponse.filterCheckboxObjects.users[thisLabel].checked
                    )
                    .length
            ).toEqual(1);
            // Check all other checkboxes false
            expect(Object.keys(testResponse.filterCheckboxObjects.users).map(x => testResponse.filterCheckboxObjects.users[x].checked).filter(x => x === false).length).toEqual(9);
            // Check postIdArray are filtered (1 posts have 'sexymartian')
            expect(testResponse.postIdArrays.users.length).toBe(1);
            // Check internalFilteredPosts are filtered (only 2,3 are filtered through other momoised filters. Only post 2 has sexymartian)
            expect(testResponse.internalFilteredPosts.length).toBe(1);
        });
        test.only("Select 'sexymartian' users checkboxes === false", async () => {
            const action: FilterActionCheckboxSingle = {
                type: 'click single checkbox',
                filterLabel: "users",
                checked: false,
                checkboxLabel: "sexymartian",
            }
            const initialUsersFilterObjectTrue = [...new Set(postsObjects1.map((thisPost) => thisPost.username))]
                .sort()
                .reduce<FilterObjectCheckbox>((prev, cur) => {
                    const returnObj = { ...prev };
                    returnObj[cur] = { checked: true, disabled: false };
                    return returnObj;
                }, {})
            const initialReducerStateCheckedAllFalse: FilterState = {
                ...initialReducerState,
                filterCheckboxObjects: {
                    ...initialReducerState.filterCheckboxObjects, users: initialUsersFilterObjectTrue
                }
            }
            const testResponse = filterReducer(initialReducerStateCheckedAllFalse, action);
            // Test timestamp updated
            expect(testResponse.timestamps.users).not.toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            expect(testResponse.timestamps.chest).toEqual("Tue, 15 Mar 2022 06:42:43 GMT");
            // Test internalFilterObject.users updates 'casual'
            // Check includes the 10 unique users
            expect(10).toEqual(Object.keys(testResponse.filterCheckboxObjects.users).length);
            // There should be 1/10 unchecked and 9 checked
            expect(
                Object.keys(
                    testResponse.filterCheckboxObjects.users)
                    .filter(thisLabel =>
                        testResponse.filterCheckboxObjects.users[thisLabel].checked
                    )
                    .length
            ).toEqual(9);
            // Check all other checkboxes false
            expect(Object.keys(testResponse.filterCheckboxObjects.users).map(x => testResponse.filterCheckboxObjects.users[x].checked).filter(x => x === false).length).toEqual(1);
            // Check postIdArray are filtered (1 post has this user name. 9/10 don't)
            expect(testResponse.postIdArrays.users.length).toBe(9);
            // Check internalFilteredPosts are filtered (only 2,3 are filtered through other momoised filters. Only postId 2 has is by this user)
            expect(testResponse.internalFilteredPosts.length).toBe(1);

            // Try with another username
            const actionLinen: FilterActionCheckboxSingle = {
                type: 'click single checkbox',
                filterLabel: "users",
                checked: true,
                checkboxLabel: "OldGuyWhoSitsInFront",
            }
            const testResponseLinen = filterReducer(initialReducerState, actionLinen);
            expect(testResponseLinen.internalFilteredPosts.length).toBe(1);
            expect(testResponseLinen.internalFilteredPosts[0].postId
            ).toBe(3);
        });

    });
});
