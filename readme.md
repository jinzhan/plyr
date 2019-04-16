# wplayer


## Features

-   **Accessible** - full support for VTT captions and screen readers
-   **[Customisable](#html)** - make the player look how you want with the markup you want
-   **Good HTML** - uses the _right_ elements. `<input type="range">` for volume and `<progress>` for progress and well, `<button>`s for buttons. There's no
    `<span>` or `<a href="#">` button hacks
-   **Responsive** - works with any screen size
-   **HTML Video & Audio** - support for both formats
-   **[Monetization](#ads)** - make money from your videos
-   **[Streaming](#try-plyr-online)** - support for hls.js, Shaka and dash.js streaming playback
-   **[API](#api)** - toggle playback, volume, seeking, and more through a standardized API
-   **[Events](#events)** - no messing around with Vimeo and YouTube APIs, all events are standardized across formats
-   **[Fullscreen](#fullscreen)** - supports native fullscreen with fallback to "full window" modes
-   **[Shortcuts](#shortcuts)** - supports keyboard shortcuts
-   **Picture-in-Picture** - supports Safari's picture-in-picture mode
-   **Playsinline** - supports the `playsinline` attribute
-   **Speed controls** - adjust speed on the fly
-   **Multiple captions** - support for multiple caption tracks
-   **i18n support** - support for internationalization of controls
-   **No dependencies** - written in "vanilla" ES6 JavaScript, no jQuery required
-   **SASS** - to include in your build processes


### HTML

Player extends upon the standard [HTML5 media element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) markup so that's all you need for those types.

#### HTML5 Video

```html
<video poster="/path/to/poster.jpg" id="player" playsinline controls>
    <source src="/path/to/video.mp4" type="video/mp4">
    <source src="/path/to/video.webm" type="video/webm">

    <!-- Captions are optional -->
    <track kind="captions" label="English captions" src="/path/to/captions.vtt" srclang="en" default>
</video>
```

#### HTML5 Audio

```html
<audio id="player" controls>
    <source src="/path/to/audio.mp3" type="audio/mp3">
    <source src="/path/to/audio.ogg" type="audio/ogg">
</audio>
```


### SVG

The icons used in the Player controls are loaded in an SVG sprite. The sprite is automatically loaded from our CDN by default. If you already have an icon build
system in place, you can include the source plyr icons (see `/src/sprite` for source icons).

#### Using the `iconUrl` option

You can however specify your own `iconUrl` option and Player will determine if the url is absolute and requires loading by AJAX/CORS due to current browser
limitations or if it's a relative path, just use the path directly.

If you're using the `<base>` tag on your site, you may need to use something like this: [svgfixer.js](https://gist.github.com/leonderijke/c5cf7c5b2e424c0061d2)

More info on SVG sprites here: [http://css-tricks.com/svg-sprites-use-better-icon-fonts/](http://css-tricks.com/svg-sprites-use-better-icon-fonts/) and the AJAX
technique here: [http://css-tricks.com/ajaxing-svg-sprite/](http://css-tricks.com/ajaxing-svg-sprite/)


#### Using the `inlineSvg` option

You can specify `inlineSvg` option like this: 

```
    const inlineSvg = require('wplayer/dist/plyr.svg');
    
    const player = new Player(someSelector, {
        controls: [
           ...
        ],
        loadSprite: true,
        inlineSvg
    });

```

### Cross Origin (CORS)

You'll notice the `crossorigin` attribute on the example `<video>` elements. This is because the TextTrack captions are loaded from another domain. If your
TextTrack captions are also hosted on another domain, you will need to add this attribute and make sure your host has the correct headers setup. For more info
on CORS checkout the MDN docs:
[https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

### Captions

WebVTT captions are supported. To add a caption track, check the HTML example above and look for the `<track>` element. Be sure to
[validate your caption files](https://quuz.org/webvtt/).

### JavaScript

#### Initialising

You can specify a range of arguments for the constructor to use:

-   A CSS string selector that's compatible with [`querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
-   A [`HTMLElement`](https://developer.mozilla.org/en/docs/Web/API/HTMLElement)
-   A [`NodeList`](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)
-   A [jQuery](https://jquery.com) object

_Note_: If a `NodeList`, `Array`, or jQuery object are passed, the first element will be used for setup. To setup multiple players, see [setting up multiple players](#setting-up-multiple-players) below.

Here's some examples

Passing a [string selector](https://developer.mozilla.org/en-US/docs/Web/API/NodeList):

```javascript
const player = new Player('#player');
```

Passing a [HTMLElement](https://developer.mozilla.org/en/docs/Web/API/HTMLElement):

```javascript
const player = new Player(document.getElementById('player'));
```

Passing a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) (see note below):

```javascript
const player = new Player(document.querySelectorAll('.js-player'));
```

The NodeList, HTMLElement or string selector can be the target `<video>`, `<audio>`, or `<div>` wrapper for embeds.

##### Setting up multiple players

You have two choices here. You can either use a simple array loop to map the constructor:

```javascript
const players = Array.from(document.querySelectorAll('.js-player')).map(p => new Player(p));
```

...or use a static method where you can pass a [string selector](https://developer.mozilla.org/en-US/docs/Web/API/NodeList), a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) or an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of elements:

```javascript
const players = Player.setup('.js-player');
```

Both options will also return an array of instances in the order of they were in the DOM for the string selector or the source NodeList or Array.

##### Passing options

The second argument for the constructor is the [options](#options) object:

```javascript
const player = new Player('#player', {
    /* options */
});
```

In all cases, the constructor will return a Player object that can be used with the [API](#api) methods. See the [API](#api) section for more info.

#### Options

Options can be passed as an object to the constructor as above or as JSON in `data-plyr-config` attribute on each of your target elements:

```html
<video src="/path/to/video.mp4" id="player" controls data-plyr-config='{ "title": "This is an example video", "volume": 1, "debug": true }'></video>
```

Note the single quotes encapsulating the JSON and double quotes on the object keys. Only string values need double quotes.

| Option               | Type                       | Default                                                                                                                        | Description                                                                                                                                                                                                                                                                                                                                                            |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | Boolean                    | `true`                                                                                                                         | Completely disable Player. This would allow you to do a User Agent check or similar to programmatically enable or disable Player for a certain UA. Example below.                                                                                                                                                                                                          |
| `debug`              | Boolean                    | `false`                                                                                                                        | Display debugging information in the console                                                                                                                                                                                                                                                                                                                           |
| `controls`           | Array, Function or Element | `['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']` | If a function is passed, it is assumed your method will return either an element or HTML string for the controls. Three arguments will be passed to your function; `id` (the unique id for the player), `seektime` (the seektime step in seconds), and `title` (the media title). See [controls.md](controls.md) for more info on how the html needs to be structured. |
| `settings`           | Array                      | `['captions', 'quality', 'speed', 'loop']`                                                                                     | If you're using the default controls are used then you can specify which settings to show in the menu                                                                                                                                                                                                                                                                  |
| `i18n`               | Object                     | See [defaults.js](/src/js/config/defaults.js)                                                                                  | Used for internationalization (i18n) of the text within the UI.                                                                                                                                                                                                                                                                                                        |
| `loadSprite`         | Boolean                    | `true`                                                                                                                         | Load the SVG sprite specified as the `iconUrl` option (if a URL). If `false`, it is assumed you are handling sprite loading yourself.                                                                                                                                                                                                                                  |
| `iconUrl`            | String                     | `null`                                                                                                                         | Specify a URL or path to the SVG sprite. See the [SVG section](#svg) for more info.                                                                                                                                                                                                                                                                                    |
| `iconPrefix`         | String                     | `plyr`                                                                                                                         | Specify the id prefix for the icons used in the default controls (e.g. "plyr-play" would be "plyr"). This is to prevent clashes if you're using your own SVG sprite but with the default controls. Most people can ignore this option.                                                                                                                                 |
| `blankVideo`         | String                     | `https://cdn.plyr.io/static/blank.mp4`                                                                                         | Specify a URL or path to a blank video file used to properly cancel network requests.                                                                                                                                                                                                                                                                                  |
| `autoplay`           | Boolean                    | `false`                                                                                                                        | Autoplay the media on load. This is generally advised against on UX grounds. It is also disabled by default in some browsers. If the `autoplay` attribute is present on a `<video>` or `<audio>` element, this will be automatically set to true.                                                                                                                      |
| `autopause`&sup1;    | Boolean                    | `true`                                                                                                                         | Only allow one player playing at once.                                                                                                                                                                                                                                                                                                                                 |
| `seekTime`           | Number                     | `10`                                                                                                                           | The time, in seconds, to seek when a user hits fast forward or rewind.                                                                                                                                                                                                                                                                                                 |
| `volume`             | Number                     | `1`                                                                                                                            | A number, between 0 and 1, representing the initial volume of the player.                                                                                                                                                                                                                                                                                              |
| `muted`              | Boolean                    | `false`                                                                                                                        | Whether to start playback muted. If the `muted` attribute is present on a `<video>` or `<audio>` element, this will be automatically set to true.                                                                                                                                                                                                                      |
| `clickToPlay`        | Boolean                    | `true`                                                                                                                         | Click (or tap) of the video container will toggle play/pause.                                                                                                                                                                                                                                                                                                          |
| `disableContextMenu` | Boolean                    | `true`                                                                                                                         | Disable right click menu on video to <em>help</em> as very primitive obfuscation to prevent downloads of content.                                                                                                                                                                                                                                                      |
| `hideControls`       | Boolean                    | `true`                                                                                                                         | Hide video controls automatically after 2s of no mouse or focus movement, on control element blur (tab out), on playback start or entering fullscreen. As soon as the mouse is moved, a control element is focused or playback is paused, the controls reappear instantly.                                                                                             |
| `resetOnEnd`         | Boolean                    | false                                                                                                                          | Reset the playback to the start once playback is complete.                                                                                                                                                                                                                                                                                                             |
| `keyboard`           | Object                     | `{ focused: true, global: false }`                                                                                             | Enable [keyboard shortcuts](#shortcuts) for focused players only or globally                                                                                                                                                                                                                                                                                           |
| `tooltips`           | Object                     | `{ controls: false, seek: true }`                                                                                              | `controls`: Display control labels as tooltips on `:hover` & `:focus` (by default, the labels are screen reader only). `seek`: Display a seek tooltip to indicate on click where the media would seek to.                                                                                                                                                              |
| `duration`           | Number                     | `null`                                                                                                                         | Specify a custom duration for media.                                                                                                                                                                                                                                                                                                                                   |
| `displayDuration`    | Boolean                    | `true`                                                                                                                         | Displays the duration of the media on the "metadataloaded" event (on startup) in the current time display. This will only work if the `preload` attribute is not set to `none` (or is not set at all) and you choose not to display the duration (see `controls` option).                                                                                              |
| `invertTime`         | Boolean                    | `true`                                                                                                                         | Display the current time as a countdown rather than an incremental counter.                                                                                                                                                                                                                                                                                            |
| `toggleInvert`       | Boolean                    | `true`                                                                                                                         | Allow users to click to toggle the above.                                                                                                                                                                                                                                                                                                                              |
| `listeners`          | Object                     | `null`                                                                                                                         | Allows binding of event listeners to the controls before the default handlers. See the `defaults.js` for available listeners. If your handler prevents default on the event (`event.preventDefault()`), the default handler will not fire.                                                                                                                             |
| `captions`           | Object                     | `{ active: false, language: 'auto', update: false }`                                                                           | `active`: Toggles if captions should be active by default. `language`: Sets the default language to load (if available). 'auto' uses the browser language. `update`: Listen to changes to tracks and update menu. This is needed for some streaming libraries, but can result in unselectable language options).                                                       |
| `fullscreen`         | Object                     | `{ enabled: true, fallback: true, iosNative: false }`                                                                          | `enabled`: Toggles whether fullscreen should be enabled. `fallback`: Allow fallback to a full-window solution. `iosNative`: whether to use native iOS fullscreen when entering fullscreen (no custom controls)                                                                                                                                                         |
| `ratio`              | String                     | `16:9`                                                                                                                         | The aspect ratio you want to use for embedded players.                                                                                                                                                                                                                                                                                                                 |
| `storage`            | Object                     | `{ enabled: true, key: 'plyr' }`                                                                                               | `enabled`: Allow use of local storage to store user settings. `key`: The key name to use.                                                                                                                                                                                                                                                                              |
| `speed`              | Object                     | `{ selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] }`                                                                 | `selected`: The default speed for playback. `options`: Options to display in the menu. Most browsers will refuse to play slower than 0.5.                                                                                                                                                                                                                              |
| `quality`            | Object                     | `{ default: 'default', options: ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny', 'default'] }`      | Currently only supported by YouTube. `default` is the default quality level, determined by YouTube. `options` are the options to display.                                                                                                                                                                                                                              |
| `loop`               | Object                     | `{ active: false }`                                                                                                            | `active`: Whether to loop the current video. If the `loop` attribute is present on a `<video>` or `<audio>` element, this will be automatically set to true This is an object to support future functionality.                                                                                                                                                         |
| `ads`                | Object                     | `{ enabled: false, publisherId: '' }`                                                                                          | `enabled`: Whether to enable vi.ai ads. `publisherId`: Your unique vi.ai publisher ID.                                                                                                                                                                                                                                                                                 |
| `urls`               | Object                     | See source.                                                                                                                    | If you wish to override any API URLs then you can do so here. You can also set a custom download URL for the download button.                                                                                                                                                                                                                                          |

1.  Vimeo only

## API

There are methods, setters and getters on a Player object.

### Object

The easiest way to access the Player object is to set the return value from your call to the constructor to a variable. For example:

```javascript
const player = new Player('#player', {
    /* options */
});
```

You can also access the object through any events:

```javascript
element.addEventListener('ready', event => {
    const player = event.detail.plyr;
});
```

### Methods

Example method use:

```javascript
player.play(); // Start playback
player.fullscreen.enter(); // Enter fullscreen
```

| Method                   | Parameters       | Description                                                                                                |
| ------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| `play()`&sup1;           | -                | Start playback.                                                                                            |
| `pause()`                | -                | Pause playback.                                                                                            |
| `togglePlay(toggle)`     | Boolean          | Toggle playback, if no parameters are passed, it will toggle based on current status.                      |
| `stop()`                 | -                | Stop playback and reset to start.                                                                          |
| `restart()`              | -                | Restart playback.                                                                                          |
| `rewind(seekTime)`       | Number           | Rewind playback by the specified seek time. If no parameter is passed, the default seek time will be used. |
| `forward(seekTime)`      | Number           | Fast forward by the specified seek time. If no parameter is passed, the default seek time will be used.    |
| `increaseVolume(step)`   | Number           | Increase volume by the specified step. If no parameter is passed, the default step will be used.           |
| `decreaseVolume(step)`   | Number           | Increase volume by the specified step. If no parameter is passed, the default step will be used.           |
| `toggleCaptions(toggle)` | Boolean          | Toggle captions display. If no parameter is passed, it will toggle based on current status.                |
| `fullscreen.enter()`     | -                | Enter fullscreen. If fullscreen is not supported, a fallback "full window/viewport" is used instead.       |
| `fullscreen.exit()`      | -                | Exit fullscreen.                                                                                           |
| `fullscreen.toggle()`    | -                | Toggle fullscreen.                                                                                         |
| `airplay()`              | -                | Trigger the airplay dialog on supported devices.                                                           |
| `toggleControls(toggle)` | Boolean          | Toggle the controls (video only). Takes optional truthy value to force it on/off.                          |
| `on(event, function)`    | String, Function | Add an event listener for the specified event.                                                             |
| `once(event, function)`  | String, Function | Add an event listener for the specified event once.                                                        |
| `off(event, function)`   | String, Function | Remove an event listener for the specified event.                                                          |
| `supports(type)`         | String           | Check support for a mime type.                                                                             |
| `destroy()`              | -                | Destroy the instance and garbage collect any elements.                                                     |

1.  For HTML5 players, `play()` will return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) in _some_ browsers - WebKit and Mozilla [according to MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) at time of writing.

### Getters and Setters

Example setters:

```javascript
player.volume = 0.5; // Sets volume at 50%
player.currentTime = 10; // Seeks to 10 seconds
```

Example getters:

```javascript
player.volume; // 0.5;
player.currentTime; // 10
player.fullscreen.active; // false;
```

| Property             | Getter | Setter | Description                                                                                                                                                                                                                                                                                                                            |
| -------------------- | ------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isHTML5`            | ✓      | -      | Returns a boolean indicating if the current player is HTML5.                                                                                                                                                                                                                                                                           |
| `isEmbed`            | ✓      | -      | Returns a boolean indicating if the current player is an embedded player.                                                                                                                                                                                                                                                              |
| `playing`            | ✓      | -      | Returns a boolean indicating if the current player is playing.                                                                                                                                                                                                                                                                         |
| `paused`             | ✓      | -      | Returns a boolean indicating if the current player is paused.                                                                                                                                                                                                                                                                          |
| `stopped`            | ✓      | -      | Returns a boolean indicating if the current player is stopped.                                                                                                                                                                                                                                                                         |
| `ended`              | ✓      | -      | Returns a boolean indicating if the current player has finished playback.                                                                                                                                                                                                                                                              |
| `buffered`           | ✓      | -      | Returns a float between 0 and 1 indicating how much of the media is buffered                                                                                                                                                                                                                                                           |
| `currentTime`        | ✓      | ✓      | Gets or sets the currentTime for the player. The setter accepts a float in seconds.                                                                                                                                                                                                                                                    |
| `seeking`            | ✓      | -      | Returns a boolean indicating if the current player is seeking.                                                                                                                                                                                                                                                                         |
| `duration`           | ✓      | -      | Returns the duration for the current media.                                                                                                                                                                                                                                                                                            |
| `volume`             | ✓      | ✓      | Gets or sets the volume for the player. The setter accepts a float between 0 and 1.                                                                                                                                                                                                                                                    |
| `muted`              | ✓      | ✓      | Gets or sets the muted state of the player. The setter accepts a boolean.                                                                                                                                                                                                                                                              |
| `hasAudio`           | ✓      | -      | Returns a boolean indicating if the current media has an audio track.                                                                                                                                                                                                                                                                  |
| `speed`              | ✓      | ✓      | Gets or sets the speed for the player. The setter accepts a value in the options specified in your config. Generally the minimum should be 0.5.                                                                                                                                                                                        |
| `quality`&sup1;      | ✓      | ✓      | Gets or sets the quality for the player. The setter accepts a value from the options specified in your config.                                                                                                                                                                                                                         |
| `loop`               | ✓      | ✓      | Gets or sets the current loop state of the player. The setter accepts a boolean.                                                                                                                                                                                                                                                       |
| `source`             | ✓      | ✓      | Gets or sets the current source for the player. The setter accepts an object. See [source setter](#the-source-setter) below for examples.                                                                                                                                                                                              |
| `poster`             | ✓      | ✓      | Gets or sets the current poster image for the player. The setter accepts a string; the URL for the updated poster image.                                                                                                                                                                                                               |
| `autoplay`           | ✓      | ✓      | Gets or sets the autoplay state of the player. The setter accepts a boolean.                                                                                                                                                                                                                                                           |
| `currentTrack`       | ✓      | ✓      | Gets or sets the caption track by index. `-1` means the track is missing or captions is not active                                                                                                                                                                                                                                     |
| `language`           | ✓      | ✓      | Gets or sets the preferred captions language for the player. The setter accepts an ISO two-letter language code. Support for the languages is dependent on the captions you include. If your captions don't have any language data, or if you have multiple tracks with the same language, you may want to use `currentTrack` instead. |
| `fullscreen.active`  | ✓      | -      | Returns a boolean indicating if the current player is in fullscreen mode.                                                                                                                                                                                                                                                              |
| `fullscreen.enabled` | ✓      | -      | Returns a boolean indicating if the current player has fullscreen enabled.                                                                                                                                                                                                                                                             |
| `pip`&sup2;                | ✓      | ✓      | Gets or sets the picture-in-picture state of the player. The setter accepts a boolean. This currently only supported on Safari 10+ (on MacOS Sierra+ and iOS 10+) and Chrome 70+.                                                                                                                                                      |

1.  YouTube only. HTML5 will follow.
2.  HTML5 only

#### The `.source` setter

This allows changing the player source and type on the fly.

Video example:

```javascript
player.source = {
    type: 'video',
    title: 'Example title',
    sources: [
        {
            src: '/path/to/movie.mp4',
            type: 'video/mp4',
            size: 720,
        },
        {
            src: '/path/to/movie.webm',
            type: 'video/webm',
            size: 1080,
        },
    ],
    poster: '/path/to/poster.jpg',
    tracks: [
        {
            kind: 'captions',
            label: 'English',
            srclang: 'en',
            src: '/path/to/captions.en.vtt',
            default: true,
        },
        {
            kind: 'captions',
            label: 'French',
            srclang: 'fr',
            src: '/path/to/captions.fr.vtt',
        },
    ],
};
```

Audio example:

```javascript
player.source = {
    type: 'audio',
    title: 'Example title',
    sources: [
        {
            src: '/path/to/audio.mp3',
            type: 'audio/mp3',
        },
        {
            src: '/path/to/audio.ogg',
            type: 'audio/ogg',
        },
    ],
};
```


_Note:_ `src` property for YouTube and Vimeo can either be the video ID or the whole URL.

| Property       | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`         | String | Either `video` or `audio`. _Note:_ YouTube and Vimeo are currently not supported as audio sources.                                                                                                                                                                                                                                                                                                             |
| `title`        | String | _Optional._ Title of the new media. Used for the `aria-label` attribute on the play button, and outer container. YouTube and Vimeo are populated automatically.                                                                                                                                                                                                                                                |
| `sources`      | Array  | This is an array of sources. For HTML5 media, the properties of this object are mapped directly to HTML attributes so more can be added to the object if required.                                                                                                                                                                                                                                             |
| `poster`&sup1; | String | The URL for the poster image (HTML5 video only).                                                                                                                                                                                                                                                                                                                                                               |
| `tracks`&sup1; | String | An array of track objects. Each element in the array is mapped directly to a track element and any keys mapped directly to HTML attributes so as in the example above, it will render as `<track kind="captions" label="English" srclang="en" src="https://cdn.selz.com/plyr/1.0/example_captions_en.vtt" default>` and similar for the French version. Booleans are converted to HTML5 value-less attributes. |

1.  HTML5 only

## Events

You can listen for events on the target element you setup Player on (see example under the table). Some events only apply to HTML5 audio and video. Using your
reference to the instance, you can use the `on()` API method or `addEventListener()`. Access to the API can be obtained this way through the `event.detail.plyr`
property. Here's an example:

```javascript
player.on('ready', event => {
    const instance = event.detail.plyr;
});
```

### Standard Media Events

| Event Type         | Description                                                                                                                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `progress`         | Sent periodically to inform interested parties of progress downloading the media. Information about the current amount of the media that has been downloaded is available in the media element's `buffered` attribute. |
| `playing`          | Sent when the media begins to play (either for the first time, after having been paused, or after ending and then restarting).                                                                                         |
| `play`             | Sent when playback of the media starts after having been paused; that is, when playback is resumed after a prior `pause` event.                                                                                        |
| `pause`            | Sent when playback is paused.                                                                                                                                                                                          |
| `timeupdate`       | The time indicated by the element's `currentTime` attribute has changed.                                                                                                                                               |
| `volumechange`     | Sent when the audio volume changes (both when the volume is set and when the `muted` state is changed).                                                                                                                |
| `seeking`          | Sent when a seek operation begins.                                                                                                                                                                                     |
| `seeked`           | Sent when a seek operation completes.                                                                                                                                                                                  |
| `ratechange`       | Sent when the playback speed changes.                                                                                                                                                                                  |
| `ended`            | Sent when playback completes. _Note:_ This does not fire if `autoplay` is true.                                                                                                                                        |
| `enterfullscreen`  | Sent when the player enters fullscreen mode (either the proper fullscreen or full-window fallback for older browsers).                                                                                                 |
| `exitfullscreen`   | Sent when the player exits fullscreen mode.                                                                                                                                                                            |
| `captionsenabled`  | Sent when captions are enabled.                                                                                                                                                                                        |
| `captionsdisabled` | Sent when captions are disabled.                                                                                                                                                                                       |
| `languagechange`   | Sent when the caption language is changed.                                                                                                                                                                             |
| `controlshidden`   | Sent when the controls are hidden.                                                                                                                                                                                     |
| `controlsshown`    | Sent when the controls are shown.                                                                                                                                                                                      |
| `ready`            | Triggered when the instance is ready for API calls.                                                                                                                                                                    |

#### HTML5 only

| Event Type       | Description                                                                                                                                                                                                                                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loadstart`      | Sent when loading of the media begins.                                                                                                                                                                                                                                                                                                         |
| `loadeddata`     | The first frame of the media has finished loading.                                                                                                                                                                                                                                                                                             |
| `loadedmetadata` | The media's metadata has finished loading; all attributes now contain as much useful information as they're going to.                                                                                                                                                                                                                          |
| `qualitychange`  | The quality of playback has changed.                                                                                                                                                                                                                                                                                                           |
| `canplay`        | Sent when enough data is available that the media can be played, at least for a couple of frames. This corresponds to the `HAVE_ENOUGH_DATA` `readyState`.                                                                                                                                                                                     |
| `canplaythrough` | Sent when the ready state changes to `CAN_PLAY_THROUGH`, indicating that the entire media can be played without interruption, assuming the download rate remains at least at the current level. _Note:_ Manually setting the `currentTime` will eventually fire a `canplaythrough` event in firefox. Other browsers might not fire this event. |
| `stalled`        | Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.                                                                                                                                                                                                                                              |
| `waiting`        | Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek).                                                                                                                                                                                                                  |
| `emptied`        | he media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the `load()` method is called to reload it.                                                                                                                                                                         |
| `cuechange`      | Sent when a `TextTrack` has changed the currently displaying cues.                                                                                                                                                                                                                                                                             |
| `error`          | Sent when an error occurs. The element's `error` attribute contains more information.                                                                                                                                                                                                                                                          |


## Shortcuts

By default, a player will bind the following keyboard shortcuts when it has focus. If you have the `global` option to `true` and there's only one player in the
document then the shortcuts will work when any element has focus, apart from an element that requires input.

| Key        | Action                                 |
| ---------- | -------------------------------------- |
| `0` to `9` | Seek from 0 to 90% respectively        |
| `space`    | Toggle playback                        |
| `K`        | Toggle playback                        |
| &larr;     | Seek backward by the `seekTime` option |
| &rarr;     | Seek forward by the `seekTime` option  |
| &uarr;     | Increase volume                        |
| &darr;     | Decrease volume                        |
| `M`        | Toggle mute                            |
| `F`        | Toggle fullscreen                      |
| `C`        | Toggle captions                        |
| `L`        | Toggle loop                            |

## Fullscreen

Fullscreen in Player is supported by all browsers that [currently support it](http://caniuse.com/#feat=fullscreen).

## Browser support

Player supports the last 2 versions of most _modern_ browsers.

| Browser       | Supported     |
| ------------- | ------------- |
| Safari        | ✓             |
| Mobile Safari | ✓&sup1;       |
| Firefox       | ✓             |
| Chrome        | ✓             |
| Opera         | ✓             |
| Edge          | ✓             |
| IE11          | ✓&sup3;       |
| IE10          | ✓&sup2;&sup3; |

1.  Mobile Safari on the iPhone forces the native player for `<video>` unless the `playsinline` attribute is present. Volume controls are also disabled as they are handled device wide.
2.  Native player used (no support for `<progress>` or `<input type="range">`) but the API is supported. No native fullscreen support, fallback can be used (see [options](#options)).
3.  Polyfills required. See below.

### Polyfills

Player uses ES6 which isn't supported in all browsers quite yet. This means some features will need to be polyfilled to be available otherwise you'll run into issues. We've elected to not burden the ~90% of users that do support these features with extra JS and instead leave polyfilling to you to work out based on your needs. The easiest method I've found is to use [polyfill.io](https://polyfill.io) which provides polyfills based on user agent. This is the method the demo uses.

### Checking for support

You can use the static method to check for support. For example

```javascript
const supported = Player.supported('video', 'html5', true);
```

The arguments are:

-   Media type (`audio` or `video`)
-   Provider (`html5`, `youtube` or `vimeo`)
-   Whether the player has the `playsinline` attribute (only applicable to iOS 10+)

### Disable support programatically

The `enabled` option can be used to disable certain User Agents. For example, if you don't want to use Player for smartphones, you could use:

```javascript
{
    enabled: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}
```

If a User Agent is disabled but supports `<video>` and `<audio>` natively, it will use the native player.

## RangeTouch

Some touch browsers (particularly Mobile Safari on iOS) seem to have issues with `<input type="range">` elements whereby touching the track to set the value
doesn't work and sliding the thumb can be tricky. To combat this, I've created [RangeTouch](https://rangetouch.com) which I'd recommend including in your
solution. It's a tiny script with a nice benefit for users on touch devices.

## Issues

If you find anything weird with Player, please let us know using the GitHub issues tracker.


## Copyright and License

[The MIT license](license.md)
