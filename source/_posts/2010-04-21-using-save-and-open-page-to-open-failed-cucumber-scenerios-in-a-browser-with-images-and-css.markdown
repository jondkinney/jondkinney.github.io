---
layout: post
title: "Using save_and_open_page to open failed cucumber scenerios in a browser with images and  CSS"
date: 2010-04-21 16:43
comments: false
categories: 
- Rails
- Cucumber
alias: /articles/2010/04/21/using-save_and_open_page-to-open-failed-cucumber-scenerios-in-a-browser-with-images-and-css/
---

I've been doing a lot of Cucumber testing lately and have really been liking it, but there is one thing that is hard with Cucumber... debugging errors. That is until I found out about the save_and_open_page method that webrat provides for opening a browser to the page the cuke puked on from Bodaniel Jeanes over on <a target='_blank' href="http://bjeanes.com/2010/02/10/automatically-open-the-last-page-for-failed-scenarios">his blog</a>.

The only problem was that the page didn't look very nice. I could have left it (it was working after all) but then I ran across <a target='_blank' href="http://gist.github.com/320890">an init script for cuke</a> in a gist from Duff that allowed for the rewriting of the paths to the local image, JavaScript and CSS files so they at least could be referenced properly. While this worked, most of my images were specified as backgrounds in my actual CSS files so if I wanted to be able to see the page as it was intended I would need to find a way to change the paths in the actual CSS files as well.

<!-- more -->

After playing around with the idea of modifying my actual CSS files temporarily and then switching them back (and realizing that solution was full of fail) I settled on a way strip out all links to all css files and then embed the actual CSS inline in a style tag inside the page's head tag. This way I can more easily and permanently modify the css background image paths all in a self contained HTML file. I did this by looping through a specified directory on the file system that contains CSS files and looking for any stylesheets that the user specifies and in the order that the user specifies so that the hierarchy would remain in tact when the styles were all embedded inline.

Since Cucumber's env.rb file is auto-generated it's a bad place to store customized configuration options. Instead I encourage you to do what Cucumber says at the top of the env.rb file and put it somewhere else. From env.rb: "Cucumber will automatically load all features/**/*.rb files"

I chose to put this code in a file under the features/support directory called: open_browser_on_fail.rb. If it's sitting next to the env.rb file itself then you have the new file in the right place.

Place the following code in that file and you'll be good to go!

```ruby
After do |scenario|  
  if scenario.status == :failed
    save_and_open_page
  end  
end

module Webrat
  module SaveAndOpenPage
    def save_and_open_page
      return unless File.exist?(Webrat.configuration.saved_pages_dir)
      
      filename = "#{Webrat.configuration.saved_pages_dir}/webrat-#{Time.now.to_i}.html"
      
      File.open(filename, "w") do |f|
        f.write rewrite_public_file_references(response_body)
      end
      
      open_in_browser(filename)
    end
    
    def rewrite_public_file_references(response_html)
      # remove conditional comments/ie stylesheets
      response_html.gsub!(/<!--\[.*?\]-->/im, '')
      # remove other stylesheets
      response_html.gsub!(/<link href=(.*)\/>/i, '')
      
      response_html.gsub!(/("|')\/(stylesheets|images|javascripts)/, '\1' + '../public' + '/\2')
      
      response_html.gsub!(/<\/head>/i, "<style>#{rewrite_public_stylesheet_image_references('\/images', '../public')}<\/style>\n<\/head>")
    end
    
    def rewrite_public_stylesheet_image_references(regex, server_url)
      dir = "/Users/jkinney/Sites/Rails/Client/new_rails_app/public/stylesheets/"
      
      stylesheets = %w(reset admin main js_menu css_tabs firefox)
      
      css = ""
      stylesheets.each do |file|
        # puts file
        lines = []
        File.open(dir+file+".css", "r"){|f| lines = f.readlines }
        lines = lines.inject([]){|l, line| l << line.gsub(/#{regex}/i, "#{server_url}/images")}
        css << lines.to_s
      end
      css
    end
    
  end
end
```
