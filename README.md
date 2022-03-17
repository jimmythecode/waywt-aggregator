# WAYWT Aggregator

WAYWT ("What Are You Wearing Today") Aggregator is a tool to enable users to filter through previous posts on r/malefashionadvice's WAYWT threads. [Hosted Demo](https://waywt.netlify.app/)

<p align="center">
  <img src="https://i.imgur.com/4layLOg.gif"  />
    <img src="https://i.imgur.com/OHvNSDF.gif"  />
</p>
<figcaption align = "center"><b>The left gif demonstrates how the results can be viewed for simple information, such as the dress styles of the post. The username and location of the poster is viewable, and clicking the image will take the user to the original post on Reddit.  The right gif demonstrates the filter in action. Currently the user can filter by styles, username, measurements, and seasonal color.</b></figcaption>
<br/><br/>

Each Reddit post will contain an image of the post author wearing whatever attire they chose for the day. The other Redditors can then provide feedback, and other Reddit browsers (lurkers) can use the post for inspiration for their own attire.
<br/>

<p float="middle" align="center">
  <img src="https://i.imgur.com/39Rwuya.png" width="49%" />
  <img src="https://i.imgur.com/136Erhj.jpg" width="49%" /> 
</p>
<figcaption align = "center"><b>A typical WAYWT thread (left) and an example of the kind of image associated with the post (right)</b></figcaption>

# The Code
The front-end was built using Create-React-App, using typescript. The majority of the components are from the Material UI library.

The [back-end API](https://github.com/jimmythecode/waywt-backend) is built on ASP.NET, using C#. Currently, the API is only used for creating a user session and recording user interactions with the demo. 

## Code Features
### Testing
Only the filterReducer is currently tested. TDD was carried out using Jest.
### Memoisation and Performance
To improve the speed of the app, the `SearchResults` component was wrapped in `React.memo()`. The comparison function checks that the filter options are changed/unchanged compared to the current results on display and will only re-render if there has been a change.

The `filterState` is created in `SearchContext.tsx`. It is a complex, nested object which provides memoisation of results for each of the filters. This was me trying to save memory compared to recalculating all the filters on each change.
### Logging/Analytics
I've used a custom `useInterval` hook to provide a dynamic interval for sending recorded user interactions to the ASP.NET API (see `LoggingContext.tsx` for more info). The `LoggingContext` records such interactions as clicking filters, menus, etc.
