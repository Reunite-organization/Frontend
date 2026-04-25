export const CASES = [
  {
    id: 1,
    name: "Selam Bekele",
    age: 34,
    gender: "Female",
    status: "critical",
    days: 3,
    sightings: 2,
    lastSeen: "Mercato Market, Addis Ababa",
    height: "165 cm",
    weight: "58 kg",
    clothing: "Blue netela shawl, dark brown trousers, brown sandals",
    distinctive:
      "Small scar on left chin, hair in braids, usually carries a green tote bag",
    description:
      "Selam is a market trader who goes missing on her usual route home from Mercato. Her husband Tesfaye says this is completely out of character — she always calls when she's going to be late. Her 3 children are waiting at home.",
    hope: 42,
    lat: 38,
    lng: 44,
    timeline: [
      {
        time: "3 days ago — Thu, 6:30 PM",
        text: "Last seen leaving Mercato Market, reportedly heading toward the Piassa bus stop.",
        type: "orange",
      },
      {
        time: "2 days ago — Fri, 11:00 AM",
        text: "Possible sighting near Bole Medhanialem Church by a shopkeeper. Uncertain match.",
        type: "normal",
      },
      {
        time: "Yesterday — Sat, 3:45 PM",
        text: "Family filed an official missing person report with Addis Ababa Police Station 7.",
        type: "normal",
      },
    ],
  },
  {
    id: 2,
    name: "Dawit Haile",
    age: 16,
    gender: "Male",
    status: "active",
    days: 7,
    sightings: 5,
    lastSeen: "Arat Kilo, near Addis Ababa University",
    height: "170 cm",
    weight: "62 kg",
    clothing: "Red school uniform shirt, black trousers, white sneakers",
    distinctive:
      "Wears thin-framed glasses, usually carries a blue backpack with a football keychain",
    description:
      "Dawit is a 10th grade student who disappeared after school on Thursday. His classmates say he was in good spirits that day. He is a top student with no known problems at school or home. His mother Marta is devastated.",
    hope: 68,
    lat: 45,
    lng: 55,
    timeline: [
      {
        time: "7 days ago — Mon, 4:00 PM",
        text: "Dawit left Entoto Secondary School in Arat Kilo. Classmates confirm he left alone.",
        type: "orange",
      },
      {
        time: "6 days ago — Tue",
        text: "Two students reported seeing him near Sidist Kilo walking toward Churchill Road.",
        type: "normal",
      },
      {
        time: "4 days ago — Thu",
        text: "CCTV footage at Piassa bus station shows a possible match. Under police review.",
        type: "normal",
      },
      {
        time: "2 days ago — Sat",
        text: "Volunteer network deployed. 18 volunteers searching Bole and Kazanchis areas.",
        type: "normal",
      },
    ],
  },
  {
    id: 3,
    name: "Tigist Alemu",
    age: 67,
    gender: "Female",
    status: "active",
    days: 2,
    sightings: 1,
    lastSeen: "Gotera area, Addis Ababa",
    height: "155 cm",
    weight: "52 kg",
    clothing: "Traditional habesha kemis (white), brown shawl, black flats",
    distinctive:
      "Uses a wooden walking stick, moves slowly, very soft spoken, speaks mostly Amharic",
    description:
      "Tigist is a 67-year-old grandmother who left her home in Gotera to visit her daughter in Lideta. She never arrived. She has mild memory problems and may be disoriented. Her son Abebe is extremely worried.",
    hope: 55,
    lat: 60,
    lng: 34,
    timeline: [
      {
        time: "2 days ago — 9:00 AM",
        text: "Tigist left home to visit her daughter Hiwot in Lideta. Expected to arrive by 10:30.",
        type: "orange",
      },
      {
        time: "Yesterday — 2:30 PM",
        text: "Neighbor reported a possible sighting near Megenagna roundabout — an elderly woman matching her description.",
        type: "normal",
      },
    ],
  },
  {
    id: 4,
    name: "Bereket Tesfaye",
    age: 28,
    gender: "Male",
    status: "found",
    days: 0,
    sightings: 8,
    lastSeen: "Found at Jimma University Hospital — road accident",
    height: "178 cm",
    weight: "74 kg",
    clothing: "Found wearing hospital gown",
    distinctive:
      "Traditional tribal marking on right forearm, gap between front teeth",
    description:
      "Bereket was involved in a road accident near Jimma and was admitted as an unidentified patient. His family's case on REUNITE led to a volunteer making the connection. He has fully recovered.",
    hope: 100,
    lat: 72,
    lng: 68,
    timeline: [
      {
        time: "12 days ago",
        text: "Reported missing in Addis Ababa. Last seen heading to Jimma for work.",
        type: "orange",
      },
      {
        time: "5 days ago",
        text: "A REUNITE volunteer in Jimma saw the case and checked the hospital.",
        type: "normal",
      },
      {
        time: "4 days ago",
        text: "Identity confirmed. Bereket was recovering from a road accident.",
        type: "normal",
      },
      {
        time: "2 days ago",
        text: "Family arrived in Jimma. Bereket was discharged and reunited. 🙏",
        type: "green",
      },
    ],
  },
];

