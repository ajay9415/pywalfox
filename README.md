![Theme preview](https://i.imgur.com/Gw7lp2u.png "Theme preview Black")
![Theme preview](https://i.imgur.com/lFaQAve.png "Theme preview Pink")
![Theme preview](https://i.imgur.com/GQKzDff.png "Theme preview Blue")

# Pywalfox

Pywalfox allows Firefox to be themed using Pywal. There is an option to use a custom CSS-file that adds things such as a thin scrollbar, smaller and bold text, styled dropdowns, etc, as well as a theme for DuckDuckGo.

The custom CSS is optional and can be enabled/disabled from within the extension (there may be some issues if you have multiple profiles in firefox). You also have to enable the support for custom CSS for it to work. How to do this is described down below.

The addon is using the new Theme API to dynamically change colors in a more efficient and future-proof way. However, some features still require custom CSS since they are not available from the Theme API. The goal is to move away completely from custom CSS and considering that you need to enable a flag to be able to use it in the first place, it is obvious that they want to drop support for it eventually. Using the new Theme API also helps with compatibility, since future UI updates to Firefox may change selectors, variables, etc. 

You can download the Firefox Addon here: https://addons.mozilla.org/en-US/firefox/addon/pywalfox/

### Warning
The layout presented in the screenshots with the bookmarks to the right of the URL-bar is simply my preferred layout. You are free to use whatever you like.

Pywalfox is quite new and not fully polished, so there may be some issues with styling/readability in some cases. The extension and script has only been tested on two different machines running Arch Linux and very similiar setups, so things may not work as expected for you out of the box. Feel free to create an issue/pull request or reach out to me for any issues you may have.

### Installation
1. `git clone git@github.com:Frewacom/Pywalfox.git`
2. `cd Pywalfox/native-app`
3. `bash setup.sh`

The setup script will require sudo access, since the path in which we need to place the native app manifest is protected by default. Firefox requires said manifest to allow communication between the addon and the script running on your system.
Make sure to run the script from within the `native-app` folder, or you will get errors.

If everything goes as planned, it should look something like this:
```
Creating 'native-messaging-hosts' folder in ~/.mozilla
Setting path to pywal-fetcher.py in the native app manifest
Copying native application manifest to ~/.mozilla/native-messaging-hostst/pywalfox.json
Setting execution permissions on daemon (pywal-fetcher.py)
Finished.
```

When this is done, you should be able to apply the theme using the addon menu.

### Custom CSS (userChrome.css and userContent.css)
If you want to use the custom CSS, you must do the following:
1. Navigate to `about:config` in Firefox
2. Set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`

### Troubleshooting
* Make sure that `path` in `~/.mozilla/native-messaging-hosts/pywalfox.json` points to the location of `Pywalfox/native-app/pywal-fetcher.py`
* Make sure that `pywal-fetcher.py` is executable (`chmod +x pywal-fetcher.py`)
* Make sure that the file `~/.cache/wal/colors` exists and contains the colors generated by pywal
* Take a look at the Browser console (`Tools > Web developer > Browser console`) for errors

### Roadmap
Feel free to create issues/pull requests for features you want to be added. You can see what is currently planned/being worked on here: https://trello.com/b/1xkrD1GS/pywalfox
