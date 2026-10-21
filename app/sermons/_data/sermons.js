// The catalogue contains study themes from the existing sermon listing. A recording
// must not be advertised until the ministry supplies its real URL and date.
export const sermons = [
  {
    slug: "the-unshakable-foundation",
    title: "The Unshakable Foundation",
    sub: "Standing when nations tremble",
    type: "Divine Service",
    image: "divine-sermon-banner.jpg",
    date: null,
    audioUrl: null,
    passages: ["Hebrews 12", "Jeremiah 1"],
    sections: [
      {
        heading: "A foundation that remains",
        paragraphs: [
          "Hebrews 12 points us toward a kingdom that cannot be shaken. In this Divine Service teaching, we consider where we place our confidence when everything around us feels uncertain.",
          "Jeremiah 1 reminds us that the call to stand faithfully is grounded in the One who sends us, not in our own strength.",
        ],
      },
      {
        heading: "Carry the Word into the week",
        paragraphs: [
          "Read Hebrews 12 slowly. What in the passage calls you to gratitude and reverence? Bring those questions into prayer and into conversation with the community.",
        ],
      },
    ],
  },
  {
    slug: "tarrying-for-the-latter-rain",
    title: "Tarrying for the Latter Rain",
    sub: "A call to patient prayer",
    type: "Divine Service",
    image: "pastor-sermon.jpg",
    date: null,
    audioUrl: null,
    passages: ["James 5:7", "Acts 1:14"],
    sections: [
      {
        heading: "The posture of waiting",
        paragraphs: [
          "James 5:7 offers the picture of patient expectation. Waiting in prayer is not passivity; it is a way of remaining attentive to God.",
        ],
      },
      {
        heading: "Praying together",
        paragraphs: [
          "Acts 1:14 describes a community continuing together in prayer. Consider what it means to make room for that same persistence in the life of this house.",
        ],
      },
    ],
  },
  {
    slug: "the-broken-yoke",
    title: "The Broken Yoke & Resurrection Liberty",
    sub: "Freedom in the name of Yeshua",
    type: "Divine Service",
    image: "faith-clinic.jpg",
    date: null,
    audioUrl: null,
    passages: ["2 Corinthians 3:17", "John 8:36"],
    sections: [
      {
        heading: "Where the Spirit brings liberty",
        paragraphs: [
          "2 Corinthians 3:17 places freedom in the presence of the Spirit. This message invites us to seek Yeshua for healing and renewal, with prayer and care for one another.",
        ],
      },
      {
        heading: "The promise of the Son",
        paragraphs: [
          "John 8:36 speaks of the liberty found in the Son. Reflect on this promise and bring your needs honestly before God.",
        ],
      },
    ],
  },
  {
    slug: "the-fourth-commandment",
    title: "The Fourth Commandment",
    sub: "Creation, redemption and Sabbath rest",
    type: "Sabbath School",
    image: "sabbath-study-banner.jpg",
    date: null,
    passages: ["Genesis 2:1-3", "Exodus 20:8-11", "Hebrews 4:1-11"],
    sections: [
      {
        heading: "At creation",
        paragraphs: [
          "Begin with Genesis 2:1-3. Observe what the passage says about rest and the seventh day before turning to later texts.",
        ],
      },
      {
        heading: "In the commandments",
        paragraphs: [
          "Read Exodus 20:8-11 alongside the creation account. What connections does the text make between remembrance, worship and the rhythm of work and rest?",
        ],
      },
      {
        heading: "In the apostolic writings",
        paragraphs: [
          "Hebrews 4:1-11 invites a further conversation about rest and faith. Read the passage in context, and bring your observations and questions to Sabbath School.",
        ],
      },
    ],
  },
  {
    slug: "torah-prophets-and-apostolic-writings",
    title: "Torah, Prophets & Apostolic Writings",
    sub: "One story, one faithful God",
    type: "Sabbath School",
    image: "sabbath-school.jpg",
    date: null,
    passages: ["Luke 24:27", "2 Timothy 3:16"],
    sections: [
      {
        heading: "Reading the whole story",
        paragraphs: [
          "Luke 24:27 presents a way of reading scripture that looks for the testimony concerning the Messiah. Consider how each part of the biblical story contributes to the whole.",
        ],
      },
      {
        heading: "Learning together",
        paragraphs: [
          "2 Timothy 3:16 describes scripture as useful for teaching and growth. What habits help us read carefully, ask good questions and put the Word into practice?",
        ],
      },
    ],
  },
  {
    slug: "rooted-in-the-word",
    title: "Rooted in the Word",
    sub: "The life of a disciple",
    type: "Sabbath School",
    image: "bible-study.jpg",
    date: null,
    passages: ["Psalm 1", "James 1:22"],
    sections: [
      {
        heading: "Meditate on the Word",
        paragraphs: [
          "Psalm 1 offers a picture of a life nourished by attention to the Word. Where do you find room for reflection in your week?",
        ],
      },
      {
        heading: "Live what you learn",
        paragraphs: [
          "James 1:22 asks us to be doers as well as hearers. Read the surrounding passage and discuss one practical response with your study group.",
        ],
      },
    ],
  },
];

export function sermonPath(sermon) {
  return `/sermons/${sermon.type === "Divine Service" ? "divine-service" : "sabbath-school"}/${sermon.slug}`;
}
export function findSermon(type, slug) {
  return sermons.find((sermon) => sermon.type === type && sermon.slug === slug);
}
