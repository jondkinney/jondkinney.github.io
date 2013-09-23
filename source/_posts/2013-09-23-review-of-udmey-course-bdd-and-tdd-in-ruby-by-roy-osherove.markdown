---
layout: post
title: "Review of Udmey course: BDD and TDD in Ruby by Roy Osherove"
date: 2013-09-23 12:01
comments: true
categories: 
- Reviews
- Rspec
---

Avdi Grimm recently [tweeted](https://twitter.com/avdi/status/381090549488287744) about a new Udmey course [TDD and BDD in Ruby](https://www.udemy.com/tdd-bdd-in-ruby) by [Roy Osherove](https://twitter.com/royosherove). I'm not sure if this was an endorsement by Avdi, or more of a "oh hey, there's this thing over here which might be interesting" type mention, but when [Avdi tweets](http://storify.com/allafarce/avdi-grimm-s-super-happy-fun-time-at-newark-int-l)... people listen, so I decided to go check out the course. What follows is the review I left on the Udmey site, shared here more widely.

As an experienced developer, I'd give this course 3.5 stars if it was an option, but I rounded up because if you don't know anything about unit testing then this course is a great overview.

The most valuable parts to me were the advanced RSpec overview and discussion of fakes (mocks, stubs). Roy covers this well, but encourages using a 3rd party mock library outside of what RSpec provides called [Bogus](https://github.com/psyho/bogus). The reason is to allow for non-strict mock expectations, which are less brittle since they don't complain every time a method on the object under test is called that you didn't explicitly stub out. However, RSpec does support this with the [as_null_object](https://www.relishapp.com/rspec/rspec-mocks/v/2-6/docs/method-stubs/as-null-object) method so it would have been nice to not introduce an additional gem unnecessarily. 

Another thing that was a bit glossed over is the fact that in (I think all) of his mock expectation examples Roy is actually using a 'spy' where in he does the assert AFTER the method under test is invoked. That's a fine way to test, but it would have been useful to mention to viewers that the other (more pervasive?) way of doing it is setting up an expectation first 

```ruby
blah.should_receive(:something)
```

or in the new RSpec syntax...

```ruby
expect(blah).to receive(:something) 
```

and then doing the work on that method AFTER that expectation to determine whether or not that expectation was fulfilled. This confused me when I first got into testing since it's backwards from the typical 'do work' and 'assert a state change' work flow, but I think there are advantages to doing mock expectations first so you end up thinking about the code you wish you had instead of checking that it was called at the end. Really, they're both fine ways, I just wish the multiple ways of doing it were discussed in this course. Here's a [blog article](http://myronmars.to/n/dev-blog/2013/07/rspec-2-14-is-released) that shows how to do both options in RSpec (check the Mocks:Spies section). 

Another error I noticed was in the discussion of `let` vs `let!`. Roy talks about how `let` memoizes (caches) whatever it's storing so that if that variable is used multiple times, it'll just retrieve whatever was set on that variable previously. That is in fact how let in RSpec works, BUT that only happens within the current example if the let gets called multiple times. It DOES NOT memoize/cache the `let` value BETWEEN examples as Roy described. See the [docs](https://www.relishapp.com/rspec/rspec-core/docs/helper-methods/let-and-let).

One thing I picked up that I liked quite a bit was this tip:

When describing a method on a class like `Calc#adding`, define a method that does what you want to test below the describe for that method, and re-use that helper method in the tests so that if the implementation changes later you only have to update the code in one place. 

Here's an example where extracting a method called 'adding' could help clean up specs:

```ruby
describe Calculator do
  context "a single number"
    def adding(input)
      calc.add(input) #calls a let defined above
    end

    it "adding 2 increases the number by 2" do
      expect(adding('2')).to eq(2)
    end
  end
end
```

Roy also does a good job of explaining RSpec's 'subject' and 'its' which I never took the time to fully grok until now.

Truth be told, I didn't even watch the TeamCity stuff because I'm using Jenkins for CI on [Circleci](http://circleci.com) (which I highly recommend!). If you don't know anything about CI or want a bit more hand holding to setup your own server, then I'm sure that section is fine.

One other negative of this class was the rather lackluster production quality. It gets the job done, but the audio in the videos is not up to par with something like RailsCasts or Destroy All Software. It doesn't appear to have been mastered at all (loudness differs vastly across the videos) and the lessons are actually all 'live' in that Roy was teaching a class of real people while screen recording these videos. I didn't realize that when I purchased the course and it did disappoint me a bit when I saw that this was how the information was going to be presented. In fact, some of the Q&A sessions between Roy and the class are completely unintelligible because of the way the gate on the microphone was setup. It cut off the audience almost entirely.

Speaking of live screen recording, there were definitely a few times when Roy got bit by the 'live demo' demons and had to pull his chute / abandon ship / insert clever metaphor here...but it didn't detract from the lesson too much.

All and all I'm glad I took a few hours to go through this material. Thanks to Roy for presenting it, and to Avdi Grimm for tweeting about it to get me there.
