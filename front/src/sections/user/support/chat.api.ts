import { useMemo } from 'react';
import keyBy from 'lodash/keyBy';
import useSWR, { mutate } from 'swr';
// utils
import axios, { endpoints, fetcher } from 'src/utils/axios';
// types
import {
  IChatMessage,
  IChatParticipant,
  IChatConversations,
  IChatConversation,
} from './chat.type';

// ----------------------------------------------------------------------

const CONTACTS: IChatParticipant[] = [
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
    "role": "CEO",
    "email": "nannie.abernathy70@yahoo.com",
    "name": "Jayvion Simon",
    "lastActivity": "2024-09-25T15:55:15+00:00",
    "address": "19034 Verna Unions Apt. 164 - Honolulu, RI / 87535",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-1.webp",
    "phoneNumber": "+1 202-555-0143",
    "status": "busy"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
    "role": "CTO",
    "email": "ashlynn.ohara62@gmail.com",
    "name": "Lucian Obrien",
    "lastActivity": "2024-09-24T14:55:15+00:00",
    "address": "1147 Rohan Drive Suite 819 - Burlington, VT / 82021",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-2.webp",
    "phoneNumber": "+1 416-555-0198",
    "status": "online"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
    "role": "Project Coordinator",
    "email": "milo.farrell@hotmail.com",
    "name": "Deja Brady",
    "lastActivity": "2024-09-23T13:55:15+00:00",
    "address": "18605 Thompson Circle Apt. 086 - Idaho Falls, WV / 50337",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-3.webp",
    "phoneNumber": "+44 20 7946 0958",
    "status": "offline"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
    "role": "Team Leader",
    "email": "violet.ratke86@yahoo.com",
    "name": "Harrison Stein",
    "lastActivity": "2024-09-22T12:55:15+00:00",
    "address": "110 Lamar Station Apt. 730 - Hagerstown, OK / 49808",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-4.webp",
    "phoneNumber": "+61 2 9876 5432",
    "status": "online"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5",
    "role": "Software Developer",
    "email": "letha.lubowitz24@yahoo.com",
    "name": "Reece Chung",
    "lastActivity": "2024-09-21T11:55:15+00:00",
    "address": "36901 Elmer Spurs Apt. 762 - Miramar, DE / 92836",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-5.webp",
    "phoneNumber": "+91 22 1234 5678",
    "status": "offline"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6",
    "role": "Marketing Strategist",
    "email": "aditya.greenfelder31@gmail.com",
    "name": "Lainey Davidson",
    "lastActivity": "2024-09-20T10:55:15+00:00",
    "address": "2089 Runolfsson Harbors Suite 886 - Chapel Hill, TX / 32827",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-6.webp",
    "phoneNumber": "+49 30 123456",
    "status": "online"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7",
    "role": "Data Analyst",
    "email": "lenna.bergnaum27@hotmail.com",
    "name": "Cristopher Cardenas",
    "lastActivity": "2024-09-19T09:55:15+00:00",
    "address": "279 Karolann Ports Apt. 774 - Prescott Valley, WV / 53905",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-7.webp",
    "phoneNumber": "+33 1 23456789",
    "status": "alway"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8",
    "role": "Product Owner",
    "email": "luella.ryan33@gmail.com",
    "name": "Melanie Noble",
    "lastActivity": "2024-09-18T08:55:15+00:00",
    "address": "96607 Claire Square Suite 591 - St. Louis Park, HI / 40802",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-8.webp",
    "phoneNumber": "+81 3 1234 5678",
    "status": "online"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9",
    "role": "Graphic Designer",
    "email": "joana.simonis84@gmail.com",
    "name": "Chase Day",
    "lastActivity": "2024-09-17T07:55:15+00:00",
    "address": "9388 Auer Station Suite 573 - Honolulu, AK / 98024",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-9.webp",
    "phoneNumber": "+86 10 1234 5678",
    "status": "offline"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10",
    "role": "Operations Manager",
    "email": "marjolaine.white94@gmail.com",
    "name": "Shawn Manning",
    "lastActivity": "2024-09-16T06:55:15+00:00",
    "address": "47665 Adaline Squares Suite 510 - Blacksburg, NE / 53515",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-10.webp",
    "phoneNumber": "+55 11 2345-6789",
    "status": "online"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b11",
    "role": "Customer Support Specialist",
    "email": "vergie.block82@hotmail.com",
    "name": "Soren Durham",
    "lastActivity": "2024-09-15T05:55:15+00:00",
    "address": "989 Vernice Flats Apt. 183 - Billings, NV / 04147",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-11.webp",
    "phoneNumber": "+27 11 123 4567",
    "status": "offline"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b12",
    "role": "Sales Manager",
    "email": "vito.hudson@hotmail.com",
    "name": "Cortez Herring",
    "lastActivity": "2024-09-14T04:55:15+00:00",
    "address": "91020 Wehner Locks Apt. 673 - Albany, WY / 68763",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-12.webp",
    "phoneNumber": "+7 495 123-4567",
    "status": "online"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b13",
    "role": "HR Recruiter",
    "email": "tyrel.greenholt@gmail.com",
    "name": "Brycen Jimenez",
    "lastActivity": "2024-09-13T03:55:15+00:00",
    "address": "585 Candelario Pass Suite 090 - Columbus, LA / 25376",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-13.webp",
    "phoneNumber": "+52 55 1234 5678",
    "status": "busy"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b14",
    "role": "Business Consultant",
    "email": "dwight.block85@yahoo.com",
    "name": "Giana Brandt",
    "lastActivity": "2024-09-12T02:55:15+00:00",
    "address": "80988 Renner Crest Apt. 000 - Fargo, VA / 24266",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-14.webp",
    "phoneNumber": "+39 06 123 4567",
    "status": "online"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b15",
    "role": "Financial Planner",
    "email": "mireya13@hotmail.com",
    "name": "Aspen Schmitt",
    "lastActivity": "2024-09-11T01:55:15+00:00",
    "address": "28307 Shayne Pike Suite 523 - North Las Vegas, AZ / 28550",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-15.webp",
    "phoneNumber": "+34 91 123 4567",
    "status": "offline"
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b16",
    "role": "Network Engineer",
    "email": "dasia.jenkins@hotmail.com",
    "name": "Colten Aguilar",
    "lastActivity": "2024-09-10T00:55:15+00:00",
    "address": "205 Farrell Highway Suite 333 - Rock Hill, OK / 63421",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-16.webp",
    "phoneNumber": "+31 20 123 4567",
    "status": "online"
  }
];

