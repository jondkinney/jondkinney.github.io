---
layout: post
title: "Wiring up LittleSnapper to CloudApp"
date: 2012-10-01 09:28
comments: true
categories: 
- OS X
---

I used to love Skitch, but the recent changes have made it less awesome so I decided to seek out alternative options. I have a licensed copy of [LittleSnapper](http://www.realmacsoftware.com/littlesnapper/) from a bundle of Mac apps that I purchased a while back so I decided to give it a go.

I also use CloudApp multiple times per day (and pay for a pro subscription) so I was encouraged when I saw [an article](http://blog.getcloudapp.com/ember-in-the-house) stating that RealMac (the team behind LittleSnapper) was working on integration with CloudApp, but [nothing has developed](https://twitter.com/cloudapp/status/250758889249849344) on that front in over a year and I didn't want to wait any longer so I started down the path of solving the problem myself.

Here's how it works:

  * Configure LittleSnapper to use SFTP to "publish" locally to a folder of your choosing.
  * Create a new Automator "Folder Action" which runs an AppleScript when the contents of the folder changes.
  * Use the CloudApp API through a Ruby script (called by the aforementioned AppleScript) to publish the given file.

<!-- more -->

##Details with Code and Screenshots

1. Configure LittleSnapper's publishing preferences to include a location local to your machine. 

    * Use your Mac username and password when setting up this connection. The "Server" is whatever shows up when you open System Preferences and choose "Sharing". At the top you'll see a note stating: "Computers on your local network can access your computer at: MBPr.local". Use the full name including .local shown there (which will likely be different than mine).
    
    * The file path I'm using is: `/Users/jon/Pictures/ScreenShots/LittleSnapper`. 

        * Note: I used TinkerTool to change the default location where OS X stores screenshots to ~/Pictures/ScreenShots so using a subdirectory of that folder seemes optimal.

    ![LittleSnapper Publishing Preferences](http://f.cl.ly/items/1G3P2f1z1Q0t1I1Z2C07/Screen%20Shot%202012-10-01%20at%209.40.07%20AM.png)

1. Create a new Automator "Folder Action" which runs an AppleScript when the contents of a folder you specify changes.

    ![New Automator Folder Action](http://f.cl.ly/items/0X1u2S2h43160Z2n0h0Q/Screen%20Shot%202012-10-01%20at%2010.21.50%20AM.png)

    Filter the available Actions by searching for "Run AppleScript", then drag that action to your workflow:

    ![Drag Run AppleScript to Workflow](http://f.cl.ly/items/3D0G1g0H2K1O222M2t3A/Screen%20Shot%202012-10-01%20at%2010.25.35%20AM.png)

    Set the folder action to the same folder you chose in the above steps and paste in (and customize if necessary) the provided AppleScript     

    ![Configure AppleScript](http://f.cl.ly/items/3o1Q2j0K2h0P0l0p2j1a/Screen%20Shot%202012-10-01%20at%2010.26.56%20AM.png)

    AppleScript for the Automator Action:

        set cloudappSlug to do shell script "cd /Users/jon/Pictures/ScreenShots/scripts; /Users/jon/.rbenv/versions/1.9.3-p194-perf/bin/ruby cloud.rb"
        set the clipboard to cloudappSlug
        do shell script "afplay /System/Library/Sounds/Glass.aiff"
      
    **Note:** It's necessary to use the full path to the version of Ruby that has the cloudapp_api gem installed under it. Type `which ruby` to show the full path to your currently executable Ruby and be sure to `gem install cloudapp_api` or `sudo gem install cloudapp_api` under that same Ruby version. Sudo is only required if you're not using a Ruby version management solution and are using the default system Ruby that shipped with OS X. You can also see in the above AppleScript that we change into the folder that contains the Ruby script before calling it. Be sure to customize the script to change into the folder where you place the Ruby script if it's different than mine.

    * After saving the Automator Action (I chose the name "Watch LittleSnapper"), navigate to the chosen folder in Finder and right click, choose Services > Folder Action Setup... 
    
    ![Finder Folder Action Menu](http://f.cl.ly/items/1N06122b3x0d2q1q411Q/Screen%20Shot%202012-10-01%20at%2010.55.48%20AM.png)
    
    * Cancel the pop up dialog and verify that your Automator Folder Action is there and checked (enabled).
    
    ![Folder Action Worked](http://f.cl.ly/items/2d1z1l3G1o1S2p1K3w3h/Screen%20Shot%202012-10-01%20at%2010.57.05%20AM.png)

1. Use the CloudApp API through a Ruby script (called by the aforementioned AppleScript) to publish the given file.
                                                            
    * Place the below Ruby script somewhere on your machine (the AppleScript I provide assumes it's in ~/Pictures/ScreenShots/scripts/cloud.rb). 
 
    * Note that the first line of the Ruby script also references the full path to the version of Ruby you want to use. It will likely be different than what I show here. It should be customized the same as it was in the AppleScript above.

    * You can also see there is authentication to the CloudApp servers necessary on line 7. Customize the script with your CloudApp username and password here. 
  
```ruby
#!/Users/jon/.rbenv/versions/1.9.3-p194-perf/bin/ruby

require 'rubygems'
require 'cloudapp_api'

# customize me please
CloudApp.authenticate "your_email_here", "your_password_here"

pasteboard_file = `cd /Users/jon/Pictures/ScreenShots/LittleSnapper; ls -td * | head -1`
file = "/Users/jon/Pictures/ScreenShots/LittleSnapper/#{pasteboard_file.chomp}"

@drop = CloudApp::Drop.create :upload, :file => file

puts @drop.data["url"]
```

  * Make sure the ruby script is executable:

```bash
cd ~/Pictures/ScreenShots/scripts
chmod 755 cloud.rb
```

### Wrapping Up

All that's left to do is try it out!

  * Take a screenshot with LittleSnapper and publish it to local folder we setup in step 1
  * Wait for the ding
  * Paste the new CloudApp slug to the screen shot you just uploaded! 

If this all seems like a bit of a pain for something so simple, you're right... it is. And for the vast majority of cases I still do what I did with Skitch which is to just take a screenshot of my annotated screenshot with the normal Cmd+Shift+4 shortcut which will automatically upload to CloudApp. However, LittleSnapper can also take screenshots of entire web pages (even the portion that doesn't fit on your screen!) and sometimes I want to upload those screenshots to CloudApp too. Hopefully the Realmac team will just start providing CloudApp support natively so folks won't have to use crazy workarounds like this!
