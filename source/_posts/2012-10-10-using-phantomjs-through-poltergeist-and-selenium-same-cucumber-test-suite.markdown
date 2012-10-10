---
layout: post
title: "using PhantomJS (through poltergeist) and selenium in the same cucumber test suite"
date: 2012-10-10 12:51
comments: true
categories: 
- Rails
- Cucumber
---

We use DocuSign at Bosltr to facilitate electronic signatures and testing this functionality with Cucumber has proved to be quite a pain. First of all DocuSign uses an iframe to deliver it's functionality so there was that added complexity right off the bat. Secondly because we're doing integration testing I wanted to actually hit the DocuSign test servers and verify that things are still working as I expect because stubbing those requests out wouldn't give me insight into any unexpected API changes breaking our app. Because we're reaching out externally I had to account for the delay in receiving data from DocuSign often needing to `sleep 3` in the step definitions.

The default Selenium driver through Firefox is the only solution for testing the DocuSign iframe that I could get working. However, the rest of the test suite that needs JavaScript testing has been working wonderfully on Poltergeist, an awesome headless PhantomJS driver for Capybara. Poltergeist was throwing errors about elements overlapping in the DocuSign iframe that I couldn't solve but I didn't want to abandon Poltergeist and revert to Selenium for ALL our JS testing, so I figured out a way to use both by tagging stories and using some Before and After hooks.

<!-- more -->

The rest of this post assumes you [already have Poltergeist intalled](https://github.com/jonleighton/poltergeist).

Inside of `features/support/env.rb` add the following hooks:

```ruby
# Hooks
Before('@docusign') do |scenario|
  Capybara.current_driver = :selenium
end

After('@docusign') do |scenario|
  Capybara.use_default_driver
end
```

Additionally, add:

```ruby
Capybara.default_driver = :rack_test
Capybara.javascript_driver = :poltergeist
```

...which I actually have in my `Spork.each_run do` block

Now by default any stories tagged with just `@javascript` will run through PhantomJS. If you want to use Selenium for a given test then you need to tag it with BOTH `@javascript` AND `@docusign`. Perhaps naming the tag `@selenium` would be more approperiate, but I only plan to use Selenium for testing DocuSign stories so this works for me for now. Note: I'm not sure why the `@javascript` tag is required, but it didn't work for me unless I had both tags specified. I'm guessing `@javacript` sets up more than just the driver, but if anyone has more of an explanation I'd love to know.

In an effort to help other devs perhaps more quickly acceptance test DocuSign with Cucumber here are the step definitions that I came up with for our use case.

```ruby
When /^I sign the docusign document as an "(.+)" and click finish$/ do |user_type|
  sleep 3

  within_frame("docusign_iframe") do
    # Docusign disclaimer (review button)
    click_button 'ds_hldrBdy_dlgStart_startReview_btnInline'

    # Sign
    page.find_button('Sign Here').click

    # Adopt and sign (might not always need to do this step if the user has
    # already adopted his or her signature. I would have though we'd have to
    # adopt each time in the testing world but it doesn't seem to be that way)
    if page.has_css?('#ds_hldrBdy_dlgAdoptSig_btnAdoptSignature_btnInline')
      click_button 'ds_hldrBdy_dlgAdoptSig_btnAdoptSignature_btnInline'
    end

    if user_type == 'attorney'
      # DocuSign gives us .FirstPage as a class on the first page and just
      # .Page for each page after that, so this really only works if your first
      # 'Sign Here' is on the first page and there is only one subsequent one
      # within all of the rest of the .Page pages. Still, fits this use case
      # alright as long as the engagement letters in the test env fit on one
      # page so the attorney disclaimer bit is always on page two.
      within(:xpath, "//div[@class='Page' and @class != 'FirstPage']") do
        click_button 'Sign Here'
      end
    end

    # Confirm signing
    click_button 'ds_hldrBdy_navnexttext_btnInline'
  end

  sleep 3
end


When /^I choose to sign the docusign document later$/ do
  sleep 3

  within_frame("docusign_iframe") do
    # Finish Later
    click_button 'ds_hldrBdy_dlgStart_btnIntroSignLater_btnInline'
  end

  sleep 3
end


When /^I decline to sign the docusign document$/ do
  sleep 3

  within_frame("docusign_iframe") do
    # Decline to Sign
    click_button 'ds_hldrBdy_dlgStart_btnIntroDecline_btnInline'

    # Decline confirmation
    click_button 'ds_hldrBdy_dlgDecline_btnDecline_btnInline'
  end

  sleep 3
end
```
