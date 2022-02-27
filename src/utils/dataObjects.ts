/* eslint-disable import/prefer-default-export */
type Seasons = "autumn" | "winter" | "spring" | "summer";

export interface PostObject {
    postId: number,
    username: string,
    height: number,
    chest: number,
    waist: number,
    season: Seasons,
    images: string[],
    postUrl: string,
    tags: string[],
    country: string,
    postText: string

}

export const postsObjects: PostObject[] = [
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
    {
        postId: 11,
        username: "manliftingbanner",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/ubzAphN.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/waywt_21_february_2022/hxuto6p/?utm_source=share&utm_medium=web2x&context=3",
        tags: [],
        country: "US",
        postText: `borrowed my dad's jeans to see if he would notice
        Drake's / Engineered Garments / Universal Works / don't remember / Red Wing`
    },
    {
        postId: 12,
        username: "wavynails",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/FX3l7yS.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/waywt_21_february_2022/hxuvmod/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["casual", "wide"],
        country: "US",
        postText: `wounded wide boi
        gap, thrift, naked and famous, birks
        
        ben sherman, thrift, adsum, birks
        
        Nothing ground breaking here, just grateful my pants and shoes are big enough that I can still wear them.`
    },
    {
        postId: 13,
        username: "KevinsChilli",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/NhhNjvM.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/waywt_21_february_2022/hxuu752/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["casual", "relaxed", "leisure"],
        country: "US",
        postText: `botanical garden fit
        Pendleton (thrifted), J. Crew (left at my house by anonymous), LL Bean (thrifted), Chaco`
    },
    {
        postId: 14,
        username: "lb17spradling",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/rWLGEk7.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/waywt_21_february_2022/hxuq91t/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["vintage americana", "modern street", "traditional preppy"],
        country: "US",
        postText: `Growing up, I used to hate wearing my dad’s hand-me-downs, but now they are some of my favorite pieces in my closet

        cap: Pink Floyd ‘88 World Tour (my dad’s)
        
        t-shirt: Kirkland
        
        sweater vest: Geoffrey Beene (my dad’s)
        
        jacket: Ralph Lauren
        
        jeans: Brave Star
        
        boots: Dr. Martens 1460`
    },
    {
        postId: 15,
        username: "bchanx",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/V4u35hT.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/waywt_21_february_2022/hxv5d0e/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["japanese americana", "japanese streetwear", "traditional preppy"],
        country: "us",
        postText: `invested in a vest
        eg / ts(s) / muji / drole de monsieur / shoes like pottery
        
        got myself a shoulder vest. wuz put it best:
        
        initial thought: this shit rocks
        
        --- /u/wuzpoppin *(source)*
        
        bonus: in the wild
        insta`
    },
    {
        postId: 16,
        username: "Schraiber",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/gUwxbGO.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/comment/hxuuv21/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["streetwear", "techwear", "oversized", "cozy"],
        country: "us",
        postText: `A couple of weekend fits

        Red, green, and blue
        Jacket: ONI
        
        Shirt: Freenote Cloth
        
        Denim: 3Sixteen
        
        Derbies: Parkhurst
        
        Must have been windy?
        Jacket: Levi's
        
        Shirt: Portuguese Flannel
        
        Pants: Naked and Famous
        
        Chukkas: Alden
        
        Critiques and suggestions always welcome!`
    },
    {
        postId: 17,
        username: "Skinnygold",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/L6LAeHy.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/waywt_21_february_2022/hxuno33/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["british heritage workwear", "regular fit", "straight cut"],
        country: "gb",
        postText: `Storm Eunice left a little snow on its way out in the north of England last weekend — managed a a quick fit pic before it all melted away…

        Universal Works watch cap
        
        SEH Kelly topcoat
        
        Oliver Spencer grandad shirt
        
        Anderson's belt
        
        Nigel Cabourn Lybro army pants
        
        Solovair postman shoes`
    },
    {
        postId: 18,
        username: "Ok-Sun-9372",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/5NyBaIN.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/comment/hxx0itz/?utm_source=share&utm_medium=web2x&context=3",
        tags: [],
        country: "us",
        postText: `In a birch grove.
        old tweed field coat from Brooks Brothers, loden pants, random warm boots, hat and pipe.`
    },
    {
        postId: 19,
        username: "Ptubs",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/QgtKGyM.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/comment/hxuo7fm/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["cosy"],
        country: "us",
        postText: `Yesterday

        Kapital
        
        Dries van Noten
        
        Needles
        
        Yuketen
        
        My knee is in recovery, but finally had nice weather along with the will to get out over the weekend.`
    },

    {
        postId: 20,
        username: "License2grill",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/2WwCxlN.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/waywt_21_february_2022/hxv0d3t/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["cozy"],
        country: "us",
        postText: `I helped a friend move yesterday so this is my "cancel all meetings for the day and RELAX" comfy fit. I know I look rough. I know cigarettes are bad. We don't need to talk about it.
        Northface
        
        Palace
        
        Nike ACG
        
        Suicoke`
    },
    {
        postId: 21,
        username: "M-S-K-93",
        height: 186,
        chest: 110,
        waist: 90,
        season: "autumn",
        images: ["https://i.imgur.com/7wwBjZw.jpg"],
        postUrl: "https://www.reddit.com/r/malefashionadvice/comments/sxyelb/waywt_21_february_2022/hxusvlp/?utm_source=share&utm_medium=web2x&context=3",
        tags: ["smart casual", "workwear"],
        country: "us",
        postText: `What I wore today`
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
        postId: 4,
        username: "Purple_Skies",
        height: 177,
        chest: 100,
        waist: 82,
        season: "autumn",
        images: ["https://i.imgur.com/PwobPfO.jpeg"],
        postUrl: "",
        tags: ["casual"],
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
] 

// avant-garde/casual/slim/industrial/etc
// Hi there, I was just looking through a WAYWT thread on r/mfa, and came across your post. I wanted to put it on a WAYWT aggregator website I'm building as a practice coding project. Just wanted to ask:
// 1. If you didn't mind me using your post for the aggregator?
// 2. I want to add style/fit description tags (but I'm clueless). What tags would you suggest giving your post (eg, avant-garde/casual/slim/industrial/etc)