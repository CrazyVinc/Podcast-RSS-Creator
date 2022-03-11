const Podcast = require('podcast').Podcast;
var moment = require("moment");

var RSS = {cache: "", rebuild: (() => RSS.cache = feed.buildXml())};

/* lets create an rss feed */
const feed = new Podcast({
    title: 'title',
    description: 'description',
    // feedUrl: 'http://example.com/rss.xml',
    // siteUrl: 'http://example.com',
    // imageUrl: 'http://example.com/icon.png',
    // docs: 'http://example.com/rss/docs.html',
    // author: 'Dylan Greene',
    // managingEditor: 'Dylan Greene',
    // webMaster: 'Dylan Greene',
    // copyright: '2013 Dylan Greene',
    // language: 'en',
    // categories: ['Category 1','Category 2','Category 3'],
    // pubDate: 'May 20, 2012 04:00:00 GMT',
    ttl: 1,
});

/* loop over data and add to feed */
const BuildFeedFromArray = ((items) => {
  items.forEach(item => {
      var date = moment(item.date);
      var time = {
          YYYY: date.year(),
          MM: ("0" + (date.month() + 1)).slice(-2),
          DD: ("0" + (date.date())).slice(-2),
          HH: ("0" + (date.hour())).slice(-2)
      }
    feed.addItem({
        title: `${time.YYYY}/${time.MM}/${time.DD} ${time.HH}:00`,
        description: 'use this for the content. It can include html.',
        url: `https://localhost/${item.filename}`, // link to the item
        categories: [item.category], // optional - array of item categories
        // author: '', // optional - defaults to feed author property
        date: item.date, // any format that js Date can parse.
    });
  });
});

RSS.rebuild();
module.exports = {
    RSS, feed, BuildFeedFromArray
}