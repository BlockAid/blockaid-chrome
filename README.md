[BlockAid](http://codeweft.com/blockaid)
========
Speeding up page load by blocking unwanted third party fonts, css and javascript

##Background

If you ever access internet behind a firewall with access policy or with slow internet connectivity, you will realize some of the websites take longer to load. In some cases the page load takes more than a minute since the request timeout for unwanted content within the website takes too long.

What is this content?

* Font's and StyleSheets: Used to improve overall look and feel of the website
* Javascripts: Used for Analytics or accessing third party services on your website

Most of the above content is unnecessary and the website you are accessing can continue to work without it. BlockAid is a set of browser extension's to help you solve this problem.

##Installation

BlockAid is still under active development. If you plan to use it, following are the steps

1. Clone the project repository
2. git clone git@github.com:codeweft/blockaid.git
3. Open Chrome browser and goto chrome://extensions
4. Select developer mode and load unpacked extension. Open the cloned directory 'blockaid/client/chrome'

##Contributing
####Development
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

####Bugs
Please keep the [issue tracker](http://github.com/codeweft/blockaid/issues) limited to **bug reports**, **feature requests** and **pull requests**. If you are reporting a bug make sure to include information about which browser and operating system you are using as well as the necessary steps to reproduce the issue.

If you have personal support questions use [StackOverflow](http://stackoverflow.com/questions/tagged/blockaid).

###Contributors
* [Hash](https://github.com/codeweft)
* [Qiu Juntao](https://github.com/abruzzi)
* [leprechaun](https://github.com/leprechaun)

##Build Status

[![Build Status](https://snap-ci.com/codeweft/blockaid/branch/master/build_image)](https://snap-ci.com/codeweft/blockaid/branch/master)

This project is conceived in [ThoughtWorks, China](https://thoughtworks.com/)