const CONVERSATIONS: any = [
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
    "participants": [
      {
        "id": "8864c717-587d-472a-929a-8e5f298024da-0",
        "role": "admin",
        "status": "online",
        "name": "Jaydon Frankie",
        "email": "demo@minimals.cc",
        "phoneNumber": "+40 777666555",
        "address": "90210 Broadway Blvd",
        "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-25.webp",
        "lastActivity": "2024-09-25T15:54:15+00:00"
      },
      {
        "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
        "role": "CTO",
        "email": "ashlynn.ohara62@gmail.com",
        "name": "Lucian Obrien",
        "lastActivity": "2024-09-24T14:55:15+00:00",
        "address": "1147 Rohan Drive Suite 819 - Burlington, VT / 82021",
        "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-2.webp",
        "phoneNumber": "+1 416-555-0198",
        "status": "online"
      }
    ],
    "type": "ONE_TO_ONE",
    "unreadCount": 0,
    "messages": [
      {
        "id": "dd6dfe4e-2b80-4339-9174-d85b97398a47",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
        "body": "She eagerly opened the gift, her eyes sparkling with excitement.",
        "contentType": "text",
        "attachments": [
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
            "name": "cover-2.jpg",
            "path": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-3.webp",
            "preview": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-3.webp",
            "size": 48000000,
            "createdAt": "2024-09-25T15:55:15+00:00",
            "modifiedAt": "2024-09-25T15:55:15+00:00",
            "type": "jpg"
          }
        ],
        "createdAt": "2024-09-25T10:55:15+00:00"
      },
      {
        "id": "558f8866-7404-4125-8499-712150f77b11",
        "senderId": "8864c717-587d-472a-929a-8e5f298024da-0",
        "body": "The old oak tree stood tall and majestic, its branches swaying gently in the breeze.",
        "contentType": "text",
        "attachments": [
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
            "name": "design-suriname-2015.mp3",
            "path": "https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3",
            "preview": "https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3",
            "size": 24000000,
            "createdAt": "2024-09-24T14:55:15+00:00",
            "modifiedAt": "2024-09-24T14:55:15+00:00",
            "type": "mp3"
          }
        ],
        "createdAt": "2024-09-25T11:55:15+00:00"
      },
      {
        "id": "2ef7db7f-2144-4dac-8517-5242d75ddcda",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
        "body": "The aroma of freshly brewed coffee filled the air, awakening my senses.",
        "contentType": "text",
        "attachments": [
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
            "name": "expertise-2015-conakry-sao-tome-and-principe-gender.mp4",
            "path": "https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4",
            "preview": "https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4",
            "size": 16000000,
            "createdAt": "2024-09-23T13:55:15+00:00",
            "modifiedAt": "2024-09-23T13:55:15+00:00",
            "type": "mp4"
          }
        ],
        "createdAt": "2024-09-25T12:55:15+00:00"
      },
      {
        "id": "53486f1f-59ff-49e2-9edc-6dc36e67e694",
        "senderId": "8864c717-587d-472a-929a-8e5f298024da-0",
        "body": "The children giggled with joy as they ran through the sprinklers on a hot summer day.",
        "contentType": "text",
        "attachments": [
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
            "name": "money-popup-crack.pdf",
            "path": "https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf",
            "preview": "https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf",
            "size": 12000000,
            "createdAt": "2024-09-22T12:55:15+00:00",
            "modifiedAt": "2024-09-22T12:55:15+00:00",
            "type": "pdf"
          },
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5",
            "name": "cover-4.jpg",
            "path": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-4.webp",
            "preview": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-4.webp",
            "size": 9600000,
            "createdAt": "2024-09-21T11:55:15+00:00",
            "modifiedAt": "2024-09-21T11:55:15+00:00",
            "type": "jpg"
          },
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6",
            "name": "cover-6.jpg",
            "path": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-6.webp",
            "preview": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-6.webp",
            "size": 8000000,
            "createdAt": "2024-09-20T10:55:15+00:00",
            "modifiedAt": "2024-09-20T10:55:15+00:00",
            "type": "jpg"
          }
        ],
        "createdAt": "2024-09-25T13:55:15+00:00"
      },
      {
        "id": "fc122266-45df-40a9-bbbf-c73ae3c89144",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
        "body": "He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.",
        "contentType": "text",
        "attachments": [
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7",
            "name": "large-news.txt",
            "path": "https://www.cloud.com/s/c218bo6kjuqyv66/large_news.txt",
            "preview": "https://www.cloud.com/s/c218bo6kjuqyv66/large_news.txt",
            "size": 6857142.857142857,
            "createdAt": "2024-09-19T09:55:15+00:00",
            "modifiedAt": "2024-09-19T09:55:15+00:00",
            "type": "txt"
          },
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8",
            "name": "nauru-6015-small-fighter-left-gender.psd",
            "path": "https://www.cloud.com/s/c218bo6kjuqyv66/nauru-6015-small-fighter-left-gender.psd",
            "preview": "https://www.cloud.com/s/c218bo6kjuqyv66/nauru-6015-small-fighter-left-gender.psd",
            "size": 6000000,
            "createdAt": "2024-09-18T08:55:15+00:00",
            "modifiedAt": "2024-09-18T08:55:15+00:00",
            "type": "psd"
          },
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9",
            "name": "tv-xs.doc",
            "path": "https://www.cloud.com/s/c218bo6kjuqyv66/tv-xs.doc",
            "preview": "https://www.cloud.com/s/c218bo6kjuqyv66/tv-xs.doc",
            "size": 5333333.333333333,
            "createdAt": "2024-09-17T07:55:15+00:00",
            "modifiedAt": "2024-09-17T07:55:15+00:00",
            "type": "doc"
          },
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10",
            "name": "gustavia-entertainment-productivity.docx",
            "path": "https://www.cloud.com/s/c218bo6kjuqyv66/gustavia-entertainment-productivity.docx",
            "preview": "https://www.cloud.com/s/c218bo6kjuqyv66/gustavia-entertainment-productivity.docx",
            "size": 4800000,
            "createdAt": "2024-09-16T06:55:15+00:00",
            "modifiedAt": "2024-09-16T06:55:15+00:00",
            "type": "docx"
          }
        ],
        "createdAt": "2024-09-25T14:55:15+00:00"
      },
      {
        "id": "d750652e-9f01-47cd-af2e-0e9526cd5029",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
        "attachments": [],
        "contentType": "image",
        "body": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-5.webp",
        "createdAt": "2024-09-25T15:40:15+00:00"
      },
      {
        "id": "1f924823-1eaf-4dd4-81ab-8bcea9795aeb",
        "senderId": "8864c717-587d-472a-929a-8e5f298024da-0",
        "contentType": "text",
        "attachments": [],
        "body": "The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.",
        "createdAt": "2024-09-25T15:54:15+00:00"
      },
      {
        "id": "32327e89-45f5-490e-bf3e-7aa83bb0f262",
        "senderId": "8864c717-587d-472a-929a-8e5f298024da-0",
        "body": "The waves crashed against the shore, creating a soothing symphony of sound.",
        "contentType": "text",
        "attachments": [],
        "createdAt": "2024-09-25T15:55:15+00:00"
      }
    ]
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
    "participants": [
      {
        "id": "8864c717-587d-472a-929a-8e5f298024da-0",
        "role": "admin",
        "status": "online",
        "name": "Jaydon Frankie",
        "email": "demo@minimals.cc",
        "phoneNumber": "+40 777666555",
        "address": "90210 Broadway Blvd",
        "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-25.webp",
        "lastActivity": "2024-09-25T15:54:15+00:00"
      },
      {
        "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
        "role": "Project Coordinator",
        "email": "milo.farrell@hotmail.com",
        "name": "Deja Brady",
        "lastActivity": "2024-09-23T13:55:15+00:00",
        "address": "18605 Thompson Circle Apt. 086 - Idaho Falls, WV / 50337",
        "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-3.webp",
        "phoneNumber": "+44 20 7946 0958",
        "status": "offline"
      }
    ],
    "type": "ONE_TO_ONE",
    "unreadCount": 0,
    "messages": [
      {
        "id": "11d9b6ef-7a57-4046-9c9b-7a2d476e8a23",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
        "body": "The old oak tree stood tall and majestic, its branches swaying gently in the breeze.",
        "contentType": "text",
        "attachments": [],
        "createdAt": "2024-09-25T09:55:15+00:00"
      },
      {
        "id": "9559a467-e823-4446-9d02-395e51301b12",
        "senderId": "8864c717-587d-472a-929a-8e5f298024da-0",
        "body": "The aroma of freshly brewed coffee filled the air, awakening my senses.",
        "contentType": "text",
        "attachments": [],
        "createdAt": "2024-09-25T10:55:15+00:00"
      },
      {
        "id": "06c9f816-b0cc-4882-9f19-88a6ba67e5a4",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
        "body": "The children giggled with joy as they ran through the sprinklers on a hot summer day.",
        "contentType": "text",
        "attachments": [],
        "createdAt": "2024-09-25T11:55:15+00:00"
      },
      {
        "id": "b78609f7-1a9a-4ef4-8439-f5f43cca859f",
        "senderId": "8864c717-587d-472a-929a-8e5f298024da-0",
        "body": "He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.",
        "contentType": "text",
        "attachments": [],
        "createdAt": "2024-09-25T08:55:15+00:00"
      },
      {
        "id": "8115bfd3-d230-4c63-a341-ce0113d0acbf",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
        "body": "The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.",
        "contentType": "text",
        "attachments": [],
        "createdAt": "2024-09-25T12:55:15+00:00"
      },
      {
        "id": "477bd691-0ec4-48df-b851-ccdb4ddd4dbd",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
        "body": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-8.webp",
        "attachments": [],
        "contentType": "image",
        "createdAt": "2024-09-25T13:55:15+00:00"
      },
      {
        "id": "c33ebaeb-057a-4ad8-a09c-e004d592ab59",
        "senderId": "8864c717-587d-472a-929a-8e5f298024da-0",
        "body": "The scent of blooming flowers wafted through the garden, creating a fragrant paradise.",
        "contentType": "text",
        "attachments": [],
        "createdAt": "2024-09-25T14:55:15+00:00"
      }
    ]
  },
  {
    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
    "participants": [
      {
        "id": "8864c717-587d-472a-929a-8e5f298024da-0",
        "role": "admin",
        "status": "online",
        "name": "Jaydon Frankie",
        "email": "demo@minimals.cc",
        "phoneNumber": "+40 777666555",
        "address": "90210 Broadway Blvd",
        "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-25.webp",
        "lastActivity": "2024-09-25T15:54:15+00:00"
      },
      {
        "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
        "role": "Team Leader",
        "email": "violet.ratke86@yahoo.com",
        "name": "Harrison Stein",
        "lastActivity": "2024-09-22T12:55:15+00:00",
        "address": "110 Lamar Station Apt. 730 - Hagerstown, OK / 49808",
        "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-4.webp",
        "phoneNumber": "+61 2 9876 5432",
        "status": "online"
      }
    ],
    "type": "ONE_TO_ONE",
    "unreadCount": 0,
    "messages": [
      {
        "id": "38e3c9d9-2ec8-4382-ac79-f09644c7e2c9",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
        "body": "The aroma of freshly brewed coffee filled the air, awakening my senses.",
        "contentType": "text",
        "attachments": [
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
            "name": "cover-2.jpg",
            "path": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-3.webp",
            "preview": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-3.webp",
            "size": 48000000,
            "createdAt": "2024-09-25T15:55:15+00:00",
            "modifiedAt": "2024-09-25T15:55:15+00:00",
            "type": "jpg"
          }
        ],
        "createdAt": "2024-09-25T07:55:15+00:00"
      },
      {
        "id": "78cd2210-b94a-476f-acfc-ee1492c7ac13",
        "senderId": "8864c717-587d-472a-929a-8e5f298024da-0",
        "body": "The children giggled with joy as they ran through the sprinklers on a hot summer day.",
        "contentType": "text",
        "attachments": [
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
            "name": "design-suriname-2015.mp3",
            "path": "https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3",
            "preview": "https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3",
            "size": 24000000,
            "createdAt": "2024-09-24T14:55:15+00:00",
            "modifiedAt": "2024-09-24T14:55:15+00:00",
            "type": "mp3"
          }
        ],
        "createdAt": "2024-09-25T08:55:15+00:00"
      },
      {
        "id": "88753df3-72e8-4537-9902-8f82aa0dc0d7",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
        "body": "He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.",
        "contentType": "text",
        "attachments": [],
        "createdAt": "2024-09-25T09:55:15+00:00"
      },
      {
        "id": "031ef188-59cb-48f9-a7b8-8ee712a7db2c",
        "senderId": "8864c717-587d-472a-929a-8e5f298024da-0",
        "body": "The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.",
        "contentType": "text",
        "attachments": [
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
            "name": "expertise-2015-conakry-sao-tome-and-principe-gender.mp4",
            "path": "https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4",
            "preview": "https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4",
            "size": 16000000,
            "createdAt": "2024-09-23T13:55:15+00:00",
            "modifiedAt": "2024-09-23T13:55:15+00:00",
            "type": "mp4"
          },
          {
            "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
            "name": "money-popup-crack.pdf",
            "path": "https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf",
            "preview": "https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf",
            "size": 12000000,
            "createdAt": "2024-09-22T12:55:15+00:00",
            "modifiedAt": "2024-09-22T12:55:15+00:00",
            "type": "pdf"
          }
        ],
        "createdAt": "2024-09-25T10:55:15+00:00"
      },
      {
        "id": "ae79e90d-ef15-49c3-bc0d-4a425504ec94",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
        "body": "The waves crashed against the shore, creating a soothing symphony of sound.",
        "contentType": "text",
        "attachments": [],
        "createdAt": "2024-09-25T11:55:15+00:00"
      },
      {
        "id": "d5f91625-fbc9-4369-975f-9bca66092c77",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
        "body": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-9.webp",
        "contentType": "image",
        "attachments": [],
        "createdAt": "2024-09-25T12:55:15+00:00"
      },
      {
        "id": "76ffbcbe-199f-4fd3-afa2-060168719891",
        "senderId": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
        "body": "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-10.webp",
        "contentType": "image",
        "attachments": [],
        "createdAt": "2024-09-25T13:55:15+00:00"
      }
    ]
  },
]

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetContacts() {
  return { contacts: CONTACTS };
}