export const MEMORIES = [
  {
    id: 1,
    poster: "Amara Gebru",
    posterId: "AG",
    posted: "3 months ago",
    seeking: "Childhood friend Hana Tadesse",
    quote:
      "We grew up on the same street in Bahir Dar. Every Sunday we would race barefoot to the lake and the one who lost had to carry the other's school bag for a week. I moved to Addis in 2005 and lost touch. She had the most contagious laugh in the world.",
    seekingDetail:
      "Looking for Hana Tadesse, around 34 years old now. Last known location: Bahir Dar, near Lake Tana. She had an aunt named Worknesh who lived near the Saturday market. They may have moved to Gondar.",
    tags: ["Bahir Dar", "Childhood", "Lake Tana", "2005", "Primary school"],
    claimed: false,
    claimCount: 0,
  },
  {
    id: 2,
    poster: "Solomon Mekuria",
    posterId: "SM",
    posted: "1 week ago",
    seeking: "Brother Yonas Mekuria",
    quote:
      "We were separated during the 2002 floods in Dire Dawa. I was 10, he was 7. I have been searching ever since. He had a small birthmark on his left hand — shaped like a crescent. Every year on his birthday I light a candle.",
    seekingDetail:
      "Looking for Yonas Mekuria, would be around 29 now. Separated during flooding near Dire Dawa bridge. Possibly relocated to Harar or Addis Ababa. Was taken in by a family whose name began with Haile—.",
    tags: ["Dire Dawa", "Siblings", "2002 floods", "Harar"],
    claimed: true,
    claimCount: 1,
  },
  {
    id: 3,
    poster: "Frehiwot Taye",
    posterId: "FT",
    posted: "2 weeks ago",
    seeking: "Teacher Ato Girma Assefa",
    quote:
      "Ato Girma changed my life in Grade 4. I was failing every subject, ready to drop out. He stayed after school with me every day for a month. I went on to become a doctor. I just want him to know what he did.",
    seekingDetail:
      "Looking for Ato Girma Assefa, a primary school teacher in Adama (Nazret) between 1998 and 2003. He would be in his late 60s now. Possibly retired. Had a distinctive gray beard and always wore a brown jacket.",
    tags: ["Adama", "Teacher", "Grade 4", "Gratitude", "1998-2003"],
    claimed: false,
    claimCount: 0,
  },
  {
    id: 4,
    poster: "Yeshi Tadesse",
    posterId: "YT",
    posted: "5 days ago",
    seeking: "Former neighbor Dawit Wolde",
    quote:
      "We lived next door in Piassa for 12 years. His family moved suddenly in 1995 when I was 8. He taught me to play tej gena. I still think of him every Ethiopian Christmas.",
    seekingDetail:
      "Looking for Dawit Wolde, would be around 40 now. Lived in Piassa, Addis Ababa until 1995. Father was a carpenter named Ato Wolde Giorgis. May have moved to Bahir Dar or Mekelle.",
    tags: ["Piassa", "Addis Ababa", "Neighbors", "1995"],
    claimed: false,
    claimCount: 0,
  },
];

export function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
