---
layout: post
title: "breaking out of an iframe from a rails controller"
date: 2012-07-07 03:56
comments: true
categories: 
- Rails 
- JavaScript
---

For the [docusign_rest](https://github.com/j2fly/docusign_rest) gem that I recently created I needed to break out of the DocuSign iframe after a signer successfully signed the embedded PDF and redirect to a controller action showing that action's view.

After a bit of Googling I found this code snippet:

```html
<html>
  <body>
    <script type='text/javascript' charset='utf-8'>
      parent.location.href = '/myloc';
    </script>
  </body>
</html>
```

Which can be implemented in a Rails controller like so:

```ruby
render text: "<html><body><script type='text/javascript' charset='utf-8'>window.parent.document.location.href = '/myloc';</script></body></html>", content_type: :html
```

<!-- more -->

The above code snippet takes the place of the traditional `redirect_to`. The beauty of this solution is that after the signer interacts with the document and completes his or her signing ceremony, the app will act just like we had served the embedded signing iframe code directly from our own view. There isn't a button to click that says "go to parent" or "back to home" or anything, it just works and redirects appropriately when the user is done interacting with the iframe.

I created a little utility method in the [docusign_rest](https://github.com/j2fly/docusign_rest/blob/master/lib/docusign_rest/utility.rb#L49) gem to abstract the JS portion and make it more consise. See lines 23 and 26 in the example controller code below:

```ruby    
class SomeController < ApplicationController

  # the view corresponding to this action has the iframe in it with the
  # @url as it's src. @envelope_response is populated from either:
  # @envelope_response = client.create_envelope_from_document
  # or
  # @envelope_response = client.create_envelope_from_template
  def embedded_signing
    client = DocusignRest::Client.new
    @url = client.get_recipient_view(
      envelope_id: @envelope_response["envelopeId"],
      name: current_user.display_name,
      email: current_user.email,
      return_url: "http://localhost:3000/docusign_response"
    )
  end

  def docusign_response
    utility = DocusignRest::Utility.new

    if params[:event] == "signing_complete"
      flash[:notice] = "Thanks! Successfully signed"
      render :text => utility.breakout_path(some_path), content_type: :html
    else
      flash[:notice] = "You chose not to sign the document."
      render :text => utility.breakout_path(some_other_path), content_type: :html
    end
  end

end
```

Here is the method in the Utility class of the DocuSign module that handles embedding the path in the HTML snippet.

```ruby
def breakout_path(path)
  "<html><body><script type='text/javascript' charset='utf-8'>parent.location.href = '#{path}';</script></body></html>"
end
```