// ----------------------------------------------------------------------

export function useGetConversations() {
  const byId = keyBy(CONVERSATIONS, 'id') || {};
  const allIds = Object.keys(byId) || [];

  return {
    conversations: {
      byId,
      allIds,
    },
    conversationsLoading: false,
  };
}

// ----------------------------------------------------------------------

export function useGetConversation(conversationId: string) {
  return {
    conversation: CONVERSATIONS.find((e: any) => e.id === conversationId),
    conversationError: false,
  };
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId: string, messageData: IChatMessage) {
  const CONVERSATIONS_URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  const CONVERSATION_URL = [
    endpoints.chat,
    {
      params: { conversationId, endpoint: 'conversation' },
    },
  ];

  /**
   * Work on server
   */
  // const data = { conversationId, messageData };
  // await axios.put(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    CONVERSATION_URL,
    (currentData: any) => {
      const { conversation: currentConversation } = currentData;

      const conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, messageData],
      };

      return {
        conversation,
      };
    },
    false
  );

  /**
   * Work in local
   */
  mutate(
    CONVERSATIONS_URL,
    (currentData: any) => {
      const { conversations: currentConversations } = currentData;

      const conversations: IChatConversation[] = currentConversations.map(
        (conversation: IChatConversation) =>
          conversation.id === conversationId
            ? {
              ...conversation,
              messages: [...conversation.messages, messageData],
            }
            : conversation
      );

      return {
        conversations,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: IChatConversation) {
  const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const conversations: IChatConversation[] = [...currentData.conversations, conversationData];
      return {
        ...currentData,
        conversations,
      };
    },
    false
  );

  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string) {
  const URL = endpoints.chat;

  /**
   * Work on server
   */
  // await axios.get(URL, { params: { conversationId, endpoint: 'mark-as-seen' } });

  /**
   * Work in local
   */
  const conversations: IChatConversations = CONVERSATIONS.map(
    (conversation: IChatConversation) =>
      conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
  );

  return {
    conversations,
  };

}
