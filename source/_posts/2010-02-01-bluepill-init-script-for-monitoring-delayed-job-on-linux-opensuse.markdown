---
layout: post
title: "Bluepill init script for Monitoring Delayed Job on Linux openSUSE"
date: 2010-02-01 16:08
comments: false
categories: 
- Linux, Rails
alias: /articles/2010/02/01/bluepill-init-script-for-monitoring-delayed-job-on-linux-opensuse/
---

I recently moved a long running request in my application to delayed job ([the collectiveidea fork](http://github.com/collectiveidea/delayed_job)) and it went really well. However, after some time the delayed job process died and my users couldn't use an essential part of the application. I knew it was time for a process monitor. I probably should have put one in to begin with, but I was new to delayed job (really to background processing in general) and the though hadn't crossed my mind.

<!-- more -->

I googled around and found [several](http://blog.plataformatec.com.br/2010/02/monitoring-delayed-job-with-bluepill-and-capistrano) [articles](http://rails.co.za/2009/11/14/monitoring-delayed-job-with-bluepill.html) that told me exactly how to get bluepill to monitor delayed job and even one for [monitoring apache](http://mickeyben.com/2009/12/22/monitoring-apache-with-bluepill.html), but none of them seemed to give me a way to create an init script that would ensure that if the server rebooted, bluepill would start up and make sure delayed job continued to work.

It took a while but I finally found <a target="_blank" href="http://groups.google.com/group/bluepill-rb/browse_thread/thread/96f9db9d5213ef39">this post</a> in the bluepill google group asking about documentation and an init script. The author (Carl) later answered his own post with <a target="_blank" href="http://gist.github.com/272125">this gist</a> containing an init script for bluepill! I thought I was set, so I set out to figure out how to create an init script for openSUSE, the flavor of Linux <a target="_blank" href="http://avastonetech.com">my company</a> uses. A simple google search yielded this <a target="_blank" href="http://en.opensuse.org/SDB:How_to_Create_Your_Own_Init_Script">great post</a> about creating your own init script in openSUSE.

I followed it's directions and was very happy to find that issuing the following command `/etc/init.d/bluepill restart` resulted in bluepill being started and then executing `bluepill status` revealed that the delayed job process was indeed "UP" meaning that bluepill was doing it's job. Then I rebooted the machine and what happened next isn't for the faint of heart... after the machine rebooted and I SSH'd back into the box to check the bluepill log and I was devastated. The logs were reporting that bluepill couldn't start!

```ruby
Mar  3 18:32:02 if-suse11-stage bluepilld[2344]: [application_name:delayed_job] Start command execution returned non-zero exit code:
Mar  3 18:32:02 if-suse11-stage bluepilld[2344]: [application_name:delayed_job] {:stdout=>"", :stderr=>"script/delayed_job:3:in 'require': no such file to load -- rubygems (LoadError) from script/delayed_job:3", :exit_code=>1}
Mar  3 18:32:02 if-suse11-stage bluepilld[2344]: [application_name:delayed_job] Going from down => starting
```

Ok, so maybe it's not that bad but I'm not a Linux expert (I'm decent, but only because I need to know Linux to host rails) and this was my first init script so I was pretty sunk. Having nowhere else to go, I <a target="_blank" href="http://github.com/arya/bluepill/issues/closed#issue/41">turned to</a> the author of bluepill himself, <a target="_blank" href="http://github.com/arya">Arya</a>. He was very helpful in answering my questions and as it turned out, my environment variables were not setup properly. Well, really the problem was that I had two installations of Ruby (apparently) and so the script was trying to start under the wrong one (I guess). Ayra's suggestion in the issues section of his github page was to add this code:

```ruby
export PATH="/usr/local/bin:$PATH"
```

It worked and I haven't bothered to investigate much further. Here is my full init script, hopefully this will help someone else in the future!

```bash
#!/bin/sh

# Author: Jon Kinney
# Based on the opensuse skeleton /etc/init.d/skeleton init script

### BEGIN INIT INFO
# Provides: bluepill
# Required-Start:
# Required-Stop:
# Default-Start: 2 3 4 5
# Default-Stop: 0 1 6
# Short-Description: bluepill daemon, providing process monitoring
# Description: bluepill is a monitoring tool. More info at http://github.com/arya/bluepill.
### END INIT INFO

export PATH="/usr/local/bin:$PATH"

# Check for missing binaries
BLUEPILL_BIN=/usr/local/bin/bluepill
test -x $BLUEPILL_BIN || { echo "$BLUEPILL_BIN not installed";
        if [ "$1" = "stop" ]; then exit 0;
        else exit 5; fi; }

# Check for existence of needed config file and read it
BLUEPILL_CONFIG=/srv/www/app_name/shared/config/delayed_job.pill
test -r $BLUEPILL_CONFIG || { echo "$BLUEPILL_CONFIG not existing";
        if [ "$1" = "stop" ]; then exit 0;
        else exit 6; fi; }

case "$1" in
    start)
        echo -n "Starting bluepill "
        $BLUEPILL_BIN load $BLUEPILL_CONFIG
        ;;
    stop)
        echo -n "Shutting down bluepill "
        $BLUEPILL_BIN quit
        ;;
    restart)
        ## Stop the service and regardless of whether it was
        ## running or not, start it again.
        $0 stop
        $0 start
        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
        ;;
esac
```
